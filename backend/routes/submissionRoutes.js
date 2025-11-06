// wazir-glass-backend/routes/submissionRoutes.js
const express = require("express");
const router = express.Router();
const {
  submitContact,
  submitQuote,
} = require("../controllers/submissionController");

router.post("/contact", submitContact);
router.post("/quote", submitQuote);

module.exports = router;
