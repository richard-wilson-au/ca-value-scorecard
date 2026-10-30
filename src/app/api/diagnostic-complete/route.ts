import { NextResponse } from 'next/server';
import { scoreAnswers, PILLAR_LABELS } from '../../../lib/scoring';
import { GHL_FIELD_IDS, addContactTags, splitName, upsertContact } from '../../../lib/ghl';
import { LOCATION_ID, saveFullCompletion, validCompletion } from '../../../lib/completion';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;
const failure = 'We could not confirm your result was saved. Your answers are still here. Please try again.';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Please use the diagnostic form.' }, { status: 403 });
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 12000) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!validCompletion(body)) return NextResponse.json({ error: 'Please complete all questions and provide your name and email.' }, { status: 400 });
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: failure }, { status: 503 });
  try {
    const result = scoreAnswers(body.answers);
    const { firstName, lastName } = splitName(body.name);
    const upsert = await upsertContact({
      firstName, lastName, email: body.email.trim().toLowerCase(), locationId: LOCATION_ID,
      source: 'Strategic Capacity Diagnostic',
      customFields: [
        { id: GHL_FIELD_IDS.scorecardTier, field_value: result.tier },
        { id: GHL_FIELD_IDS.scorecardInclusion, field_value: result.subScores.inclusion },
        { id: GHL_FIELD_IDS.scorecardCounsel, field_value: result.subScores.counsel },
        { id: GHL_FIELD_IDS.scorecardMeasurement, field_value: result.subScores.measurement },
        { id: GHL_FIELD_IDS.scorecardArchitecture, field_value: result.subScores.architecture },
        { id: GHL_FIELD_IDS.scorecardWeakestPillar, field_value: PILLAR_LABELS[result.dominantWeakness] },
      ],
    }, apiKey);
    if (!upsert.success) throw new Error('Contact save failed');
    const saved = await saveFullCompletion(body, upsert.contactId, apiKey);
    const tags = await addContactTags(upsert.contactId, ['slot-3-scorecard', 'slot-3-completed'], apiKey);
    if (!tags.success) console.error('diagnostic_completion_tag_failed');
    return NextResponse.json({ ok: true, reference: saved.reference });
  } catch {
    console.error('diagnostic_completion_save_or_notification_failed');
    return NextResponse.json({ error: failure }, { status: 502 });
  }
}
