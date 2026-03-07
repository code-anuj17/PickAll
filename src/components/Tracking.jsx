import { useState } from "react";

export default function Tracking(){
  const [id,setId] = useState("");
  const [result,setResult] = useState(null);

  const handleTrack = (e)=>{
    e.preventDefault();
    // Since no backend here, we'll mock result.
    // Replace this with real API call if you add backend.
    setResult({
      id,
      status: "In transit",
      lastLocation: "Nagpur",
      eta: "2 days"
    });
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h3 className="text-xl font-semibold mb-4">Track shipment</h3>

      <form onSubmit={handleTrack} className="flex gap-3">
        <input value={id} onChange={(e)=>setId(e.target.value)} placeholder="Enter tracking ID" className="flex-1 border p-3 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Track</button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <div className="font-semibold">Status: {result.status}</div>
          <div className="text-sm text-gray-600">Last location: {result.lastLocation}</div>
          <div className="text-sm text-gray-600">ETA: {result.eta}</div>
        </div>
      )}
    </section>
  );
}