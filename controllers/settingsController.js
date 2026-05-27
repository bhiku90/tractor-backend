const Settings = require("../models/settingsModel");

exports.getSettings = async (req, res) => {
  try {
    const data = await Settings.get();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    await Settings.set(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addWorkType = async (req, res) => {
  try {
    const updated = await Settings.addWorkType(req.body);
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWorkType = async (req, res) => {
  try {
    const updated = await Settings.deleteWorkType(req.params.value);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
