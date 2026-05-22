const Work = require("../models/workModel");

exports.addWork = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { category = "farming" } = req.body;

    if (category === "farming") {
      if (req.body.acres === undefined || !req.body.charges) {
        return res
          .status(400)
          .json({ error: "Missing fields for farming: acres, charges" });
      }
    } else if (category === "trailer") {
      if (!req.body.trips || !req.body.ratePerTrip) {
        return res
          .status(400)
          .json({ error: "Missing fields for trailer: trips, ratePerTrip" });
      }
    } else if (category === "thresher") {
      if (!req.body.sacks || !req.body.ratePerSack) {
        return res
          .status(400)
          .json({ error: "Missing fields for thresher: sacks, ratePerSack" });
      }
    }

    const result = await Work.create(customerId, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkByCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const works = await Work.getByCustomer(customerId);
    if (!works || works.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(works);
  } catch (err) {
    console.error("Error in getWorkByCustomer:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatePaidStatus = async (req, res) => {
  try {
    const customerId = req.params.id;
    const workId = req.params.workId;
    const { isPaid } = req.body;

    if (!customerId || !workId) {
      return res.status(400).json({ error: "Missing customer ID or Work ID" });
    }

    await Work.togglePaidStatus(customerId, workId, isPaid);
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateWork = async (req, res) => {
  try {
    const customerId = req.params.id;
    const workId = req.params.workId;
    const { category = "farming" } = req.body;

    if (category === "farming") {
      if (req.body.acres === undefined || !req.body.charges) {
        return res
          .status(400)
          .json({ error: "Missing fields for farming: acres, charges" });
      }
    } else if (category === "trailer") {
      if (!req.body.trips || !req.body.ratePerTrip) {
        return res
          .status(400)
          .json({ error: "Missing fields for trailer: trips, ratePerTrip" });
      }
    } else if (category === "thresher") {
      if (!req.body.sacks || !req.body.ratePerSack) {
        return res
          .status(400)
          .json({ error: "Missing fields for thresher: sacks, ratePerSack" });
      }
    }

    const result = await Work.update(customerId, workId, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Update Work Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWork = async (req, res) => {
  try {
    const customerId = req.params.id;
    const workId = req.params.workId;

    if (!customerId || !workId) {
      return res.status(400).json({ error: "Missing customer ID or Work ID" });
    }

    await Work.delete(customerId, workId);
    res.status(200).json({ message: "Work entry deleted successfully" });
  } catch (err) {
    console.error("Delete Work Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
