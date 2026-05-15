const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams allows access to :id from the parent route
const workController = require('../controllers/workController');

// POST: Add new work for a specific customer
// Endpoint: /api/customers/:id/works
router.post('/', workController.addWork);

// GET: Fetch all work history for a specific customer
// Endpoint: /api/customers/:id/works
router.get('/', workController.getWorkByCustomer);
router.patch('/:workId', workController.updatePaidStatus);

module.exports = router;