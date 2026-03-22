import ServicesCard from "./ServicesCard";

function Services() {
  const services = [
    {
      title: "Car Transport",
      desc: "Safe and secure car transport across India.",
      icon: "🚗",
    },
    {
      title: "Bike Transport",
      desc: "Door to door bike and scooter delivery.",
      icon: "🏍️",
    },
    {
      title: "Other Transport",
      desc: "Custom transport for all other vehicle and special-case requirements.",
      icon: "🚚",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">

          {services.map((service, i) => (
            <ServicesCard
              key={i}
              title={service.title}
              desc={service.desc}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;