const Work = require('../models/workModel');

/**
 * Adds a new work entry for a specific customer.
 * URL: POST /api/customers/:id/works
 */
exports.addWork = async (req, res) => {
    try {
        const customerId = req.params.id; // The ID from the URL
        const { workName, area, charges } = req.body; // ✅ CORRECT: Data comes from the Body

        // Validation check
        if (!workName || !area || !charges) {
            return res.status(400).json({ 
                error: `Missing fields. Received: workName=${workName}, area=${area}, charges=${charges}` 
            });
        }

        const result = await Work.create(customerId, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};  

/**
 * Retrieves the entire work history for a specific customer.
 * URL: GET /api/customers/:id/works
 */
exports.getWorkByCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        // Fetch works using the model
        const works = await Work.getByCustomer(customerId);

        if (!works || works.length === 0) {
            return res.status(200).json([]); // Return empty array if no work found
        }

        res.status(200).json(works);
    } catch (err) {
        console.error("Error in getWorkByCustomer:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updatePaidStatus = async (req, res) => {
    try {
        // Change this line: The parent route uses ':id', the child uses ':workId'
        const customerId = req.params.id; 
        const workId = req.params.workId;
        
        const { isPaid } = req.body;

        // Safety check to prevent 500 errors
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