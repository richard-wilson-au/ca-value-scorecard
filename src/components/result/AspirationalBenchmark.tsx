'use client';

import { PILLAR_LABELS, type Pillar, type ScoreResult } from '../../lib/scoring';

const ASPIRATIONAL_COPY: Record<Pillar, string> = {
  inclusion:
    "Top-quartile CA Heads earn a standing seat at the strategy offsite, the M&A diligence rhythm, and the investor-day prep. The seat is calendared, not granted. They are in the room when the decision is still soft, not when the comms plan is being drafted. The question they answer is what the function would change about the decision before it leaves the room, and the CEO has come to expect that answer in writing.",
  counsel:
    "Top-quartile CA Heads make the counsel function visible. There is a named cadence with the CEO, usually quarterly on strategy and monthly on the politically expensive choices, and the judgement is recorded in a one-page memo, not lost in a corridor conversation. The CEO does not have to remember to ask. The counsel is on the calendar, and the written record is what the Board sees when the decision is later reviewed.",
  measurement:
    "Top-quartile CA Heads run a quarterly measurement review with the CEO and CFO. The agenda is fixed: three contribution metrics, audited by Finance, defended to the Board the same way operations defends EBITDA. The conversation is no longer whether the function delivered, because the number is signed. The conversation is what to invest in next, and the function is the one being asked, not the one being reviewed.",
  architecture:
    "Top-quartile CA Heads build the function into the cadence of the company, not into the calendar of the CEO. The risk register has a CA seat by default. The M&A diligence runbook has a named CA stage with a deliverable. The investor-day prep starts with a CA briefing. The work is being in the process whether or not the CEO remembers to invite them, because the process itself was designed with the seat already in it.",
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
