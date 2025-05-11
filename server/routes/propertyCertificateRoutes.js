const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  getApplication,
  updateStatus
} = require('../controllers/propertyCertificateController');

// Submit new property certificate application
router.post('/', submitApplication);

// Get all property certificate applications
router.get('/', getAllApplications);

// Get single property certificate application
router.get('/:id', getApplication);

// Update application status
router.patch('/:id/status', updateStatus);

module.exports = router;