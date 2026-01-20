import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, DollarSign, AlertCircle, CheckCircle, X, FileText, Send, Fingerprint, CalendarClock, User, Wallet, History } from 'lucide-react';

// --- HELPER FUNCTIONS ---
const calculateNextDueDate = (frequency, fromDate = new Date()) => {
  const next = new Date(fromDate);
  if (frequency === "weekly") {
    next.setDate(next.getDate() + 7);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString().split("T")[0];
};

const FinancingDashboard = () => {
  // --- STATE ---
  const [agreements, setAgreements] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false); 
  
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // New Plan Form State
  const initialFormState = {
    customerName: "", phone: "", vehicleId: "",
    identificationNo: "", address: "", occupation: "", 
    chassisNo: "", engineNo: "", color: "", ccRating: "",
    totalAmount: "", deposit: "", months: "12", paymentFrequency: "monthly",
    agreementDate: new Date().toISOString().split("T")[0],
    agreementFile: null // Stores the file object
  };
  const [newPlan, setNewPlan] = useState(initialFormState);

  // --- API URLS ---
  const API_URL = "http://localhost:5000/api/financing";
  const VEHICLE_API = "http://localhost:5000/api/vehicles";

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agreementsRes, vehiclesRes] = await Promise.all([
            fetch(API_URL),
            fetch(VEHICLE_API)
        ]);
        
        const agreementsData = await agreementsRes.json();
        const vehiclesData = await vehiclesRes.json();

        setAgreements(agreementsData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CALCULATIONS ---
  const financials = useMemo(() => {
    let totalDeposits = 0;
    let monthlyInstallmentsCollected = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    agreements.forEach(agreement => {
        if(agreement.paymentHistory) {
            agreement.paymentHistory.forEach(payment => {
                const payDate = new Date(payment.date);
                if (payment.type === 'Deposit') totalDeposits += payment.amount;
                if (payment.type === 'Installment' && 
                    payDate.getMonth() === currentMonth && 
                    payDate.getFullYear() === currentYear) {
                    monthlyInstallmentsCollected += payment.amount;
                }
            });
        }
    });
    return { totalDeposits, monthlyInstallmentsCollected };
  }, [agreements]);

  const getPenaltyData = (agreement) => {
    if (agreement.status !== 'Overdue') return { penalty: 0, isDue: false };
    if (!agreement.installmentsCount || agreement.installmentsCount === 0) return { penalty: 0, isDue: false };
    
    const installmentAmt = (agreement.totalAmount - agreement.deposit) / agreement.installmentsCount;
    return { penalty: Math.round(installmentAmt * 0.20), isDue: true };
  };

  // --- ACTIONS ---

  // Handle New Plan Creation (POST with FormData)
  const handleNewPlanSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!newPlan.vehicleId) {
        alert("Please select a vehicle.");
        return;
    }

    // 2. Enforce 20% Deposit Rule (Frontend Check)
    const minDeposit = Number(newPlan.totalAmount) * 0.2;
    if (Number(newPlan.deposit) < minDeposit) {
        alert(`Deposit too low! Minimum required is Ksh ${minDeposit.toLocaleString()} (20%)`);
        return;
    }

    const selectedVehicle = vehicles.find(v => v._id === newPlan.vehicleId);
    
    // Calculate Installments
    const installmentsCount = newPlan.paymentFrequency === "weekly" 
        ? Number(newPlan.months) * 4 
        : Number(newPlan.months);

    // 3. Create FormData (Required for File Upload)
    const formData = new FormData();
    
    // Append simple fields
    formData.append('customerName', newPlan.customerName);
    formData.append('phone', newPlan.phone);
    formData.append('identificationNo', newPlan.identificationNo);
    formData.append('address', newPlan.address);
    formData.append('occupation', newPlan.occupation);
    
    // Vehicle Snapshot
    formData.append('vehicleId', newPlan.vehicleId);
    formData.append('vehicleName', selectedVehicle?.name || "Unknown");
    formData.append('chassisNo', newPlan.chassisNo);
    formData.append('engineNo', newPlan.engineNo);
    formData.append('color', newPlan.color);
    formData.append('ccRating', newPlan.ccRating);

    // Financials
    formData.append('totalAmount', newPlan.totalAmount);
    formData.append('deposit', newPlan.deposit);
    formData.append('paymentFrequency', newPlan.paymentFrequency);
    formData.append('installmentsCount', installmentsCount);
    
    // Calculated
    formData.append('nextDueDate', calculateNextDueDate(newPlan.paymentFrequency));

    // File (Important!)
    if (newPlan.agreementFile) {
        formData.append('agreementFile', newPlan.agreementFile);
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            // Note: Content-Type is auto-set by browser when using FormData
            body: formData 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create agreement");
        }

        setAgreements([data, ...agreements]);
        setIsAddModalOpen(false);
        setNewPlan(initialFormState); // Reset Form
        alert("✅ Agreement Created & File Uploaded!");
    } catch (error) {
        alert("Error: " + error.message);
    }
  };

  // Handle Payment (PUT)
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount)) return;

    try {
        const response = await fetch(`${API_URL}/${selectedAgreement._id}/pay`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: paymentAmount })
        });

        if (!response.ok) throw new Error("Payment failed");
        const updatedAgreement = await response.json();

        setAgreements(agreements.map(a => a._id === updatedAgreement._id ? updatedAgreement : a));
        setIsPaymentModalOpen(false);
        alert(`Payment Recorded for ${selectedAgreement.customerName}`);
    } catch (error) {
        alert("Error logging payment: " + error.message);
    }
  };

  // Auto-fill vehicle details when vehicle is selected
  const handleVehicleSelect = (e) => {
      const vId = e.target.value;
      const v = vehicles.find(veh => veh._id === vId);
      setNewPlan(prev => ({
          ...prev,
          vehicleId: vId,
          // Auto-fill from DB, allow override
          chassisNo: v?.chassisNo || "",
          engineNo: v?.engineNo || "",
          color: v?.color || "",
          ccRating: v?.ccRating || "",
          totalAmount: v?.price || ""
      }));
  };

  // Helper functions for modals
  const openPaymentModal = (agreement) => {
    setSelectedAgreement(agreement);
    setPaymentAmount("");
    setIsPaymentModalOpen(true);
  };

  const openLedger = (agreement) => {
    setSelectedAgreement(agreement);
    setIsLedgerOpen(true);
  };

  // Filter Logic
  const filteredData = agreements.filter(item => 
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard Data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financing Manager</h1>
          <p className="text-gray-500">Live Database Connection</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm">
            <Plus size={18} /> New Agreement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wallet size={20}/></div>
                <p className="text-sm text-gray-500 font-medium">Total Deposits</p>
            </div>
            <h3 className="text-2xl font-bold">Ksh {financials.totalDeposits.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={20}/></div>
                <p className="text-sm text-gray-500 font-medium">Installments (Month)</p>
            </div>
            <h3 className="text-2xl font-bold">Ksh {financials.monthlyInstallmentsCollected.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertCircle size={20}/></div>
                <p className="text-sm text-gray-500 font-medium">Overdue</p>
            </div>
            <h3 className="text-2xl font-bold">{agreements.filter(a => a.status === 'Overdue').length}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CheckCircle size={20}/></div>
                <p className="text-sm text-gray-500 font-medium">Active Plans</p>
            </div>
            <h3 className="text-2xl font-bold">{agreements.length}</h3>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="relative w-full max-w-md">
                <input 
                    type="text" placeholder="Search customers..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Vehicle</th>
                        <th className="p-4">Balance</th>
                        <th className="p-4">Next Due</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Evidence</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredData.length === 0 ? (
                        <tr><td colSpan="7" className="p-8 text-center text-gray-500">No financing agreements found.</td></tr>
                    ) : (
                        filteredData.map((item) => {
                            const balance = item.totalAmount - item.paidAmount;
                            return (
                                <tr key={item._id} className="hover:bg-gray-50 transition group">
                                    <td className="p-4 cursor-pointer" onClick={() => openLedger(item)}>
                                        <div className="font-bold text-blue-600 hover:underline flex items-center gap-2">
                                            {item.customerName} <History size={14}/>
                                        </div>
                                        <div className="text-xs text-gray-500">{item.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{item.vehicleName}</div>
                                        <div className="text-xs text-gray-500">{item.chassisNo}</div>
                                    </td>
                                    <td className="p-4 font-mono font-medium text-gray-700">
                                        {balance.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {item.status === 'Completed' ? '-' : new Date(item.nextDueDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            item.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                                            item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs">
                                        {item.agreementFile ? (
                                            <a href={`http://localhost:5000${item.agreementFile}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                <FileText size={12}/> View PDF
                                            </a>
                                        ) : <span className="text-gray-400">Missing</span>}
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => openPaymentModal(item)} className="text-brand-accent hover:text-white border border-brand-accent hover:bg-brand-accent px-3 py-1 rounded text-xs font-bold transition">
                                          Log Pay
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- ADD MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="text-brand-accent"/> New Financing Agreement</h2>
              <button onClick={() => setIsAddModalOpen(false)}><X /></button>
            </div>
            
            <form onSubmit={handleNewPlanSubmit} className="p-6 space-y-6">
              {/* Customer Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2"><User size={16}/> Customer Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-medium mb-1">Full Name</label><input required className="w-full border p-2 rounded bg-white text-sm" value={newPlan.customerName} onChange={e => setNewPlan({...newPlan, customerName: e.target.value})} /></div>
                    <div><label className="block text-xs font-medium mb-1">Phone</label><input required className="w-full border p-2 rounded bg-white text-sm" value={newPlan.phone} onChange={e => setNewPlan({...newPlan, phone: e.target.value})} /></div>
                    <div><label className="block text-xs font-medium mb-1">ID Number</label><input required className="w-full border p-2 rounded bg-white text-sm" value={newPlan.identificationNo} onChange={e => setNewPlan({...newPlan, identificationNo: e.target.value})} /></div>
                    <div><label className="block text-xs font-medium mb-1">Occupation</label><input className="w-full border p-2 rounded bg-white text-sm" value={newPlan.occupation} onChange={e => setNewPlan({...newPlan, occupation: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className="block text-xs font-medium mb-1">Address</label><input required className="w-full border p-2 rounded bg-white text-sm" value={newPlan.address} onChange={e => setNewPlan({...newPlan, address: e.target.value})} /></div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2 uppercase tracking-wide"><Fingerprint size={16}/> Vehicle Details</h3>
                <div className="mb-4">
                    <select required className="w-full border p-2 rounded bg-white" value={newPlan.vehicleId} onChange={handleVehicleSelect}>
                        <option value="">-- Choose Stock Vehicle --</option>
                        {vehicles.map(v => <option key={v._id} value={v._id}>{v.name} - ({v.price?.toLocaleString()})</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Chassis No" className="border p-2 rounded" value={newPlan.chassisNo} onChange={e=>setNewPlan({...newPlan, chassisNo: e.target.value})} />
                    <input placeholder="Engine No" className="border p-2 rounded" value={newPlan.engineNo} onChange={e=>setNewPlan({...newPlan, engineNo: e.target.value})} />
                    <input placeholder="Color" className="border p-2 rounded" value={newPlan.color} onChange={e=>setNewPlan({...newPlan, color: e.target.value})} />
                    <input placeholder="CC Rating" className="border p-2 rounded" value={newPlan.ccRating} onChange={e=>setNewPlan({...newPlan, ccRating: e.target.value})} />
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="text-xs font-bold">Total Price</label><input type="number" className="w-full border p-2 rounded" value={newPlan.totalAmount} onChange={e=>setNewPlan({...newPlan, totalAmount: e.target.value})}/></div>
                  <div><label className="text-xs font-bold">Deposit (Min 20%)</label><input type="number" className="w-full border p-2 rounded" value={newPlan.deposit} onChange={e=>setNewPlan({...newPlan, deposit: e.target.value})}/></div>
                  <div>
                      <label className="text-xs font-bold">Frequency</label>
                      <select className="w-full border p-2 rounded" value={newPlan.paymentFrequency} onChange={e=>setNewPlan({...newPlan, paymentFrequency: e.target.value})}>
                          <option value="monthly">Monthly</option>
                          <option value="weekly">Weekly</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-bold">Duration (Months)</label>
                      <select className="w-full border p-2 rounded" value={newPlan.months} onChange={e=>setNewPlan({...newPlan, months: e.target.value})}>
                          <option value="6">6 Months</option>
                          <option value="12">12 Months</option>
                          <option value="18">18 Months</option>
                          <option value="24">24 Months</option>
                      </select>
                  </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold mb-1">Upload Signed Agreement (PDF/Image)</label>
                <input 
                    type="file" 
                    accept=".pdf, .jpg, .jpeg, .png"
                    onChange={(e) => setNewPlan({...newPlan, agreementFile: e.target.files[0]})}
                    className="w-full border p-2 rounded bg-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-brand-primary text-white font-bold rounded hover:bg-slate-800">Create Agreement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {isPaymentModalOpen && selectedAgreement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center bg-green-50 rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2"><DollarSign className="text-green-600"/> Log Payment</h2>
              <button onClick={() => setIsPaymentModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">{selectedAgreement.customerName}</h3>
                <p className="text-sm text-gray-500">{selectedAgreement.vehicleName}</p>
              </div>
              <input autoFocus required type="number" className="w-full border-2 border-green-100 p-3 rounded-lg text-2xl font-bold text-center" placeholder="0.00" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
              <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg">Confirm Payment</button>
            </form>
          </div>
        </div>
      )}

      {/* --- LEDGER MODAL --- */}
      {isLedgerOpen && selectedAgreement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div><h2 className="text-xl font-bold">Payment Ledger</h2><p className="text-sm text-gray-500">{selectedAgreement.customerName}</p></div>
                    <button onClick={() => setIsLedgerOpen(false)}><X /></button>
                </div>
                <div className="p-6">
                    {/* Customer Profile Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-blue-50 p-4 rounded-lg text-sm">
                        <div><span className="block text-gray-500 text-xs">ID Number</span>{selectedAgreement.identificationNo || "-"}</div>
                        <div><span className="block text-gray-500 text-xs">Occupation</span>{selectedAgreement.occupation || "-"}</div>
                        <div className="col-span-2"><span className="block text-gray-500 text-xs">Address</span>{selectedAgreement.address || "-"}</div>
                    </div>

                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100"><tr><th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3 text-right">Amount</th></tr></thead>
                        <tbody className="divide-y">
                            {selectedAgreement.paymentHistory?.map((pay, idx) => (
                                <tr key={idx}>
                                    <td className="p-3">{new Date(pay.date).toLocaleDateString()}</td>
                                    <td className="p-3">{pay.type}</td>
                                    <td className="p-3 text-right font-mono">{pay.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                            <tr>
                                <td colSpan="2" className="p-3 text-right">Total Paid:</td>
                                <td className="p-3 text-right text-green-700">{selectedAgreement.paidAmount.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="p-3 text-right">Balance:</td>
                                <td className="p-3 text-right text-red-600">{(selectedAgreement.totalAmount - selectedAgreement.paidAmount).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default FinancingDashboard;