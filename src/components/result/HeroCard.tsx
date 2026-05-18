'use client';

import type { ScoreResult, Pillar, Tier } from '../../lib/scoring';

const HERO_SENTENCE: Record<Tier, Record<Pillar, string>> = {
  Trailblazer: {
    inclusion:
      "You are upstream of the decisions that matter, and the data agrees. The remaining work is keeping that posture as the function grows past you.",
    counsel:
      "The CEO has come to expect your judgement on the hard calls. The next move is making the counsel survive whoever sits in your chair after you.",
    measurement:
      "You measure better than your peer set, which is a low bar. The unfinished work is a CFO-grade definition of contribution that Finance is willing to sign.",
    architecture:
      "Your function is in most rooms a CA Head should be in. The few you are missing are the ones top-quartile peers treat as a standing seat.",
  },
  Aspirant: {
    inclusion:
      "You are closer to upstream than most of your peers, but still being briefed on decisions you should be shaping. That gap is the next visible win.",
    counsel:
      "The CEO consults you on most things, but not the politically expensive ones. Closing that gap is the move that re-prices the function in his head.",
    measurement:
      "You can defend the work, but not yet in CFO language. That is the widest gap in your profile, and the one your peer set is closing fastest.",
    architecture:
      "Your function is in most of the strategic conversations. The missing ones are the rooms where the function would have the most to say. Worth naming each one with the CEO.",
  },
  Follower: {
    inclusion:
      "You are downstream of decisions the function should be shaping. Inclusion is the gap that, once closed, makes every other gap on this scorecard easier.",
    counsel:
      "The CEO uses you for delivery, not for counsel. That is a relationship gap rather than a competence gap, and it is the first one to close.",
    measurement:
      "The function is reviewed in cost language, not contribution language. Until that flips at the CFO's desk, every other gap on this scorecard stays open.",
    architecture:
      "Your function is missing from the rooms where top-quartile CA Heads earn their seat. Architecture is the structural fix the other three pillars depend on.",
  },
  Beginner: {
    inclusion:
      "The function is operating downstream of decisions across the board. The first move is picking one named decision per quarter and shaping it end to end.",
    counsel:
      "The CEO relationship is transactional. Rebuilding it as advisory is the precondition for the other three pillars, and it is a twelve-month project.",
    measurement:
      "Without a CFO-grade definition of contribution, the function is reviewed in cost language every cycle. That is the first gap to close, before anything else.",
    architecture:
      "The function is missing from most of the strategic conversations a CA Head needs to be in. Architecture is the foundation the other three pillars sit on.",
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
