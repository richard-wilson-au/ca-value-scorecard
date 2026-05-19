// Server-only PDF report rendered with @react-pdf/renderer.
// Five A4 pages on warm-paper canvas. Translates the on-screen result
// page into the lead-magnet kit register per design brief §9.
//
// Copy mirrors the on-screen dictionaries in HeroCard.tsx, Insights.tsx,
// and AspirationalBenchmark.tsx. Duplication is deliberate — those files
// are 'use client', and this module runs on the Node API route. A future
// pass can extract both surfaces' copy to src/lib/interpretations.ts.

import path from 'node:path';
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type {
  Pillar,
  ScoreResult,
  SubScores,
  Tier,
} from '../../lib/scoring';
import { PILLAR_LABELS, PILLAR_QUESTIONS } from '../../lib/scoring';

// ---------------------------------------------------------------------------
// Fonts. Libre Baskerville (italic + normal) for display headlines and the
// tier name. IBM Plex Mono (regular + medium) for eyebrow labels and
// numerals. Helvetica is built into @react-pdf/renderer — no registration
// needed for body.
//
// We ship the TTF files in public/fonts/ rather than load from
// node_modules/@fontsource because @react-pdf 4.x parses TTF reliably across
// platforms; Fontsource only ships woff/woff2, and the woff path triggered a
// fontkit RangeError on Windows during local dev.

let fontsRegistered = false;
function registerFontsOnce() {
  if (fontsRegistered) return;
  const fontsRoot = path.join(process.cwd(), 'public', 'fonts');

  Font.register({
    family: 'Libre Baskerville',
    fonts: [
      {
        src: path.join(fontsRoot, 'LibreBaskerville-Italic.ttf'),
        fontStyle: 'italic',
        fontWeight: 400,
      },
      {
        src: path.join(fontsRoot, 'LibreBaskerville-Regular.ttf'),
        fontStyle: 'normal',
        fontWeight: 400,
      },
    ],
  });

  Font.register({
    family: 'IBM Plex Mono',
    fonts: [
      {
        src: path.join(fontsRoot, 'IBMPlexMono-Regular.ttf'),
        fontWeight: 400,
      },
      {
        src: path.join(fontsRoot, 'IBMPlexMono-Medium.ttf'),
        fontWeight: 500,
      },
    ],
  });

  // Word hyphenation off — TP house style is to break the line, not the word.
  Font.registerHyphenationCallback((w) => [w]);

  fontsRegistered = true;
}

// ---------------------------------------------------------------------------
// TP palette tokens (pt units in @react-pdf — translated from CSS).

const COLOR = {
  paperWarm: '#F6F2EB',
  paper: '#E4EAF1',
  white: '#FFFFFF',
  navy: '#556C8E',
  navyInk: '#2F3D55',
  navySoft: '#8C9AB1',
  navyLine: '#C6CFDC',
  orange: '#F96121',
};

// ---------------------------------------------------------------------------
// Copy dictionaries — mirror of HeroCard.tsx + Insights.tsx + AspirationalBenchmark.tsx
// canon. Edit both surfaces in lockstep until a future refactor extracts to
// src/lib/interpretations.ts.

