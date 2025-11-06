// wazir-glass-backend/models/quotationModel.js
const mongoose = require("mongoose");

const quotationItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String },
    items: [quotationItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    notes: { type: String },
    status: {
      type: String,
      // *** ADD 'converted' TO THE LIST ***
      enum: ["pending", "accepted", "rejected", "converted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Quotation = mongoose.model("Quotation", quotationSchema);
module.exports = Quotation;
