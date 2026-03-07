import ServicesCard from "../components/ServicesCard";

export default function ServicesPage(){
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServicesCard title="Car Transport" desc="Covered carriers & insurance." icon={<span>🚗</span>} />
        <ServicesCard title="Bike Transport" desc="Safe folding & pickup." icon={<span>🏍️</span>} />
        <ServicesCard title="Commercial Logistics" desc="Large vehicle shippers." icon={<span>🚚</span>} />
      </div>
    </section>
  );
}