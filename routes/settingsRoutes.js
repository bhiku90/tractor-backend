const express = require("express");
const router  = express.Router();
const c       = require("../controllers/settingsController");

router.get("/",                   c.getSettings);
router.put("/",                   c.updateSettings);
router.post("/worktypes",         c.addWorkType);
router.delete("/worktypes/:value", c.deleteWorkType);

module.exports = router;
