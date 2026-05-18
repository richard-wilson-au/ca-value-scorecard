'use client';

import { PILLAR_LABELS, type Pillar, type ScoreResult } from '../../lib/scoring';

// TODO Phase 4 — hand-curated "what top-quartile does differently" paragraph
// per dominant-weakness pillar. Placeholder copy below renders the layout.
const ASPIRATIONAL_COPY: Record<Pillar, string> = {
  inclusion:
    'What top-quartile CA Heads do differently on Inclusion: they negotiate calendared positions in the decision-shape phase, not the comms-plan phase. The pattern is structural — a standing seat at the strategy offsite, the M&A diligence rhythm, the investor-day prep — and it survives the calendar. The conversation isn’t whether the function is briefed; it’s what the function would change about the decision before it leaves the room.',
  counsel:
    'What top-quartile CA Heads do differently on Counsel: they make the counsel function explicit. There is a named cadence — quarterly with the CEO, monthly on the politically expensive choices — and the function defends its judgment in writing, not just in conversation. The CEO doesn’t need to ask; the counsel is on the calendar.',
  measurement:
    'What top-quartile CA Heads do differently on Measurement: they run a quarterly measurement review with the CEO and CFO. The agenda is fixed — three contribution metrics, audited by Finance, defended to the Board the same way operations defends EBITDA. The conversation isn’t whether the function delivered; that’s evidence-based. The conversation is what to invest in next.',
  architecture:
    'What top-quartile CA Heads do differently on Architecture: they build the function into the cadence of the company, not into the calendar of the CEO. The risk register has a CA seat. The M&A diligence runbook has a CA stage. The investor-day prep starts with a CA briefing. The work isn’t getting invited; it’s being in the process by default.',
};

export default function AspirationalBenchmark({
  result,
}: {
  result: ScoreResult;
}) {
  const pillar = result.dominantWeakness;

  return (
    <section>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-tp-navy-soft">
        What top-quartile looks like
      </p>
      <h2 className="mt-3 font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        On {PILLAR_LABELS[pillar]} — the pattern Richard has seen close the gap fastest.
      </h2>
      <p className="mt-6 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
        {ASPIRATIONAL_COPY[pillar]}
      </p>
    </section>
  );
}
