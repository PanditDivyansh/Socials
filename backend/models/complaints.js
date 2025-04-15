const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  for:String,
  complaint: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
