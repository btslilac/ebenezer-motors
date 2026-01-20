export const financingAgreements = [
  {
    id: "f1",
    customerName: "John Kamau",
    phone: "+254700000001",
    identificationNo: "24567890",
    address: "123 Moi Avenue, Nairobi",
    occupation: "Business Man",
    vehicleName: "2021 Toyota Prado",
    
    totalAmount: 6500000,
    deposit: 2000000,
    paidAmount: 4500000, // Deposit (2M) + 5 Installments (2.5M)
    
    installmentsCount: 12,
    installmentsPaid: 5,
    paymentFrequency: "monthly",
    
    nextDueDate: "2026-01-05", 
    status: "Overdue",
    
    // Ledger Logic
    paymentHistory: [
      { date: "2025-08-01", type: "Deposit", amount: 2000000 },
      { date: "2025-09-05", type: "Installment", amount: 500000 },
      { date: "2025-10-05", type: "Installment", amount: 500000 },
      { date: "2025-11-05", type: "Installment", amount: 500000 },
      { date: "2025-12-05", type: "Installment", amount: 500000 },
      { date: "2026-01-05", type: "Installment", amount: 500000 },
    ]
  },
  {
    id: "f2",
    customerName: "Sarah Ochieng",
    phone: "+254700000002",
    identificationNo: "30123456",
    address: "45 Kisumu Rd, Kisumu",
    occupation: "Doctor",
    vehicleName: "2016 Subaru Forester",
    
    totalAmount: 2400000,
    deposit: 1000000,
    paidAmount: 2200000,
    
    installmentsCount: 6,
    installmentsPaid: 5,
    paymentFrequency: "monthly",
    
    nextDueDate: "2026-11-20",
    status: "Good",
    
    paymentHistory: [
      { date: "2026-05-20", type: "Deposit", amount: 1000000 },
      { date: "2026-06-20", type: "Installment", amount: 240000 },
      { date: "2026-07-20", type: "Installment", amount: 240000 },
      { date: "2026-08-20", type: "Installment", amount: 240000 },
      { date: "2026-09-20", type: "Installment", amount: 240000 },
      { date: "2026-10-20", type: "Installment", amount: 240000 },
    ]
  },
  {
    id: "f3",
    customerName: "David Koech",
    phone: "+254700000003",
    identificationNo: "28999000",
    address: "88 Eldoret Highway, Eldoret",
    occupation: "Farmer",
    vehicleName: "2026 Nissan X-Trail",
    
    totalAmount: 1850000,
    deposit: 500000,
    paidAmount: 500000,
    
    installmentsCount: 24,
    installmentsPaid: 0,
    paymentFrequency: "monthly",
    
    nextDueDate: "2026-11-01", 
    status: "Overdue",
    
    paymentHistory: [
      { date: "2026-10-01", type: "Deposit", amount: 500000 },
    ]
  },
];