// wazir-glass-backend/models/billModel.js
const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const billSchema = new mongoose.Schema(
  {
    billNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String },
    items: [billItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountReceived: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "paid", "advanced"],
      default: "pending",
    },

    // *** ADD THIS FIELD ***
    convertedFromQuotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      required: false, // It's optional
    },
  },
  {
    timestamps: true,
  }
);

// Before saving, automatically calculate remaining amount and set status
billSchema.pre("save", function (next) {
  this.remainingAmount = this.total - this.amountReceived;

  if (this.amountReceived <= 0) {
    this.status = "pending";
  } else if (this.amountReceived >= this.total) {
    this.status = "paid";
    this.remainingAmount = 0;
    this.amountReceived = this.total; // Cap received amount at total
  } else {
    this.status = "advanced";
  }

  next();
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
