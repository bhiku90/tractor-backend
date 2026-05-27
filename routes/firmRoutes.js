const express  = require("express");
const router   = express.Router();
const Firm     = require("../models/firmModel");
const Customer = require("../models/customerModel");
const Work     = require("../models/workModel");
const Driver   = require("../models/driverModel");

// ── Middleware: verify firmId exists for all /:firmId routes ──────────────
router.param("firmId", async (req, res, next, firmId) => {
  // Skip existence check for firm creation
  if (req.method === "POST" && req.path === "/") return next();
  const firm = await Firm.get(firmId).catch(() => null);
  if (!firm) return res.status(404).json({ error: "Firm not found. Check your firm code." });
  req.firm = firm;
  next();
});

// ═══════════════════════════════════════════════════════════════
// FIRMS
// ═══════════════════════════════════════════════════════════════
// Create a new firm (called from Onboarding "Create New Firm")
router.post("/", async (req, res) => {
  try {
    const { firmNameEn, firmNameMr } = req.body;
    if (!firmNameEn || !firmNameMr)
      return res.status(400).json({ error: "Both firm names (EN and MR) are required." });
    const firm = await Firm.create({ firmNameEn, firmNameMr });
    res.status(201).json(firm);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get firm info (used to verify a firm code on "Join Existing Firm")
router.get("/:firmId", (req, res) => res.json(req.firm));

// Update firm name / settings
router.put("/:firmId", async (req, res) => {
  try {
    await Firm.update(req.params.firmId, req.body);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Work-type management
router.post("/:firmId/worktypes", async (req, res) => {
  try {
    const updated = await Firm.addWorkType(req.params.firmId, req.body);
    res.status(201).json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete("/:firmId/worktypes/:value", async (req, res) => {
  try {
    const updated = await Firm.deleteWorkType(req.params.firmId, req.params.value);
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════
router.get("/:firmId/customers", async (req, res) => {
  try { res.json(await Customer.getAll(req.params.firmId)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/:firmId/customers", async (req, res) => {
  try {
    const { firmId } = req.params;
    const { name, mobile } = req.body;
    if (!name || !mobile)
      return res.status(400).json({ error: "Name and mobile are required." });
    const dup = await Customer.findByMobile(firmId, mobile);
    if (dup)
      return res.status(409).json({ error: `Mobile ${mobile} is already registered for "${dup.name}".` });
    res.status(201).json(await Customer.create(firmId, req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:firmId/customers/:id", async (req, res) => {
  try {
    const { firmId, id } = req.params;
    const { name, mobile } = req.body;
    if (!name || !mobile)
      return res.status(400).json({ error: "Name and mobile are required." });
    const dup = await Customer.findByMobile(firmId, mobile, id);
    if (dup)
      return res.status(409).json({ error: `Mobile ${mobile} is already registered for "${dup.name}".` });
    res.json(await Customer.update(firmId, id, req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:firmId/customers/:id", async (req, res) => {
  try {
    await Customer.delete(req.params.firmId, req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// WORKS  (nested under customers)
// ═══════════════════════════════════════════════════════════════
router.get("/:firmId/customers/:customerId/works", async (req, res) => {
  try {
    const works = await Work.getByCustomer(req.params.firmId, req.params.customerId);
    res.json(works.length ? works : []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/:firmId/customers/:customerId/works", async (req, res) => {
  try {
    const { firmId, customerId } = req.params;
    const { category = "farming" } = req.body;
    if (category === "farming" && (req.body.acres === undefined || !req.body.charges))
      return res.status(400).json({ error: "Missing fields: acres, charges" });
    if (category === "trailer" && (!req.body.trips || !req.body.ratePerTrip))
      return res.status(400).json({ error: "Missing fields: trips, ratePerTrip" });
    if (category === "thresher" && (!req.body.sacks || !req.body.ratePerSack))
      return res.status(400).json({ error: "Missing fields: sacks, ratePerSack" });
    res.status(201).json(await Work.create(firmId, customerId, req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:firmId/customers/:customerId/works/:workId", async (req, res) => {
  try {
    const { firmId, customerId, workId } = req.params;
    res.json(await Work.update(firmId, customerId, workId, req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:firmId/customers/:customerId/works/:workId", async (req, res) => {
  try {
    const { firmId, customerId, workId } = req.params;
    await Work.togglePaidStatus(firmId, customerId, workId, req.body.isPaid);
    res.json({ message: "Status updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:firmId/customers/:customerId/works/:workId", async (req, res) => {
  try {
    await Work.delete(req.params.firmId, req.params.customerId, req.params.workId);
    res.json({ message: "Work deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// DRIVERS
// ═══════════════════════════════════════════════════════════════
router.get("/:firmId/drivers", async (req, res) => {
  try { res.json(await Driver.getAll(req.params.firmId)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/:firmId/drivers", async (req, res) => {
  try {
    const { firmId } = req.params;
    const { name, mobile } = req.body;
    if (!name) return res.status(400).json({ error: "Driver name is required." });
    if (mobile) {
      const dup = await Driver.findByMobile(firmId, mobile);
      if (dup) return res.status(409).json({ error: `Mobile ${mobile} is already registered for "${dup.name}".` });
    }
    res.status(201).json(await Driver.create(firmId, req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:firmId/drivers/:id", async (req, res) => {
  try {
    const { firmId, id } = req.params;
    const { name, mobile } = req.body;
    if (!name) return res.status(400).json({ error: "Driver name is required." });
    if (mobile) {
      const dup = await Driver.findByMobile(firmId, mobile, id);
      if (dup) return res.status(409).json({ error: `Mobile ${mobile} is already registered for "${dup.name}".` });
    }
    res.json(await Driver.update(firmId, id, req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:firmId/drivers/:id", async (req, res) => {
  try {
    await Driver.delete(req.params.firmId, req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// DRIVER PAYMENTS
// ═══════════════════════════════════════════════════════════════
router.get("/:firmId/drivers/:driverId/payments", async (req, res) => {
  try { res.json(await Driver.getPayments(req.params.firmId, req.params.driverId)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/:firmId/drivers/:driverId/payments", async (req, res) => {
  try {
    res.status(201).json(await Driver.addPayment(req.params.firmId, req.params.driverId, req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:firmId/drivers/:driverId/payments/:paymentId", async (req, res) => {
  try {
    await Driver.deletePayment(req.params.firmId, req.params.driverId, req.params.paymentId);
    res.json({ message: "Payment deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
