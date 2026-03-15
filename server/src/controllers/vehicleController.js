import Vehicle from "../models/Vehicle.js";

export const listVehicles = async (req, res, next) => {
  try {
    const { brand, category, fuelType, search, sort, forHire, isNewArrival, limit = 50 } = req.query;
    const query = {};
    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (fuelType) query.fuelType = fuelType;
    if (forHire) query.forHire = forHire === "true";
    if (isNewArrival) query.isNewArrival = isNewArrival === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = { modelYear: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };

    const vehicles = await Vehicle.find(query)
      .sort(sortOption)
      .limit(Math.min(Number(limit), 200));

    res.json({ data: vehicles });
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ data: vehicle });
  } catch (error) {
    return next(error);
  }
};

export const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    return res.status(201).json({ data: vehicle });
  } catch (error) {
    return next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ data: vehicle });
  } catch (error) {
    return next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ message: "Vehicle removed" });
  } catch (error) {
    return next(error);
  }
};
