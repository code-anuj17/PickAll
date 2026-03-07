import { Link } from "react-router-dom";

export default function Hero(){
  return (
    <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-10">
        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Reliable vehicle transport across India
          </h1>
          <p className="mt-4 text-lg text-blue-100/90 max-w-2xl">
            Door-to-door car and bike transport, full tracking, insured carriers and verified drivers.
          </p>

          <div className="mt-6 flex gap-4">
            <Link to="/get-a-quote" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow">Get a Quote</Link>
            <Link to="/track" className="border border-white/40 px-6 py-3 rounded-lg">Track Shipment</Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          {/* example card: put an illustration image if you want */}
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <h3 className="font-semibold mb-2">Instant Quote Preview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 p-3 rounded">
                <div className="text-xs">Car</div>
                <div className="font-bold">₹ 6,200</div>
              </div>
              <div className="bg-white/20 p-3 rounded">
                <div className="text-xs">Bike</div>
                <div className="font-bold">₹ 2,200</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-blue-100/80">Prices vary with distance and type of carrier — request an exact quote to confirm.</p>
          </div>
        </div>
      </div>
    </section>
  );
}