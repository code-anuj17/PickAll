import Tracking from "../components/Tracking";

export default function TrackPage(){
  return (
    <section className="section-shell py-14">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">Live Status</p>
        <h2 className="mt-2 text-4xl font-bold">Track Your Vehicle</h2>
        <p className="mt-2 text-sm text-slate-600">Enter your shipment ID created during quote request.</p>
      </div>

      <div className="mx-auto max-w-4xl">
        <Tracking />
      </div>
    </section>
  );
}