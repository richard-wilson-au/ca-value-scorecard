'use client';

import { useState } from 'react';
import type { Answers } from '../Diagnostic';

type DownloadState = 'idle' | 'loading' | 'error';

export default function NextSteps({ answers }: { answers: Answers }) {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');

  async function handleDownloadPdf() {
    if (downloadState === 'loading') return;
    setDownloadState('loading');
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        setDownloadState('error');
        return;
      }
      const blob = await response.blob();
      const filenameFromHeader = (() => {
        const header = response.headers.get('Content-Disposition') ?? '';
        const match = header.match(/filename="?([^";]+)"?/i);
        return match?.[1];
      })();
      const filename =
        filenameFromHeader ?? 'CA Value-Demonstration Maturity Report.pdf';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloadState('idle');
    } catch {
      setDownloadState('error');
    }
  }

  function handleSendSeries() {
    // TODO Phase 7 — wire to GHL workflow trigger (slot-3-completed tag + 4-email sequence).
    console.log('TODO Phase 7 — series');
  }

  const pdfButtonLabel =
    downloadState === 'loading'
      ? 'Generating…'
      : downloadState === 'error'
        ? 'Try again'
        : 'Download the PDF';

  return (
    <section className="rounded-lg bg-tp-paper px-6 py-10 md:px-10 md:py-12">
      <h2 className="font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        Take this with you.
      </h2>
      <p className="mt-4 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
        Download the full PDF report. Four-pillar scoring detail, three peer
        comparisons (anonymised), and the methodology Richard uses to score this
        from coffee conversations with ASX CA Heads.
      </p>
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={downloadState === 'loading'}
        aria-busy={downloadState === 'loading'}
        className="mt-6 rounded-sm bg-tp-orange px-6 py-3 font-sans text-base font-medium text-tp-white transition-colors hover:bg-tp-orange-deep disabled:cursor-progress disabled:opacity-80"
      >
        {pdfButtonLabel}
      </button>
      {downloadState === 'error' ? (
        <p className="mt-3 font-sans text-sm font-light text-tp-navy">
          The report did not generate. Please try once more, or reply to
          Richard's email and he will send it.
        </p>
      ) : null}

      <p className="mt-10 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
        Want the four-part email series? It walks through each pillar with one
        named pattern Richard has seen close the gap fastest. Sent over seven
        days. Unsubscribe whenever.
      </p>
      <button
        type="button"
        onClick={handleSendSeries}
        className="mt-6 rounded-sm border border-tp-navy bg-tp-white px-6 py-3 font-sans text-base font-medium text-tp-navy transition-colors hover:bg-tp-paper-deep"
      >
        Send me the four-part series
      </button>
    </section>
  );
}