const HERO_SENTENCE: Record<Tier, Record<Pillar, string>> = {
  Trailblazer: {
    inclusion:
      'You are upstream of the decisions that matter, and the data agrees. The remaining work is keeping that posture as the function grows past you.',
    counsel:
      'The CEO has come to expect your judgement on the hard calls. The next move is making the counsel survive whoever sits in your chair after you.',
    measurement:
      'You measure better than your peer set, which is a low bar. The unfinished work is a CFO-grade definition of contribution that Finance is willing to sign.',
    architecture:
      'Your function is in most rooms a CA Head should be in. The few you are missing are the ones top-quartile peers treat as a standing seat.',
  },
  Aspirant: {
    inclusion:
      'You are closer to upstream than most of your peers, but still being briefed on decisions you should be shaping. That gap is the next visible win.',
    counsel:
      'The CEO consults you on most things, but not the politically expensive ones. Closing that gap is the move that re-prices the function in his head.',
    measurement:
      'You can defend the work, but not yet in CFO language. That is the widest gap in your profile, and the one your peer set is closing fastest.',
    architecture:
      'Your function is in most of the strategic conversations. The missing ones are the rooms where the function would have the most to say. Worth naming each one with the CEO.',
  },
  Follower: {
    inclusion:
      'You are downstream of decisions the function should be shaping. Inclusion is the gap that, once closed, makes every other gap on this scorecard easier.',
    counsel:
      'The CEO uses you for delivery, not for counsel. That is a relationship gap rather than a competence gap, and it is the first one to close.',
    measurement:
      "The function is reviewed in cost language, not contribution language. Until that flips at the CFO's desk, every other gap on this scorecard stays open.",
    architecture:
      'Your function is missing from the rooms where top-quartile CA Heads earn their seat. Architecture is the structural fix the other three pillars depend on.',
  },
  Beginner: {
    inclusion:
      'The function is operating downstream of decisions across the board. The first move is picking one named decision per quarter and shaping it end to end.',
    counsel:
      'The CEO relationship is transactional. Rebuilding it as advisory is the precondition for the other three pillars, and it is a twelve-month project.',
    measurement:
      'Without a CFO-grade definition of contribution, the function is reviewed in cost language every cycle. That is the first gap to close, before anything else.',
    architecture:
      'The function is missing from most of the strategic conversations a CA Head needs to be in. Architecture is the foundation the other three pillars sit on.',
  },
};

