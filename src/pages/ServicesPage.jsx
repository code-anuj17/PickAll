import ServicesCard from "../components/ServicesCard";

export default function ServicesPage(){
  const items = [
    { title: "Car Transport", desc: "Open and covered carriers for hatchback, sedan, SUV and luxury cars.", icon: <span>🚗</span> },
    { title: "Bike Transport", desc: "Secure bike packing and intercity transfer with careful loading.", icon: <span>🏍️</span> },
    { title: "Other Transport", desc: "Custom transport solutions for other vehicle categories and special cases.", icon: <span>🚚</span> },
  ];

  return (
    <section className="section-shell py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">What We Offer</p>
        <h2 className="mt-2 text-4xl font-bold">Transport Services</h2>
        <p className="mt-3 max-w-3xl text-slate-600">From single-vehicle transfers to managed relocation programs, PickAll offers full transport support with route coordination and tracking visibility.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ServicesCard key={item.title} {...item} />
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        Estimated delivery duration: most metro-to-metro routes complete in 2-6 days based on distance and carrier availability.
      </div>
    </section>
  );
}