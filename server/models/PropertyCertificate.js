const mongoose = require('mongoose');

const propertyCertificateSchema = new mongoose.Schema({
  districtName: {
    type: String,
    required: true
  },
  talukaName: {
    type: String,
    required: true
  },
  villageName: {
    type: String,
    required: true
  },
  financialYear: {
    type: String,
    required: true
  },
  propertyOwnerFirstName: {
    type: String,
    required: true
  },
  propertyOwnerMiddleName: String,
  propertyOwnerLastName: {
    type: String,
    required: true
  },
  applicantFirstNameEng: {
    type: String,
    required: true
  },
  applicantMiddleNameEng: String,
  applicantLastNameEng: {
    type: String,
    required: true
  },
  applicantFirstNameDev: {
    type: String,
    required: true
  },
  applicantMiddleNameDev: String,
  applicantLastNameDev: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  applicantAadhaar: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: props => `${props.value} is not a valid Aadhaar number!`
    }
  },
  numCopies: {
    type: String, 
    required: true
  }
});

module.exports = mongoose.model('PropertyCertificate', propertyCertificateSchema);