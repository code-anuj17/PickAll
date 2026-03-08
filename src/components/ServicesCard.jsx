import { Link } from "react-router-dom";

export default function ServicesCard({ title, desc, icon }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[var(--brand-700)]">
        {icon}
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>

      <div className="mt-5 pt-2">
        <Link
          to="/get-a-quote"
          className="inline-flex items-center rounded-lg bg-[var(--brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
        >
          Book Now
        </Link>
      </div>
    </article>
  );
}