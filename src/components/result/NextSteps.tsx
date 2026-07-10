'use client';

import { useEffect, useRef, useState } from 'react';
import type { Answers, PrefillContact } from '../Diagnostic';
import { PILLAR_LABELS, type ScoreResult, type Tier } from '../../lib/scoring';

type DownloadState = 'idle' | 'loading' | 'error';
type CaptureState = 'idle' | 'submitting' | 'success' | 'error';

// The cohort landing page. Warmest moment to send them — they have just seen
// their gap benchmarked against ASX CA Head peers.
const COHORT_URL = 'https://cohort.transformationpartners.com.au';

// Tier-aware framing for the cohort CTA. Lower tiers get a sharper
// gap-to-fix nudge; higher tiers get a sharpen-the-edge / build-it-in framing
// so the invitation never feels mismatched to their result.
const COHORT_LEAD_BY_TIER: Record<Tier, string> = {
  Beginner:
    'The gap this surfaced is the one the cohort is built to close. Not another framework to read — the operating model, drafted and deployed with you.',
  Follower:
    'You can read about closing this, or you can build the fix. The cohort deploys the operating model with you over 90 days, so the pattern this surfaced stops repeating.',
  Aspirant:
    'You are close. The cohort is where the last stretch gets built into the system — so the seat is calendared, not granted, and the value is signed, not argued.',
  Trailblazer:
    'You are already running ahead of the peer set. The cohort is where a strong function gets engineered into the company cadence, so it holds without you in the room.',
};

function isEmailLooksValid(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
}

