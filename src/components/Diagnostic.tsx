'use client';

import { useState } from 'react';
import PlaceholderResult from './result/PlaceholderResult';

type LikertScore = 1 | 2 | 3 | 4 | 5;

export type Answers = {
  sector: string;
  functionSize: string;
  involvedEarly: LikertScore | null;
  ceoSeeksCounsel: LikertScore | null;
  canQuantifyValue: LikertScore | null;
  budgetReview: LikertScore | null;
  missingConversations: string[];
  rootCause: string;
};

const INITIAL_ANSWERS: Answers = {
  sector: '',
  functionSize: '',
  involvedEarly: null,
  ceoSeeksCounsel: null,
  canQuantifyValue: null,
  budgetReview: null,
  missingConversations: [],
  rootCause: '',
};

const SECTOR_OPTIONS = [
  'Mining and resources',
  'Energy — oil and gas, renewables',
  'Utilities',
  'Other heavy industry',
];

const FUNCTION_SIZE_OPTIONS = [
  'Just me, or 1–2',
  'Small team — 3 to 8',
  'Medium — 9 to 20',
  'Large — 20+',
];

const MISSING_CONVERSATION_OPTIONS = [
  'Risk register',
  'Capital allocation',
  'Board-paper drafting',
  'Investor-day prep',
  'M&A diligence',
  'ESG materiality',
  'CEO message-of-the-year',
  "We're in all of these",
];

const ROOT_CAUSE_OPTIONS = [
  "Can't articulate value in CFO terms",
  "CEO doesn't prioritise it",
  'Wrong relationships at the top',
  'Function viewed as overhead, not investment',
  'Budget cycle timing',
];

const LIKERT_ANCHORS: Record<LikertScore, string> = {
  1: 'Rarely true',
  2: '',
  3: 'Sometimes true',
  4: '',
  5: 'Consistently true',
};

const TOTAL_QUESTIONS = 8;

type StepKey =
  | 'identity'
  | 'involvedEarly'
  | 'ceoSeeksCounsel'
  | 'canQuantifyValue'
  | 'budgetReview'
  | 'missingConversations'
  | 'rootCause'
  | 'result';

const STEPS: StepKey[] = [
  'identity',
  'involvedEarly',
  'ceoSeeksCounsel',
  'canQuantifyValue',
  'budgetReview',
  'missingConversations',
  'rootCause',
  'result',
];

function questionNumberForStep(step: StepKey): number | null {
  switch (step) {
    case 'identity':
      return null;
    case 'involvedEarly':
      return 3;
    case 'ceoSeeksCounsel':
      return 4;
    case 'canQuantifyValue':
      return 5;
    case 'budgetReview':
      return 6;
    case 'missingConversations':
      return 7;
    case 'rootCause':
      return 8;
    default:
      return null;
  }
}

function isStepComplete(step: StepKey, answers: Answers): boolean {
  switch (step) {
    case 'identity':
      return answers.sector !== '' && answers.functionSize !== '';
    case 'involvedEarly':
      return answers.involvedEarly !== null;
    case 'ceoSeeksCounsel':
      return answers.ceoSeeksCounsel !== null;
    case 'canQuantifyValue':
      return answers.canQuantifyValue !== null;
    case 'budgetReview':
      return answers.budgetReview !== null;
    case 'missingConversations':
      return answers.missingConversations.length > 0;
    case 'rootCause':
      return answers.rootCause !== '';
    case 'result':
      return true;
  }
}

export default function Diagnostic() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const step = STEPS[stepIndex];
  const canContinue = isStepComplete(step, answers);

  function goBack() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  function goForward() {
    if (canContinue && stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  }

  if (step === 'result') {
    return <PlaceholderResult answers={answers} onRestart={() => {
      setAnswers(INITIAL_ANSWERS);
      setStepIndex(0);
    }} />;
  }

  const questionNumber = questionNumberForStep(step);

  return (
    <main className="min-h-screen bg-tp-white px-6 py-10 md:py-16">
      <div className="mx-auto w-full max-w-2xl">
        {questionNumber !== null && (
          <p className="mb-10 font-mono text-sm text-tp-navy-soft">
            Question {questionNumber} of {TOTAL_QUESTIONS}
          </p>
        )}

        {step === 'identity' && (
          <IdentityScreen
            sector={answers.sector}
            functionSize={answers.functionSize}
            onSectorChange={(v) => setAnswers({ ...answers, sector: v })}
            onSizeChange={(v) => setAnswers({ ...answers, functionSize: v })}
          />
        )}

        {step === 'involvedEarly' && (
          <LikertScreen
            prompt="I'm involved early in major decisions — not just briefed on the comms plan afterwards."
            value={answers.involvedEarly}
            onChange={(v) => setAnswers({ ...answers, involvedEarly: v })}
          />
        )}

        {step === 'ceoSeeksCounsel' && (
          <LikertScreen
            prompt="The CEO actively seeks my perspective on politically and socially sensitive choices."
            value={answers.ceoSeeksCounsel}
            onChange={(v) => setAnswers({ ...answers, ceoSeeksCounsel: v })}
          />
        )}

        {step === 'canQuantifyValue' && (
          <LikertScreen
            prompt="I can quantify Corporate Affairs' contribution in terms the CFO and Board understand."
            value={answers.canQuantifyValue}
            onChange={(v) => setAnswers({ ...answers, canQuantifyValue: v })}
          />
        )}

        {step === 'budgetReview' && (
          <LikertScreen
            prompt="When my function's budget is reviewed, the conversation focuses on what we delivered, not what we cost."
            value={answers.budgetReview}
            onChange={(v) => setAnswers({ ...answers, budgetReview: v })}
          />
        )}

        {step === 'missingConversations' && (
          <MultiSelectScreen
            prompt="Which of these strategic conversations is your function currently not in?"
            helper="Select all that apply."
            options={MISSING_CONVERSATION_OPTIONS}
            selected={answers.missingConversations}
            onChange={(v) => setAnswers({ ...answers, missingConversations: v })}
          />
        )}

        {step === 'rootCause' && (
          <SingleSelectScreen
            prompt="When you don't get the resources you ask for, the most common reason is..."
            options={ROOT_CAUSE_OPTIONS}
            value={answers.rootCause}
            onChange={(v) => setAnswers({ ...answers, rootCause: v })}
          />
        )}

        <Navigation
          showBack={stepIndex > 0}
          canContinue={canContinue}
          onBack={goBack}
          onContinue={goForward}
          continueLabel={stepIndex === STEPS.length - 2 ? 'See my result' : 'Continue'}
        />
      </div>
    </main>
  );
}

