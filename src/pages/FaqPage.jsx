import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What does PICKALL LOGISTICS PRIVATE LIMITED specialize in?",
      answer:
        "We specialize in service activities incidental to land transportation, especially outbound auto logistics and transport support operations for automobile consignments.",
    },
    {
      question: "How can I request transport support or onboarding?",
      answer:
        "Use our website quote/contact forms with pickup, destination, and vehicle details. Our operations team reviews requests and coordinates movement plans directly.",
    },
    {
      question: "Where is your company based and where do you operate?",
      answer:
        "Our registered office is in Jaipur, Rajasthan, and we handle consignment movement across India depending on client requirements and route planning.",
    },
    {
      question: "How do you ensure shipment safety?",
      answer:
        "We follow strict tracking arrangements using hi-tech GPS systems and maintain observer checks for en-route movement. Safety and damage-free delivery are core operational priorities.",
    },
    {
      question: "What fleet and hardware setup do you currently run?",
      answer:
        "We operate a dedicated fleet, including double-decker fully covered containerized trailers built for automobile movement combinations.",
    },
    {
      question: "What are your current strengths and performance highlights?",
      answer:
        "Our profile highlights include 99% on-time delivery, 99% safe transportation record, strict movement monitoring, and direct involvement by management in day-to-day operations.",
    },
    {
      question: "Can clients track consignments in real time?",
      answer:
        "Yes. GPS-based tracking is available and can be shared with customers through internet/API-based visibility where enabled.",
    },
    {
      question: "What is your future expansion plan?",
      answer:
        "We plan to acquire up to 75 additional trailers over the next three financial years based on customer demand and route expansion needs.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="soft-enter">
      {/* Hero Banner */}
      <section className="brand-gradient overflow-hidden text-white">
        <div className="section-shell flex items-center justify-center" style={{ minHeight: '260px' }}>
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold sm:text-5xl">FAQs</h1>
            <p className="mt-2 text-sm text-slate-100/85">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              {" »  "}
              <span className="text-slate-100">FAQs</span>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-shell py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">
              Common Questions
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              We Are Here to Help
            </h2>
            <p className="mt-4 text-slate-600">
              Find answers to frequently asked questions about our vehicle transportation services, coverage, and how to use PickAll.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
                >
                  <span className="font-semibold text-[var(--text)]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-[var(--brand-700)] transition ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-slate-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-shell py-12">
        <div className="rounded-2xl bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-700)] p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-bold">Still have questions?</h2>
          <p className="mt-2 text-slate-100/85">
            Our 24/7 support team is ready to help you with any queries.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
