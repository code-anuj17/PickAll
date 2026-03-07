export default function ContactPage(){
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="mb-6 text-gray-600">For bulk bookings and corporate enquiries, email us at <span className="font-medium">{import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com"}</span></p>
        <div className="bg-white p-6 rounded shadow">
          <h4 className="font-semibold">Office Address</h4>
          <p className="text-sm text-gray-600 mt-2">123 Transport Lane, City</p>
        </div>
      </div>
    </section>
  );
}