const INSIGHT_COPY: Record<Tier, Record<Pillar, string>> = {
  Trailblazer: {
    inclusion:
      'You are upstream of more decisions than most of the Heads of Corporate Affairs I have sat with, and your Q3 score reflects that. The gap that remains at this tier is consistency. The rooms you are in by default versus the rooms you are in by invitation. The pattern I have seen close that last gap is the function negotiating a standing position in the strategy offsite agenda and the M&A diligence runbook, so the seat survives a change of CEO or a change of you.',
    counsel:
      'The CEO already comes to you on the hard calls. At this tier the gap is no longer the relationship; it is the structure underneath it. Most of the top-quartile CA Heads I have spoken with have the same worry: the counsel function depends on them, and walks out of the building if they walk out. The pattern that closes the gap is making the counsel calendared and written, usually a quarterly memo to the CEO, so the function reads as a system, not a personality.',
    measurement:
      'You measure better than your peer set, which is a low bar. Most Heads of Corporate Affairs I have sat with at ASX-listed mining and energy companies score Measurement the lowest of the four. At your tier the conversation always lands in the same place: the function has activity numbers the CEO accepts, but no contribution number the CFO will sign. The pattern that closes that last gap is a quarterly CFO-grade definition of contribution, audited by Finance, defended in the function\'s own budget review.',
    architecture:
      'Your function is in most of the strategic conversations a CA Head should be in. At this tier the missing rooms tend to be capital allocation, M&A diligence, or the risk register. Those are the rooms the top-quartile peers I speak with treat as a standing seat, not an invitation. The pattern that closes the gap is naming the missing rooms to the CEO directly, with a one-line case for what the function would contribute to each, and asking for the seat as a process change rather than a favour.',
  },
  Aspirant: {
    inclusion:
      'I have heard this pattern in seven of the ten coffees at your tier: the function is briefed, not consulted. The conversation always lands in the same place. By the time Corporate Affairs is in the room, the shape of the decision is fixed and the only question left is how to communicate it. Closing that gap usually starts with one named decision per quarter where the function gets the brief at the soft stage, shapes it, and the CEO sees the difference between a function that is briefed and a function that is consulted.',
    counsel:
      'The CEO uses you on the comms side of politically expensive decisions, but not on the strategic shape of them. I have heard the same line in five of the ten coffees: "he calls me when the decision is made, not when it is being made." That is a relationship gap, and it closes faster than people think once the function names what it is offering on the strategic side, usually a short written view delivered before the decision, on the two or three issues per year where the function has a genuine read the CEO does not.',
    measurement:
      'Your Measurement score is the widest gap in your profile. Most Heads of Corporate Affairs I have sat with at ASX-listed mining and energy companies score this dimension the lowest, and the conversation always lands in the same place: the function cannot articulate contribution in CFO language, so the function gets reviewed in cost language. The pattern that closes the gap fastest is not a new dashboard. It is a CFO-grade definition of contribution, audited quarterly by Finance, that the function defends in its own budget review.',
    architecture:
      'Your function is in the rooms it has to be in, and missing from the ones it should be in. The missing ones are usually capital allocation, investor-day prep, or the risk register. Across the ten coffees I have done at your tier, the same three rooms come up again and again as the ones the function would have the most to contribute in if it were there. The pattern that closes the gap is naming each missing room to the CEO, with a one-line case for what the function would contribute, and asking for the seat as a process change rather than a favour.',
  },
  Follower: {
    inclusion:
      'The function is downstream of decisions it should be shaping. That is a positioning gap rather than a competence gap, and it is the one I see flagged most often in the coffees at your tier. The function gets handed the comms plan and asked to make the announcement work. The contribution sits earlier, in shaping the decision before it is made. The first move is picking one decision per quarter where the function will not accept the brief at the announce stage, and arguing for the brief at the soft stage instead.',
    counsel:
      'The CEO uses the function for delivery, not for counsel. The hardest part of closing that gap is not the CEO. It is the function naming what counsel actually looks like in its hands, on what cadence, on what topics. I have heard this in six of the ten coffees at your tier: the Head of Corporate Affairs knows the CEO should be asking, and is not sure what he would ask for. A short written view on two or three issues per year, delivered before the decision, is usually how it starts.',
    measurement:
      'The function is reviewed in cost language, not contribution language. Until that flips at the CFO\'s desk, every other gap on this scorecard stays open. The pattern that closes the gap fastest is not a new dashboard. It is a CFO-grade definition of contribution, signed off by Finance, that the function defends in its own budget review. I have seen one Head of Corporate Affairs save half a million dollars in negotiation costs that no one in the business knew about. The number existed, the function had it. Finance had never been asked to audit it.',
    architecture:
      'The missing conversations you flagged in Q7 are not accidents. Top-quartile CA Heads are in those rooms by design. They sit on the risk-register cadence, they have a named stage in the M&A diligence runbook, they are first into the investor-day prep. The pattern I see at your score band is the function having grown by accumulation, hat by hat, with no one designing the architecture underneath. The gap closes by naming the missing rooms one by one and negotiating each one in as a process change, not a favour.',
  },
  Beginner: {
    inclusion:
      'The function is operating downstream across the board. The work at your tier is not to argue for inclusion in every decision, because that conversation will go nowhere when the function has not yet earned a track record at the soft stage. The pattern I have seen work is picking one named decision per quarter, getting in at the soft stage, shaping it well, and using that single track record as the case for the next one. Compound from there. The function buys its way upstream one decision at a time.',
    counsel:
      'The CEO relationship is transactional. He calls when he needs a media problem solved, not when he is wrestling with the politically expensive choice. That is the precondition gap. Until it shifts, the function does not get the strategic conversations it needs to demonstrate value, and every other dimension on this scorecard becomes harder. The pattern I have seen close this gap is a twelve-month project, not a memo. It starts with one short written view per quarter on a decision the CEO is genuinely wrestling with, whether or not he asked for it.',
    measurement:
      'Without a CFO-grade definition of contribution, the function is reviewed in cost language every cycle. That is the first gap to close at your tier, because everything else on this scorecard becomes harder to defend without it. I have heard this in eight of the ten coffees at the Beginner band: the function has activity numbers the CEO will tolerate, has no contribution number the CFO will sign, and the budget review conversation is always about cost. A quarterly Finance-audited contribution number, even on one initiative to start, changes that conversation.',
    architecture:
      'The function is missing from most of the strategic conversations a CA Head needs to be in. Architecture is the structural fix the other three pillars depend on. Without it, inclusion is an individual relationship rather than a standing seat, and counsel is a corridor conversation rather than a calendared one. The pattern I have seen at your tier is the function having grown by accumulation, one new hat at a time, with no one designing the operating model underneath. The first move is mapping the missing rooms and naming one to negotiate into per quarter.',
  },
};

