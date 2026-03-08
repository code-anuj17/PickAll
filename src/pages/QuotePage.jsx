import QuoteForm from "../components/QuoteForm";

export default function QuotePage(){
  return (
    <section className="section-shell py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">Quote Request</p>
        <h2 className="mt-2 text-4xl font-bold">Get Your Transport Estimate</h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">Submit your details and we will send confirmation using EmailJS. Your request is also stored in Firebase for tracking and follow-up.</p>
      </div>

      <div className="mx-auto max-w-4xl">
        <QuoteForm />
      </div>
    </section>
  );
}