import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, firestoreEnabled } from "../lib/firebase";

export default function Tracking(){
  const [id,setId] = useState("");
  const [result,setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e)=>{
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (!firestoreEnabled || !db) {
      setError("Tracking is temporarily unavailable. Firestore is not enabled yet.");
      setLoading(false);
      return;
    }

    try {
      const cleanedId = id.trim().toUpperCase();
      const ref = doc(db, "tracking", cleanedId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("Tracking ID not found. Please check and try again.");
      } else {
        setResult(snap.data());
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch tracking right now. Please verify Firestore is enabled in Firebase console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
      <h3 className="mb-2 text-2xl font-bold">Track Shipment</h3>
      <p className="mb-5 text-sm text-slate-600">Use your tracking ID from quote confirmation email.</p>

      <form onSubmit={handleTrack} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter tracking ID (e.g. PK1234567ABC)"
          className="flex-1 rounded-lg border border-slate-300 p-3 outline-none focus:border-[var(--brand-500)]"
          required
        />
        <button className="rounded-lg bg-[var(--brand-700)] px-5 py-3 font-semibold text-white" disabled={loading}>
          {loading ? "Checking..." : "Track"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-lg font-semibold text-emerald-700">Status: {result.status}</div>
          <div className="mt-2 text-sm text-slate-700">Tracking ID: {result.trackingId}</div>
          <div className="text-sm text-slate-700">From: {result.fromCity || "-"}</div>
          <div className="text-sm text-slate-700">To: {result.toCity || "-"}</div>
          <div className="text-sm text-slate-700">Last location: {result.lastLocation || "Processing"}</div>
          <div className="text-sm text-slate-700">ETA: {result.eta || "Will be updated shortly"}</div>
        </div>
      )}
    </section>
  );
}