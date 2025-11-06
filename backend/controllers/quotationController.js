// wazir-glass-backend/controllers/quotationController.js
const Quotation = require("../models/quotationModel");

// @desc    Create a new quotation
// @route   POST /api/quotations
// @access  Private (Admin)
const createQuotation = async (req, res) => {
  try {
    const quotation = new Quotation({
      ...req.body,
      status: "pending", // Default status
    });

    const createdQuotation = await quotation.save();
    res.status(201).json(createdQuotation);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating quotation", error: error.message });
  }
};

// @desc    Get all quotations (WITH SEARCH & FILTER)
// @route   GET /api/quotations
// @access  Private (Admin)
const getQuotations = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { quotationNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const quotations = await Quotation.find(query).sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching quotations" });
  }
};

// @desc    Get a single quotation by ID
// @route   GET /api/quotations/:id
// @access  Private (Admin)
const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (quotation) {
      res.json(quotation);
    } else {
      res.status(404).json({ message: "Quotation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotation" });
  }
};

// @desc    Update a quotation (e.g., status)
// @route   PUT /api/quotations/:id
// @access  Private (Admin)
const updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (quotation) {
      // List of fields that can be updated
      const updatableFields = [
        "quotationNumber",
        "date",
        "customerName",
        "customerPhone",
        "customerAddress",
        "items",
        "subtotal",
        "discount",
        "discountAmount",
        "total",
        "notes",
        "status",
      ];

      let hasChanges = false;

      updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          quotation[field] = req.body[field];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        const updatedQuotation = await quotation.save();
        res.json(updatedQuotation);
      } else {
        res.json(quotation);
      }
    } else {
      res.status(404).json({ message: "Quotation not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating quotation", error: error.message });
  }
};

// @desc    Delete a quotation
// @route   DELETE /api/quotations/:id
// @access  Private (Admin)
const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (quotation) {
      await quotation.deleteOne();
      res.json({ message: "Quotation removed" });
    } else {
      res.status(404).json({ message: "Quotation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting quotation" });
  }
};

module.exports = {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
};
