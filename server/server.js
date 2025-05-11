const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Enable CORS (so frontend can connect)
app.use(cors());

// Configure middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images to browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer storage to save uploaded files with original filename
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Set up file upload - only accept images and PDF
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: function(req, file, cb) {
    // Accept images and PDF only
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error('Only image files and PDFs are allowed!'), false);
    }
    cb(null, true);
  }
});

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/property-certificate', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// ✅ Define schema and model
const propertySchema = new mongoose.Schema({
  districtName: String,
  talukaName: String,
  villageName: String,
  financialYear: String,
  propertyOwnerFirstName: String,
  propertyOwnerMiddleName: String,
  propertyOwnerLastName: String,
  applicantFirstNameEng: String,
  applicantMiddleNameEng: String,
  applicantLastNameEng: String,
  applicantFirstNameDev: String,
  applicantMiddleNameDev: String,
  applicantLastNameDev: String,
  mobileNo: String,
  applicantAadhaar: String,
  numCopies: String
});

const PropertyCertificate = mongoose.model('PropertyCertificate', propertySchema);

// ✅ Route to handle form submission
app.post('/api/property-certificates', async (req, res) => {
  try {
    const formData = req.body;

    console.log('Received form data:', formData);

    // List of required fields
    const requiredFields = [
      'districtName', 'talukaName', 'villageName', 'financialYear',
      'propertyOwnerFirstName', 'propertyOwnerLastName',
      'applicantFirstNameEng', 'applicantLastNameEng',
      'applicantFirstNameDev', 'applicantLastNameDev',
      'mobileNo', 'applicantAadhaar', 'numCopies'
    ];

    // Check for missing fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing field: ${field}`
        });
      }
    }

    // ✅ Save form data to MongoDB
    const newEntry = new PropertyCertificate(formData);

    await newEntry.save();

    console.log('✅ Data saved to MongoDB');
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving to DB:', err);
    res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});