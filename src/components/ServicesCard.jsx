export default function ServicesCard({title, desc, icon}){
  return (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </div>
  );
}