async function postCapture(
  name: string,
  email: string,
  answers: Answers,
): Promise<boolean> {
  try {
    const response = await fetch('/api/diagnostic-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name || 'Unknown', email, answers }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default function NextSteps({
  answers,
  result,
  prefill,
}: {
  answers: Answers;
  result: ScoreResult;
  prefill: PrefillContact;
}) {
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');

  // Silent capture: if the GHL opt-in handed off an email in the URL, write the
  // completed score to the CRM once, on mount, with no form. The visitor just
  // sees the cohort CTA. If there is no email (direct traffic / shared link),
  // we show a one-field fallback instead.
  const hasPrefillEmail = isEmailLooksValid(prefill.email);
  const silentFired = useRef(false);
  const [captureState, setCaptureState] = useState<CaptureState>(
    hasPrefillEmail ? 'submitting' : 'idle',
  );
  const [fallbackName, setFallbackName] = useState(prefill.name);
  const [fallbackEmail, setFallbackEmail] = useState('');

  useEffect(() => {
    if (!hasPrefillEmail || silentFired.current) return;
    silentFired.current = true;
    postCapture(prefill.name, prefill.email, answers).then((ok) =>
      setCaptureState(ok ? 'success' : 'error'),
    );
    // answers is stable for the life of the result screen; fire exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFallbackSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (captureState === 'submitting') return;
    const name = fallbackName.trim();
    const email = fallbackEmail.trim();
    if (!isEmailLooksValid(email)) {
      setCaptureState('error');
      return;
    }
    setCaptureState('submitting');
    const ok = await postCapture(name, email, answers);
    setCaptureState(ok ? 'success' : 'error');
  }

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

  const weakestPillar = PILLAR_LABELS[result.dominantWeakness];
  const cohortLead = COHORT_LEAD_BY_TIER[result.tier];

  const pdfButtonLabel =
    downloadState === 'loading'
      ? 'Generating…'
      : downloadState === 'error'
        ? 'Try again'
        : 'Download the PDF';

  // The fallback email field only shows when we did NOT get an email from the
  // opt-in handoff and the visitor has not yet successfully submitted one.
  const showFallbackForm = !hasPrefillEmail && captureState !== 'success';

  return (
    <div className="space-y-8">
      {/* Primary next step: the cohort. Tier-aware, names the weakest pillar. */}
      <section className="rounded-lg bg-tp-paper px-6 py-10 md:px-10 md:py-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-tp-navy-soft">
          The 90-day cohort
        </p>
        <h2 className="mt-3 font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
          Close the {weakestPillar} gap — with the function, not a slide deck.
        </h2>
        <p className="mt-6 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
          {cohortLead}
        </p>
        <p className="mt-4 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
          Over 90 days you leave with three things you can put in front of your
          executive: a Corporate Affairs operating model, drafted campaign
          plans, and an ELT endorsement pack. Small groups. Heads of Corporate
          Affairs at ASX-listed companies.
        </p>
        <a
          href={COHORT_URL}
          className="mt-6 inline-block rounded-sm bg-tp-orange px-6 py-3 font-sans text-base font-medium text-tp-white transition-colors hover:bg-tp-orange-deep"
        >
          See how the cohort works
        </a>
        <p className="mt-4 font-sans text-sm font-light text-tp-navy-soft">
          No money first. If we need to check fit, it is a 15-minute call.
        </p>
      </section>

      {/* Secondary: the no-friction PDF take-away, with the capture fallback. */}
      <section className="rounded-lg border border-tp-navy-line bg-tp-white px-6 py-10 md:px-10 md:py-12">
        <h2 className="font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
          Take this with you.
        </h2>
        <p className="mt-4 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
          Download the full PDF report. Four-pillar scoring detail, three peer
          comparisons (anonymised), and the methodology Richard uses to score
          this from coffee conversations with ASX CA Heads.
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloadState === 'loading'}
          aria-busy={downloadState === 'loading'}
          className="mt-6 rounded-sm border border-tp-navy bg-tp-white px-6 py-3 font-sans text-base font-medium text-tp-navy transition-colors hover:bg-tp-paper disabled:cursor-progress disabled:opacity-80"
        >
          {pdfButtonLabel}
        </button>
        {downloadState === 'error' ? (
          <p className="mt-3 font-sans text-sm font-light text-tp-navy">
            The report did not generate. Please try once more, or reply to
            Richard&apos;s email and he will send it.
          </p>
        ) : null}

        {showFallbackForm ? (
          <form
            onSubmit={handleFallbackSubmit}
            className="mt-8 border-t border-tp-navy-line pt-8"
            noValidate
          >
            <p className="font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
              Prefer Richard to have your result on file before the cohort
              conversation? Leave your details and he will pick it up from there.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="font-sans text-sm font-medium text-tp-navy-ink">
                  Your name
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={fallbackName}
                  onChange={(e) => setFallbackName(e.target.value)}
                  disabled={captureState === 'submitting'}
                  className="mt-2 w-full rounded-sm border border-tp-navy-line bg-tp-white px-3 py-2 font-sans text-base text-tp-navy-ink placeholder:text-tp-navy-soft focus:border-tp-navy focus:outline-none disabled:opacity-60"
                  placeholder="First and last"
                />
              </label>
              <label className="block">
                <span className="font-sans text-sm font-medium text-tp-navy-ink">
                  Email
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={fallbackEmail}
                  onChange={(e) => setFallbackEmail(e.target.value)}
                  disabled={captureState === 'submitting'}
                  className="mt-2 w-full rounded-sm border border-tp-navy-line bg-tp-white px-3 py-2 font-sans text-base text-tp-navy-ink placeholder:text-tp-navy-soft focus:border-tp-navy focus:outline-none disabled:opacity-60"
                  placeholder="you@company.com.au"
                />
              </label>
            </div>
            {captureState === 'error' ? (
              <p className="mt-3 font-sans text-sm font-light text-tp-orange-deep">
                That did not go through. Check the email address and try once
                more.
              </p>
            ) : null}
            <button
              type="submit"
              disabled={captureState === 'submitting'}
              aria-busy={captureState === 'submitting'}
              className="mt-5 rounded-sm bg-tp-orange px-6 py-3 font-sans text-base font-medium text-tp-white transition-colors hover:bg-tp-orange-deep disabled:cursor-progress disabled:opacity-80"
            >
              {captureState === 'submitting' ? 'Sending…' : 'Send Richard my result'}
            </button>
          </form>
        ) : null}

        {!hasPrefillEmail && captureState === 'success' ? (
          <p className="mt-8 border-t border-tp-navy-line pt-8 font-display text-lg italic leading-snug text-tp-navy-ink">
            Got it — Richard has your result on file.
          </p>
        ) : null}
      </section>
    </div>
  );
}
