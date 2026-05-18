/*
 * Diagnostic scoring — pure functions, no side effects.
 *
 * Sub-pillar composition (design brief §5.2):
 *   inclusion    = Q3 involvedEarly (1–5)
 *   counsel      = Q4 ceoSeeksCounsel (1–5)
 *   measurement  = avg(Q5 canQuantifyValue, Q6 budgetReview), 1 dp
 *   architecture = Q7 inverted-missing-count. 8 options; "We're in all of these"
 *                  short-circuits to 5. Otherwise architecture = 5 − missing*(4/7),
 *                  clamped to [1, 5], 1 dp. Maps 0 missing → 5; 7 missing → 1.
 *
 * Tier boundaries (design brief §6):
 *   Trailblazer ≥ 4.0  ·  Aspirant 3.0–3.9  ·  Follower 2.0–2.9  ·  Beginner < 2.0
 *
 * v1.1 peer benchmark (design brief §7, n = 10 ASX CA Head coffees Oct 2025 – May 2026):
 *   Overall median 3.4 · top quartile 4.2 (hard-coded per brief).
 *
 * Per-pillar medians and top-quartile values are hand-picked for v1.1 to reflect
 * the P3 pattern Richard has heard in coffees — Measurement sits below Counsel,
 * Counsel below Inclusion. Phase 4 may revise once the n = 25 sample lands.
 */

import type { Answers } from '../components/Diagnostic';

export type Pillar = 'inclusion' | 'counsel' | 'measurement' | 'architecture';
export type Tier = 'Trailblazer' | 'Aspirant' | 'Follower' | 'Beginner';

export type SubScores = Record<Pillar, number>;

export type PeerBenchmark = {
  median: number;
  topQuartile: number;
  n: number;
  subScoreMedians: SubScores;
  subScoreTopQuartile: SubScores;
};

export type ScoreResult = {
  overall: number;
  subScores: SubScores;
  tier: Tier;
  dominantWeakness: Pillar;
  peerBenchmark: PeerBenchmark;
};

const ARCHITECTURE_ALL_OPTION = "We're in all of these";
const ARCHITECTURE_OPTION_COUNT = 7;
const ARCHITECTURE_STEP = 4 / ARCHITECTURE_OPTION_COUNT;

const PEER_BENCHMARK: PeerBenchmark = {
  median: 3.4,
  topQuartile: 4.2,
  n: 10,
  subScoreMedians: {
    inclusion: 3.6,
    counsel: 3.5,
    measurement: 2.9,
    architecture: 3.6,
  },
  subScoreTopQuartile: {
    inclusion: 4.4,
    counsel: 4.3,
    measurement: 4.0,
    architecture: 4.5,
  },
};

const TIE_BREAK_ORDER: Pillar[] = [
  'measurement',
  'architecture',
  'inclusion',
  'counsel',
];

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function architectureScore(missingConversations: string[]): number {
  if (missingConversations.includes(ARCHITECTURE_ALL_OPTION)) return 5;
  const otherMissing = missingConversations.filter(
    (o) => o !== ARCHITECTURE_ALL_OPTION,
  ).length;
  return round1(clamp(5 - otherMissing * ARCHITECTURE_STEP, 1, 5));
}

function assignTier(overall: number): Tier {
  if (overall >= 4.0) return 'Trailblazer';
  if (overall >= 3.0) return 'Aspirant';
  if (overall >= 2.0) return 'Follower';
  return 'Beginner';
}

function pickDominantWeakness(subScores: SubScores): Pillar {
  const min = Math.min(
    subScores.inclusion,
    subScores.counsel,
    subScores.measurement,
    subScores.architecture,
  );
  for (const pillar of TIE_BREAK_ORDER) {
    if (subScores[pillar] === min) return pillar;
  }
  return 'measurement';
}

export function scoreAnswers(answers: Answers): ScoreResult {
  // Diagnostic only mounts Result after all Likerts answered; narrow to numbers.
  const inclusion = answers.involvedEarly ?? 1;
  const counsel = answers.ceoSeeksCounsel ?? 1;
  const measurement = round1(
    ((answers.canQuantifyValue ?? 1) + (answers.budgetReview ?? 1)) / 2,
  );
  const architecture = architectureScore(answers.missingConversations);

  const subScores: SubScores = {
    inclusion,
    counsel,
    measurement,
    architecture,
  };

  const overall = round1(
    (inclusion + counsel + measurement + architecture) / 4,
  );

  return {
    overall,
    subScores,
    tier: assignTier(overall),
    dominantWeakness: pickDominantWeakness(subScores),
    peerBenchmark: PEER_BENCHMARK,
  };
}

export const PILLAR_LABELS: Record<Pillar, string> = {
  inclusion: 'Inclusion',
  counsel: 'Counsel',
  measurement: 'Measurement',
  architecture: 'Architecture',
};

export const PILLAR_QUESTIONS: Record<Pillar, string> = {
  inclusion: 'Are you upstream of decisions?',
  counsel: 'Does the CEO trust your judgment?',
  measurement: 'Can you defend value in CFO language?',
  architecture: 'Is your function structurally embedded?',
};
