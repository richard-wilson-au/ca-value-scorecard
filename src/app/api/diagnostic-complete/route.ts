// Diagnostic completion API route. Accepts the user's name, email, and
// answers, scores the result, upserts the contact into GHL with six
// Scorecard_* custom fields populated, and applies the slot-3-completed tag
// that triggers the Phase 7b GHL Workflow (4-email sequence).
//
// PIT auth: reuses the steve-funnel-kit-diagnostics PIT (contacts.write +
// contacts.readonly) — same GHL location XSTagpGfycjvto36M28p. The env var
// GHL_API_KEY must be set in Vercel for this project (copy from the
// steve-funnel-kit Vercel project's env vars).

import { NextResponse } from 'next/server';
import type { Answers } from '../../../components/Diagnostic';
import { scoreAnswers, PILLAR_LABELS } from '../../../lib/scoring';
import {
  GHL_FIELD_IDS,
  addContactTags,
  splitName,
  upsertContact,
} from '../../../lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GHL_LOCATION_ID = 'XSTagpGfycjvto36M28p';
const SLOT_3_COMPLETED_TAG = 'slot-3-completed';
const SCORECARD_OPT_IN_TAG = 'slot-3-scorecard'; // matches squeeze-page tag for filtering

type DiagnosticCompleteBody = {
  name: string;
  email: string;
  answers: Answers;
};

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isAnswers(value: unknown): value is Answers {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.sector === 'string' &&
    typeof v.functionSize === 'string' &&
    Array.isArray(v.missingConversations) &&
    typeof v.rootCause === 'string'
  );
}

function isValidEmail(email: string): boolean {
  // Lightweight check — full RFC 5322 isn't necessary at the API boundary.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body must be an object' }, { status: 400 });
  }

  const candidate = body as Partial<DiagnosticCompleteBody>;
  if (!isString(candidate.name) || candidate.name.trim().length === 0) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!isString(candidate.email) || !isValidEmail(candidate.email.trim())) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (!isAnswers(candidate.answers)) {
    return NextResponse.json(
      { error: 'answers does not match the expected shape' },
      { status: 400 },
    );
  }

  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) {
    console.error('GHL_API_KEY is not set in this environment');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    );
  }

  const result = scoreAnswers(candidate.answers);
  const { firstName, lastName } = splitName(candidate.name);
  const weakestPillarLabel = PILLAR_LABELS[result.dominantWeakness];

  const customFields = [
    { id: GHL_FIELD_IDS.scorecardTier, field_value: result.tier },
    { id: GHL_FIELD_IDS.scorecardInclusion, field_value: result.subScores.inclusion },
    { id: GHL_FIELD_IDS.scorecardCounsel, field_value: result.subScores.counsel },
    { id: GHL_FIELD_IDS.scorecardMeasurement, field_value: result.subScores.measurement },
    { id: GHL_FIELD_IDS.scorecardArchitecture, field_value: result.subScores.architecture },
    { id: GHL_FIELD_IDS.scorecardWeakestPillar, field_value: weakestPillarLabel },
  ];

  const upsert = await upsertContact(
    {
      firstName,
      lastName,
      email: candidate.email.trim().toLowerCase(),
      locationId: GHL_LOCATION_ID,
      source: 'Strategic Capacity Diagnostic',
      customFields,
    },
    apiKey,
  );

  if (!upsert.success) {
    if (upsert.statusCode === 401 || upsert.statusCode === 403) {
      console.error('GHL authorization error — check PIT scopes include contacts.write');
    }
    console.error('GHL upsert failed', upsert.statusCode, upsert.error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 502 },
    );
  }

  // Apply tags — both the opt-in tag (matches squeeze-page convention) and the
  // workflow-trigger tag. Tag append is non-destructive; existing tags survive.
  const tagsResult = await addContactTags(
    upsert.contactId,
    [SCORECARD_OPT_IN_TAG, SLOT_3_COMPLETED_TAG],
    apiKey,
  );
  if (!tagsResult.success) {
    console.error('GHL tag append failed', tagsResult.statusCode, tagsResult.error);
    // Don't fail the whole request — the contact + custom fields are in GHL.
    // The workflow won't trigger without the tag, but a manual tag-add in GHL
    // UI recovers. Surface a partial-success response.
    return NextResponse.json(
      {
        ok: true,
        warning: 'Contact saved, but the workflow trigger tag failed to apply.',
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
