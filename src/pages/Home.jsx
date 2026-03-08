import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import ServicesCard from "../components/ServicesCard";
import QuoteForm from "../components/QuoteForm";

export default function Home(){
  const services = [
    {
      title: "Car Transport",
      desc: "Covered and open carrier options with doorstep pickup and delivery.",
      icon: <span>🚗</span>,
    },
    {
      title: "Bike Transport",
      desc: "Safe bike packing with dedicated loading and unloading handling.",
      icon: <span>🏍️</span>,
    },
    {
      title: "Household Add-ons",
      desc: "Optional household parcel transfer during your vehicle relocation.",
      icon: <span>📦</span>,
    },
  ];

  return (
    <div className="soft-enter">
      <Hero />

      <section className="section-shell py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">Our Expertise</p>
            <h3 className="mt-2 text-3xl font-bold">Vehicle Shipping Services</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServicesCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="section-shell pb-4">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-7 md:grid-cols-4">
          <div>
            <div className="text-3xl font-bold text-[var(--brand-700)]">10k+</div>
            <div className="text-sm text-slate-600">Vehicle Moves</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--brand-700)]">500+</div>
            <div className="text-sm text-slate-600">Route Coverage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--brand-700)]">24/7</div>
            <div className="text-sm text-slate-600">Tracking Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--brand-700)]">98%</div>
            <div className="text-sm text-slate-600">On-time Deliveries</div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="section-shell py-14">
        <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]">
          <div className="brand-gradient rounded-2xl p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">Get Started</p>
            <h3 className="mt-2 text-3xl font-bold">Ready to move your vehicle?</h3>
            <p className="mt-4 text-slate-100/85">
              Fill this form to receive your estimate and shipment ID. You can use the shipment ID directly on our tracking page.
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>
    </div>
  );
}