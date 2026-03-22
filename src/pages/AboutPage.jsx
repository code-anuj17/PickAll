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
              About PICKALL LOGISTICS PRIVATE LIMITED
            </h2>

            <p className="mt-6 text-slate-700 leading-relaxed">
              We are a newly established logistics company focused on service activities incidental to land transportation. Our professional management team led by Directors Rahul Sharma and Mamta is committed to customer delight, reliable communication, and damage-free movement.
            </p>

            <p className="mt-5 text-slate-700 leading-relaxed">
              Our current operations support clients like Tata Rewire and Resustainability Limited with a starting fleet of 5 carriers. We employ strict GPS-based tracking, observer route checks, and a hands-on management model to ensure safe and timely delivery performance.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">5</div>
                <div className="mt-1 text-sm text-slate-600">Starting Carriers</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">99%</div>
                <div className="mt-1 text-sm text-slate-600">On-time Delivery</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">99%</div>
                <div className="mt-1 text-sm text-slate-600">Safe Transport</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-[var(--brand-700)]">8</div>
                <div className="mt-1 text-sm text-slate-600">Employees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-shell py-14">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">Our Core Values</p>
          <h2 className="mt-3 text-3xl font-bold">Values & Operating Strengths</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Commitment</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Customer service with customer delight is the first priority across all business transactions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Customer Value</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Every route is managed with real-time visibility and proactive communication to clients.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Teamwork</h3>
            <p className="mt-3 text-slate-600 text-sm">
              We operate with a dedicated 8-member team plus direct leadership involvement by directors.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Professionalism</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Strong record-keeping discipline and process control ensure predictable service quality.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Flexibility</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Our fleet supports multiple automobile combinations with hydraulically operated trailers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-[var(--brand-900)]">Future-ready Growth</h3>
            <p className="mt-3 text-slate-600 text-sm">
              We plan to add up to 75 new trailers in the next three financial years as demand grows.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-shell py-12">
        <div className="rounded-2xl bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-700)] p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-bold">Need Reliable Auto Logistics Support?</h2>
          <p className="mt-2 text-slate-100/85">
            Contact our Jaipur operations team for transport planning and approved partner onboarding.
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
