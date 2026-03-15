import ContactMessage from "../models/ContactMessage.js";

export const createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const contact = await ContactMessage.create({ name, email, message });
    return res.status(201).json({ data: contact });
  } catch (error) {
    return next(error);
  }
};

export const listContacts = async (req, res, next) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ data: contacts });
  } catch (error) {
    return next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.json({ data: contact });
  } catch (error) {
    return next(error);
  }
};
