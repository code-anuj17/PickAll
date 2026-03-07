import Tracking from "../components/Tracking";

export default function TrackPage(){
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Track your vehicle</h2>
        <Tracking />
      </div>
    </div>
  );
}