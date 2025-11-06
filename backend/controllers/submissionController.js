// wazir-glass-backend/controllers/submissionController.js
const nodemailer = require("nodemailer");
const Quote = require("../models/quoteModel");

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Handle contact form submission
// @route   POST /api/submissions/contact
// @access  Public
const submitContact = async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !message) {
    return res
      .status(400)
      .json({ message: "Please fill out all required fields." });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: "New Contact Form Submission - Wazir Glass",
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

// @desc    Handle quote form submission
// @route   POST /api/submissions/quote
// @access  Public
const submitQuote = async (req, res) => {
  const { name, phone, email, serviceType, location, projectDetails } =
    req.body;

  if (!name || !phone || !serviceType || !location || !projectDetails) {
    return res
      .status(400)
      .json({ message: "Please fill out all required fields." });
  }

  try {
    // 1. Save quote to database
    const quote = new Quote({
      name,
      phone,
      email,
      serviceType,
      location,
      projectDetails,
    });
    await quote.save();

    // 2. Send email notification
    const mailOptions = {
      from: `"Quote Request" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "New Quote Request - Wazir Glass",
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Project Details:</strong></p>
        <p>${projectDetails}</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Quote request submitted successfully" });
  } catch (error) {
    console.error("Quote Submission Error:", error);
    res.status(500).json({ message: "Error submitting quote request" });
  }
};

module.exports = { submitContact, submitQuote };
