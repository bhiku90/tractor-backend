const express = require("express");
const router = express.Router();
const c = require("../controllers/driverController");

router.get("/", c.getDrivers);
router.post("/", c.addDriver);
router.put("/:id", c.updateDriver);
router.delete("/:id", c.deleteDriver);

router.get("/:id/payments", c.getPayments);
router.post("/:id/payments", c.addPayment);
router.delete("/:id/payments/:paymentId", c.deletePayment);

module.exports = router;