function IdentityScreen({
  sector,
  functionSize,
  onSectorChange,
  onSizeChange,
}: {
  sector: string;
  functionSize: string;
  onSectorChange: (value: string) => void;
  onSizeChange: (value: string) => void;
}) {
  return (
    <div>
      <h1 className="font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        Score your Corporate Affairs function's value-demonstration maturity against ASX-listed mining and energy peers.
      </h1>
      <p className="mt-4 font-sans text-base font-light text-tp-navy md:text-lg">
        Eight questions. Five minutes. A peer-benchmarked result you can forward to your CEO.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        <ChipGroup
          label="Your sector"
          options={SECTOR_OPTIONS}
          value={sector}
          onChange={onSectorChange}
        />
        <ChipGroup
          label="Function size"
          options={FUNCTION_SIZE_OPTIONS}
          value={functionSize}
          onChange={onSizeChange}
        />
      </div>
    </div>
  );
}

function LikertScreen({
  prompt,
  value,
  onChange,
}: {
  prompt: string;
  value: LikertScore | null;
  onChange: (value: LikertScore) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        {prompt}
      </h2>
      <LikertRow value={value} onChange={onChange} />
    </div>
  );
}

function LikertRow({
  value,
  onChange,
}: {
  value: LikertScore | null;
  onChange: (value: LikertScore) => void;
}) {
  const scores: LikertScore[] = [1, 2, 3, 4, 5];

  return (
    <div className="mt-10">
      <div className="flex gap-2 sm:gap-3">
        {scores.map((score) => {
          const active = value === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              aria-pressed={active}
              aria-label={`${score} — ${LIKERT_ANCHORS[score] || 'unlabelled'}`}
              className={
                'flex h-12 min-w-[44px] flex-1 items-center justify-center rounded-sm font-mono text-base transition-colors sm:h-14 sm:text-lg ' +
                (active
                  ? 'bg-tp-orange text-tp-white'
                  : 'border border-tp-navy bg-tp-white text-tp-navy hover:bg-tp-paper')
              }
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between font-sans text-xs font-light text-tp-navy-soft sm:text-sm">
        <span>1 — Rarely true</span>
        <span className="hidden sm:inline">3 — Sometimes true</span>
        <span>5 — Consistently true</span>
      </div>
    </div>
  );
}

function MultiSelectScreen({
  prompt,
  helper,
  options,
  selected,
  onChange,
}: {
  prompt: string;
  helper: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        {prompt}
      </h2>
      <p className="mt-3 font-sans text-sm font-light text-tp-navy-soft">{helper}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={active}
              className={
                'min-h-[44px] rounded-sm px-4 py-2 font-sans text-base font-light transition-colors md:text-lg ' +
                (active
                  ? 'bg-tp-orange text-tp-white'
                  : 'border border-tp-navy bg-tp-white text-tp-navy hover:bg-tp-paper')
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SingleSelectScreen({
  prompt,
  options,
  value,
  onChange,
}: {
  prompt: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        {prompt}
      </h2>
      <div className="mt-8 flex flex-col gap-3">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={
                'min-h-[44px] rounded-sm px-4 py-3 text-left font-sans text-base font-light transition-colors md:text-lg ' +
                (active
                  ? 'bg-tp-orange text-tp-white'
                  : 'border border-tp-navy bg-tp-white text-tp-navy hover:bg-tp-paper')
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-tp-navy-soft">
        {label}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={
                'min-h-[44px] rounded-sm px-4 py-2 text-left font-sans text-base font-light transition-colors md:text-lg ' +
                (active
                  ? 'bg-tp-orange text-tp-white'
                  : 'border border-tp-navy bg-tp-white text-tp-navy hover:bg-tp-paper')
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Navigation({
  showBack,
  canContinue,
  onBack,
  onContinue,
  continueLabel,
}: {
  showBack: boolean;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
  continueLabel: string;
}) {
  return (
    <div className="mt-16 flex items-center justify-between">
      <div>
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="font-sans text-base font-light text-tp-navy underline decoration-tp-navy-line underline-offset-4 hover:text-tp-navy-ink hover:decoration-tp-navy"
          >
            Back
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className={
          'rounded-sm px-6 py-3 font-sans text-base font-medium transition-colors ' +
          (canContinue
            ? 'bg-tp-orange text-tp-white hover:bg-tp-orange-deep'
            : 'cursor-not-allowed bg-tp-navy-line text-tp-navy-soft')
        }
      >
        {continueLabel}
      </button>
    </div>
  );
}
