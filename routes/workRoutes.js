const express = require("express");
const router = express.Router({ mergeParams: true });
const workController = require("../controllers/workController");

// POST: Add new work for a specific customer
router.post("/", workController.addWork);

// GET: Fetch all work history for a specific customer
router.get("/", workController.getWorkByCustomer);

// PATCH: Toggle paid status
router.patch("/:workId", workController.updatePaidStatus);

// PUT: Update a work entry
router.put("/:workId", workController.updateWork);

// DELETE: Delete a work entry
router.delete("/:workId", workController.deleteWork);

module.exports = router;
