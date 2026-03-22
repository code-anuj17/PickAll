import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import ServicesCard from "../components/ServicesCard";
import QuoteForm from "../components/QuoteForm";
import { Link } from "react-router-dom";

export default function Home(){
  const services = [
    {
      title: "Car Transport",
      desc: "Double-decker covered carrier movement for cars with safety-first handling.",
      icon: <span>🚗</span>,
    },
    {
      title: "Bike Transport",
      desc: "Dedicated bike and two-wheeler outbound movement with secure loading.",
      icon: <span>🏍️</span>,
    },
    {
      title: "Other Transport",
      desc: "Custom land-transport support activities for automobile logistics clients.",
      icon: <span>🚚</span>,
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

      <HowItWorks />

      <section className="section-shell py-14">
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">New Marketplace</p>
            <h3 className="mt-2 text-3xl font-bold">Connect Business Loads with Truck Owners</h3>
            <p className="mt-4 text-slate-600">
              Businesses can post available loads and truck owners can post available trucks. You can act as the mediator and
              manage both sides through one live platform with status controls and fraud moderation.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              to="/marketplace"
              className="rounded-xl border border-[var(--brand-700)] bg-slate-50 px-5 py-4 text-sm font-semibold text-[var(--brand-700)] transition hover:bg-slate-100"
            >
              Post Load Availability
            </Link>
            <Link
              to="/marketplace"
              className="rounded-xl bg-[var(--brand-700)] px-5 py-4 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Post Truck Availability
            </Link>
          </div>
        </div>
      </section>

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