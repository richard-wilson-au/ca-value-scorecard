'use client';

import { useMemo } from 'react';
import type { Answers } from '../Diagnostic';
import { scoreAnswers } from '../../lib/scoring';
import HeroCard from './HeroCard';
import SubScores from './SubScores';
import Insights from './Insights';
import AspirationalBenchmark from './AspirationalBenchmark';
import NextSteps from './NextSteps';
import SoftSignoff from './SoftSignoff';

function SectionRule() {
  // 4px burnt-orange short rule, 56px wide — typographer's dingbat, not a divider.
  return (
    <div
      aria-hidden="true"
      className="h-1 w-14 bg-tp-orange"
    />
  );
}

function OrangeBall() {
  // 24px burnt-orange dot — treated as a full-stop after the hero.
  return (
    <div className="flex justify-start" aria-hidden="true">
      <span className="block h-6 w-6 rounded-full bg-tp-orange" />
    </div>
  );
}

export default function Result({
  answers,
  onRestart,
}: {
  answers: Answers;
  onRestart: () => void;
}) {
  const result = useMemo(() => scoreAnswers(answers), [answers]);

  return (
    <main className="min-h-screen bg-tp-white px-6 py-10 md:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <HeroCard result={result} />

        <div className="mt-10 mb-10 md:mt-14 md:mb-14">
          <OrangeBall />
        </div>

        <SectionRule />
        <div className="mt-6">
          <SubScores result={result} />
        </div>

        <div className="mt-14 md:mt-16">
          <SectionRule />
          <div className="mt-6">
            <Insights result={result} />
          </div>
        </div>

        <div className="mt-14 md:mt-16">
          <SectionRule />
          <div className="mt-6">
            <AspirationalBenchmark result={result} />
          </div>
        </div>

        <div className="mt-14 md:mt-16">
          <SectionRule />
          <div className="mt-6">
            <NextSteps />
          </div>
        </div>

        <div className="mt-10 md:mt-12">
          <SoftSignoff />
        </div>

        <div className="mt-16 border-t border-tp-navy-line pt-6">
          <button
            type="button"
            onClick={onRestart}
            className="font-sans text-sm font-light text-tp-navy-soft underline decoration-tp-navy-line underline-offset-4 hover:text-tp-navy"
          >
            Restart the diagnostic
          </button>
        </div>
      </div>
    </main>
  );
}
