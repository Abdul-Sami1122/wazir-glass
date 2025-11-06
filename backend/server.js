// wazir-glass-backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS (so your React app can talk to this backend)
app.use(cors());

// Mount routers
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/quotations", require("./routes/quotationRoutes")); // <-- ADDED THIS LINE

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
