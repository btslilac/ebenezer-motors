import React, { useEffect, useState } from "react";
import {
  adminLogin,
  adminRegister,
  fetchAdminProfile,
  fetchContacts,
  fetchTradeIns,
  fetchHireRequests,
  updateContact,
  updateTradeIn,
  updateHireRequest
} from "../services/adminApi";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImages
} from "../services/vehicleApi";

const emptyVehicleForm = {
  name: "",
  brand: "",
  modelYear: "",
  price: "",
  hirePrice: "",
  hirePriceWeekly: "",
  fuelType: "",
  mileage: "",
  transmission: "",
  power: "",
  ccRating: "",
  color: "",
  chassisNo: "",
  engineNo: "",
  category: "",
  condition: "",
  description: "",
  features: "",
  images: "",
  isNewArrival: false,
  forHire: false
};

const toNumber = (value) => {
  if (value === "") {
    return undefined;
  }
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const buildVehiclePayload = (form, { includeImages }) => {
  const payload = {
    name: form.name,
    brand: form.brand,
    modelYear: toNumber(form.modelYear),
    price: toNumber(form.price),
    hirePrice: toNumber(form.hirePrice),
    hirePriceWeekly: toNumber(form.hirePriceWeekly),
    fuelType: form.fuelType,
    mileage: toNumber(form.mileage),
    transmission: form.transmission,
    power: form.power,
    ccRating: form.ccRating,
    color: form.color,
    chassisNo: form.chassisNo,
    engineNo: form.engineNo,
    category: form.category,
    condition: form.condition,
    description: form.description,
    features: form.features
      ? form.features.split(",").map((feature) => feature.trim()).filter(Boolean)
      : [],
    isNewArrival: Boolean(form.isNewArrival),
    forHire: Boolean(form.forHire)
  };

  if (includeImages && form.images) {
    payload.images = form.images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
};

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vehicles");

  const [vehicles, setVehicles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tradeIns, setTradeIns] = useState([]);
  const [hireRequests, setHireRequests] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState({ state: "idle", message: "" });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const hydrateAdmin = async () => {
      if (!token) {
        setAdmin(null);
        setAuthLoading(false);
        return;
      }
      try {
        const response = await fetchAdminProfile();
        if (isMounted) {
          setAdmin(response.admin);
          setAuthLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          localStorage.removeItem("adminToken");
          setToken("");
          setAdmin(null);
          setAuthLoading(false);
        }
      }
    };

    hydrateAdmin();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const loadDashboardData = async () => {
    try {
      setDashboardLoading(true);
      const [vehiclesRes, contactsRes, tradeRes, hireRes] = await Promise.all([
        getVehicles({ limit: 200 }),
        fetchContacts(),
        fetchTradeIns(),
        fetchHireRequests()
      ]);
      setVehicles(vehiclesRes?.data || []);
      setContacts(contactsRes?.data || []);
      setTradeIns(tradeRes?.data || []);
      setHireRequests(hireRes?.data || []);
      setDashboardError("");
    } catch (error) {
      setDashboardError(error.message || "Failed to load admin data.");
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const onLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setAdmin(null);
  };

  const onEditVehicle = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    setVehicleForm({
      name: vehicle.name || "",
      brand: vehicle.brand || "",
      modelYear: vehicle.modelYear || "",
      price: vehicle.price || "",
      hirePrice: vehicle.hirePrice || "",
      hirePriceWeekly: vehicle.hirePriceWeekly || "",
      fuelType: vehicle.fuelType || "",
      mileage: vehicle.mileage || "",
      transmission: vehicle.transmission || "",
      power: vehicle.power || "",
      ccRating: vehicle.ccRating || "",
      color: vehicle.color || "",
      chassisNo: vehicle.chassisNo || "",
      engineNo: vehicle.engineNo || "",
      category: vehicle.category || "",
      condition: vehicle.condition || "",
      description: vehicle.description || "",
      features: vehicle.features ? vehicle.features.join(", ") : "",
      images: "",
      isNewArrival: Boolean(vehicle.isNewArrival),
      forHire: Boolean(vehicle.forHire)
    });
  };

  const resetVehicleForm = () => {
    setEditingVehicleId(null);
    setVehicleForm(emptyVehicleForm);
    setImageFiles([]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface text-slate-500">
        Loading admin console...
      </div>
    );
  }

  if (!token) {
    return (
      <AdminAuth
        onAuth={(newToken, profile) => {
          localStorage.setItem("adminToken", newToken);
          setToken(newToken);
          setAdmin(profile);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-brand-primary">Admin Console</h1>
            <p className="text-sm text-slate-500">Manage inventory, inquiries, and hire requests.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              {admin ? `Signed in as ${admin.name}` : "Signed in"}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-brand-muted/60 px-4 py-2 text-sm font-semibold text-brand-primary hover:border-brand-accent"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
          <aside className="rounded-2xl border border-brand-muted/60 bg-white p-4 shadow-sm">
            {[
              { key: "vehicles", label: "Vehicles" },
              { key: "contacts", label: "Contact Messages" },
              { key: "tradeIns", label: "Trade-In Requests" },
              { key: "hire", label: "Hire Requests" }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`mb-2 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === item.key
                    ? "bg-brand-primary text-white"
                    : "bg-brand-surface text-brand-primary hover:bg-brand-muted/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </aside>

          <section className="space-y-6">
            {dashboardError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {dashboardError}
              </div>
            )}
            {dashboardLoading && (
              <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 text-sm text-slate-500">
                Loading dashboard data...
              </div>
            )}

            {!dashboardLoading && activeTab === "vehicles" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-heading font-semibold text-brand-primary">
                        {editingVehicleId ? "Edit Vehicle" : "Add Vehicle"}
                      </h2>
                      <p className="text-sm text-slate-500">Create new listings or update existing ones.</p>
                    </div>
                    {editingVehicleId && (
                      <button
                        type="button"
                        onClick={resetVehicleForm}
                        className="rounded-full border border-brand-muted/60 px-4 py-2 text-xs font-semibold text-brand-primary hover:border-brand-accent"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>

                  <form
                    className="grid gap-4 md:grid-cols-2"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      try {
                        setVehicleStatus({ state: "loading", message: "" });
                        if (editingVehicleId) {
                          const payload = buildVehiclePayload(vehicleForm, { includeImages: Boolean(vehicleForm.images) });
                          const response = await updateVehicle(editingVehicleId, payload);
                          setVehicles((prev) =>
                            prev.map((item) => (item._id === editingVehicleId ? response.data : item))
                          );
                        } else {
                          const payload = buildVehiclePayload(vehicleForm, { includeImages: true });
                          const response = await createVehicle(payload);
                          setVehicles((prev) => [response.data, ...prev]);
                        }
                        setVehicleStatus({ state: "success", message: "Vehicle saved." });
                        resetVehicleForm();
                      } catch (error) {
                        setVehicleStatus({ state: "error", message: error.message || "Unable to save vehicle." });
                      }
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Name"
                      value={vehicleForm.name}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, name: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Brand"
                      value={vehicleForm.brand}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, brand: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Model year"
                      value={vehicleForm.modelYear}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, modelYear: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={vehicleForm.price}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, price: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Hire price (daily)"
                      value={vehicleForm.hirePrice}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, hirePrice: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Hire price (weekly)"
                      value={vehicleForm.hirePriceWeekly}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, hirePriceWeekly: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Fuel type"
                      value={vehicleForm.fuelType}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, fuelType: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Mileage"
                      value={vehicleForm.mileage}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, mileage: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Transmission"
                      value={vehicleForm.transmission}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, transmission: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Power"
                      value={vehicleForm.power}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, power: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="CC rating"
                      value={vehicleForm.ccRating}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, ccRating: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={vehicleForm.color}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, color: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Chassis number"
                      value={vehicleForm.chassisNo}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, chassisNo: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Engine number"
                      value={vehicleForm.engineNo}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, engineNo: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={vehicleForm.category}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, category: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Condition"
                      value={vehicleForm.condition}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, condition: event.target.value })}
                      className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <textarea
                      rows="3"
                      placeholder="Description"
                      value={vehicleForm.description}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, description: event.target.value })}
                      className="md:col-span-2 w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Features (comma separated)"
                      value={vehicleForm.features}
                      onChange={(event) => setVehicleForm({ ...vehicleForm, features: event.target.value })}
                      className="md:col-span-2 w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                    />
                    {!editingVehicleId && (
                      <input
                        type="text"
                        placeholder="Image URLs (comma separated)"
                        value={vehicleForm.images}
                        onChange={(event) => setVehicleForm({ ...vehicleForm, images: event.target.value })}
                        className="md:col-span-2 w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
                      />
                    )}

                    <div className="md:col-span-2 flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={vehicleForm.isNewArrival}
                          onChange={(event) => setVehicleForm({ ...vehicleForm, isNewArrival: event.target.checked })}
                        />
                        Mark as new arrival
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={vehicleForm.forHire}
                          onChange={(event) => setVehicleForm({ ...vehicleForm, forHire: event.target.checked })}
                        />
                        Available for hire
                      </label>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        className="rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-accentLight"
                        disabled={vehicleStatus.state === "loading"}
                      >
                        {vehicleStatus.state === "loading" ? "Saving..." : editingVehicleId ? "Update vehicle" : "Add vehicle"}
                      </button>
                      {vehicleStatus.state === "success" && (
                        <span className="text-sm text-green-600">{vehicleStatus.message}</span>
                      )}
                      {vehicleStatus.state === "error" && (
                        <span className="text-sm text-red-600">{vehicleStatus.message}</span>
                      )}
                    </div>
                  </form>
                </div>

                {editingVehicleId && (
                  <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-heading font-semibold text-brand-primary mb-4">Upload Images</h3>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
                        className="w-full text-sm"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (imageFiles.length === 0) {
                            return;
                          }
                          try {
                            const response = await uploadVehicleImages(editingVehicleId, imageFiles);
                            setVehicles((prev) =>
                              prev.map((item) => (item._id === editingVehicleId ? response.data : item))
                            );
                            setImageFiles([]);
                          } catch (error) {
                            setVehicleStatus({ state: "error", message: error.message || "Upload failed." });
                          }
                        }}
                        className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-semibold text-brand-primary">Vehicle Inventory</h3>
                    <button
                      type="button"
                      onClick={loadDashboardData}
                      className="rounded-full border border-brand-muted/60 px-4 py-2 text-xs font-semibold text-brand-primary hover:border-brand-accent"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="space-y-3">
                    {vehicles.length === 0 && (
                      <div className="rounded-xl border border-dashed border-brand-muted/60 bg-brand-surface p-6 text-sm text-slate-500">
                        No vehicles yet.
                      </div>
                    )}
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle._id}
                        className="flex flex-col gap-3 rounded-xl border border-brand-muted/60 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-brand-primary">{vehicle.name}</p>
                          <p className="text-xs text-slate-500">
                            {vehicle.brand} • {vehicle.modelYear} • Ksh {vehicle.price?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onEditVehicle(vehicle)}
                            className="rounded-full border border-brand-muted/60 px-3 py-1 text-xs font-semibold text-brand-primary hover:border-brand-accent"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const confirmDelete = window.confirm("Delete this vehicle?");
                              if (!confirmDelete) return;
                              try {
                                await deleteVehicle(vehicle._id);
                                setVehicles((prev) => prev.filter((item) => item._id !== vehicle._id));
                              } catch (error) {
                                setVehicleStatus({
                                  state: "error",
                                  message: error.message || "Unable to delete vehicle."
                                });
                              }
                            }}
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!dashboardLoading && activeTab === "contacts" && (
              <AdminList
                title="Contact Messages"
                items={contacts}
                emptyMessage="No messages yet."
                renderItem={(item) => (
                  <AdminMessageCard
                    key={item._id}
                    title={item.name}
                    subtitle={item.email}
                    status={item.status}
                    body={item.message}
                    onStatusChange={async () => {
                      const response = await updateContact(item._id, { status: "read" });
                      setContacts((prev) => prev.map((entry) => (entry._id === item._id ? response.data : entry)));
                    }}
                    actionLabel="Mark as read"
                  />
                )}
              />
            )}

            {!dashboardLoading && activeTab === "tradeIns" && (
              <AdminList
                title="Trade-In Requests"
                items={tradeIns}
                emptyMessage="No trade-in requests yet."
                renderItem={(item) => (
                  <AdminMessageCard
                    key={item._id}
                    title={`${item.makeModel} (${item.year})`}
                    subtitle={`Mileage: ${item.mileage?.toLocaleString()} km • ${item.phone}`}
                    status={item.status}
                    body={`Condition: ${item.condition} • Contact: ${item.name}`}
                    onStatusChange={async () => {
                      const response = await updateTradeIn(item._id, { status: "contacted" });
                      setTradeIns((prev) => prev.map((entry) => (entry._id === item._id ? response.data : entry)));
                    }}
                    actionLabel="Mark as contacted"
                  />
                )}
              />
            )}

            {!dashboardLoading && activeTab === "hire" && (
              <AdminList
                title="Hire Requests"
                items={hireRequests}
                emptyMessage="No hire requests yet."
                renderItem={(item) => (
                  <AdminMessageCard
                    key={item._id}
                    title={item.vehicle?.name || "Vehicle"}
                    subtitle={`${item.name} • ${item.phone}`}
                    status={item.status}
                    body={`Dates: ${item.startDate ? new Date(item.startDate).toLocaleDateString() : "N/A"} - ${
                      item.endDate ? new Date(item.endDate).toLocaleDateString() : "N/A"
                    }`}
                    onStatusChange={async () => {
                      const response = await updateHireRequest(item._id, { status: "contacted" });
                      setHireRequests((prev) => prev.map((entry) => (entry._id === item._id ? response.data : entry)));
                    }}
                    actionLabel="Mark as contacted"
                  />
                )}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const AdminAuth = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [formState, setFormState] = useState({ name: "", email: "", password: "", registrationKey: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submit = async (event) => {
    event.preventDefault();
    try {
      setStatus({ state: "loading", message: "" });
      const payload = {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        registrationKey: formState.registrationKey
      };
      const response = mode === "register" ? await adminRegister(payload) : await adminLogin(payload);
      onAuth(response.token, response.admin);
    } catch (error) {
      setStatus({ state: "error", message: error.message || "Unable to authenticate." });
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-brand-muted/60 bg-white p-8 shadow-elevated">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-semibold text-brand-primary">Admin Access</h1>
          <p className="text-sm text-slate-500">Sign in to manage Ebenezer Motors.</p>
        </div>

        <div className="mb-6 flex gap-3 rounded-full bg-brand-surface p-1">
          {["login", "register"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === value ? "bg-brand-primary text-white" : "text-brand-primary"
              }`}
            >
              {value === "login" ? "Login" : "Create Admin"}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              value={formState.name}
              onChange={(event) => setFormState({ ...formState, name: event.target.value })}
              className="w-full rounded-full border border-brand-muted px-5 py-3 text-sm focus:border-brand-accent focus:outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={formState.email}
            onChange={(event) => setFormState({ ...formState, email: event.target.value })}
            className="w-full rounded-full border border-brand-muted px-5 py-3 text-sm focus:border-brand-accent focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formState.password}
            onChange={(event) => setFormState({ ...formState, password: event.target.value })}
            className="w-full rounded-full border border-brand-muted px-5 py-3 text-sm focus:border-brand-accent focus:outline-none"
            required
          />
          {mode === "register" && (
            <input
              type="text"
              placeholder="Registration key"
              value={formState.registrationKey}
              onChange={(event) => setFormState({ ...formState, registrationKey: event.target.value })}
              className="w-full rounded-full border border-brand-muted px-5 py-3 text-sm focus:border-brand-accent focus:outline-none"
              required
            />
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-accentLight"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Please wait..." : mode === "login" ? "Sign in" : "Create admin"}
          </button>
          {status.state === "error" && (
            <p className="text-sm text-red-600">{status.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

const AdminList = ({ title, items, emptyMessage, renderItem }) => {
  return (
    <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-brand-primary">{title}</h2>
        <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-slate-500">
          {items.length} total
        </span>
      </div>
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-brand-muted/60 bg-brand-surface p-6 text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
        {items.map(renderItem)}
      </div>
    </div>
  );
};

const AdminMessageCard = ({ title, subtitle, status, body, onStatusChange, actionLabel }) => {
  return (
    <div className="rounded-xl border border-brand-muted/60 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-primary">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-slate-500">
          {status}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{body}</p>
      <button
        type="button"
        onClick={onStatusChange}
        className="mt-4 rounded-full border border-brand-muted/60 px-4 py-2 text-xs font-semibold text-brand-primary hover:border-brand-accent"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default Admin;
