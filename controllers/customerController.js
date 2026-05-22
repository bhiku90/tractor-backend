const Customer = require("../models/customerModel");

exports.addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body.name || !req.body.mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }
    const updated = await Customer.update(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.delete(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
