import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

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
              <span className="font-bold text-lg tracking-wide text-white">PickAll Logistics Pvt Ltd</span>
            </div>
            <p className="text-sm text-slate-100/85 mb-6 leading-relaxed">
              PICKALL LOGISTICS PRIVATE LIMITED provides dedicated land transport support activities with a strong focus on safe, on-time and damage-free delivery across India.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-slate-100/90">
                <span className="font-semibold">✉</span> Info@pickalllogistics.com
              </p>
              <p className="text-sm text-slate-100/90">
                <span className="font-semibold">📱</span> +91-9024885287, +91-9950721565
              </p>
              <p className="text-sm text-slate-100/90">
                <span className="font-semibold">📍</span> PNO 238, Mahal Vistar, Pratap Nagar, Jaipur - 302033
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full text-white flex items-center justify-center transition" style={{ backgroundColor: "#1877F2" }}>
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full text-white flex items-center justify-center transition" style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}>
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full text-white flex items-center justify-center transition" style={{ backgroundColor: "#FF0000" }}>
                <Youtube size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full text-white flex items-center justify-center transition" style={{ backgroundColor: "#0A66C2" }}>
                <Linkedin size={20} />
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
        © {new Date().getFullYear()} PICKALL LOGISTICS PRIVATE LIMITED. All Rights Reserved.
      </div>
    </footer>
  );
}