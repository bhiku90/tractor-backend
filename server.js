const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// All application data is scoped under /api/firms/:firmId
app.use("/api/firms", require("./routes/firmRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
