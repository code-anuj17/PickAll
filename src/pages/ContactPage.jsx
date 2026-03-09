import { useState } from "react";
import styles from "./ContactPage.module.css";
import emailjs from "@emailjs/browser";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, firestoreEnabled } from "../lib/firebase";

const SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE;
const TEMPLATE_ID =
  import.meta.env.VITE_CONTACT_TEMPLATE || import.meta.env.VITE_EMAIL_TEMPLATE;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_KEY;

function withTimeout(promise, ms, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), ms)
    ),
  ]);
}

export default function ContactPage(){
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await withTimeout(
        emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            request_type: "Contact Inquiry",
            subject: "New Contact Inquiry",
            name: form.name,
            email: form.email,
            phone: form.phone,
            message: form.message,
            note: form.message,
            pickup: "",
            destination: "",
            vehicle: "",
            admin_email: import.meta.env.VITE_ADMIN_EMAIL,
          },
          PUBLIC_KEY
        ),
        12000,
        "Email request timed out"
      );

      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setLoading(false);

      if (firestoreEnabled && db) {
        void addDoc(collection(db, "contactLeads"), {
            ...form,
            createdAt: serverTimestamp(),
          })
          .catch((firestoreErr) => {
            console.warn("Firestore contact save failed:", firestoreErr);
            setNotice("Message sent, but Firebase lead storage is currently unavailable.");
          });
      } else {
        setNotice("Message sent. Firebase lead storage is currently disabled.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to send your message right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="soft-enter">
      {/* Hero Banner */}
      <section className="brand-gradient overflow-hidden text-white">
        <div className="section-shell flex items-center justify-center" style={{ minHeight: '260px' }}>
          <div className="text-center w-full">
            <h1 className="text-3xl font-bold sm:text-4xl">CONTACT US</h1>
            <p className="mt-4 text-sm text-slate-100/85">
              <a href="/" className="hover:text-white">
                Home
              </a>
              {" »  "}
              <span className="text-slate-100">Contact Us</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] mt-8">
          <aside className="brand-gradient rounded-2xl p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">Need Help?</p>
            <h2 className="mt-2 text-4xl font-bold">Contact PickAll Team</h2>
            <p className="mt-4 text-sm text-slate-100/85">For relocation planning, route questions and bulk bookings, write to us and we will respond quickly.</p>
            <div className="mt-8 rounded-xl bg-white/10 p-4 text-sm">
              Email: {import.meta.env.VITE_ADMIN_EMAIL || "support@pickall.in"}
            </div>
          </aside>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            {sent ? (
              <div className="py-8 text-center">
                <h3 className="text-2xl font-bold text-emerald-600">Message sent</h3>
                <p className="mt-2 text-sm text-slate-600">Our support team will connect with you shortly.</p>
                {notice && <p className="mt-3 text-sm text-amber-700">{notice}</p>}
                <button onClick={() => setSent(false)} className="mt-5 rounded-lg bg-[--brand-700] px-4 py-2 text-sm text-white">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4">
                <div>
                  <label className="text-sm text-slate-600">Full name</label>
                  <input name="name" value={form.name} onChange={onChange} required className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[--brand-500]" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">Email</label>
                    <input name="email" type="email" value={form.email} onChange={onChange} required className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[--brand-500]" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Phone</label>
                    <input name="phone" value={form.phone} onChange={onChange} required className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[--brand-500]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Message</label>
                  <textarea name="message" value={form.message} onChange={onChange} required className="mt-1 min-h-30 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[--brand-500]" />
                </div>
                <button
                  disabled={loading}
                  className={styles["contact-submit-btn"]}
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </section>
      <div className="h-10" />
    </div>
  );
}