const ASPIRATIONAL_COPY: Record<Pillar, string> = {
  inclusion:
    'Top-quartile CA Heads earn a standing seat at the strategy offsite, the M&A diligence rhythm, and the investor-day prep. The seat is calendared, not granted. They are in the room when the decision is still soft, not when the comms plan is being drafted. The question they answer is what the function would change about the decision before it leaves the room, and the CEO has come to expect that answer in writing.',
  counsel:
    'Top-quartile CA Heads make the counsel function visible. There is a named cadence with the CEO, usually quarterly on strategy and monthly on the politically expensive choices, and the judgement is recorded in a one-page memo, not lost in a corridor conversation. The CEO does not have to remember to ask. The counsel is on the calendar, and the written record is what the Board sees when the decision is later reviewed.',
  measurement:
    'Top-quartile CA Heads run a quarterly measurement review with the CEO and CFO. The agenda is fixed: three contribution metrics, audited by Finance, defended to the Board the same way operations defends EBITDA. The conversation is no longer whether the function delivered, because the number is signed. The conversation is what to invest in next, and the function is the one being asked, not the one being reviewed.',
  architecture:
    'Top-quartile CA Heads build the function into the cadence of the company, not into the calendar of the CEO. The risk register has a CA seat by default. The M&A diligence runbook has a named CA stage with a deliverable. The investor-day prep starts with a CA briefing. The work is being in the process whether or not the CEO remembers to invite them, because the process itself was designed with the seat already in it.',
};

const PULL_QUOTE = {
  body: "Most Heads of Corporate Affairs I have sat with are leading a function that was never designed. It accumulated activities over time. The first move is admitting that, and naming the rooms the function should be in but isn't, one by one.",
  attribution:
    'Richard Wilson, from Heads of Corporate Affairs coffees October 2025 – May 2026',
};

const RICHARD_BIO =
  'Richard Wilson runs Transformation Partners, a boutique advisory practice helping Heads of Corporate Affairs in Australian resources, energy, and utilities companies design the architecture of their function and demonstrate its value in CFO language. Before founding the practice he was a Principal at BCG, working on operating-model design with corporate functions at ASX-listed clients. He lives in Perth with his wife and two sons.';

const QUESTION_PILLAR_MAP: Array<{ question: string; pillar: string }> = [
  {
    question: 'Q3 — Involved early in major decisions',
    pillar: 'Inclusion',
  },
  {
    question: 'Q4 — CEO actively seeks your perspective',
    pillar: 'Counsel',
  },
  {
    question: 'Q5 + Q6 — Quantify contribution; budget framed on delivery',
    pillar: 'Measurement',
  },
  {
    question: 'Q7 — Strategic conversations the function is not in',
    pillar: 'Architecture',
  },
];

