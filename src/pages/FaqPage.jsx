import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What types of vehicles do you transport?",
      answer:
        "We specialize in transporting cars, bikes, scooters, and can handle bulk corporate fleet relocations. We offer both open and covered carrier options depending on your vehicle type and protection needs.",
    },
    {
      question: "How do I request a transportation quote?",
      answer:
        "Simply visit our Get Instant Quote page, fill in pickup and drop locations along with vehicle details. You'll receive a quoted price and delivery timeline within minutes.",
    },
    {
      question: "What areas do you provide vehicle transportation services to?",
      answer:
        "PickAll operates across major metro cities and intercity routes throughout India. We can handle pickups and deliveries from Delhi, Mumbai, Bangalore, Hyderabad, Chennai, and many other cities nationwide.",
    },
    {
      question: "Is my vehicle insured during transportation?",
      answer:
        "Yes, all vehicles are covered with transit insurance. We provide comprehensive protection during pickup, transit, and delivery. You can declare the vehicle value for additional coverage if needed.",
    },
    {
      question: "Do you offer both domestic and international transportation services?",
      answer:
        "Currently, we specialize in domestic transportation across India. International shipping services are available for high-value and specialty vehicles upon request with advance planning.",
    },
    {
      question: "What sets your company apart from other logistics providers?",
      answer:
        "PickAll combines 24/7 live support, transparent pricing, real-time tracking, 98% on-time delivery, and verified carrier networks. We handle over 10,000+ vehicle moves annually with proven reliability.",
    },
    {
      question: "How can I track the status of my transported vehicle?",
      answer:
        "You can track your shipment in real-time through our Track Shipment feature. Just enter your tracking ID to see live location updates, estimated delivery time, and contact your assigned handler.",
    },
    {
      question: "What is the typical delivery timeline?",
      answer:
        "Most metro-to-metro routes complete in 2-6 days based on distance and carrier availability. Expedited delivery options are available for urgent requests with priority handling.",
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
