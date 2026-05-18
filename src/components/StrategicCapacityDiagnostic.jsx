'use client';

import React, { useState, useMemo } from 'react';

/**
 * Strategic Capacity Diagnostic — v1.0 baseline
 * Lead magnet for Transformation Partners
 * Target: Corporate Affairs leaders in mining, energy, utilities
 *
 * This is the v1.0 component, brought in 2026-05-18 from the original
 * standalone JSX file at 04-projects/content-marketing/strategic-capacity-diagnostic.jsx.
 * v1.1 redesign per 02-spec/2026-05-18-diagnostic-v1.1-design-brief.md is the
 * next commit on this repo. Kept here as the starting point for the rebuild
 * so the git history shows v1.0 → v1.1 cleanly.
 *
 * Original v1.0 design principles, retained for archive context (superseded
 * by the v1.1 design brief):
 * - B2B Hormozi tone (now banned per TP voice canon)
 * - Acknowledges "languishing" stage
 * - Addresses past transformation failures
 * - Aligns with 4-week EAE Sprint offer (now removed from result page)
 * - Industry-specific language and examples
 */

const StrategicCapacityDiagnostic = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    // Step 1: Industry qualification
    sector: '',
    functionSize: '',

    // Step 2: Time reality (constrained to 100%)
    reactiveTime: 50,
    bauTime: 30,
    strategicTime: 20,

    // Step 3: Strategic influence check
    involvedEarly: 3,
    ceoSeeksCounsel: 3,
    canQuantifyValue: 3,
    canSayNo: 3,
    peerRespect: 3,

    // Step 4: What you've already tried
    triedConsulting: false,
    triedTechnology: false,
    triedTraining: false,
    triedRestructure: false,
    triedHiring: false,
    whyDidntWork: '',

    // Step 5: Hidden time theft (CA-specific)
    mediaMonitoringHours: '',
    stakeholderUpdatesHours: '',
    internalMeetingsHours: '',
    reportingHours: '',
    approvalChasingHours: '',

    // Step 6: Conversations you're missing
    missingConversations: [],

    // Step 7: The real blockers
    primaryBlocker: '',

    // Lead capture
    email: '',
    name: '',
    company: '',
    wantsDebrief: false
  });
  const [showResults, setShowResults] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Brand colors from style guide
  const colors = {
    lightBlue: '#E4EAF1',
    navy: '#556C8E',
    yellow: '#FEB739',
    orange: '#F96121',
    white: '#FFFFFF',
    darkText: '#2D3748'
  };

  // Logo component
  const Logo = ({ width = 200 }) => (
    <svg width={width} viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="35" cy="40" r="30" fill="none" stroke={colors.orange} strokeWidth="2"/>
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M ${10 + i*4} ${20 + Math.sin(i*0.5)*5} Q ${35} ${40 + Math.cos(i*0.3)*10} ${60 - i*4} ${60 - Math.sin(i*0.5)*5}`}
            stroke={colors.orange}
            strokeWidth="1.5"
            fill="none"
            opacity={0.6 + i*0.05}
          />
        ))}
      </g>
      <text x="75" y="35" fontFamily="Libre Baskerville, Georgia, serif" fontSize="22" fontWeight="400" fill={colors.orange}>
        Transformation
      </text>
      <text x="75" y="60" fontFamily="Libre Baskerville, Georgia, serif" fontSize="22" fontWeight="400" fill={colors.navy}>
        Partners
      </text>
    </svg>
  );

  const updateAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayAnswer = (field, value) => {
    setAnswers(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  // Constrained time allocation (always totals 100%)
  const updateTimeAllocation = (field, newValue) => {
    const fields = ['reactiveTime', 'bauTime', 'strategicTime'];
    const otherFields = fields.filter(f => f !== field);
    const currentOthersTotal = otherFields.reduce((sum, f) => sum + answers[f], 0);
    const remaining = 100 - newValue;

    if (currentOthersTotal === 0) {
      const each = Math.floor(remaining / 2);
      setAnswers(prev => ({
        ...prev,
        [field]: newValue,
        [otherFields[0]]: each,
        [otherFields[1]]: remaining - each
      }));
    } else {
      const ratio = remaining / currentOthersTotal;
      setAnswers(prev => ({
        ...prev,
        [field]: newValue,
        [otherFields[0]]: Math.round(prev[otherFields[0]] * ratio),
        [otherFields[1]]: remaining - Math.round(prev[otherFields[0]] * ratio)
      }));
    }
  };

  // Calculate hidden hours
  const totalHiddenHours = useMemo(() => {
    const hourValues = {
      '0-2': 1,
      '2-5': 3.5,
      '5-10': 7.5,
      '10+': 12
    };
    return (
      (hourValues[answers.mediaMonitoringHours] || 0) +
      (hourValues[answers.stakeholderUpdatesHours] || 0) +
      (hourValues[answers.internalMeetingsHours] || 0) +
      (hourValues[answers.reportingHours] || 0) +
      (hourValues[answers.approvalChasingHours] || 0)
    );
  }, [answers]);

  // Calculate strategic influence score
  const influenceScore = useMemo(() => {
    return (
      answers.involvedEarly +
      answers.ceoSeeksCounsel +
      answers.canQuantifyValue +
      answers.canSayNo +
      answers.peerRespect
    ) / 5;
  }, [answers]);

  // Generate personalized insights
  const insights = useMemo(() => {
    const result = [];

    // Time allocation insight
    if (answers.strategicTime < 25) {
      result.push({
        type: 'critical',
        title: 'Strategic Time Deficit',
        text: `Only ${answers.strategicTime}% of your time goes to strategic work. At this level, you're operating as a service function, not a strategic partner. The work that would position you differently with the CEO stays perpetually "next quarter."`
      });
    }

    // Influence score insight
    if (influenceScore < 3) {
      result.push({
        type: 'critical',
        title: 'Strategic Influence Gap',
        text: `Your strategic influence score is ${influenceScore.toFixed(1)}/5. This isn't a capability problem — you understand what strategic Corporate Affairs looks like. The challenge is that operational demands leave no bandwidth for the work that would shift your position.`
      });
    } else if (influenceScore < 4) {
      result.push({
        type: 'warning',
        title: 'Inconsistent Strategic Position',
        text: `Your influence score of ${influenceScore.toFixed(1)}/5 suggests moments of strategic inclusion, but not consistent partnership. You're likely invited to some conversations but not others — and the selection feels arbitrary.`
      });
    }

    // Hidden hours insight
    if (totalHiddenHours >= 15) {
      result.push({
        type: 'critical',
        title: 'Hidden Capacity Drain',
        text: `${totalHiddenHours}+ hours per week consumed by activities that could be eliminated or automated. That's ${Math.round(totalHiddenHours * 52)} hours annually — more than a month of full-time work trapped in low-value activities.`
      });
    } else if (totalHiddenHours >= 8) {
      result.push({
        type: 'warning',
        title: 'Capacity Opportunity',
        text: `${totalHiddenHours} hours per week in activities with automation potential. Not critical, but that's ${Math.round(totalHiddenHours * 52)} hours annually that could shift from administration to strategic contribution.`
      });
    }

    // Past failures insight
    const triedCount = [
      answers.triedConsulting,
      answers.triedTechnology,
      answers.triedTraining,
      answers.triedRestructure,
      answers.triedHiring
    ].filter(Boolean).length;

    if (triedCount >= 2) {
      result.push({
        type: 'insight',
        title: 'Past Transformation Attempts',
        text: `You've tried ${triedCount} different approaches to transform your function. The common failure pattern: each solution added new work on top of existing work, without first creating capacity for it. Training programs fizzle. Technology implementations stall. Restructures create temporary chaos without lasting change.`
      });
    }

    // Missing conversations insight
    if (answers.missingConversations.length >= 3) {
      result.push({
        type: 'critical',
        title: 'Excluded from Critical Decisions',
        text: `You identified ${answers.missingConversations.length} strategic conversations happening without Corporate Affairs input. Each exclusion is a missed opportunity to shape decisions before they become crises to manage.`
      });
    }

    return result;
  }, [answers, influenceScore, totalHiddenHours]);

  // Generate 4-week action plan
  const actionPlan = useMemo(() => {
    const plan = {
      eliminate: [],
      automate: [],
      elevate: []
    };

    // Eliminate recommendations based on hidden hours
    if (answers.mediaMonitoringHours && ['5-10', '10+'].includes(answers.mediaMonitoringHours)) {
      plan.eliminate.push('Audit media monitoring outputs — identify which summaries drive action vs. those archived unread');
    }
    if (answers.internalMeetingsHours && ['5-10', '10+'].includes(answers.internalMeetingsHours)) {
      plan.eliminate.push('Review internal meetings where you\'re "staying across things" — replace with 5-minute briefing notes');
    }
    if (answers.reportingHours && ['5-10', '10+'].includes(answers.reportingHours)) {
      plan.eliminate.push('Survey report recipients on which outputs they actually use for decisions');
    }
    if (answers.approvalChasingHours && ['2-5', '5-10', '10+'].includes(answers.approvalChasingHours)) {
      plan.eliminate.push('Map approval workflows — identify bottlenecks that add time without adding value');
    }
    if (plan.eliminate.length === 0) {
      plan.eliminate.push('Conduct systematic capacity audit across your team to surface eliminable work');
    }

    // Automate recommendations
    if (answers.mediaMonitoringHours && answers.mediaMonitoringHours !== '0-2') {
      plan.automate.push('Deploy AI-enabled media intelligence that surfaces strategic signals, not just volume');
    }
    if (answers.stakeholderUpdatesHours && answers.stakeholderUpdatesHours !== '0-2') {
      plan.automate.push('Build automated stakeholder tracking that maintains relationship context without manual updates');
    }
    if (answers.reportingHours && answers.reportingHours !== '0-2') {
      plan.automate.push('Create dynamic reporting dashboards that pull data automatically instead of manual compilation');
    }
    if (plan.automate.length === 0) {
      plan.automate.push('Identify your highest-volume repeatable workflow and design AI-assisted automation');
    }

    // Elevate recommendations based on missing conversations
    if (answers.missingConversations.includes('investment-decisions')) {
      plan.elevate.push('Prepare stakeholder risk assessment framework for upcoming investment decisions');
    }
    if (answers.missingConversations.includes('government-strategy')) {
      plan.elevate.push('Request a seat at government relations strategy discussions — bring political risk scenarios');
    }
    if (answers.missingConversations.includes('crisis-planning')) {
      plan.elevate.push('Propose crisis scenario planning session with executive team — position CA as risk radar');
    }
    if (answers.missingConversations.includes('community-approvals')) {
      plan.elevate.push('Build social license dashboard for major project decisions — quantify community sentiment');
    }
    if (plan.elevate.length === 0 && answers.ceoSeeksCounsel < 4) {
      plan.elevate.push('Schedule strategic briefing with CEO on external environment shifts affecting the business');
    }
    if (plan.elevate.length === 0) {
      plan.elevate.push('Identify one strategic conversation you should be part of and prepare your case for inclusion');
    }

    return plan;
  }, [answers]);

  // Step definitions
  const steps = [
    { id: 'intro', title: 'Start' },
    { id: 'sector', title: 'Your Context' },
    { id: 'time', title: 'Time Reality' },
    { id: 'influence', title: 'Strategic Position' },
    { id: 'tried', title: 'What You\'ve Tried' },
    { id: 'hidden', title: 'Hidden Hours' },
    { id: 'missing', title: 'Missing Conversations' },
    { id: 'blocker', title: 'Primary Blocker' },
    { id: 'results', title: 'Your Diagnostic' }
  ];

  // Reusable components
  const OptionButton = ({ selected, onClick, children, fullWidth = false }) => (
    <button
      onClick={onClick}
      style={{
        padding: '14px 20px',
        borderRadius: '10px',
        border: `2px solid ${selected ? colors.orange : colors.navy}`,
        background: selected ? `${colors.orange}15` : 'transparent',
        color: selected ? colors.orange : colors.navy,
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        textAlign: 'left',
        width: fullWidth ? '100%' : 'auto',
        lineHeight: '1.4'
      }}
    >
      {children}
    </button>
  );

  const CheckboxOption = ({ checked, onChange, label }) => (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '10px',
      border: `2px solid ${checked ? colors.orange : colors.navy}`,
      background: checked ? `${colors.orange}15` : 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '4px',
        border: `2px solid ${checked ? colors.orange : colors.navy}`,
        background: checked ? colors.orange : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {checked && <span style={{ color: colors.white, fontSize: '14px' }}>✓</span>}
      </div>
      <span style={{ color: colors.navy, fontSize: '14px', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        {label}
      </span>
    </label>
  );

  const ScoreButton = ({ value, selected, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: selected ? 'none' : `2px solid ${colors.navy}`,
        background: selected ? colors.orange : 'transparent',
        color: selected ? colors.white : colors.navy,
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
      }}
    >
      {value}
    </button>
  );

  const ProgressBar = () => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '12px',
        color: colors.navy,
        opacity: 0.7
      }}>
        <span>Step {currentStep + 1} of {steps.length}</span>
        <span>{steps[currentStep].title}</span>
      </div>
      <div style={{
        height: '4px',
        background: colors.lightBlue,
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${((currentStep + 1) / steps.length) * 100}%`,
          background: colors.orange,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );

  // Step renderers
  const renderIntro = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '24px' }}>
        <Logo width={240} />
      </div>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '16px',
        color: colors.navy,
        fontFamily: 'Libre Baskerville, Georgia, serif',
        lineHeight: '1.3'
      }}>
        Strategic Capacity Diagnostic
      </h1>
      <p style={{
        fontSize: '16px',
        color: colors.navy,
        marginBottom: '24px',
        maxWidth: '500px',
        margin: '0 auto 24px',
        lineHeight: '1.6',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        opacity: 0.85
      }}>
        For Corporate Affairs leaders in mining, energy, and utilities who already know what strategic looks like — but can't seem to get there.
      </p>

      <div style={{
        background: colors.lightBlue,
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'left',
        marginBottom: '24px'
      }}>
        <p style={{ color: colors.navy, marginBottom: '16px', lineHeight: '1.6' }}>
          You've been to the conferences. You've seen how other functions operate. You know what "strategic Corporate Affairs" should look like.
        </p>
        <p style={{ color: colors.navy, marginBottom: '16px', lineHeight: '1.6' }}>
          The challenge isn't awareness. It's capacity.
        </p>
        <p style={{ color: colors.navy, marginBottom: '0', lineHeight: '1.6', fontWeight: '500' }}>
          This diagnostic will surface where your time is really going, what's blocking strategic elevation, and what a 4-week sprint could unlock.
        </p>
      </div>

      <div style={{
        background: `${colors.orange}10`,
        borderRadius: '12px',
        padding: '16px',
        borderLeft: `3px solid ${colors.orange}`,
        textAlign: 'left',
        marginBottom: '24px'
      }}>
        <p style={{ color: colors.navy, fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
          <strong>5 minutes.</strong> Honest answers only. At the end, you'll receive a personalised capacity analysis and 4-week action plan.
        </p>
      </div>
    </div>
  );

  const renderSector = () => (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        Your Context
      </h2>
      <p style={{ color: colors.navy, marginBottom: '28px', lineHeight: '1.6', opacity: 0.8 }}>
        This diagnostic is calibrated for the complexity of heavy industry. Let's confirm you're in the right place.
      </p>

      <div style={{
        background: colors.lightBlue,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px'
      }}>
        <p style={{ color: colors.navy, marginBottom: '16px', fontWeight: '600' }}>
          What sector are you in?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { value: 'mining', label: 'Mining & Resources' },
            { value: 'energy', label: 'Energy (Oil & Gas, Renewables)' },
            { value: 'utilities', label: 'Utilities (Water, Power, Infrastructure)' },
            { value: 'other', label: 'Other heavy industry' }
          ].map((option) => (
            <OptionButton
              key={option.value}
              selected={answers.sector === option.value}
              onClick={() => updateAnswer('sector', option.value)}
              fullWidth
            >
              {option.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div style={{
        background: colors.lightBlue,
        borderRadius: '16px',
        padding: '24px'
      }}>
        <p style={{ color: colors.navy, marginBottom: '16px', fontWeight: '600' }}>
          How large is your Corporate Affairs / External Relations function?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { value: 'solo', label: 'Just me (or 1-2 direct reports)' },
            { value: 'small', label: 'Small team (3-8 people)' },
            { value: 'medium', label: 'Medium team (9-20 people)' },
            { value: 'large', label: 'Large function (20+ people)' }
          ].map((option) => (
            <OptionButton
              key={option.value}
              selected={answers.functionSize === option.value}
              onClick={() => updateAnswer('functionSize', option.value)}
              fullWidth
            >
              {option.label}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTime = () => (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        Your Time Reality
      </h2>
      <p style={{ color: colors.navy, marginBottom: '28px', lineHeight: '1.6', opacity: 0.8 }}>
        Be honest. Not how you want it to be, or how it should be — how it actually is.
      </p>

      <div style={{
        background: colors.lightBlue,
        borderRadius: '16px',
        padding: '24px'
      }}>
        <p style={{ color: colors.navy, marginBottom: '8px', fontWeight: '600' }}>
          Over a typical month, how does your time split?
        </p>
        <p style={{ color: colors.navy, marginBottom: '24px', fontSize: '14px', opacity: 0.7 }}>
          Drag the sliders — they're linked to always total 100%.
        </p>

        {/* Pie chart visualization */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `conic-gradient(
              #EF4444 0deg ${answers.reactiveTime * 3.6}deg,
              ${colors.yellow} ${answers.reactiveTime * 3.6}deg ${(answers.reactiveTime + answers.bauTime) * 3.6}deg,
              ${colors.orange} ${(answers.reactiveTime + answers.bauTime) * 3.6}deg 360deg
            )`,
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: colors.lightBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '11px', color: colors.navy, fontWeight: '600' }}>100%</span>
            </div>
          </div>
        </div>

        {[
          { field: 'reactiveTime', label: 'Reactive: Issues, crises, urgent requests', color: '#EF4444' },
          { field: 'bauTime', label: 'BAU: Approvals, reporting, coordination', color: colors.yellow },
          { field: 'strategicTime', label: 'Strategic: Proactive, forward-looking work', color: colors.orange }
        ].map((item) => (
          <div key={item.field} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                <span style={{ color: colors.navy, fontSize: '13px' }}>{item.label}</span>
              </div>
              <span style={{ color: item.color, fontWeight: '600', fontSize: '16px' }}>{answers[item.field]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={answers[item.field]}
              onChange={(e) => updateTimeAllocation(item.field, parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right, ${item.color} ${answers[item.field]}%, #CBD5E1 ${answers[item.field]}%)`,
                appearance: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
        ))}

        {/* Dynamic feedback */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: answers.strategicTime < 25 ? 'rgba(239, 68, 68, 0.1)' : `${colors.orange}15`,
          borderRadius: '8px',
          borderLeft: `3px solid ${answers.strategicTime < 25 ? '#EF4444' : colors.orange}`
        }}>
          <p style={{ color: answers.strategicTime < 25 ? '#DC2626' : colors.orange, fontSize: '14px', margin: 0 }}>
            {answers.strategicTime < 15
              ? `${answers.strategicTime}% on strategic work. At this level, you're operating as a reactive service function. The work that would position you differently stays perpetually "next quarter."`
              : answers.strategicTime < 25
              ? `${answers.strategicTime}% on strategic work. Still heavily operational. The CEO sees you solving problems, not shaping strategy.`
              : answers.strategicTime < 40
              ? `${answers.strategicTime}% on strategic work — better than most Corporate Affairs leaders we see. The question is whether it's the right strategic work.`
              : `${answers.strategicTime}% on strategic work is strong. Let's see if that's translating into strategic influence.`
            }
          </p>
        </div>
      </div>
    </div>
  );

  const renderInfluence = () => (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        Strategic Position Check
      </h2>
      <p style={{ color: colors.navy, marginBottom: '28px', lineHeight: '1.6', opacity: 0.8 }}>
        Score each statement: 1 (rarely true) to 5 (consistently true).
      </p>

      {[
        { field: 'involvedEarly', label: 'I\'m involved early in major decisions — not just briefed on the comms plan afterwards.' },
        { field: 'ceoSeeksCounsel', label: 'The CEO actively seeks my perspective on politically and socially sensitive choices.' },
        { field: 'canQuantifyValue', label: 'I can quantify Corporate Affairs\' contribution in terms the CFO and Board understand.' },
        { field: 'canSayNo', label: 'I can decline low-value work without damaging relationships or my reputation.' },
        { field: 'peerRespect', label: 'Operations and commercial peers treat me as a strategic equal, not a support function.' }
      ].map((item, i) => (
        <div key={i} style={{
          background: colors.lightBlue,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <p style={{ color: colors.navy, marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
            {item.label}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(score => (
              <ScoreButton
                key={score}
                value={score}
                selected={answers[item.field] === score}
                onClick={() => updateAnswer(item.field, score)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Score summary */}
      <div style={{
        marginTop: '8px',
        padding: '16px',
        background: influenceScore < 3 ? 'rgba(239, 68, 68, 0.1)' : `${colors.orange}15`,
        borderRadius: '12px',
        borderLeft: `3px solid ${influenceScore < 3 ? '#EF4444' : colors.orange}`
      }}>
        <p style={{ color: influenceScore < 3 ? '#DC2626' : colors.orange, fontSize: '14px', margin: 0 }}>
          {influenceScore < 2.5
            ? `Strategic influence score: ${influenceScore.toFixed(1)}/5. You're operating as a service function, despite knowing you should be a strategic partner.`
            : influenceScore < 3.5
            ? `Strategic influence score: ${influenceScore.toFixed(1)}/5. You have moments of strategic inclusion, but it's inconsistent.`
            : influenceScore < 4.5
            ? `Strategic influence score: ${influenceScore.toFixed(1)}/5. Solid foundation. The question is how to make this more consistent.`
            : `Strategic influence score: ${influenceScore.toFixed(1)}/5. Strong position. Let's see what's limiting further elevation.`
          }
        </p>
      </div>
    </div>
  );

  const renderTried = () => (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        What You've Already Tried
      </h2>
      <p style={{ color: colors.navy, marginBottom: '28px', lineHeight: '1.6', opacity: 0.8 }}>
        Most Corporate Affairs leaders have attempted transformation before. Understanding what didn't work reveals why.
      </p>

      <div style={{
        background: colors.lightBlue,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px'
      }}>
        <p style={{ color: colors.navy, marginBottom: '16px', fontWeight: '600' }}>
          What approaches have you tried to elevate your function?
        </p>
        <p style={{ color: colors.navy, marginBottom: '16px', fontSize: '14px', opacity: 0.7 }}>
          Select all that apply.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <CheckboxOption
            checked={answers.triedConsulting}
            onChange={(v) => updateAnswer('triedConsulting', v)}
            label="Brought in consultants (Big 4, boutique, or independent)"
          />
          <CheckboxOption
            checked={answers.triedTechnology}
            onChange={(v) => updateAnswer('triedTechnology', v)}
            label="Implemented new technology or systems"
          />
          <CheckboxOption
            checked={answers.triedTraining}
            onChange={(v) => updateAnswer('triedTraining', v)}
            label="Sent team to training or capability programs"
          />
          <CheckboxOption
            checked={answers.triedRestructure}
            onChange={(v) => updateAnswer('triedRestructure', v)}
            label="Restructured the team or reporting lines"
          />
          <CheckboxOption
            checked={answers.triedHiring}
            onChange={(v) => updateAnswer('triedHiring', v)}
            label="Hired new senior people to change the dynamic"
          />
        </div>
      </div>

      {(answers.triedConsulting || answers.triedTechnology || answers.triedTraining || answers.triedRestructure || answers.triedHiring) && (
        <div style={{
          background: colors.lightBlue,
          borderRadius: '16px',
          padding: '24px'
        }}>
          <p style={{ color: colors.navy, marginBottom: '16px', fontWeight: '600' }}>
            What was the common pattern in why these didn't fully work?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { value: 'no-capacity', label: 'Team was too busy with day-to-day to implement properly' },
              { value: 'no-context', label: 'Solutions didn\'t understand the realities of our industry' },
              { value: 'no-stick', label: 'Initial momentum, then things drifted back to old ways' },
              { value: 'no-exec', label: 'Lacked executive sponsorship or organizational buy-in' },
              { value: 'no-embed', label: 'Got recommendations or training, but no embedded change' }
            ].map((option) => (
              <OptionButton
                key={option.value}
                selected={answers.whyDidntWork === option.value}
                onClick={() => updateAnswer('whyDidntWork', option.value)}
                fullWidth
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>
      )}

      {answers.whyDidntWork && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: `${colors.orange}10`,
          borderRadius: '12px',
          borderLeft: `3px solid ${colors.orange}`
        }}>
          <p style={{ color: colors.navy, fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
            {answers.whyDidntWork === 'no-capacity'
              ? 'This is the most common pattern. Solutions that add new work on top of existing capacity are designed to fail. The fix: eliminate work first, create breathing room, then build the new.'
              : answers.whyDidntWork === 'no-context'
              ? 'Generic solutions struggle in heavy industry. The regulatory complexity, community dynamics, and political sensitivities require deep sector understanding.'
              : answers.whyDidntWork === 'no-stick'
              ? 'Without embedded systems and transferred capability, change depends on continued consultant presence. When they leave, old patterns return.'
              : answers.whyDidntWork === 'no-exec'
              ? 'Transformation without executive air cover is swimming upstream. The question is how to build that case in terms executives understand.'
              : 'The gap between recommendation and implementation is where most transformation efforts die. Strategy decks don\'t create change — embedded systems do.'
            }
          </p>
        </div>
      )}
    </div>
  );

  const renderHidden = () => (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        Hidden Hours Audit
      </h2>
      <p style={{ color: colors.navy, marginBottom: '28px', lineHeight: '1.6', opacity: 0.8 }}>
        Where is your time actually going? Be specific about recurring activities.
      </p>

      {[
        { field: 'mediaMonitoringHours', label: 'Media monitoring, clipping summaries, and coverage reports' },
        { field: 'stakeholderUpdatesHours', label: 'Stakeholder contact updates, relationship tracking, briefing prep' },
        { field: 'internalMeetingsHours', label: 'Internal meetings where you\'re "staying across things" but not deciding' },
        { field: 'reportingHours', label: 'Compiling reports, status updates, Board papers' },
        { field: 'approvalChasingHours', label: 'Chasing approvals, coordinating sign-offs, managing workflows' }
      ].map((item, i) => (
        <div key={i} style={{
          background: colors.lightBlue,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <p style={{ color: colors.navy, marginBottom: '14px', fontSize: '14px', lineHeight: '1.5' }}>
            {item.label}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { value: '0-2', label: '0-2 hrs/week' },
              { value: '2-5', label: '2-5 hrs/week' },
              { value: '5-10', label: '5-10 hrs/week' },
              { value: '10+', label: '10+ hrs/week' }
            ].map((option) => (
              <OptionButton
                key={option.value}
                selected={answers[item.field] === option.value}
                onClick={() => updateAnswer(item.field, option.value)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>
      ))}

      {/* Running total */}
      <div style={{
        padding: '16px',
        background: totalHiddenHours >= 15 ? 'rgba(239, 68, 68, 0.1)' : `${colors.orange}15`,
        borderRadius: '12px',
        borderLeft: `3px solid ${totalHiddenHours >= 15 ? '#EF4444' : colors.orange}`
      }}>
        <p style={{ color: totalHiddenHours >= 15 ? '#DC2626' : colors.orange, fontSize: '14px', margin: 0, fontWeight: '500' }}>
          {totalHiddenHours >= 20
            ? `${totalHiddenHours}+ hours per week in operational activities. That's ${Math.round(totalHiddenHours * 52)} hours annually — over a month of full-time capacity trapped in low-value work.`
            : totalHiddenHours >= 10
            ? `${totalHiddenHours} hours per week identified. That's ${Math.round(totalHiddenHours * 52)} hours annually with significant automation or elimination potential.`
            : totalHiddenHours >= 5
            ? `${totalHiddenHours} hours per week — not dramatic, but ${Math.round(totalHiddenHours * 52)} hours annually is still meaningful capacity to recover.`
            : 'Your operational overhead appears manageable. Let\'s see where strategic influence is blocked.'
          }
        </p>
      </div>
    </div>
  );

  const renderMissing = () => (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        Conversations You're Missing
      </h2>
      <p style={{ color: colors.navy, marginBottom: '28px', lineHeight: '1.6', opacity: 0.8 }}>
        Which strategic conversations are happening without Corporate Affairs input?
      </p>

      <div style={{
        background: colors.lightBlue,
        borderRadius: '16px',
        padding: '24px'
      }}>
        <p style={{ color: colors.navy, marginBottom: '16px', fontWeight: '600' }}>
          Select conversations where you should have a seat — but currently don't.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { value: 'investment-decisions', label: 'Investment committee / capital allocation decisions' },
            { value: 'ma-due-diligence', label: 'M&A due diligence and integration planning' },
            { value: 'government-strategy', label: 'Government relations strategy and political positioning' },
            { value: 'community-approvals', label: 'Major project approvals and community engagement strategy' },
            { value: 'crisis-planning', label: 'Crisis scenario planning and risk exercises' },
            { value: 'workforce-planning', label: 'Workforce restructuring and change communications' },
            { value: 'esg-strategy', label: 'ESG strategy and sustainability commitments' },
            { value: 'board-prep', label: 'Board meeting preparation and stakeholder positioning' }
          ].map((option) => (
            <CheckboxOption
              key={option.value}
              checked={(answers.missingConversations || []).includes(option.value)}
              onChange={() => toggleArrayAnswer('missingConversations', option.value)}
              label={option.label}
            />
          ))}
        </div>
      </div>

      {answers.missingConversations.length >= 2 && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: `${colors.orange}10`,
          borderRadius: '12px',
          borderLeft: `3px solid ${colors.orange}`
        }}>
          <p style={{ color: colors.navy, fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
            Each conversation you're excluded from is a decision being made without stakeholder risk perspective. By the time it reaches you, you're managing consequences rather than shaping outcomes.
          </p>
        </div>
      )}
    </div>
  );

  const renderBlocker = () => (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        The Primary Blocker
      </h2>
      <p style={{ color: colors.navy, marginBottom: '28px', lineHeight: '1.6', opacity: 0.8 }}>
        If you could solve one thing, which would unlock the most progress?
      </p>

      <div style={{
        background: colors.lightBlue,
        borderRadius: '16px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { value: 'time', label: 'I simply don\'t have the bandwidth to do strategic work on top of everything else' },
            { value: 'visibility', label: 'Executives don\'t see or understand the value Corporate Affairs creates' },
            { value: 'positioning', label: 'I\'m seen as support/service function, not strategic partner' },
            { value: 'systems', label: 'We don\'t have the systems, data, or processes to operate strategically' },
            { value: 'skills', label: 'My team needs capability uplift to operate at a more strategic level' },
            { value: 'politics', label: 'Organizational politics and turf protection limit what\'s possible' }
          ].map((option) => (
            <OptionButton
              key={option.value}
              selected={answers.primaryBlocker === option.value}
              onClick={() => updateAnswer('primaryBlocker', option.value)}
              fullWidth
            >
              {option.label}
            </OptionButton>
          ))}
        </div>
      </div>

      {answers.primaryBlocker && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: `${colors.orange}10`,
          borderRadius: '12px',
          borderLeft: `3px solid ${colors.orange}`
        }}>
          <p style={{ color: colors.navy, fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
            {answers.primaryBlocker === 'time'
              ? 'When capacity is the blocker, adding new initiatives makes it worse. The solution is to eliminate work first, creating breathing room for everything else.'
              : answers.primaryBlocker === 'visibility'
              ? 'Visibility problems are often measurement problems. When you can\'t quantify value in terms executives understand, you remain invisible.'
              : answers.primaryBlocker === 'positioning'
              ? 'Repositioning from service function to strategic partner requires demonstrating strategic value — which requires capacity to do strategic work. It\'s a chicken-and-egg problem that starts with freeing capacity.'
              : answers.primaryBlocker === 'systems'
              ? 'Systems and processes are enablers, not solutions. Without capacity to implement and maintain them, new systems become expensive shelfware.'
              : answers.primaryBlocker === 'skills'
              ? 'Capability gaps are real, but often misdiagnosed. Your team may have strategic capability that\'s buried under operational load.'
              : 'Political constraints are real. The question is whether strategic positioning and demonstrated value can shift the dynamics.'
            }
          </p>
        </div>
      )}
    </div>
  );

  const renderResults = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Logo width={180} />
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginTop: '16px', marginBottom: '8px', color: colors.navy, fontFamily: 'Libre Baskerville, Georgia, serif' }}>
          Your Strategic Capacity Diagnostic
        </h2>
        <p style={{ color: colors.navy, opacity: 0.8, fontSize: '14px' }}>
          Based on your responses, here's what we see.
        </p>
      </div>

      {/* Key metrics summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: colors.lightBlue,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '28px', fontWeight: '700', color: answers.strategicTime < 25 ? '#EF4444' : colors.orange, margin: '0 0 4px 0' }}>
            {answers.strategicTime}%
          </p>
          <p style={{ fontSize: '12px', color: colors.navy, margin: 0, opacity: 0.7 }}>
            Strategic Time
          </p>
        </div>
        <div style={{
          background: colors.lightBlue,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '28px', fontWeight: '700', color: influenceScore < 3 ? '#EF4444' : colors.orange, margin: '0 0 4px 0' }}>
            {influenceScore.toFixed(1)}
          </p>
          <p style={{ fontSize: '12px', color: colors.navy, margin: 0, opacity: 0.7 }}>
            Influence Score /5
          </p>
        </div>
        <div style={{
          background: colors.lightBlue,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '28px', fontWeight: '700', color: totalHiddenHours >= 15 ? '#EF4444' : colors.orange, margin: '0 0 4px 0' }}>
            {totalHiddenHours}+
          </p>
          <p style={{ fontSize: '12px', color: colors.navy, margin: 0, opacity: 0.7 }}>
            Hidden Hours/Week
          </p>
        </div>
      </div>

      {/* Insights section */}
      {insights.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.navy, marginBottom: '12px' }}>
            Key Findings
          </h3>
          {insights.map((insight, i) => (
            <div key={i} style={{
              background: insight.type === 'critical' ? 'rgba(239, 68, 68, 0.08)' : colors.lightBlue,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              borderLeft: `3px solid ${insight.type === 'critical' ? '#EF4444' : colors.orange}`
            }}>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: insight.type === 'critical' ? '#DC2626' : colors.orange,
                marginBottom: '6px'
              }}>
                {insight.title}
              </p>
              <p style={{ fontSize: '14px', color: colors.navy, margin: 0, lineHeight: '1.5' }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4-Week Action Plan */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.navy, marginBottom: '12px' }}>
          Your 4-Week Sprint Plan
        </h3>

        {/* Week 1: Eliminate */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.03) 100%)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          borderLeft: '3px solid #EF4444'
        }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#DC2626', marginBottom: '8px', letterSpacing: '0.5px' }}>
            WEEK 1: ELIMINATE
          </p>
          {actionPlan.eliminate.slice(0, 2).map((action, i) => (
            <p key={i} style={{ fontSize: '14px', color: colors.navy, margin: i === 0 ? 0 : '8px 0 0 0', lineHeight: '1.5' }}>
              • {action}
            </p>
          ))}
        </div>

        {/* Weeks 2-3: Automate */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.yellow}15 0%, ${colors.yellow}05 100%)`,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          borderLeft: `3px solid ${colors.yellow}`
        }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#B45309', marginBottom: '8px', letterSpacing: '0.5px' }}>
            WEEKS 2-3: AUTOMATE
          </p>
          {actionPlan.automate.slice(0, 2).map((action, i) => (
            <p key={i} style={{ fontSize: '14px', color: colors.navy, margin: i === 0 ? 0 : '8px 0 0 0', lineHeight: '1.5' }}>
              • {action}
            </p>
          ))}
        </div>

        {/* Week 4: Elevate */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.orange}15 0%, ${colors.orange}05 100%)`,
          borderRadius: '12px',
          padding: '16px',
          borderLeft: `3px solid ${colors.orange}`
        }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: colors.orange, marginBottom: '8px', letterSpacing: '0.5px' }}>
            WEEK 4: ELEVATE
          </p>
          {actionPlan.elevate.slice(0, 2).map((action, i) => (
            <p key={i} style={{ fontSize: '14px', color: colors.navy, margin: i === 0 ? 0 : '8px 0 0 0', lineHeight: '1.5' }}>
              • {action}
            </p>
          ))}
        </div>
      </div>

      {/* Lead capture */}
      {!emailSubmitted ? (
        <div style={{
          background: colors.navy,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.white, marginBottom: '8px', fontFamily: 'Libre Baskerville, Georgia, serif' }}>
            Get Your Full Diagnostic Report
          </h3>
          <p style={{ fontSize: '14px', color: colors.white, opacity: 0.85, marginBottom: '20px', lineHeight: '1.5' }}>
            Receive your detailed diagnostic as a PDF, plus the Corporate Affairs Operating Model template we use with clients.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Your name"
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
              }}
            />
            <input
              type="email"
              placeholder="Work email"
              value={answers.email}
              onChange={(e) => updateAnswer('email', e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
              }}
            />
            <input
              type="text"
              placeholder="Company"
              value={answers.company}
              onChange={(e) => updateAnswer('company', e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
              }}
            />

            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
              marginTop: '4px'
            }}>
              <input
                type="checkbox"
                checked={answers.wantsDebrief}
                onChange={(e) => updateAnswer('wantsDebrief', e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <span style={{ fontSize: '13px', color: colors.white, opacity: 0.85, lineHeight: '1.4' }}>
                I'd like a 20-minute diagnostic debrief call to discuss my results
              </span>
            </label>

            <button
              onClick={() => {
                if (answers.email && answers.name) {
                  setEmailSubmitted(true);
                  // In production: send to your email service / CRM
                  console.log('Lead captured:', answers);
                }
              }}
              disabled={!answers.email || !answers.name}
              style={{
                padding: '14px 24px',
                borderRadius: '8px',
                border: 'none',
                background: answers.email && answers.name ? colors.orange : '#9CA3AF',
                color: colors.white,
                fontSize: '15px',
                fontWeight: '600',
                cursor: answers.email && answers.name ? 'pointer' : 'not-allowed',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                marginTop: '8px'
              }}
            >
              Send My Diagnostic Report
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: `${colors.orange}15`,
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: colors.orange, marginBottom: '8px' }}>
            Check your inbox
          </p>
          <p style={{ fontSize: '14px', color: colors.navy, margin: 0, lineHeight: '1.5' }}>
            Your diagnostic report and Operating Model template are on their way to {answers.email}.
            {answers.wantsDebrief && ' We\'ll be in touch within 24 hours to schedule your debrief call.'}
          </p>
        </div>
      )}

      {/* Footer context */}
      <div style={{
        background: colors.lightBlue,
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '13px', color: colors.navy, margin: 0, lineHeight: '1.5', opacity: 0.8 }}>
          This diagnostic is based on patterns from Corporate Affairs leaders across mining, energy, and utilities.
          The 4-week EAE Sprint methodology has delivered 10-20% capacity release in every engagement.
        </p>
      </div>
    </div>
  );

  // Navigation
  const canProgress = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return answers.sector && answers.functionSize;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      case 7: return answers.primaryBlocker;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0: return renderIntro();
      case 1: return renderSector();
      case 2: return renderTime();
      case 3: return renderInfluence();
      case 4: return renderTried();
      case 5: return renderHidden();
      case 6: return renderMissing();
      case 7: return renderBlocker();
      case 8: return renderResults();
      default: return renderIntro();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.white,
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '560px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        {currentStep > 0 && currentStep < steps.length - 1 && <ProgressBar />}

        {renderStep()}

        {/* Navigation buttons */}
        {currentStep < steps.length - 1 && (
          <div style={{
            display: 'flex',
            justifyContent: currentStep === 0 ? 'center' : 'space-between',
            marginTop: '32px',
            gap: '12px'
          }}>
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                style={{
                  padding: '14px 28px',
                  borderRadius: '10px',
                  border: `2px solid ${colors.navy}`,
                  background: 'transparent',
                  color: colors.navy,
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProgress()}
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                border: 'none',
                background: canProgress() ? colors.orange : '#9CA3AF',
                color: colors.white,
                fontSize: '15px',
                fontWeight: '600',
                cursor: canProgress() ? 'pointer' : 'not-allowed',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                flex: currentStep === 0 ? 'none' : 1,
                maxWidth: currentStep === 0 ? '200px' : 'none'
              }}
            >
              {currentStep === 0 ? 'Start Diagnostic' : currentStep === steps.length - 2 ? 'See My Results' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategicCapacityDiagnostic;