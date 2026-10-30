import { NextResponse } from 'next/server';
import { addContactTags, splitName, upsertContact } from '../../../lib/ghl';
import { LOCATION_ID } from '../../../lib/completion';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Please use the diagnostic form.' }, { status: 403 });
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 2000) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
  const { name, email } = body as Record<string, unknown>;
  if (typeof name !== 'string' || !name.trim() || name.length > 200 ||
      typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      name.includes('{{') || email.includes('{{')) {
    return NextResponse.json({ error: 'Please provide your name and a valid email.' }, { status: 400 });
  }
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Contact save unavailable' }, { status: 503 });
  // Identity only: preserve existing scores and avoid completion/nurture tags.
  const saved = await upsertContact({
    ...splitName(name), email: email.trim().toLowerCase(), locationId: LOCATION_ID,
    source: 'Strategic Capacity Diagnostic',
  }, apiKey);
  if (!saved.success) return NextResponse.json({ error: 'Could not save your details. Please retry.' }, { status: 502 });
  const tagged = await addContactTags(saved.contactId, ['slot-3-started'], apiKey);
  if (!tagged.success) return NextResponse.json({ error: 'Could not confirm your quiz start. Please retry.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
