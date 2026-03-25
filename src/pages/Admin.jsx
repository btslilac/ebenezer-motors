import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  adminLogin,
  adminRegister,
  fetchAdminProfile,
  fetchContacts,
  fetchTradeIns,
  fetchHireRequests,
  updateContact,
  updateTradeIn,
  updateHireRequest,
  fetchFinancingClients,
  createFinancingClient,
  fetchFinancingRecords,
  createFinancingRecord,
  updateFinancingRecord,
  addFinancingPayment
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
      ? form.features.split("\n").map((feature) => feature.trim()).filter(Boolean)
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
  const [financingClients, setFinancingClients] = useState([]);
  const [financingRecords, setFinancingRecords] = useState([]);
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
      const [vehiclesRes, contactsRes, tradeRes, hireRes, finClientsRes, finRecordsRes] = await Promise.all([
        getVehicles({ limit: 200 }),
        fetchContacts(),
        fetchTradeIns(),
        fetchHireRequests(),
        fetchFinancingClients(),
        fetchFinancingRecords()
      ]);
      setVehicles(vehiclesRes?.data || []);
      setContacts(contactsRes?.data || []);
      setTradeIns(tradeRes?.data || []);
      setHireRequests(hireRes?.data || []);
      setFinancingClients(finClientsRes?.data || []);
      setFinancingRecords(finRecordsRes?.data || []);
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
      features: vehicle.features ? vehicle.features.join("\n") : "",
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

        <div className="flex flex-col gap-6">
          <aside className="flex gap-2 overflow-x-auto overflow-y-hidden rounded-2xl border border-brand-muted/60 bg-white p-4 shadow-sm scrollbar-hide">
            {[
              { key: "vehicles", label: "Vehicles" },
              { key: "contacts", label: "Contact Messages" },
              { key: "tradeIns", label: "Trade-In Requests" },
              { key: "hire", label: "Hire Requests" },
              { key: "financing", label: "Financing" }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`flex-1 whitespace-nowrap rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${activeTab === item.key
                  ? "bg-brand-primary text-blue-500"
                  : "bg-brand-surface text-brand-primary hover:bg-blue-muted/40"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </aside>
          {/* Vehicle Dashboard Section */}
          <section className="space-y-6">
            {dashboardError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {dashboardError}
              </div>
            )}
            {dashboardLoading && (
              <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 text-sm text-black">
                Loading dashboard data...
              </div>
            )}

            {!dashboardLoading && activeTab === "vehicles" && (
              <div className="space-y-6">
                <CollapsibleSection
                  title={editingVehicleId ? "Edit Vehicle" : "Add Vehicle"}
                  description="Create new listings."
                  defaultOpen={true}
                  actionButton={
                    editingVehicleId ? (
                      <button
                        type="button"
                        onClick={resetVehicleForm}
                        className="rounded-full border border-brand-muted/60 px-4 py-2 text-xs font-semibold text-brand-primary hover:border-brand-accent transition-colors bg-white hover:bg-slate-50"
                      >
                        Cancel edit
                      </button>
                    ) : null
                  }
                >
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
                    <textarea
                      rows="3"
                      placeholder="Features (press Enter for a new feature)"
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
                </CollapsibleSection>

                {editingVehicleId && (
                  <CollapsibleSection
                    title="Upload Images"
                    defaultOpen={true}
                  >
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
                  </CollapsibleSection>
                )}

                <CollapsibleSection
                  title="Vehicle Inventory"
                  defaultOpen={true}
                  actionButton={
                    <button
                      type="button"
                      onClick={loadDashboardData}
                      className="rounded-full border border-brand-muted/60 px-4 py-2 text-xs font-semibold text-brand-primary hover:border-brand-accent transition-colors bg-white hover:bg-slate-50"
                    >
                      Refresh
                    </button>
                  }
                >
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
                </CollapsibleSection>
              </div>
            )}
            {/* Contact Dashboard Section */}

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
                    body={`Dates: ${item.startDate ? new Date(item.startDate).toLocaleDateString() : "N/A"} - ${item.endDate ? new Date(item.endDate).toLocaleDateString() : "N/A"
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

            {!dashboardLoading && activeTab === "financing" && (
              <FinancingTab
                vehicles={vehicles}
                clients={financingClients}
                records={financingRecords}
                onClientCreated={(c) => setFinancingClients((prev) => [c, ...prev])}
                onRecordCreated={(r) => setFinancingRecords((prev) => [r, ...prev])}
                onRecordUpdated={(r) =>
                  setFinancingRecords((prev) => prev.map((x) => (x._id === r._id ? r : x)))
                }
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
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === value ? "bg-brand-primary text-white" : "text-brand-primary"
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

const CollapsibleSection = ({ title, description, children, defaultOpen = false, actionButton }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-brand-muted/60 bg-white shadow-sm overflow-hidden transition-all duration-300">
      <div
        className="flex items-center justify-between p-6 cursor-pointer bg-white hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="text-xl font-heading font-semibold text-brand-primary">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-4">
          {actionButton && (
            <div onClick={(e) => e.stopPropagation()}>
              {actionButton}
            </div>
          )}
          <div className={`p-2 rounded-full border border-brand-muted/60 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 bg-slate-50" : "bg-white"}`}>
            <ChevronDown className="w-5 h-5 text-brand-primary" />
          </div>
        </div>
      </div>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="p-6 pt-0 border-t border-brand-muted/20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminList = ({ title, items, emptyMessage, renderItem }) => {
  return (
    <CollapsibleSection
      title={title}
      defaultOpen={true}
      actionButton={
        <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-slate-500">
          {items.length} total
        </span>
      }
    >
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-brand-muted/60 bg-brand-surface p-6 text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
        {items.map(renderItem)}
      </div>
    </CollapsibleSection>
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
        <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
          status?.toLowerCase() === 'read' 
            ? 'bg-red-500 text-white shadow-sm' 
            : status?.toLowerCase() === 'unread' 
            ? 'bg-brand-accent text-white shadow-sm'
            : 'bg-brand-surface text-slate-500'
        }`}>
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

// ── Financing Tab ─────────────────────────────────────────────────────────────

const emptyClientForm = { fullName: "", phone: "", email: "", idNumber: "", address: "", notes: "" };
const emptyRecordForm = {
  clientId: "", vehicleId: "", vehicleName: "", vehiclePrice: "",
  downPayment: "", financedAmount: "", monthlyInstalment: "", durationMonths: "",
  startDate: "", notes: ""
};

const FinancingTab = ({ vehicles, clients, records, onClientCreated, onRecordCreated, onRecordUpdated }) => {
  const [clientForm, setClientForm] = useState(emptyClientForm);
  const [clientStatus, setClientStatus] = useState({ state: "idle", message: "" });

  const [recordForm, setRecordForm] = useState(emptyRecordForm);
  const [recordStatus, setRecordStatus] = useState({ state: "idle", message: "" });

  const [paymentModal, setPaymentModal] = useState(null); // { record }
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentStatus, setPaymentStatus] = useState({ state: "idle", message: "" });

  const [clientSearch, setClientSearch] = useState("");

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalFinanced = records.reduce((sum, r) => sum + (r.financedAmount || 0), 0);
  const activeDeals = records.filter((r) => r.status === "active").length;
  const totalPaidOut = records.reduce((sum, r) => {
    const paid = (r.payments || []).reduce((s, p) => s + p.amount, 0);
    return sum + paid;
  }, 0);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getRemaining = (r) => {
    const paid = (r.payments || []).reduce((s, p) => s + p.amount, 0);
    return Math.max(0, (r.financedAmount || 0) - paid);
  };
  const getAmountPaid = (r) => (r.payments || []).reduce((s, p) => s + p.amount, 0);

  const filteredClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.phone.includes(clientSearch)
  );

  // Auto-fill vehicle details when vehicle is selected
  const handleVehicleSelect = (vehicleId) => {
    const v = vehicles.find((v) => v._id === vehicleId);
    if (v) {
      setRecordForm((prev) => ({
        ...prev,
        vehicleId: v._id,
        vehicleName: v.name,
        vehiclePrice: v.price || "",
        financedAmount: prev.downPayment
          ? String(Math.max(0, (v.price || 0) - Number(prev.downPayment)))
          : String(v.price || "")
      }));
    } else {
      setRecordForm((prev) => ({ ...prev, vehicleId: "", vehicleName: "", vehiclePrice: "" }));
    }
  };

  const handleDownPaymentChange = (val) => {
    const dp = Number(val) || 0;
    const vp = Number(recordForm.vehiclePrice) || 0;
    setRecordForm((prev) => ({
      ...prev,
      downPayment: val,
      financedAmount: vp ? String(Math.max(0, vp - dp)) : prev.financedAmount
    }));
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      setClientStatus({ state: "loading", message: "" });
      const res = await createFinancingClient(clientForm);
      onClientCreated(res.data);
      setClientForm(emptyClientForm);
      setClientStatus({ state: "success", message: "Client added!" });
    } catch (err) {
      setClientStatus({ state: "error", message: err.message || "Failed to add client." });
    }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      setRecordStatus({ state: "loading", message: "" });
      const payload = {
        client: recordForm.clientId,
        vehicle: recordForm.vehicleId || undefined,
        vehicleName: recordForm.vehicleName,
        vehiclePrice: Number(recordForm.vehiclePrice),
        downPayment: Number(recordForm.downPayment) || 0,
        financedAmount: Number(recordForm.financedAmount),
        monthlyInstalment: Number(recordForm.monthlyInstalment) || undefined,
        durationMonths: Number(recordForm.durationMonths) || undefined,
        startDate: recordForm.startDate || undefined,
        notes: recordForm.notes || undefined
      };
      const res = await createFinancingRecord(payload);
      onRecordCreated(res.data);
      setRecordForm(emptyRecordForm);
      setRecordStatus({ state: "success", message: "Financing record created!" });
    } catch (err) {
      setRecordStatus({ state: "error", message: err.message || "Failed to create record." });
    }
  };

  const handleLogPayment = async () => {
    const amt = Number(paymentAmount);
    if (!amt || amt <= 0) {
      setPaymentStatus({ state: "error", message: "Enter a valid amount." });
      return;
    }
    try {
      setPaymentStatus({ state: "loading", message: "" });
      const res = await addFinancingPayment(paymentModal.record._id, { amount: amt, note: paymentNote });
      onRecordUpdated(res.data);
      setPaymentModal(null);
      setPaymentAmount("");
      setPaymentNote("");
      setPaymentStatus({ state: "idle", message: "" });
    } catch (err) {
      setPaymentStatus({ state: "error", message: err.message || "Payment failed." });
    }
  };

  const handleStatusChange = async (record, status) => {
    try {
      const res = await updateFinancingRecord(record._id, { status });
      onRecordUpdated(res.data);
    } catch (_) {}
  };

  const statusBadge = (status) => {
    const map = {
      active: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      defaulted: "bg-red-100 text-red-700"
    };
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${map[status] || "bg-slate-100 text-slate-500"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Clients", value: clients.length },
          { label: "Active Deals", value: activeDeals },
          { label: "Total Financed", value: `Ksh ${totalFinanced.toLocaleString()}` },
          { label: "Total Collected", value: `Ksh ${totalPaidOut.toLocaleString()}` }
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-brand-muted/60 bg-white p-5 shadow-sm text-center">
            <p className="text-2xl font-bold text-brand-primary">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Add Client ─────────────────────────────────────────────────────── */}
      <CollapsibleSection title="Add Financing Client" description="Register a new client." defaultOpen={false}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleClientSubmit}>
          <input required placeholder="Full name" value={clientForm.fullName}
            onChange={(e) => setClientForm({ ...clientForm, fullName: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input required placeholder="Phone number" value={clientForm.phone}
            onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input placeholder="Email" value={clientForm.email}
            onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input placeholder="ID / Passport number" value={clientForm.idNumber}
            onChange={(e) => setClientForm({ ...clientForm, idNumber: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input placeholder="Address" value={clientForm.address}
            onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
            className="md:col-span-2 w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <textarea rows={2} placeholder="Notes" value={clientForm.notes}
            onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
            className="md:col-span-2 w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <div className="md:col-span-2 flex items-center gap-4">
            <button type="submit" disabled={clientStatus.state === "loading"}
              className="rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white hover:bg-brand-accentLight transition">
              {clientStatus.state === "loading" ? "Saving..." : "Add Client"}
            </button>
            {clientStatus.state === "success" && <span className="text-sm text-green-600">{clientStatus.message}</span>}
            {clientStatus.state === "error" && <span className="text-sm text-red-600">{clientStatus.message}</span>}
          </div>
        </form>
      </CollapsibleSection>

      {/* ── Add Financing Record ────────────────────────────────────────────── */}
      <CollapsibleSection title="New Financing Deal" description="Link a client to a vehicle and set payment terms." defaultOpen={false}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleRecordSubmit}>
          {/* Client selector */}
          <select required value={recordForm.clientId}
            onChange={(e) => setRecordForm({ ...recordForm, clientId: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none bg-white">
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>{c.fullName} — {c.phone}</option>
            ))}
          </select>
          {/* Vehicle selector */}
          <select value={recordForm.vehicleId} onChange={(e) => handleVehicleSelect(e.target.value)}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none bg-white">
            <option value="">Select vehicle (optional)</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>{v.name} — Ksh {v.price?.toLocaleString()}</option>
            ))}
          </select>
          <input required placeholder="Vehicle name" value={recordForm.vehicleName}
            onChange={(e) => setRecordForm({ ...recordForm, vehicleName: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input required type="number" placeholder="Vehicle price (Ksh)" value={recordForm.vehiclePrice}
            onChange={(e) => setRecordForm({ ...recordForm, vehiclePrice: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input type="number" placeholder="Down payment (Ksh)" value={recordForm.downPayment}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input required type="number" placeholder="Financed amount (Ksh)" value={recordForm.financedAmount}
            onChange={(e) => setRecordForm({ ...recordForm, financedAmount: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input type="number" placeholder="Monthly instalment (Ksh)" value={recordForm.monthlyInstalment}
            onChange={(e) => setRecordForm({ ...recordForm, monthlyInstalment: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input type="number" placeholder="Duration (months)" value={recordForm.durationMonths}
            onChange={(e) => setRecordForm({ ...recordForm, durationMonths: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <input type="date" placeholder="Start date" value={recordForm.startDate}
            onChange={(e) => setRecordForm({ ...recordForm, startDate: e.target.value })}
            className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <textarea rows={2} placeholder="Notes" value={recordForm.notes}
            onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
            className="md:col-span-2 w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none" />
          <div className="md:col-span-2 flex items-center gap-4">
            <button type="submit" disabled={recordStatus.state === "loading"}
              className="rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white hover:bg-brand-accentLight transition">
              {recordStatus.state === "loading" ? "Creating..." : "Create Deal"}
            </button>
            {recordStatus.state === "success" && <span className="text-sm text-green-600">{recordStatus.message}</span>}
            {recordStatus.state === "error" && <span className="text-sm text-red-600">{recordStatus.message}</span>}
          </div>
        </form>
      </CollapsibleSection>

      {/* ── Clients List ───────────────────────────────────────────────────── */}
      <CollapsibleSection
        title="Financing Clients"
        defaultOpen={true}
        actionButton={
          <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-slate-500">
            {clients.length} total
          </span>
        }
      >
        <div className="space-y-3">
          <input placeholder="Search by name or phone…" value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            className="w-full rounded-xl border border-brand-muted px-4 py-2 text-sm focus:border-brand-accent focus:outline-none" />
          {filteredClients.length === 0 && (
            <div className="rounded-xl border border-dashed border-brand-muted/60 bg-brand-surface p-6 text-sm text-slate-500">
              No clients found.
            </div>
          )}
          {filteredClients.map((c) => (
            <div key={c._id} className="rounded-xl border border-brand-muted/60 bg-white p-4">
              <p className="text-sm font-semibold text-brand-primary">{c.fullName}</p>
              <p className="text-xs text-slate-500">{c.phone}{c.email ? ` • ${c.email}` : ""}{c.idNumber ? ` • ID: ${c.idNumber}` : ""}</p>
              {c.address && <p className="text-xs text-slate-400 mt-0.5">{c.address}</p>}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* ── Financing Records ──────────────────────────────────────────────── */}
      <CollapsibleSection
        title="Financing Records"
        defaultOpen={true}
        actionButton={
          <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-slate-500">
            {records.length} total
          </span>
        }
      >
        <div className="space-y-3">
          {records.length === 0 && (
            <div className="rounded-xl border border-dashed border-brand-muted/60 bg-brand-surface p-6 text-sm text-slate-500">
              No financing deals yet.
            </div>
          )}
          {records.map((r) => {
            const amtPaid = getAmountPaid(r);
            const remaining = getRemaining(r);
            const progress = r.financedAmount > 0 ? Math.min(100, (amtPaid / r.financedAmount) * 100) : 0;
            return (
              <div key={r._id} className="rounded-xl border border-brand-muted/60 bg-white p-4 space-y-3">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brand-primary">
                      {r.client?.fullName || "Unknown Client"} — {r.vehicleName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {r.client?.phone} • Started {r.startDate ? new Date(r.startDate).toLocaleDateString() : "N/A"}
                      {r.durationMonths ? ` • ${r.durationMonths} months` : ""}
                    </p>
                  </div>
                  {statusBadge(r.status)}
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div className="rounded-lg bg-brand-surface p-2 text-center">
                    <p className="font-bold text-brand-primary">Ksh {r.financedAmount?.toLocaleString()}</p>
                    <p className="text-slate-500">Financed</p>
                  </div>
                  <div className="rounded-lg bg-brand-surface p-2 text-center">
                    <p className="font-bold text-green-600">Ksh {amtPaid.toLocaleString()}</p>
                    <p className="text-slate-500">Paid</p>
                  </div>
                  <div className="rounded-lg bg-brand-surface p-2 text-center">
                    <p className={`font-bold ${remaining > 0 ? "text-orange-500" : "text-green-600"}`}>
                      Ksh {remaining.toLocaleString()}
                    </p>
                    <p className="text-slate-500">Remaining</p>
                  </div>
                  <div className="rounded-lg bg-brand-surface p-2 text-center">
                    <p className="font-bold text-brand-primary">
                      {r.monthlyInstalment ? `Ksh ${r.monthlyInstalment.toLocaleString()}` : "—"}
                    </p>
                    <p className="text-slate-500">Monthly</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-accent to-green-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 text-right">{progress.toFixed(1)}% paid</p>

                {/* Payment history */}
                {r.payments && r.payments.length > 0 && (
                  <div className="rounded-lg border border-brand-muted/40 bg-brand-surface/50 p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Payment History ({r.payments.length})</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {[...r.payments].reverse().map((p) => (
                        <div key={p._id} className="flex justify-between text-xs text-slate-600">
                          <span>{new Date(p.date).toLocaleDateString()}{p.note ? ` — ${p.note}` : ""}</span>
                          <span className="font-semibold text-green-600">+Ksh {p.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {r.status !== "completed" && (
                    <button
                      type="button"
                      onClick={() => { setPaymentModal({ record: r }); setPaymentAmount(""); setPaymentNote(""); setPaymentStatus({ state: "idle", message: "" }); }}
                      className="rounded-full bg-brand-accent px-4 py-2 text-xs font-semibold text-white hover:bg-brand-accentLight transition"
                    >
                      💳 Log Payment
                    </button>
                  )}
                  {r.status === "active" && (
                    <button type="button" onClick={() => handleStatusChange(r, "completed")}
                      className="rounded-full border border-green-300 px-4 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 transition">
                      Mark Completed
                    </button>
                  )}
                  {r.status === "active" && (
                    <button type="button" onClick={() => handleStatusChange(r, "defaulted")}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition">
                      Mark Defaulted
                    </button>
                  )}
                  {r.status !== "active" && (
                    <button type="button" onClick={() => handleStatusChange(r, "active")}
                      className="rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* ── Log Payment Modal ──────────────────────────────────────────────── */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setPaymentModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="text-lg font-heading font-semibold text-brand-primary">Log Payment</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {paymentModal.record.client?.fullName} — {paymentModal.record.vehicleName}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Remaining balance: <span className="font-semibold text-orange-500">
                  Ksh {getRemaining(paymentModal.record).toLocaleString()}
                </span>
              </p>
            </div>
            <input
              type="number"
              placeholder="Amount paid (Ksh)"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
              autoFocus
            />
            <input
              placeholder="Note (optional, e.g. 'March instalment')"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="w-full rounded-xl border border-brand-muted px-4 py-3 text-sm focus:border-brand-accent focus:outline-none"
            />
            {paymentStatus.state === "error" && (
              <p className="text-sm text-red-600">{paymentStatus.message}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleLogPayment}
                disabled={paymentStatus.state === "loading"}
                className="flex-1 rounded-full bg-brand-accent py-3 text-sm font-semibold text-white hover:bg-brand-accentLight transition"
              >
                {paymentStatus.state === "loading" ? "Saving…" : "Confirm Payment"}
              </button>
              <button
                type="button"
                onClick={() => setPaymentModal(null)}
                className="rounded-full border border-brand-muted/60 px-5 py-3 text-sm font-semibold text-brand-primary hover:border-brand-accent transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
