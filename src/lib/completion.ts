import { createHash } from 'node:crypto';
import type { Answers } from '../components/Diagnostic';
import { PILLAR_LABELS, scoreAnswers } from './scoring';

export const LOCATION_ID = 'XSTagpGfycjvto36M28p';
const NOTIFY_CONTACT = '8FVg7xwO6VzBhjMrLTPS';
const NOTIFY_EMAIL = 'richard@transformationpartners.com.au';
const BASE = 'https://services.leadconnectorhq.com';
const sectors = ['Mining and resources', 'Energy — oil and gas, renewables', 'Utilities', 'Other heavy industry'];
const sizes = ['Just me, or 1–2', 'Small team — 3 to 8', 'Medium — 9 to 20', 'Large — 20+'];
const conversations = ['Risk register', 'Capital allocation', 'Board-paper drafting', 'Investor-day prep', 'M&A diligence', 'ESG materiality', 'CEO message-of-the-year', "We're in all of these"];
const causes = ["Can't articulate value in CFO terms", "CEO doesn't prioritise it", 'Wrong relationships at the top', 'Function viewed as overhead, not investment', 'Budget cycle timing'];
export type Completion = { name: string; email: string; answers: Answers; submissionId?: string };

export function validCompletion(value: unknown): value is Completion {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (typeof v.name !== 'string' || !v.name.trim() || v.name.length > 200 || /[\r\n]/.test(v.name)) return false;
  if (typeof v.email !== 'string' || v.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) return false;
  if (v.submissionId !== undefined && (typeof v.submissionId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(v.submissionId))) return false;
  if (!v.answers || typeof v.answers !== 'object') return false;
  const a = v.answers as Record<string, unknown>;
  if (!sectors.includes(a.sector as string) || !sizes.includes(a.functionSize as string) || !causes.includes(a.rootCause as string)) return false;
  if (!['involvedEarly', 'ceoSeeksCounsel', 'canQuantifyValue', 'budgetReview'].every(k => Number.isInteger(a[k]) && Number(a[k]) >= 1 && Number(a[k]) <= 5)) return false;
  if (!Array.isArray(a.missingConversations) || !a.missingConversations.length || a.missingConversations.length > conversations.length) return false;
  const missing = a.missingConversations;
  return missing.every(v => typeof v === 'string' && conversations.includes(v)) && new Set(missing).size === missing.length && !(missing.includes("We're in all of these") && missing.length > 1);
}

function escape(value: unknown): string {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
type Note = { id: string; body: string };
type GHLData = { note?: Note; notes?: Note[]; messageId?: string };

// Save and read back full responses before sending the internal notification.
// Retrying the same submission reuses its note and recorded email receipt.
export async function saveFullCompletion(data: Completion, contactId: string, apiKey: string) {
  async function ghl(path: string, method = 'GET', body?: unknown): Promise<GHLData> {
    const response = await fetch(`${BASE}${path}`, {
      method,
      headers: { Authorization: `Bearer ${apiKey}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000), cache: 'no-store',
    });
    if (!response.ok) throw new Error(`GHL ${method} failed (${response.status})`);
    return await response.json() as GHLData;
  }
  const a = data.answers;
  const canonical = [data.name.trim(), data.email.trim().toLowerCase(), a.sector, a.functionSize, a.involvedEarly, a.ceoSeeksCounsel, a.canQuantifyValue, a.budgetReview, [...a.missingConversations].sort(), a.rootCause];
  const digest = createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
  const reference = `scorecard-completion:${data.submissionId ?? 'legacy'}:${digest}`;
  const result = scoreAnswers(a);
  const rows = [
    ['Name', data.name.trim()], ['Email', data.email.trim().toLowerCase()],
    ['Sector', a.sector], ['Function size', a.functionSize],
    ['Involved early in major decisions (1–5)', a.involvedEarly],
    ['CEO seeks my counsel (1–5)', a.ceoSeeksCounsel],
    ['Can quantify value for CFO / Board (1–5)', a.canQuantifyValue],
    ['Budget reviews focus on delivery (1–5)', a.budgetReview],
    ['Missing strategic conversations', a.missingConversations.join('; ')],
    ['Main reason resources are refused', a.rootCause],
    ['Overall score', result.overall], ['Tier', result.tier],
    ['Inclusion', result.subScores.inclusion], ['Counsel', result.subScores.counsel],
    ['Measurement', result.subScores.measurement], ['Architecture', result.subScores.architecture],
    ['Weakest pillar', PILLAR_LABELS[result.dominantWeakness]],
  ];
  const crmUrl = `https://app.gohighlevel.com/v2/location/${LOCATION_ID}/contacts/detail/${encodeURIComponent(contactId)}`;
  const path = `/contacts/${encodeURIComponent(contactId)}/notes`;
  const listed = await ghl(path);
  if (!Array.isArray(listed.notes)) throw new Error('GHL notes response missing');
  let note = listed.notes.find(n => n.body.includes(`Reference: ${reference}</p>`));
  if (!note) {
    const body = `<p><strong>Strategic Capacity Diagnostic — completed</strong></p><p>Received: ${new Date().toISOString()}</p><table>${rows.map(([label, value]) => `<tr><th align="left">${escape(label)}</th><td>${escape(value)}</td></tr>`).join('')}</table><p><a href="${crmUrl}">Open contact in GoHighLevel</a></p><p>Reference: ${reference}</p>`;
    const created = await ghl(path, 'POST', { body });
    if (!created.note?.id) throw new Error('GHL note ID missing');
    const checked = await ghl(`${path}/${encodeURIComponent(created.note.id)}`);
    if (checked.note?.body !== body) throw new Error('Completion note verification failed');
    note = checked.note;
  }
  if (!note.body.includes('Notification message ID: ')) {
    const sent = await ghl('/conversations/messages', 'POST', {
      type: 'Email', contactId: NOTIFY_CONTACT, emailTo: NOTIFY_EMAIL,
      subject: `Quiz completed: ${data.name.trim()} — ${result.tier}`, html: note.body,
    });
    if (!sent.messageId) throw new Error('Notification message ID missing');
    const body = `${note.body}<p>Notification message ID: ${escape(sent.messageId)}</p>`;
    await ghl(`${path}/${encodeURIComponent(note.id)}`, 'PUT', { body });
    const checked = await ghl(`${path}/${encodeURIComponent(note.id)}`);
    if (checked.note?.body !== body) throw new Error('Notification receipt verification failed');
  }
  return { reference, noteId: note.id };
}
