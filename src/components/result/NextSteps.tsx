'use client';

import { useState } from 'react';
import type { Answers } from '../Diagnostic';

type DownloadState = 'idle' | 'loading' | 'error';
type SeriesState = 'closed' | 'open' | 'submitting' | 'success' | 'error';

function isEmailLooksValid(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
}

export default function NextSteps({ answers }: { answers: Answers }) {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');

  const [seriesState, setSeriesState] = useState<SeriesState>('closed');
  const [seriesName, setSeriesName] = useState('');
  const [seriesEmail, setSeriesEmail] = useState('');

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

  function openSeriesForm() {
    if (seriesState !== 'closed') return;
    setSeriesState('open');
  }

  async function handleSeriesSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (seriesState === 'submitting') return;
    const name = seriesName.trim();
    const email = seriesEmail.trim();
    if (name.length === 0 || !isEmailLooksValid(email)) {
      setSeriesState('error');
      return;
    }
    setSeriesState('submitting');
    try {
      const response = await fetch('/api/diagnostic-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, answers }),
      });
      if (!response.ok) {
        setSeriesState('error');
        return;
      }
      setSeriesState('success');
    } catch {
      setSeriesState('error');
    }
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

      {seriesState === 'closed' ? (
        <button
          type="button"
          onClick={openSeriesForm}
          className="mt-6 rounded-sm border border-tp-navy bg-tp-white px-6 py-3 font-sans text-base font-medium text-tp-navy transition-colors hover:bg-tp-paper-deep"
        >
          Send me the four-part series
        </button>
      ) : null}

      {seriesState !== 'closed' && seriesState !== 'success' ? (
        <form
          onSubmit={handleSeriesSubmit}
          className="mt-6 rounded-sm border border-tp-navy-line bg-tp-white p-6"
          noValidate
        >
          <label className="block">
            <span className="font-sans text-sm font-medium text-tp-navy-ink">
              Your name
            </span>
            <input
              type="text"
              required
              autoComplete="name"
              value={seriesName}
              onChange={(e) => setSeriesName(e.target.value)}
              disabled={seriesState === 'submitting'}
              className="mt-2 w-full rounded-sm border border-tp-navy-line bg-tp-white px-3 py-2 font-sans text-base text-tp-navy-ink placeholder:text-tp-navy-soft focus:border-tp-navy focus:outline-none disabled:opacity-60"
              placeholder="First and last"
            />
          </label>
          <label className="mt-4 block">
            <span className="font-sans text-sm font-medium text-tp-navy-ink">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={seriesEmail}
              onChange={(e) => setSeriesEmail(e.target.value)}
              disabled={seriesState === 'submitting'}
              className="mt-2 w-full rounded-sm border border-tp-navy-line bg-tp-white px-3 py-2 font-sans text-base text-tp-navy-ink placeholder:text-tp-navy-soft focus:border-tp-navy focus:outline-none disabled:opacity-60"
              placeholder="you@company.com.au"
            />
          </label>
          {seriesState === 'error' ? (
            <p className="mt-3 font-sans text-sm font-light text-tp-orange-deep">
              That did not go through. Check the email address and try once
              more, or reply to Richard directly.
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={seriesState === 'submitting'}
              aria-busy={seriesState === 'submitting'}
              className="rounded-sm bg-tp-orange px-6 py-3 font-sans text-base font-medium text-tp-white transition-colors hover:bg-tp-orange-deep disabled:cursor-progress disabled:opacity-80"
            >
              {seriesState === 'submitting' ? 'Sending…' : 'Send me the series'}
            </button>
            <button
              type="button"
              onClick={() => setSeriesState('closed')}
              disabled={seriesState === 'submitting'}
              className="rounded-sm border border-tp-navy-line bg-tp-white px-6 py-3 font-sans text-base font-light text-tp-navy transition-colors hover:bg-tp-paper disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
          <p className="mt-4 font-sans text-xs font-light text-tp-navy-soft">
            Four emails over seven days, anchored on your weakest pillar.
            Unsubscribe anytime.
          </p>
        </form>
      ) : null}

      {seriesState === 'success' ? (
        <div className="mt-6 rounded-sm border border-tp-navy-line bg-tp-white p-6">
          <p className="font-display text-lg italic leading-snug text-tp-navy-ink">
            Email one is on the way.
          </p>
          <p className="mt-3 font-sans text-base font-light leading-relaxed text-tp-navy">
            Check your inbox in the next few minutes. If it does not arrive,
            it is probably in promotions or spam — replying to it once gets
            future emails to the primary tab.
          </p>
        </div>
      ) : null}
    </section>
  );
}
