import { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_KEY;

export default function QuoteForm(){
  const [form,setForm] = useState({
    name:"",
    phone:"",
    email:"",
    pickup:"",
    destination:"",
    vehicle:"Car",
    note:""
  });
  const [loading,setLoading] = useState(false);
  const [sent,setSent] = useState(false);
  const [error,setError] = useState(null);

  function handleChange(e){
    setForm(prev => ({...prev,[e.target.name]: e.target.value}));
  }

  function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError(null);

    // prepare template params - make sure template uses these variable names
    const templateParams = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      pickup: form.pickup,
      destination: form.destination,
      vehicle: form.vehicle,
      note: form.note
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((res)=>{
        setLoading(false);
        setSent(true);
        setForm({
          name:"", phone:"", email:"", pickup:"", destination:"", vehicle:"Car", note:""
        });
      })
      .catch((err)=>{
        setLoading(false);
        setError("Failed to send. Check console.");
        console.error("EmailJS error:", err);
      });
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-2xl mx-auto">
      {sent ? (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600">Quote sent!</h3>
          <p className="text-sm text-gray-600 mt-2">We will contact you soon on the provided phone/email.</p>
          <button onClick={()=>setSent(false)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Send another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Full name</label>
            <input required name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-3" placeholder="John Doe" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input required name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded p-3" placeholder="+91 98xxxx" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-3" placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Pickup City</label>
            <input name="pickup" value={form.pickup} onChange={handleChange} className="w-full border rounded p-3" placeholder="Delhi" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Destination City</label>
            <input name="destination" value={form.destination} onChange={handleChange} className="w-full border rounded p-3" placeholder="Mumbai" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Vehicle Type</label>
            <select name="vehicle" value={form.vehicle} onChange={handleChange} className="w-full border rounded p-3">
              <option>Car</option>
              <option>Bike</option>
              <option>Scooter</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Notes (optional)</label>
            <textarea name="note" value={form.note} onChange={handleChange} className="w-full border rounded p-3" placeholder="Any special instructions"></textarea>
          </div>

          <div className="md:col-span-2 flex items-center gap-4">
            <button disabled={loading} className="bg-blue-600 text-white px-5 py-3 rounded font-medium disabled:opacity-60">
              {loading ? "Sending..." : "Send Quote"}
            </button>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </form>
      )}
    </div>
  );
}