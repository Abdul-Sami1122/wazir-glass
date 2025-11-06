// wazir-glass-backend/routes/quotationRoutes.js
const express = require("express");
const router = express.Router();

const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
} = require("../controllers/quotationController");
const { protect } = require("../middleware/authMiddleware");

// /api/quotations
router.route("/").post(protect, createQuotation).get(protect, getQuotations);

// /api/quotations/:id
router
  .route("/:id")
  .get(protect, getQuotationById)
  .put(protect, updateQuotation)
  .delete(protect, deleteQuotation);

module.exports = router;
