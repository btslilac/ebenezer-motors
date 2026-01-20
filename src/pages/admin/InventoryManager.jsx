import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Car, Image as ImageIcon, Trash2, RefreshCw, Upload } from 'lucide-react';

const InventoryManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New State for Uploading Status
  const [uploading, setUploading] = useState(false);

  // API Base URL (Ensure your backend is running on port 5000)
  const API_URL = "http://localhost:5000/api/vehicles";
  const UPLOAD_URL = "http://localhost:5000/api/upload";

  // Initial Form State
  const initialFormState = {
    name: "", brand: "", modelYear: new Date().getFullYear(), price: "",
    category: "Family", condition: "Foreign Used",
    chassisNo: "", engineNo: "", color: "", ccRating: "",
    mileage: "", fuelType: "Petrol", transmission: "Automatic", power: "",
    description: "", features: "", images: "" 
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. FETCH DATA FROM API ---
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setVehicles(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Could not load inventory. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- NEW: HANDLE IMAGE UPLOAD ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      // Automatically set the image URL in the form
      setFormData(prev => ({ ...prev, images: result.url }));
      alert("✅ Image Uploaded Successfully!");
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // --- 2. ADD VEHICLE (POST) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newVehiclePayload = {
      ...formData,
      price: Number(formData.price),
      mileage: Number(formData.mileage),
      modelYear: Number(formData.modelYear),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ""),
      // Use the uploaded image URL
      images: formData.images ? [formData.images] : [], 
      isNewArrival: true
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehiclePayload)
      });

      if (!response.ok) throw new Error("Failed to add vehicle");
      
      const savedVehicle = await response.json();
      setVehicles([savedVehicle, ...vehicles]); 
      setIsFormOpen(false);
      setFormData(initialFormState);
      alert("✅ Vehicle Added Successfully!");

    } catch (err) {
      alert("Error adding vehicle: " + err.message);
    }
  };

  // --- 3. DELETE VEHICLE (DELETE) ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this vehicle?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Failed to delete vehicle");

      setVehicles(vehicles.filter(v => v._id !== id));
      alert("Vehicle deleted.");

    } catch (err) {
      alert("Error deleting vehicle: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-500">Live Database Connection</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchVehicles} className="bg-white p-2 rounded-lg border hover:bg-gray-50 text-gray-600" title="Refresh">
                <RefreshCw size={20} />
            </button>
            <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
                <Plus size={18} /> Add Vehicle
            </button>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && <div className="text-center py-10">Loading inventory from database...</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      {/* Vehicle List */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                        <th className="p-4">Vehicle</th>
                        <th className="p-4">Identifiers</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {vehicles.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No vehicles in database yet. Click "Add Vehicle" to start.</td></tr>
                    ) : (
                        vehicles.map(v => (
                            <tr key={v._id} className="hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img 
                                      src={v.images?.[0] || "https://via.placeholder.com/150"} 
                                      alt="" 
                                      className="w-12 h-12 rounded object-cover bg-gray-200" 
                                    />
                                    <div>
                                        <div className="font-bold text-gray-900">{v.name}</div>
                                        <div className="text-xs text-gray-500">{v.condition} • {v.modelYear}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <div>VIN: {v.chassisNo || "N/A"}</div>
                                    <div>Eng: {v.engineNo || "N/A"}</div>
                                </td>
                                <td className="p-4 font-mono font-medium">Ksh {v.price?.toLocaleString()}</td>
                                <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{v.category}</span></td>
                                <td className="p-4">
                                    <button onClick={() => handleDelete(v._id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      )}

      {/* --- ADD VEHICLE MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center bg-brand-primary text-gray rounded-t-xl">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Car /> Add New Vehicle</h2>
                    <button onClick={() => setIsFormOpen(false)}><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* 1. Basic Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wide">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Vehicle Name</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g. 2021 Toyota Prado" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Brand</label>
                                <select name="brand" value={formData.brand} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="">Select...</option>
                                    <option>Toyota</option><option>Mercedes</option><option>Nissan</option><option>Subaru</option><option>Land Rover</option><option>Mitsubishi</option><option>Ford</option><option>Mazda</option><option>Cadillac</option><option>Chevrolet</option><option>Suzuki</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (Ksh)</label>
                                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Legal Identifiers */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-4 uppercase text-sm tracking-wide">Legal Identifiers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Chassis No</label>
                                <input required name="chassisNo" value={formData.chassisNo} onChange={handleChange} className="w-full border p-2 rounded" placeholder="TRJ150..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Engine No</label>
                                <input required name="engineNo" value={formData.engineNo} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Color</label>
                                <input required name="color" value={formData.color} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">CC Rating</label>
                                <input required name="ccRating" value={formData.ccRating} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* 3. Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                            <input name="mileage" value={formData.mileage} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Fuel Type</label>
                            <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full border p-2 rounded">
                                <option>Petrol</option><option>Diesel</option><option>Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full border p-2 rounded">
                                <option>Automatic</option><option>Manual</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border p-2 rounded">
                                <option>Foreign Used</option><option>Locally Used</option><option>New</option><option>Restored</option>
                            </select>
                        </div>
                    </div>

                    {/* 4. Details & Media (UPDATED) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                        <input name="features" value={formData.features} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Sunroof, Leather Seats, 4WD..." />
                    </div>
                    
                    {/* NEW IMAGE UPLOAD SECTION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Image</label>
                        <div className="flex gap-2 items-center">
                             <input 
                                name="images" 
                                value={formData.images} 
                                onChange={handleChange} 
                                className="w-full border p-2 rounded bg-gray-50" 
                                placeholder="Image URL will appear here after upload..." 
                                readOnly
                             />
                             <label className="flex items-center gap-2 cursor-pointer bg-brand-accent text-white px-4 py-2 rounded hover:bg-slate-700">
                                <Upload size={18} />
                                {uploading ? "Uploading..." : "Upload"}
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                             </label>
                        </div>
                        {formData.images && (
                            <img src={formData.images} alt="Preview" className="h-20 w-auto mt-2 rounded border" />
                        )}
                    </div>

                    <div>
                         <label className="block text-sm font-medium mb-1">Description</label>
                         <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded h-24"></textarea>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-3">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" disabled={uploading} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 flex items-center gap-2">
                            <Save size={18} /> {uploading ? "Wait..." : "Save to Database"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;