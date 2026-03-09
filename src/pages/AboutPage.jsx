import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="soft-enter">
      {/* Hero Banner */}
      <section className="brand-gradient overflow-hidden text-white">
        <div className="section-shell flex items-center justify-center" style={{ minHeight: '260px' }}>
          <div className="text-center w-full">
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">ABOUT US</h1>
            <p className="mt-4 text-sm text-slate-100/85">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              {" »  "}
              <span className="text-slate-100">About Us</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <section className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full">
              <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-3xl" />
              <div className="glass-card relative overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/30">
                <div className="aspect-square w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-3">🚚</div>
                    <p className="text-slate-600 font-semibold">Professional Transport Fleet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">Our Story</p>
            <h2 className="mt-3 text-3xl font-bold text-[var(--brand-900)] md:text-4xl">
              About PickAll: Delivering Excellence Across India
            </h2>

            <p className="mt-6 text-slate-700 leading-relaxed">
              With over <span className="font-semibold">10,000+ vehicles transported</span> and a commitment to reliability, PickAll has established itself as a trusted name in vehicle transportation across India. Our journey has been marked by continuous innovation, unwavering dedication to customer satisfaction, and a focus on safe, timely delivery.
            </p>

            <p className="mt-5 text-slate-700 leading-relaxed">
              At the heart of our operations is our fleet of modern carriers and expert handlers, each dedicated to ensuring your vehicles reach their destinations safely and on schedule. Our comprehensive network spans major metros and intercity routes, allowing us to offer seamless transportation services to every corner of India.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">10k+</div>
                <div className="mt-1 text-sm text-slate-600">Vehicle Moves</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">98%</div>
                <div className="mt-1 text-sm text-slate-600">On-time Delivery</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">24/7</div>
                <div className="mt-1 text-sm text-slate-600">Live Support</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">All India</div>
                <div className="mt-1 text-sm text-slate-600">Coverage Network</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-shell py-14">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">Our Core Values</p>
          <h2 className="mt-3 text-3xl font-bold">Why Choose PickAll</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Safety First</h3>
            <p className="mt-3 text-slate-600 text-sm">
              All vehicles are insured during transit with comprehensive coverage and careful handling protocols.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Real-time Tracking</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Know exactly where your vehicle is at all times with our transparent tracking system.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Quick Service</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Fast quotations and doorstep pickup with minimal waiting time and efficient logistics.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Customer Support</h3>
            <p className="mt-3 text-slate-600 text-sm">
              24/7 dedicated support team ready to assist with any queries or concerns.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Verified Partners</h3>
            <p className="mt-3 text-slate-600 text-sm">
              All transport partners and drivers are thoroughly verified and trained professionals.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Transparent Pricing</h3>
            <p className="mt-3 text-slate-600 text-sm">
              No hidden charges with upfront quotes and detailed breakdowns for all services.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-shell py-12">
        <div className="rounded-2xl bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-700)] p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-bold">Ready to Ship Your Vehicle?</h2>
          <p className="mt-2 text-slate-100/85">
            Get an instant quote and experience reliable transportation with PickAll.
          </p>
          <Link
            to="/get-a-quote"
            className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
          >
            Get Instant Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
