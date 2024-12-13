const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Association avec la collection User
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // Liste des compétences
    required: true,
  },
  experience: [
    {
      company: String,
      role: String,
      duration: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      year: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CV", cvSchema);
