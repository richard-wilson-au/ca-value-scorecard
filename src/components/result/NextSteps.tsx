'use client';

export default function NextSteps() {
  function handleDownloadPdf() {
    // TODO Phase 6 — wire to /api/pdf/generate via @react-pdf/renderer.
    console.log('TODO Phase 6 — PDF');
  }

  function handleSendSeries() {
    // TODO Phase 7 — wire to GHL workflow trigger (slot-3-completed tag + 4-email sequence).
    console.log('TODO Phase 7 — series');
  }

  return (
    <section className="rounded-lg bg-tp-paper px-6 py-10 md:px-10 md:py-12">
      <h2 className="font-display text-2xl leading-snug text-tp-navy-ink md:text-3xl">
        Take this with you.
      </h2>
      <p className="mt-4 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
        Download the full PDF report. Four-pillar scoring detail, three peer
        comparisons (anonymised), and the methodology Richard uses to score this
        from coffee conversations with ASX CA Heads.
      </p>
      <button
        type="button"
        onClick={handleDownloadPdf}
        className="mt-6 rounded-sm bg-tp-orange px-6 py-3 font-sans text-base font-medium text-tp-white transition-colors hover:bg-tp-orange-deep"
      >
        Download the PDF
      </button>

      <p className="mt-10 font-sans text-base font-light leading-relaxed text-tp-navy md:text-lg">
        Want the four-part email series? It walks through each pillar with one
        named pattern Richard has seen close the gap fastest. Sent over seven
        days. Unsubscribe whenever.
      </p>
      <button
        type="button"
        onClick={handleSendSeries}
        className="mt-6 rounded-sm border border-tp-navy bg-tp-white px-6 py-3 font-sans text-base font-medium text-tp-navy transition-colors hover:bg-tp-paper-deep"
      >
        Send me the four-part series
      </button>
    </section>
  );
}
