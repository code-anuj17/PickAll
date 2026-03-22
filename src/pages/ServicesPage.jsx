import ServicesCard from "../components/ServicesCard";

export default function ServicesPage(){
  const items = [
    { title: "Covered Auto Carrier Movement", desc: "Double-decker fully covered containerized Tata and Ashok Leyland trailers with perforated flooring.", icon: <span>🚗</span> },
    { title: "Outbound Auto Logistics", desc: "Dedicated land transport support activities for automobile consignments across India.", icon: <span>🏍️</span> },
    { title: "GPS & Observer Monitoring", desc: "Hi-tech GPS tracking plus observer team for en-route movement control and safety assurance.", icon: <span>📡</span> },
  ];

  return (
    <section className="section-shell py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">What We Offer</p>
        <h2 className="mt-2 text-4xl font-bold">Transport Services</h2>
        <p className="mt-3 max-w-3xl text-slate-600">We specialize in service activities incidental to land transportation with strict operating controls, safe movement standards, and timely consignment delivery.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ServicesCard key={item.title} {...item} />
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        Operational highlights include strong on-time performance, a safe transportation record, a dedicated trailer fleet, and an ongoing expansion plan for additional trailers over the coming financial years.
      </div>
    </section>
  );
}