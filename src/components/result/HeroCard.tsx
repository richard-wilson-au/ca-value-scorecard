'use client';

import type { ScoreResult, Pillar, Tier } from '../../lib/scoring';

// TODO Phase 4 — replace with hand-curated 20-entry (tier × dominantWeakness)
// interpretation dictionary. Phase 3 ships placeholders so the layout renders.
const HERO_SENTENCE: Record<Tier, Record<Pillar, string>> = {
  Trailblazer: {
    inclusion:
      'You sit upstream of most decisions, and the data shows it — the work now is keeping the inclusion lever load-bearing as the function scales.',
    counsel:
      "The CEO already treats your judgment as a strategic asset. The next gap is structural — making the counsel function survive your calendar.",
    measurement:
      "You measure well by the standards of the field, which is a low bar; the unfinished work is a CFO-grade definition of contribution.",
    architecture:
      'Your function is in most rooms it should be in. The remaining gaps are the rooms top-quartile peers treat as non-negotiable.',
  },
  Aspirant: {
    inclusion:
      "You're closer to upstream than most, but still being briefed on decisions you should be shaping. Closing that gap is the next visible win.",
    counsel:
      "The CEO consults you on some things, not the politically expensive ones. That's the gap to name and close in the next twelve months.",
    measurement:
      "You can defend the work, but not yet in CFO language. That's the single largest gap in your profile — and the one peers are closing fastest.",
    architecture:
      "Your function is in most strategic conversations, but the missing ones are the load-bearing ones. Worth naming explicitly with the CEO.",
  },
  Follower: {
    inclusion:
      "You're downstream of most decisions that the function should be shaping. Inclusion is the lever that unlocks everything else on this scorecard.",
    counsel:
      "The CEO uses you for delivery, not for counsel. That's a relationship gap, not a competence gap — and it's the one to close first.",
    measurement:
      "The function is reviewed in cost language, not contribution language. Until that flips, every other gap on this scorecard stays open.",
    architecture:
      "Your function is missing from the rooms where top-quartile CA Heads earn their seat. Architecture is the structural fix the others depend on.",
  },
  Beginner: {
    inclusion:
      "The function is operating downstream of decisions across the board. The first move is naming one decision per quarter you should be shaping.",
    counsel:
      "The CEO relationship is transactional, not advisory. Rebuilding that is the precondition for everything else on this scorecard.",
    measurement:
      "Without a CFO-grade definition of contribution, the function gets reviewed in cost language every cycle. That's the first gap to close.",
    architecture:
      "Your function is missing from the strategic conversations a CA Head needs to be in. Architecture is the foundation everything else sits on.",
  },
};

function format1dp(n: number): string {
  return n.toFixed(1);
}

export default function HeroCard({ result }: { result: ScoreResult }) {
  const { tier, overall, dominantWeakness, peerBenchmark } = result;
  const interpretation = HERO_SENTENCE[tier][dominantWeakness];

  return (
    <section
      className="rounded-lg border border-tp-navy-line bg-tp-white px-6 py-8 md:px-10 md:py-10"
      style={{
        boxShadow:
          '0 1px 2px rgba(47, 61, 85, 0.06), 0 1px 1px rgba(47, 61, 85, 0.04)',
      }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-tp-navy-soft">
        Your result
      </p>

      <h1 className="mt-3 font-display text-3xl italic leading-tight text-tp-orange md:text-4xl">
        {tier}
      </h1>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-[64px] font-medium leading-none text-tp-navy-ink md:text-[88px]">
          {format1dp(overall)}
        </span>
        <span className="font-mono text-2xl text-tp-navy-soft md:text-3xl">
          / 5
        </span>
      </div>

      <p className="mt-5 font-sans text-sm font-light text-tp-navy md:text-base">
        Your {format1dp(overall)} versus ASX mining and energy CA Heads
        (n={peerBenchmark.n}) — median {format1dp(peerBenchmark.median)} ·
        top quartile {format1dp(peerBenchmark.topQuartile)}.
      </p>

      <p className="mt-6 font-display text-lg italic leading-snug text-tp-navy-ink md:text-xl">
        {interpretation}
      </p>

      <div className="mt-8 flex items-end justify-between border-t border-tp-navy-line pt-4">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-tp-navy">
          Transformation Partners
        </p>
        <p className="font-mono text-xs text-tp-navy-soft">
          caplaybook.substack.com
        </p>
      </div>
    </section>
  );
}
