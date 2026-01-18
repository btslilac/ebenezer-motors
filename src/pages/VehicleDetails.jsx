import { useParams, Link } from "react-router-dom";
import { vehicles } from "../data/vehicles";

function VehicleDetails() {
  const { id } = useParams();

  const vehicle = vehicles.find((car) => car.id === id);

  if (!vehicle) {
    return (
      <div className="p-10">
        <h1 className="text-2xl">Vehicle not found</h1>
        <Link to="/inventory" className="text-blue-600 underline">
          Back to inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{vehicle.name}</h1>
      <p className="text-xl text-gray-700 mt-2">{vehicle.price}</p>

      <p className="mt-4 text-gray-600">{vehicle.description}</p>

      <Link
        to="/inventory"
        className="inline-block mt-6 text-blue-600 underline"
      >
        ← Back to inventory
      </Link>
    </div>
  );
}

export default VehicleDetails;
