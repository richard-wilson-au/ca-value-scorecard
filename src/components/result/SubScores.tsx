'use client';

import {
  PILLAR_LABELS,
  PILLAR_QUESTIONS,
  type Pillar,
  type ScoreResult,
} from '../../lib/scoring';

const PILLAR_ORDER: Pillar[] = ['inclusion', 'counsel', 'measurement', 'architecture'];

function format1dp(n: number): string {
  return n.toFixed(1);
}

function pct(n: number): number {
  // Score scale 1–5 mapped to 0–100% for visual width.
  // Anchor 0 at score 1 so a score of 1 reads as "minimum" not "empty."
  const clamped = Math.max(1, Math.min(5, n));
  return ((clamped - 1) / 4) * 100;
}

function BulletChart({
  user,
  median,
  topQuartile,
}: {
  user: number;
  median: number;
  topQuartile: number;
}) {
  return (
    <div className="mt-3" aria-hidden="true">
      <div className="relative h-3 w-full rounded-sm bg-tp-paper">
        <div
          className="absolute inset-y-0 left-0 rounded-sm bg-tp-navy"
          style={{ width: `${pct(user)}%` }}
        />
        <div
          className="absolute inset-y-[-4px] w-px bg-tp-navy-ink"
          style={{ left: `${pct(median)}%` }}
        />
        <div
          className="absolute inset-y-[-4px] w-px bg-tp-orange"
          style={{ left: `${pct(topQuartile)}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-xs text-tp-navy-soft">
        <span>
          <span className="text-tp-navy-ink">You {format1dp(user)}</span>
        </span>
        <span>Median {format1dp(median)}</span>
        <span className="text-tp-orange">
          Top quartile {format1dp(topQuartile)}
        </span>
      </div>
    </div>
  );
}

export default function SubScores({ result }: { result: ScoreResult }) {
  const { subScores, peerBenchmark } = result;

  return (
    <section>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-tp-navy-soft">
        Your four pillars
      </p>
      <h2 className="mt-3 font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        Where the score comes from.
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10">
        {PILLAR_ORDER.map((pillar) => (
          <div key={pillar}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-tp-navy-ink">
                {PILLAR_LABELS[pillar]}
              </h3>
              <span className="font-mono text-lg font-medium text-tp-navy-ink">
                {format1dp(subScores[pillar])}
              </span>
            </div>
            <p className="mt-1 font-sans text-sm font-light text-tp-navy-soft">
              {PILLAR_QUESTIONS[pillar]}
            </p>
            <BulletChart
              user={subScores[pillar]}
              median={peerBenchmark.subScoreMedians[pillar]}
              topQuartile={peerBenchmark.subScoreTopQuartile[pillar]}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