// ---------------------------------------------------------------------------
// Shared styles. Pt units. No CSS. Flexbox-like layout.

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLOR.paperWarm,
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 56,
    paddingRight: 56,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: COLOR.navy,
    lineHeight: 1.55,
  },
  eyebrow: {
    fontFamily: 'IBM Plex Mono',
    fontWeight: 500,
    fontSize: 9,
    color: COLOR.navySoft,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  eyebrowSmall: {
    fontFamily: 'IBM Plex Mono',
    fontWeight: 500,
    fontSize: 8,
    color: COLOR.navySoft,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },
  brandWordmark: {
    fontFamily: 'Helvetica',
    fontWeight: 'medium',
    fontSize: 9,
    color: COLOR.navy,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  caplaybookUrl: {
    fontFamily: 'IBM Plex Mono',
    fontSize: 9,
    color: COLOR.navySoft,
  },
  bodyText: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: COLOR.navy,
    lineHeight: 1.55,
  },
  sectionHeading: {
    fontFamily: 'Libre Baskerville',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 20,
    color: COLOR.navyInk,
    lineHeight: 1.2,
  },
  pillarHeading: {
    fontFamily: 'Libre Baskerville',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 14,
    color: COLOR.orange,
  },
  orangeRule: {
    width: 56,
    height: 3,
    backgroundColor: COLOR.orange,
  },
  hairline: {
    height: 1,
    backgroundColor: COLOR.navyLine,
  },
  orangeBall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLOR.orange,
  },
});

// ---------------------------------------------------------------------------
// Helpers

function format1dp(n: number): string {
  return n.toFixed(1);
}

const PILLAR_ORDER: Pillar[] = [
  'inclusion',
  'counsel',
  'measurement',
  'architecture',
];

function pickThreeWeakest(result: ScoreResult): Pillar[] {
  const deltas = PILLAR_ORDER.map((p) => ({
    pillar: p,
    delta:
      result.peerBenchmark.subScoreTopQuartile[p] - result.subScores[p],
  }));
  deltas.sort((a, b) => b.delta - a.delta);
  return deltas.slice(0, 3).map((d) => d.pillar);
}

// ---------------------------------------------------------------------------
// Page footers — meta row mirrored bottom-left wordmark / bottom-right url.

function PageFooter({ pageLabel }: { pageLabel: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 36,
        left: 56,
        right: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}
      fixed
    >
      <Text style={styles.brandWordmark}>Transformation Partners</Text>
      <Text style={styles.eyebrowSmall}>{pageLabel}</Text>
      <Text style={styles.caplaybookUrl}>caplaybook.substack.com</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Page 1 — Cover.

function CoverPage({ name }: { name?: string }) {
  const personalised = name && name.trim().length > 0
    ? `${name.trim()}'s CA Value-Demonstration Maturity Report`
    : 'CA Value-Demonstration Maturity Report';

  return (
    <Page size="A4" style={styles.page}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <View style={styles.orangeBall} />
        <Text style={[styles.eyebrow, { marginLeft: 8 }]}>
          Transformation Partners
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Text style={styles.eyebrowSmall}>Strategic Capacity Diagnostic</Text>
        <Text
          style={{
            marginTop: 14,
            fontFamily: 'Libre Baskerville',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 34,
            color: COLOR.navyInk,
            lineHeight: 1.15,
          }}
        >
          {personalised}
        </Text>
        <Text
          style={{
            marginTop: 24,
            fontFamily: 'Helvetica',
            fontSize: 12,
            color: COLOR.navy,
            lineHeight: 1.6,
            maxWidth: 360,
          }}
        >
          A peer-benchmarked finding for senior Heads of Corporate Affairs in
          ASX-listed mining and energy companies. Eight questions answered,
          four pillars scored, n=10 peers.
        </Text>
      </View>

      <View style={styles.orangeRule} />
      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.brandWordmark}>Transformation Partners</Text>
        <Text style={styles.caplaybookUrl}>caplaybook.substack.com</Text>
      </View>
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Page 2 — Your result. Hero top half + four sub-score bullet charts.

function BulletChart({
  user,
  median,
  topQuartile,
}: {
  user: number;
  median: number;
  topQuartile: number;
}) {
  // Score scale 1–5 mapped to 0–100% of track width. Anchor 0 at score 1
  // so a 1 reads as "minimum" not "empty" — mirrors the on-screen chart.
  const pct = (n: number) =>
    Math.max(0, Math.min(100, ((Math.max(1, Math.min(5, n)) - 1) / 4) * 100));

  const trackWidth = 220; // pt — fits two-up grid inside content column
  const userWidthPt = (pct(user) / 100) * trackWidth;
  const medianLeftPt = (pct(median) / 100) * trackWidth;
  const topQLeftPt = (pct(topQuartile) / 100) * trackWidth;

  return (
    <View style={{ marginTop: 6 }}>
      <View
        style={{
          position: 'relative',
          width: trackWidth,
          height: 8,
          backgroundColor: COLOR.paper,
          borderRadius: 1,
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 8,
            width: userWidthPt,
            backgroundColor: COLOR.navy,
            borderRadius: 1,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: medianLeftPt,
            top: -3,
            height: 14,
            width: 1,
            backgroundColor: COLOR.navyInk,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: topQLeftPt,
            top: -3,
            height: 14,
            width: 1,
            backgroundColor: COLOR.orange,
          }}
        />
      </View>
      <View
        style={{
          marginTop: 6,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: trackWidth,
        }}
      >
        <Text
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: 8,
            color: COLOR.navyInk,
          }}
        >
          You {format1dp(user)}
        </Text>
        <Text
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: 8,
            color: COLOR.navySoft,
          }}
        >
          Median {format1dp(median)}
        </Text>
        <Text
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: 8,
            color: COLOR.orange,
          }}
        >
          Top quartile {format1dp(topQuartile)}
        </Text>
      </View>
    </View>
  );
}

