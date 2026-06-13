interface RuleBasedSummaryProps {
  summaryText: string;
}

export function RuleBasedSummary({ summaryText }: RuleBasedSummaryProps) {
  return (
    <section className="rule-summary" aria-labelledby="rule-summary-title">
      <div className="section-heading">
        <h2 id="rule-summary-title">Rule-Based Summary</h2>
        <p>Generated from file counts, categories, and statuses.</p>
      </div>

      <p>{summaryText}</p>
    </section>
  );
}
