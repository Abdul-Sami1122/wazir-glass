// wazir-glass-backend/routes/billRoutes.js
const express = require("express");
const router = express.Router();

// *** MAKE SURE THE IMPORT INCLUDES updateBill ***
const {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} = require("../controllers/billController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createBill).get(protect, getBills);

router
  .route("/:id")
  .get(protect, getBillById)
  .put(protect, updateBill) // <-- This line causes the crash if updateBill is undefined
  .delete(protect, deleteBill);

module.exports = router;
