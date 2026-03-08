import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer className="mt-14 bg-slate-950 text-slate-200">
      <div className="section-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="text-lg font-semibold text-white">PickAll Movers</div>
          <p className="mt-2 text-sm text-slate-400">Reliable car and bike shifting services with secure handling and verified transport partners.</p>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Quick Links</div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/services" className="hover:text-white">Services</Link>
            <Link to="/get-a-quote" className="hover:text-white">Get a Quote</Link>
            <Link to="/track" className="hover:text-white">Track Shipment</Link>
            <Link to="/contact" className="hover:text-white">Contact Us</Link>
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Support</div>
          <p className="text-sm">Email: {import.meta.env.VITE_ADMIN_EMAIL || "support@pickall.in"}</p>
          <p className="mt-1 text-sm">Mon-Sun: 8:00 AM to 10:00 PM</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PickAll Movers. All rights reserved.
      </div>
    </footer>
  );
}