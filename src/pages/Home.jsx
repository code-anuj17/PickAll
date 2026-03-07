import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import ServicesCard from "../components/ServicesCard";
import QuoteForm from "../components/QuoteForm";

export default function Home(){
  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-6">Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServicesCard title="Car Transport" desc="Covered carriers for safe transport across states." icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 13l2-6h13l2 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
          <ServicesCard title="Bike Transport" desc="Door-to-door pickup and delivery for two-wheelers." icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>} />
          <ServicesCard title="Commercial Logistics" desc="Heavy vehicle and commercial logistics solutions." icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="8" width="18" height="8" rx="2"/></svg>} />
        </div>
      </section>

      <HowItWorks />

      {/* inline quote form as CTA on home */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-6">Request a Quote</h3>
        <QuoteForm />
      </section>
    </div>
  );
}