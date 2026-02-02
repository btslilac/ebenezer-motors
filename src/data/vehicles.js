export const vehicles = [
  {
    id: "1", 
    name: "2021 Toyota Prado", 
    brand: "Toyota", 
    modelYear: 2021, 
    price: 6500000, 
    hirePrice: 10000,
    hirePriceWeekly: 70000,
    fuelType: "Diesel", 
    mileage: 45000, 
    transmission: "Automatic", 
    power: "201HP", 
    ccRating: "2800cc", // Added
    color: "Pearl White", // Added
    chassisNo: "QWER-982", // Added
    engineNo: "ENG-89302", // Added
    category: "Luxury",
    images: ["https://images.unsplash.com/photo-1670054953044-2605dbd0d747?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRveW90YSUyMHByYWRvJTIwMjAyMXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1670054953044-2605dbd0d747?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRveW90YSUyMHByYWRvJTIwMjAyMXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1670054953044-2605dbd0d747?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRveW90YSUyMHByYWRvJTIwMjAyMXxlbnwwfHwwfHx8MA%3D%3D"],
    description: "Excellent condition, locally used Toyota Land Cruiser Prado. Features a robust 2.8L diesel engine. Known for its exceptional off-road capabilities, it features advanced 4WD technology, a powerful engine, and outstanding ground clearance, making it perfect for challenging terrains. Inside, the Prado offers a luxurious, spacious cabin equipped with modern tech, premium materials, and an intuitive infotainment system. With its unmatched reliability, safety features, and comfort, the Toyota Land Cruiser Prado is the ultimate choice for both adventure seekers and those in need of a family-friendly SUV.", 
    features: ["Leather Seats", "Sunroof", "4WD", "Cool Box"], 
    isNewArrival: true, 
    forHire: true
  },
  {
    id: "2",
    name: "2019 Mercedes C-Class",
    brand: "Mercedes",
    modelYear: 2019,
    price: 4200000,
    hirePrice: 20000,
    hirePriceWeekly: 140000,
    fuelType: "Petrol", 
    mileage: 32000, 
    transmission: "Automatic", 
    power: "255HP", 
    ccRating: "2000cc", // Added
    color: "Iridium Silver", // Added
    chassisNo: "ORNF-948", // Added
    engineNo: "ENG-90876", // Added
    category: "Luxury",
    images: ["https://images.unsplash.com/photo-1686562483617-3cf08d81e117?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    description: "Clean maintenance history. A perfect blend of luxury and performance.",
    features: ["Heated Seats", "Backup Camera", "Ambient Lighting"],
    isNewArrival: true,
    forHire: true
  },
  {
    id: "3",
    name: "2019 Toyota Crown",
    brand: "Toyota",
    modelYear: 2019,
    price: 6000000,
    hirePrice: 8000,
    hirePriceWeekly: 42000,
    fuelType: "Hybrid", 
    mileage: 32000, 
    transmission: "Automatic", 
    power: "220HP", 
    ccRating: "2500cc", // Added
    color: "Black", // Added
    chassisNo: "BKDH-687", // Added
    engineNo: "ENG-79281", // Added
    category: "Luxury",
    images: ["/src/assets/ToyotaCrown.webp"],
    description: "The ultimate VIP sedan. Smooth hybrid drive and executive rear seating. ",
    features: ["Heated Seats", "Backup Camera", "Soft Close Doors"],
    isNewArrival: true,
    forHire: true
  },
  {
    id: "4",
    name: "2016 Subaru Forester",
    brand: "Subaru",
    modelYear: 2016,
    price: 2400000,
    hirePrice: 4000,
    fuelType: "Petrol", 
    mileage: 68000, 
    transmission: "Automatic", 
    power: "170HP", 
    ccRating: "2000cc", // Added
    color: "Dark Grey", // Added
    chassisNo: "QWER-387", // Added
    engineNo: "ENG-90816", // Added
    category: "Family",
    images: ["/src/assets/SubaruForestorFrontPanel.webp", "/src/assets/SubaruForestorLeftPanel.webp"],
    description: "Reliable family SUV with Symmetrical All-Wheel Drive.",
    features: ["Heated Seats", "Backup Camera", "X-Mode"],
    isNewArrival: false,
    forHire: true
  },
  {
    id: "5",
    name: "2026 Nissan X-Trail",
    brand: "Nissan",
    modelYear: 2026,
    price: 5850000,
    hirePrice: 8000,
    fuelType: "Hybrid", 
    mileage: 85006, 
    transmission: "Automatic", 
    power: "200HP", 
    ccRating: "1500cc", // Added (e-Power usually uses 1.5L generator)
    color: "Ceramic Grey", // Added
    chassisNo: "QWER-501", // Added
    engineNo: "ENG-89302", // Added
    category: "Family",
    images: ["src/assets/nissanxtrail.jpg"],
    description: "The Nissan X-trail is a compact crossover SUV that is not new in the Kenyan market. It offers a blend of comfort, practicality, and technology.",
    features: ["Heated Seats", "Backup Camera", "e-Power System"],
    isNewArrival: false,
    forHire: true
  },
  {
    id: "6",
    name: "1985 Land Rover Defender",
    brand: "Land Rover",
    modelYear: 1985,
    price: 3500000,
    hirePrice: 15000,
    fuelType: "Diesel", 
    mileage: 200000, 
    transmission: "Manual", 
    power: "110HP", 
    ccRating: "2500cc", // Added
    color: "Classic Green", // Added
    chassisNo: "QWER-840", // Added
    engineNo: "ENG-90856", // Added
    category: "OffRoad",
    images: ["https://plus.unsplash.com/premium_photo-1698072483163-3114d5cf3834?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    description: "A fully restored classic. Rugged, reliable, and iconic.",
    features: ["Off-road Tires", "Roof Rack", "Snorkel"],
    isNewArrival: false,
    forHire: true
  },
  {
    id: "7",
    name: "2026 Land Rover Defender",
    brand: "Land Rover",
    modelYear: 2025,
    price: 8500000,
    hirePrice: 30000,
    fuelType: "Hybrid", 
    mileage: 0, 
    transmission: "Automatic", 
    power: "395HP", 
    ccRating: "3000cc", // Added
    color: "Gondwana Stone", // Added
    chassisNo: "QWER-999", // Added
    engineNo: "ENG-23075", // Added
    category: "Luxury, OffRoad",
    images: ["https://images.unsplash.com/photo-1612563893490-d86ed296e5e6?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    description: "Brand new model. Unstoppable capability meets luxury.",
    features: ["Air Suspension", "360 Camera", "Meridian Sound"],
    isNewArrival: true,
    forHire: true
  },
  {
    id: "8",
    name: "Mitsubishi Pajero",
    brand: "Mitsubishi",
    modelYear: 2015,
    price: 3500000, 
    hirePrice: 7500,
    fuelType: "Diesel", 
    mileage: 100000, 
    transmission: "Automatic", 
    power: "190HP", 
    ccRating: "3200cc", // Added
    color: "Warm White", // Added
    chassisNo: "QWER-938", // Added
    engineNo: "ENG-4876", // Added
    category: "Family, OffRoad",
    images: ["https://images.unsplash.com/photo-1767534481622-cfe6b95e7164?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    description: "Legendary 3.2L Diesel engine. Built for the toughest terrains.",
    features: ["7 Seater", "Sunroof", "Low Range Gear"],
    isNewArrival: true,
    forHire: true
  },
  {
    id: "9",
    name: "Cadillac Escalade",
    brand: "Cadillac",
    modelYear: 2025,
    price: 18500000,
    hirePrice: 50000,
    fuelType: "Petrol", 
    mileage: 1000, 
    transmission: "Automatic", 
    power: "420HP", 
    ccRating: "6200cc", // Added
    color: "Black Raven", // Added
    chassisNo: "QWER-687", // Added
    engineNo: "ENG-90876", // Added
    category: "SUV",
    images: ["https://images.unsplash.com/photo-1683778547065-d85e27b7b2ac?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    description: "The pinnacle of American luxury. Massive V8 power.",
    features: ["OLED Display", "Super Cruise", "Massage Seats"],
    isNewArrival: true,
    forHire: true
  },
];