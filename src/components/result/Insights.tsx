'use client';

import {
  PILLAR_LABELS,
  type Pillar,
  type ScoreResult,
  type Tier,
} from '../../lib/scoring';

// TODO Phase 4 — 20 hand-curated tier × pillar insight paragraphs in
// Richard's voice. Phase 3 placeholders are keyed off (tier, pillar) so
// the layout renders and three different weakest pillars produce three
// distinct paragraphs.
const INSIGHT_COPY: Record<Tier, Record<Pillar, string>> = {
  Trailblazer: {
    inclusion:
      "You're upstream of more decisions than most of your peers, and the score reflects that. The remaining gap is consistency — the rooms you're in by default versus the rooms you're in by invitation.",
    counsel:
      "The CEO seeks your judgment, but the function still depends on the relationship rather than the structure. That's the gap top-quartile peers close by making counsel a calendared, not ad hoc, conversation.",
    measurement:
      "You measure better than the peer set, which is a low bar. The unfinished work is a CFO-grade definition of contribution, audited by Finance, defended quarterly. Without that, the function still reads as a cost line.",
    architecture:
      "Your function is in most strategic conversations a CA Head should be in. The remaining ones — typically capital allocation or M&A diligence — are the ones top-quartile peers treat as non-negotiable.",
  },
  Aspirant: {
    inclusion:
      "I've heard this pattern in seven of the ten coffees: the function is briefed, not consulted. The conversation always lands in the same place — by the time CA is in the room, the decision shape is fixed.",
    counsel:
      "The CEO uses you on the comms side of politically expensive decisions, not the strategic shape of them. That's a relationship gap, and it closes faster than people think — once the function names what it's offering.",
    measurement:
      "Your Measurement score is the widest gap in your profile. Most Heads of Corporate Affairs I've sat with at ASX-listed mining and energy companies score this dimension the lowest, and the conversation always lands in the same place: the function can't articulate contribution in CFO language, so the function gets reviewed in cost language.",
    architecture:
      "Your function is in the rooms it has to be in, missing from the ones it should be in. The missing ones are usually capital allocation, investor-day prep, or the risk register — the rooms where the function would have leverage if it were there.",
  },
  Follower: {
    inclusion:
      "The function is downstream of decisions it should be shaping. That's not a competence gap — it's a positioning gap. Inclusion is the lever that unlocks every other dimension on this scorecard.",
    counsel:
      "The CEO uses the function for delivery, not for counsel. The hardest part of closing that gap isn't the CEO — it's the function naming what counsel actually looks like in their hands, on what cadence, on what topics.",
    measurement:
      "The function is reviewed in cost language, not contribution language. Until that flips, every other gap on this scorecard stays open. The pattern that closes the gap fastest isn't a new dashboard — it's a CFO-grade definition of contribution, signed off by Finance, defended in the function's own budget review.",
    architecture:
      "The missing conversations on Q7 aren't accidents. Top-quartile CA Heads are in those rooms by structural design — embedded in the risk-register cadence, in the M&A diligence process, in the investor-day prep. Architecture is the foundation everything else sits on.",
  },
  Beginner: {
    inclusion:
      "The function is operating downstream across the board. The work isn't to argue for inclusion in every decision — it's to pick one named decision per quarter and shape it. Compound from there.",
    counsel:
      "The CEO relationship is transactional. That's the precondition gap — until it shifts, the function doesn't get the strategic conversations it needs to demonstrate value. Rebuilding it is a twelve-month project, not a memo.",
    measurement:
      "Without a CFO-grade definition of contribution, the function is reviewed in cost language every cycle. That's the first gap to close because everything else on this scorecard becomes harder to defend without it.",
    architecture:
      "The function is missing from most of the strategic conversations a CA Head needs to be in. Architecture is the structural fix the other three pillars depend on — without it, inclusion and counsel are individual relationships, not systems.",
  },
};

const PILLAR_ARTICLES: Record<Pillar, string> = {
  inclusion: 'Read more on inclusion → CA Playbook',
  counsel: 'Read more on counsel → CA Playbook',
  measurement: 'Read more on measurement → CA Playbook',
  architecture: 'Read more on architecture → CA Playbook',
};

function pickThreeWeakest(result: ScoreResult): Pillar[] {
  const pillars: Pillar[] = [
    'inclusion',
    'counsel',
    'measurement',
    'architecture',
  ];
  const deltas = pillars.map((p) => ({
    pillar: p,
    delta:
      result.peerBenchmark.subScoreTopQuartile[p] - result.subScores[p],
  }));
  deltas.sort((a, b) => b.delta - a.delta);
  return deltas.slice(0, 3).map((d) => d.pillar);
}

export default function Insights({ result }: { result: ScoreResult }) {
  const weakest = pickThreeWeakest(result);

  return (
    <section>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-tp-navy-soft">
        Where the work is
      </p>
      <h2 className="mt-3 font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        Three patterns Richard has seen in the coffees.
      </h2>

      <div className="mt-8 space-y-10">
        {weakest.map((pillar) => (
          <article key={pillar}>
            <h3 className="font-display text-xl text-tp-navy-ink">
              {PILLAR_LABELS[pillar]}
            </h3>
            <p className="mt-3 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
              {INSIGHT_COPY[result.tier][pillar]}
            </p>
            <p className="mt-3 font-sans text-sm font-light text-tp-navy-soft">
              {PILLAR_ARTICLES[pillar]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
