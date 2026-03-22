import { Link } from "react-router-dom";

export default function Hero(){
  return (
    <section className="soft-enter brand-gradient overflow-hidden text-white">
      <div className="section-shell py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100">
              Outbound Auto Logistics Specialists
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.45rem]">
              Dedicated land transport support with safe, on-time automobile movement.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-100/85 sm:text-lg">
              PICKALL LOGISTICS PRIVATE LIMITED operates a dedicated starting fleet of 5 carriers from Jaipur, backed by strict GPS tracking and observer checks.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                to="/get-a-quote"
                className="rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              >
                Get Instant Quote
              </Link>
              <Link to="/track" className="rounded-lg border border-white/35 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Track Shipment
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-100/90">
              <div>5 Dedicated Carriers</div>
              <div>99% On-time Delivery</div>
              <div>99% Safe Transport Record</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-5 -top-10 h-40 w-40 rounded-full bg-orange-400/20 blur-3xl" />
            <div className="absolute -bottom-16 left-2 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="glass-card relative rounded-2xl p-5 text-slate-900 shadow-2xl shadow-slate-900/30">
              <h3 className="mb-4 text-lg font-bold">Shipment Snapshot</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Pickup</div>
                  <div className="font-semibold">Delhi NCR</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Drop</div>
                  <div className="font-semibold">Bangalore</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">Vehicle</div>
                  <div className="font-semibold">Auto Carrier</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">ETA</div>
                  <div className="font-semibold">As Scheduled</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                Active: GPS tracking enabled with observer route checks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}