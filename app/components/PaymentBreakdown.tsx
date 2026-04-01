export default function PaymentBreakdown({
  rows,
  title,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-white/25 bg-black/40 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/25">
        <div className="grid grid-cols-2 border-b border-white/25 bg-black/45">
          <div className="px-4 py-3 text-sm font-medium text-neutral-100">Item</div>
          <div className="px-4 py-3 text-sm font-medium text-neutral-100">Amount</div>
        </div>

        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`grid grid-cols-2 ${index < rows.length - 1 ? "border-b border-white/25" : ""}`}
          >
            <div className="px-4 py-3 text-sm text-neutral-200">{row.label}</div>
            <div className="px-4 py-3 text-sm font-medium text-white">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
