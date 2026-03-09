import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer className="mt-14 brand-gradient text-white">
      <div className="section-shell py-12">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {/* Left Section - Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-[var(--brand-700)] flex items-center justify-center text-white font-bold text-sm">
                PA
              </div>
              <span className="font-bold text-lg tracking-wide text-white">PickAll Movers</span>
            </div>
            <p className="text-sm text-slate-100/85 mb-6 leading-relaxed">
              At PickAll Movers, we serve as your portal to the world of efficient vehicle logistics. Explore our comprehensive services and discover tailored solutions for your transportation needs.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">✉</span> {import.meta.env.VITE_ADMIN_EMAIL || "support@pickall.in"}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">📱</span> +91-8274341234
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="h-9 w-9 rounded-full bg-[var(--brand-700)] text-white flex items-center justify-center hover:bg-[var(--brand-900)] transition">
                f
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-[var(--brand-700)] text-white flex items-center justify-center hover:bg-[var(--brand-900)] transition">
                📷
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-[var(--brand-700)] text-white flex items-center justify-center hover:bg-[var(--brand-900)] transition">
                ▶
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-[var(--brand-700)] text-white flex items-center justify-center hover:bg-[var(--brand-900)] transition">
                in
              </a>
            </div>
          </div>

          {/* Middle Section - Information */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-100">Information</h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/about" className="text-slate-100/90 hover:text-white transition">About us</Link>
              <Link to="/faqs" className="text-slate-100/90 hover:text-white transition">FAQs</Link>
              <Link to="/privacy-policy" className="text-slate-100/90 hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="text-slate-100/90 hover:text-white transition">Terms & Conditions</Link>
              <Link to="/contact" className="text-slate-100/90 hover:text-white transition">Contact us</Link>
            </div>
          </div>

          {/* Right Section - Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-100">Quick Links</h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/my-account" className="text-slate-100/90 hover:text-white transition">My Account</Link>
              <Link to="/track" className="text-slate-100/90 hover:text-white transition">Tracking</Link>
              <Link to="/get-a-quote" className="text-slate-100/90 hover:text-white transition">Get a Quote</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/20 py-6 text-center text-sm text-slate-100/80">
        © {new Date().getFullYear()} PickAll Movers. All Rights Reserved.
      </div>
    </footer>
  );
}