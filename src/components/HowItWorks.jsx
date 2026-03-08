export default function HowItWorks(){
  const steps = [
    { title: "Request Quote", desc: "Share pickup, destination and vehicle details online." },
    { title: "Carrier Assigned", desc: "Our team confirms slot and sends your shipment ID." },
    { title: "Transit Updates", desc: "Get regular tracking updates while your vehicle moves." },
    { title: "Safe Delivery", desc: "Doorstep handover with verification at destination." },
  ];

  return (
    <section className="section-shell py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">Simple Process</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">How PickAll Works</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-700)] font-bold text-white">
              {i + 1}
            </span>
            <h4 className="text-lg font-semibold text-slate-900">{step.title}</h4>
            <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}