function YourResultPage({ result }: { result: ScoreResult }) {
  const { tier, overall, dominantWeakness, peerBenchmark, subScores } =
    result;
  const interpretation = HERO_SENTENCE[tier][dominantWeakness];

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>Your result</Text>

      <Text
        style={{
          marginTop: 10,
          fontFamily: 'Libre Baskerville',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 30,
          color: COLOR.orange,
          lineHeight: 1.1,
        }}
      >
        {tier}
      </Text>

      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <Text
          style={{
            fontFamily: 'IBM Plex Mono',
            fontWeight: 500,
            fontSize: 64,
            color: COLOR.navyInk,
            lineHeight: 1.0,
          }}
        >
          {format1dp(overall)}
        </Text>
        <Text
          style={{
            marginLeft: 6,
            marginBottom: 6,
            fontFamily: 'IBM Plex Mono',
            fontSize: 18,
            color: COLOR.navySoft,
          }}
        >
          / 5
        </Text>
      </View>

      <Text
        style={{
          marginTop: 12,
          fontFamily: 'Helvetica',
          fontSize: 10,
          color: COLOR.navy,
        }}
      >
        Your {format1dp(overall)} versus ASX mining and energy CA Heads (n=
        {peerBenchmark.n}) — median {format1dp(peerBenchmark.median)} · top
        quartile {format1dp(peerBenchmark.topQuartile)}.
      </Text>

      <Text
        style={{
          marginTop: 16,
          fontFamily: 'Libre Baskerville',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 13,
          color: COLOR.navyInk,
          lineHeight: 1.45,
          maxWidth: 420,
        }}
      >
        {interpretation}
      </Text>

      <View style={{ marginTop: 28 }}>
        <View style={styles.orangeRule} />
      </View>

      <Text
        style={{
          marginTop: 14,
          fontFamily: 'Libre Baskerville',
          fontWeight: 400,
          fontSize: 16,
          color: COLOR.navyInk,
        }}
      >
        Where the score comes from
      </Text>

      <View
        style={{
          marginTop: 16,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {PILLAR_ORDER.map((pillar) => (
          <View
            key={pillar}
            style={{
              width: '48%',
              marginBottom: 18,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Libre Baskerville',
                  fontWeight: 400,
                  fontSize: 13,
                  color: COLOR.navyInk,
                }}
              >
                {PILLAR_LABELS[pillar]}
              </Text>
              <Text
                style={{
                  fontFamily: 'IBM Plex Mono',
                  fontWeight: 500,
                  fontSize: 12,
                  color: COLOR.navyInk,
                }}
              >
                {format1dp(subScores[pillar])}
              </Text>
            </View>
            <Text
              style={{
                marginTop: 2,
                fontFamily: 'Helvetica',
                fontSize: 9,
                color: COLOR.navySoft,
              }}
            >
              {PILLAR_QUESTIONS[pillar]}
            </Text>
            <BulletChart
              user={subScores[pillar]}
              median={peerBenchmark.subScoreMedians[pillar]}
              topQuartile={peerBenchmark.subScoreTopQuartile[pillar]}
            />
          </View>
        ))}
      </View>

      <PageFooter pageLabel="Page 2 of 5" />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Page 3 — Three insights, one per weakest pillar.

function ThreeInsightsPage({ result }: { result: ScoreResult }) {
  const weakest = pickThreeWeakest(result);
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>Where the work is</Text>
      <Text style={[styles.sectionHeading, { marginTop: 10 }]}>
        Three patterns Richard has seen in the coffees.
      </Text>

      <View style={{ marginTop: 18 }}>
        <View style={styles.orangeRule} />
      </View>

      <View style={{ marginTop: 18 }}>
        {weakest.map((pillar, idx) => (
          <View
            key={pillar}
            style={{
              marginBottom: 18,
              paddingTop: idx === 0 ? 0 : 14,
              borderTopWidth: idx === 0 ? 0 : 1,
              borderTopColor: COLOR.navyLine,
            }}
          >
            <Text style={styles.pillarHeading}>
              {PILLAR_LABELS[pillar]}
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontFamily: 'Helvetica',
                fontSize: 10.5,
                color: COLOR.navy,
                lineHeight: 1.6,
              }}
            >
              {INSIGHT_COPY[result.tier][pillar]}
            </Text>
          </View>
        ))}
      </View>

      <PageFooter pageLabel="Page 3 of 5" />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Page 4 — Top-quartile benchmark + pull quote.

function TopQuartilePage({ result }: { result: ScoreResult }) {
  const pillar = result.dominantWeakness;
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>What top-quartile looks like</Text>
      <Text style={[styles.sectionHeading, { marginTop: 10 }]}>
        On {PILLAR_LABELS[pillar]} — the pattern Richard has seen close the
        gap fastest.
      </Text>

      <View style={{ marginTop: 18 }}>
        <View style={styles.orangeRule} />
      </View>

      <Text
        style={{
          marginTop: 18,
          fontFamily: 'Helvetica',
          fontSize: 11,
          color: COLOR.navy,
          lineHeight: 1.65,
          maxWidth: 460,
        }}
      >
        {ASPIRATIONAL_COPY[pillar]}
      </Text>

      {/* Pull quote — lead-magnet kit treatment. */}
      <View
        style={{
          marginTop: 30,
          padding: 22,
          backgroundColor: COLOR.paper,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            fontFamily: 'Libre Baskerville',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 14,
            color: COLOR.navyInk,
            lineHeight: 1.5,
          }}
        >
          “{PULL_QUOTE.body}”
        </Text>
        <Text
          style={{
            marginTop: 14,
            fontFamily: 'Helvetica',
            fontSize: 9,
            color: COLOR.navySoft,
          }}
        >
          — {PULL_QUOTE.attribution}
        </Text>
      </View>

      <PageFooter pageLabel="Page 4 of 5" />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Page 5 — Methodology + about.

function MethodologyPage({
  result,
  subScores,
}: {
  result: ScoreResult;
  subScores: SubScores;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>How the score was built</Text>
      <Text style={[styles.sectionHeading, { marginTop: 10 }]}>
        Methodology, peer set, about the author.
      </Text>

      <View style={{ marginTop: 18 }}>
        <View style={styles.orangeRule} />
      </View>

      <Text
        style={{
          marginTop: 18,
          fontFamily: 'Libre Baskerville',
          fontWeight: 400,
          fontSize: 13,
          color: COLOR.navyInk,
        }}
      >
        Peer set
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontFamily: 'Helvetica',
          fontSize: 10.5,
          color: COLOR.navy,
          lineHeight: 1.6,
        }}
      >
        This benchmark draws on ten hour-long coffee conversations Richard has
        had with Heads, GMs, and Directors of Corporate Affairs at ASX-listed
        mining and energy companies between October 2025 and May 2026. Each
        conversation was scored against the same eight-question framework you
        completed. The benchmark gets sharper as the sample grows. Reply to
        the email series and Richard will send the updated version at n=25.
      </Text>

      <Text
        style={{
          marginTop: 22,
          fontFamily: 'Libre Baskerville',
          fontWeight: 400,
          fontSize: 13,
          color: COLOR.navyInk,
        }}
      >
        Question to pillar mapping
      </Text>

      <View
        style={{
          marginTop: 10,
          borderTopWidth: 1,
          borderTopColor: COLOR.navyLine,
        }}
      >
        {QUESTION_PILLAR_MAP.map((row) => (
          <View
            key={row.pillar}
            style={{
              flexDirection: 'row',
              paddingTop: 8,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: COLOR.navyLine,
            }}
          >
            <Text
              style={{
                width: '65%',
                fontFamily: 'Helvetica',
                fontSize: 10,
                color: COLOR.navy,
              }}
            >
              {row.question}
            </Text>
            <Text
              style={{
                width: '35%',
                fontFamily: 'IBM Plex Mono',
                fontWeight: 500,
                fontSize: 10,
                color: COLOR.navyInk,
              }}
            >
              {row.pillar}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={{
          marginTop: 22,
          fontFamily: 'Libre Baskerville',
          fontWeight: 400,
          fontSize: 13,
          color: COLOR.navyInk,
        }}
      >
        About the author
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontFamily: 'Helvetica',
          fontSize: 10.5,
          color: COLOR.navy,
          lineHeight: 1.6,
        }}
      >
        {RICHARD_BIO}
      </Text>

      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={[styles.orangeBall, { width: 10, height: 10, borderRadius: 5 }]} />
        <Text
          style={{
            marginLeft: 8,
            fontFamily: 'IBM Plex Mono',
            fontSize: 10,
            color: COLOR.navySoft,
          }}
        >
          caplaybook.substack.com
        </Text>
      </View>

      {/* Quiet score reference at the bottom — confirms which result the PDF documents. */}
      <View
        style={{
          position: 'absolute',
          bottom: 64,
          left: 56,
          right: 56,
        }}
      >
        <View style={styles.hairline} />
        <Text
          style={{
            marginTop: 8,
            fontFamily: 'IBM Plex Mono',
            fontSize: 8,
            color: COLOR.navySoft,
          }}
        >
          Your overall {format1dp(result.overall)} · Inclusion{' '}
          {format1dp(subScores.inclusion)} · Counsel{' '}
          {format1dp(subScores.counsel)} · Measurement{' '}
          {format1dp(subScores.measurement)} · Architecture{' '}
          {format1dp(subScores.architecture)}
        </Text>
      </View>

      <PageFooter pageLabel="Page 5 of 5" />
    </Page>
  );
}

// ---------------------------------------------------------------------------
// Document.

export default function Report({
  result,
  name,
}: {
  result: ScoreResult;
  name?: string;
}) {
  registerFontsOnce();

  return (
    <Document
      title="CA Value-Demonstration Maturity Report"
      author="Richard Wilson, Transformation Partners"
      subject="Strategic Capacity Diagnostic"
      creator="Transformation Partners"
      producer="Transformation Partners"
    >
      <CoverPage name={name} />
      <YourResultPage result={result} />
      <ThreeInsightsPage result={result} />
      <TopQuartilePage result={result} />
      <MethodologyPage result={result} subScores={result.subScores} />
    </Document>
  );
}

export function reportFilename(name?: string): string {
  if (name && name.trim().length > 0) {
    const safe = name.trim().replace(/[^a-zA-Z0-9 _-]/g, '');
    return `${safe}'s CA Value-Demonstration Maturity Report.pdf`;
  }
  return 'CA Value-Demonstration Maturity Report.pdf';
}
