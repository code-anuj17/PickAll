import { useState } from "react";
import emailjs from "@emailjs/browser";
import { addDoc, collection, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db, firestoreEnabled } from "../lib/firebase";

const SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_KEY;

function withTimeout(promise, ms, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), ms)
    ),
  ]);
}

function makeTrackingId() {
  const stamp = Date.now().toString().slice(-7);
  const token = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PK${stamp}${token}`;
}

export default function QuoteForm(){
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    destination: "",
    vehicle: "Car",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice("");

    const localTrackingId = makeTrackingId();

    const templateParams = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      pickup: form.pickup,
      destination: form.destination,
      vehicle: form.vehicle,
      note: form.note,
      tracking_id: localTrackingId,
      admin_email: import.meta.env.VITE_ADMIN_EMAIL,
    };

    try {
      await withTimeout(
        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY),
        12000,
        "Email request timed out"
      );

      setTrackingId(localTrackingId);
      setSent(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        pickup: "",
        destination: "",
        vehicle: "Car",
        note: "",
      });
      setLoading(false);

      if (firestoreEnabled && db) {
        void addDoc(collection(db, "quoteRequests"), {
            ...form,
            trackingId: localTrackingId,
            status: "Quote Requested",
            createdAt: serverTimestamp(),
          })
          .catch((firestoreErr) => {
            console.warn("Firestore quote save failed:", firestoreErr);
            setNotice("Quote was sent, but live tracking is temporarily unavailable.");
          });

        void setDoc(doc(db, "tracking", localTrackingId), {
            trackingId: localTrackingId,
            customerName: form.name,
            fromCity: form.pickup,
            toCity: form.destination,
            vehicle: form.vehicle,
            status: "Quote Requested",
            lastLocation: form.pickup,
            eta: "Awaiting pickup confirmation",
            updatedAt: serverTimestamp(),
          })
          .catch((firestoreErr) => {
            console.warn("Firestore tracking save failed:", firestoreErr);
            setNotice("Quote was sent, but live tracking is temporarily unavailable.");
          });
      } else {
        setNotice("Quote was sent. Firestore tracking is currently disabled.");
      }
    } catch (err) {
      setError("Failed to submit quote. Please verify EmailJS and Firebase settings.");
      console.error("Quote submission error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
      {sent ? (
        <div className="py-8 text-center">
          <h3 className="text-2xl font-bold text-emerald-600">Quote sent successfully</h3>
          <p className="mt-2 text-sm text-slate-600">Our team will contact you shortly on your provided phone or email.</p>
          <p className="mt-4 text-sm font-semibold text-slate-800">
            Tracking ID: <span className="rounded bg-slate-900 px-2 py-1 text-white">{trackingId}</span>
          </p>
          {notice && <p className="mt-3 text-sm text-amber-700">{notice}</p>}
          <button
            onClick={() => {
              setSent(false);
              setTrackingId("");
              setNotice("");
            }}
            className="mt-6 rounded-lg bg-[var(--brand-700)] px-4 py-2 text-white"
          >
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Full name</label>
            <input required name="name" value={form.name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]" placeholder="John Doe" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input required name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]" placeholder="+91 98xxxx" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]" placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Pickup city</label>
            <input required name="pickup" value={form.pickup} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]" placeholder="Delhi" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Destination city</label>
            <input required name="destination" value={form.destination} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]" placeholder="Mumbai" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Vehicle type</label>
            <select name="vehicle" value={form.vehicle} onChange={handleChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]">
              <option>Car</option>
              <option>Bike</option>
              <option>Scooter</option>
              <option>SUV</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Notes (optional)</label>
            <textarea name="note" value={form.note} onChange={handleChange} className="mt-1 min-h-28 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]" placeholder="Any special instructions" />
          </div>

          <div className="md:col-span-2 flex items-center gap-4">
            <button disabled={loading} className="rounded-lg bg-[var(--brand-700)] px-5 py-3 font-medium text-white disabled:opacity-60">
              {loading ? "Sending..." : "Send Quote"}
            </button>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </form>
      )}
    </div>
  );
}