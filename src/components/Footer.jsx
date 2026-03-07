import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-semibold">MyTransport Clone</div>
          <div className="text-sm text-gray-600">Reliable vehicle transport across India</div>
        </div>

        <div className="flex gap-4">
          <Link to="/contact" className="text-sm text-gray-700">Contact</Link>
          <Link to="/get-a-quote" className="text-sm text-gray-700">Get a Quote</Link>
        </div>

        <div className="text-sm text-gray-500">© {new Date().getFullYear()} MyTransport Clone</div>
      </div>
    </footer>
  );
}