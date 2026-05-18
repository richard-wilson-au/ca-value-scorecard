'use client';

import type { Answers } from '../Diagnostic';

export default function PlaceholderResult({
  answers: _answers,
  onRestart,
}: {
  answers: Answers;
  onRestart: () => void;
}) {
  return (
    <main className="min-h-screen bg-tp-white px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <p className="font-mono text-sm text-tp-navy-soft">Result</p>
        <h1 className="mt-4 font-display text-3xl leading-snug text-tp-navy-ink md:text-4xl">
          Phase 3 will render your result here.
        </h1>
        <p className="mt-6 font-sans text-base font-light text-tp-navy md:text-lg">
          The peer benchmark, four-pillar bullet charts, and hand-curated tier interpretation land in the next build session. Thanks for clicking through the diagnostic — your answers are captured client-side and discarded on refresh.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-12 rounded-sm bg-tp-orange px-6 py-3 font-sans text-base font-medium text-tp-white transition-colors hover:bg-tp-orange-deep"
        >
          Restart
        </button>
      </div>
    </main>
  );
}
