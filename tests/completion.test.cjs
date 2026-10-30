/* CommonJS loader transpiles the route for Node's built-in test runner. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { validCompletion } = require('../src/lib/completion.ts');
const { POST } = require('../src/app/api/diagnostic-complete/route.ts');
const originalFetch = global.fetch;
const originalKey = process.env.GHL_API_KEY;
afterEach(() => { global.fetch = originalFetch; if (originalKey === undefined) delete process.env.GHL_API_KEY; else process.env.GHL_API_KEY = originalKey; });
const payload = () => ({ name: 'TEST Quiz completion', email: 'richard@transformationpartners.com.au', submissionId: '00000000-0000-4000-8000-000000000001', answers: { sector: 'Utilities', functionSize: 'Small team — 3 to 8', involvedEarly: 3, ceoSeeksCounsel: 4, canQuantifyValue: 2, budgetReview: 3, missingConversations: ['Risk register'], rootCause: 'Budget cycle timing' } });
const request = body => new Request('https://strategic-capacity-diagnostic.vercel.app/api/diagnostic-complete', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://strategic-capacity-diagnostic.vercel.app' }, body: JSON.stringify(body) });
function gateway({ failEmail = false, corruptReadback = false, duplicateContact = false } = {}) {
  const state = { notes: [], emails: [], updates: 0, failEmail, calls: [] };
  global.fetch = async (url, init = {}) => {
    const path = new URL(url).pathname; const method = init.method || 'GET'; const body = init.body ? JSON.parse(init.body) : null;
    state.calls.push([method, path]);
    let value;
    if (path === '/contacts/upsert') {
      if (duplicateContact) return Response.json({ meta: { contactId: 'applicant' } }, { status: 409 });
      value = { contact: { id: 'applicant' } };
    } else if (path === '/contacts/applicant' && method === 'PUT') { state.updates++; value = { contact: { id: 'applicant' } };
    } else if (path === '/contacts/applicant/tags') value = {};
    else if (path === '/contacts/applicant/notes' && method === 'GET') value = { notes: structuredClone(state.notes) };
    else if (path === '/contacts/applicant/notes' && method === 'POST') { const note = { id: 'note-' + (state.notes.length + 1), body: body.body }; state.notes.push(note); value = { note: structuredClone(note) };
    } else if (path.startsWith('/contacts/applicant/notes/') && method === 'GET') { value = { note: structuredClone(state.notes.find(n => path.endsWith(n.id))) }; if (corruptReadback) value.note.body = 'wrong';
    } else if (path.startsWith('/contacts/applicant/notes/') && method === 'PUT') { const note = state.notes.find(n => path.endsWith(n.id)); note.body = body.body; value = { note: structuredClone(note) };
    } else if (path === '/conversations/messages') {
      if (state.failEmail) return Response.json({}, { status: 503 });
      state.emails.push(body); value = { messageId: 'email-' + state.emails.length };
    } else throw new Error('Unexpected call: ' + method + ' ' + path);
    return Response.json(value);
  };
  process.env.GHL_API_KEY = 'fake-test-key';
  return state;
}
test('rejects incomplete, out-of-range, unknown and contradictory answers before saving', async () => {
  let calls = 0; global.fetch = async () => { calls++; throw new Error('Must not call'); };
  for (const change of [p => p.answers.involvedEarly = null, p => p.answers.budgetReview = 6, p => p.answers.rootCause = 'unknown', p => p.answers.missingConversations = ["We're in all of these", 'Risk register'], p => p.email = '', p => p.name = '']) {
    const p = payload(); change(p); assert.equal(validCompletion(p), false); assert.equal((await POST(request(p))).status, 400);
  }
  assert.equal(calls, 0);
});
test('saves all raw responses, verifies note and sends details only to Richard', async () => {
  const s = gateway(); const p = payload(); const response = await POST(request(p));
  assert.equal(response.status, 200); assert.equal((await response.json()).ok, true);
  assert.equal(s.notes.length, 1); assert.equal(s.emails.length, 1);
  for (const text of ['Utilities', 'Small team', 'Risk register', 'Budget cycle timing', 'Overall score', 'Tier', 'CEO seeks my counsel', 'Can quantify value', 'Budget reviews']) assert.ok(s.notes[0].body.includes(text), text);
  assert.ok(s.notes[0].body.includes('Notification message ID: email-1'));
  assert.equal(s.emails[0].emailTo, 'richard@transformationpartners.com.au'); assert.equal(s.emails[0].contactId, '8FVg7xwO6VzBhjMrLTPS');
  assert.ok(s.emails[0].html.includes('/contacts/detail/applicant'));
});
test('identical retry reuses saved note and email; a new completion keeps history', async () => {
  const s = gateway(); const p = payload();
  assert.equal((await POST(request(p))).status, 200); assert.equal((await POST(request(p))).status, 200);
  assert.equal(s.notes.length, 1); assert.equal(s.emails.length, 1);
  p.submissionId = '00000000-0000-4000-8000-000000000002';
  assert.equal((await POST(request(p))).status, 200); assert.equal(s.notes.length, 2); assert.equal(s.emails.length, 2);
});
test('notification failure preserves full answers and retry sends the outstanding alert', async () => {
  const s = gateway({ failEmail: true }); const p = payload();
  assert.equal((await POST(request(p))).status, 502); assert.equal(s.notes.length, 1); assert.equal(s.emails.length, 0);
  s.failEmail = false; assert.equal((await POST(request(p))).status, 200); assert.equal(s.notes.length, 1); assert.equal(s.emails.length, 1);
});
test('failed independent readback never reports success or sends an alert', async () => {
  const s = gateway({ corruptReadback: true }); assert.equal((await POST(request(payload()))).status, 502); assert.equal(s.emails.length, 0);
});
test('existing contact duplicate response requires an explicit score update', async () => {
  const s = gateway({ duplicateContact: true }); assert.equal((await POST(request(payload()))).status, 200); assert.equal(s.updates, 1);
});
test('HTML in names is escaped in the stored note and internal email', async () => {
  const s = gateway(); const p = payload(); p.name = '<img src=x onerror=alert(1)>';
  assert.equal((await POST(request(p))).status, 200); assert.ok(!s.notes[0].body.includes('<img')); assert.ok(s.notes[0].body.includes('&lt;img'));
});
test('cross-origin calls and oversized bodies are rejected', async () => {
  const p = payload(); const cross = new Request('https://strategic-capacity-diagnostic.vercel.app/api/diagnostic-complete', { method: 'POST', headers: { Origin: 'https://other.example' }, body: JSON.stringify(p) });
  assert.equal((await POST(cross)).status, 403); assert.equal((await POST(request({ padding: 'x'.repeat(13000) }))).status, 413);
});
