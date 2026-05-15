const Service = require('../models/serviceModel');

exports.addService = async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};