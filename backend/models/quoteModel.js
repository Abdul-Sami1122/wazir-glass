// wazir-glass-backend/models/quoteModel.js
const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    serviceType: { type: String, required: true },
    location: { type: String, required: true },
    projectDetails: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Quote = mongoose.model("Quote", quoteSchema);
module.exports = Quote;
