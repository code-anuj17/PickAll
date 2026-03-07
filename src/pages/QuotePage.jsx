import QuoteForm from "../components/QuoteForm";

export default function QuotePage(){
  return (
    <section className="min-h-[70vh] bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Get a Quote</h2>
        <p className="text-sm text-gray-600 mb-6">Tell us pickup & destination and we’ll get back with exact pricing.</p>
        <QuoteForm />
      </div>
    </section>
  );
}