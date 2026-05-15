const Customer = require('../models/customerModel');

exports.addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.status(200).json(customers);
  } catch (err) { res.status(500).json({ error: err.message }); }
};