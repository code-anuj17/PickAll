export default function HowItWorks(){
  const steps = [
    {title: "Request Quote", desc: "Fill the form or call us."},
    {title: "Pickup", desc: "We collect your vehicle safely."},
    {title: "Transport", desc: "Tracked carriers across routes."},
    {title: "Delivery", desc: "Delivered at your doorstep."},
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <h3 className="text-2xl font-bold mb-6">How it works</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {steps.map((s,i)=>(
          <div key={i} className="bg-white p-6 rounded-2xl shadow text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center font-bold mb-3">{i+1}</div>
            <h4 className="font-semibold">{s.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}