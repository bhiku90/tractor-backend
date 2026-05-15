const express = require('express');
const cors = require('cors');
const serviceRoutes = require('./routes/serviceRoutes');
const workRoutes = require('./routes/workRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/customers', require('./routes/customerRoutes'));

app.use('/api/services', serviceRoutes);
app.use('/api/customers/:id/works', workRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));