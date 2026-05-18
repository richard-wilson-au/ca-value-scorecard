'use client';

import {
  PILLAR_LABELS,
  type Pillar,
  type ScoreResult,
  type Tier,
} from '../../lib/scoring';

const INSIGHT_COPY: Record<Tier, Record<Pillar, string>> = {
  Trailblazer: {
    inclusion:
      "You are upstream of more decisions than most of the Heads of Corporate Affairs I have sat with, and your Q3 score reflects that. The gap that remains at this tier is consistency. The rooms you are in by default versus the rooms you are in by invitation. The pattern I have seen close that last gap is the function negotiating a standing position in the strategy offsite agenda and the M&A diligence runbook, so the seat survives a change of CEO or a change of you.",
    counsel:
      "The CEO already comes to you on the hard calls. At this tier the gap is no longer the relationship; it is the structure underneath it. Most of the top-quartile CA Heads I have spoken with have the same worry: the counsel function depends on them, and walks out of the building if they walk out. The pattern that closes the gap is making the counsel calendared and written, usually a quarterly memo to the CEO, so the function reads as a system, not a personality.",
    measurement:
      "You measure better than your peer set, which is a low bar. Most Heads of Corporate Affairs I have sat with at ASX-listed mining and energy companies score Measurement the lowest of the four. At your tier the conversation always lands in the same place: the function has activity numbers the CEO accepts, but no contribution number the CFO will sign. The pattern that closes that last gap is a quarterly CFO-grade definition of contribution, audited by Finance, defended in the function's own budget review.",
    architecture:
      "Your function is in most of the strategic conversations a CA Head should be in. At this tier the missing rooms tend to be capital allocation, M&A diligence, or the risk register. Those are the rooms the top-quartile peers I speak with treat as a standing seat, not an invitation. The pattern that closes the gap is naming the missing rooms to the CEO directly, with a one-line case for what the function would contribute to each, and asking for the seat as a process change rather than a favour.",
  },
  Aspirant: {
    inclusion:
      "I have heard this pattern in seven of the ten coffees at your tier: the function is briefed, not consulted. The conversation always lands in the same place. By the time Corporate Affairs is in the room, the shape of the decision is fixed and the only question left is how to communicate it. Closing that gap usually starts with one named decision per quarter where the function gets the brief at the soft stage, shapes it, and the CEO sees the difference between a function that is briefed and a function that is consulted.",
    counsel:
      "The CEO uses you on the comms side of politically expensive decisions, but not on the strategic shape of them. I have heard the same line in five of the ten coffees: \"he calls me when the decision is made, not when it is being made.\" That is a relationship gap, and it closes faster than people think once the function names what it is offering on the strategic side, usually a short written view delivered before the decision, on the two or three issues per year where the function has a genuine read the CEO does not.",
    measurement:
      "Your Measurement score is the widest gap in your profile. Most Heads of Corporate Affairs I have sat with at ASX-listed mining and energy companies score this dimension the lowest, and the conversation always lands in the same place: the function cannot articulate contribution in CFO language, so the function gets reviewed in cost language. The pattern that closes the gap fastest is not a new dashboard. It is a CFO-grade definition of contribution, audited quarterly by Finance, that the function defends in its own budget review.",
    architecture:
      "Your function is in the rooms it has to be in, and missing from the ones it should be in. The missing ones are usually capital allocation, investor-day prep, or the risk register. Across the ten coffees I have done at your tier, the same three rooms come up again and again as the ones the function would have the most to contribute in if it were there. The pattern that closes the gap is naming each missing room to the CEO, with a one-line case for what the function would contribute, and asking for the seat as a process change rather than a favour.",
  },
  Follower: {
    inclusion:
      "The function is downstream of decisions it should be shaping. That is a positioning gap rather than a competence gap, and it is the one I see flagged most often in the coffees at your tier. The function gets handed the comms plan and asked to make the announcement work. The contribution sits earlier, in shaping the decision before it is made. The first move is picking one decision per quarter where the function will not accept the brief at the announce stage, and arguing for the brief at the soft stage instead.",
    counsel:
      "The CEO uses the function for delivery, not for counsel. The hardest part of closing that gap is not the CEO. It is the function naming what counsel actually looks like in its hands, on what cadence, on what topics. I have heard this in six of the ten coffees at your tier: the Head of Corporate Affairs knows the CEO should be asking, and is not sure what he would ask for. A short written view on two or three issues per year, delivered before the decision, is usually how it starts.",
    measurement:
      "The function is reviewed in cost language, not contribution language. Until that flips at the CFO's desk, every other gap on this scorecard stays open. The pattern that closes the gap fastest is not a new dashboard. It is a CFO-grade definition of contribution, signed off by Finance, that the function defends in its own budget review. I have seen one Head of Corporate Affairs save half a million dollars in negotiation costs that no one in the business knew about. The number existed, the function had it. Finance had never been asked to audit it.",
    architecture:
      "The missing conversations you flagged in Q7 are not accidents. Top-quartile CA Heads are in those rooms by design. They sit on the risk-register cadence, they have a named stage in the M&A diligence runbook, they are first into the investor-day prep. The pattern I see at your score band is the function having grown by accumulation, hat by hat, with no one designing the architecture underneath. The gap closes by naming the missing rooms one by one and negotiating each one in as a process change, not a favour.",
  },
  Beginner: {
    inclusion:
      "The function is operating downstream across the board. The work at your tier is not to argue for inclusion in every decision, because that conversation will go nowhere when the function has not yet earned a track record at the soft stage. The pattern I have seen work is picking one named decision per quarter, getting in at the soft stage, shaping it well, and using that single track record as the case for the next one. Compound from there. The function buys its way upstream one decision at a time.",
    counsel:
      "The CEO relationship is transactional. He calls when he needs a media problem solved, not when he is wrestling with the politically expensive choice. That is the precondition gap. Until it shifts, the function does not get the strategic conversations it needs to demonstrate value, and every other dimension on this scorecard becomes harder. The pattern I have seen close this gap is a twelve-month project, not a memo. It starts with one short written view per quarter on a decision the CEO is genuinely wrestling with, whether or not he asked for it.",
    measurement:
      "Without a CFO-grade definition of contribution, the function is reviewed in cost language every cycle. That is the first gap to close at your tier, because everything else on this scorecard becomes harder to defend without it. I have heard this in eight of the ten coffees at the Beginner band: the function has activity numbers the CEO will tolerate, has no contribution number the CFO will sign, and the budget review conversation is always about cost. A quarterly Finance-audited contribution number, even on one initiative to start, changes that conversation.",
    architecture:
      "The function is missing from most of the strategic conversations a CA Head needs to be in. Architecture is the structural fix the other three pillars depend on. Without it, inclusion is an individual relationship rather than a standing seat, and counsel is a corridor conversation rather than a calendared one. The pattern I have seen at your tier is the function having grown by accumulation, one new hat at a time, with no one designing the operating model underneath. The first move is mapping the missing rooms and naming one to negotiate into per quarter.",
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
