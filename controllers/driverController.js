const Driver = require("../models/driverModel");

exports.addDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.getAll();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const updated = await Driver.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await Driver.delete(req.params.id);
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const payment = await Driver.addPayment(req.params.id, req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Driver.getPayments(req.params.id);
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await Driver.deletePayment(req.params.id, req.params.paymentId);
    res.status(200).json({ message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
