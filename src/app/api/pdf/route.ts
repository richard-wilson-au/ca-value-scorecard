// PDF generation API route. Accepts the user's answers, scores them, and
// streams a 5-page A4 PDF report back. Node runtime — @react-pdf/renderer
// needs node:path + filesystem access for self-hosted font registration.

import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import type { Answers } from '../../../components/Diagnostic';
import { scoreAnswers } from '../../../lib/scoring';
import Report, { reportFilename } from '../../../components/pdf/Report';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PdfRequestBody = {
  name?: string;
  email?: string;
  answers: Answers;
};

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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'Body must be an object with { answers, name? }' },
      { status: 400 },
    );
  }

  const { answers, name } = body as Partial<PdfRequestBody>;
  if (!isAnswers(answers)) {
    return NextResponse.json(
      { error: 'Body.answers does not match the expected shape' },
      { status: 400 },
    );
  }

  const result = scoreAnswers(answers);
  // Call Report directly so renderToBuffer receives the underlying <Document>
  // element — keeps the route a .ts file (no JSX) and avoids the @react-pdf
  // type narrowing issue with createElement.
  const documentElement = Report({ result, name });
  const pdfBuffer = await renderToBuffer(documentElement);

  const filename = reportFilename(name);

  // Buffer satisfies BodyInit on the Node runtime. Cast through Uint8Array to
  // keep the type checker happy without losing the binary payload.
  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
