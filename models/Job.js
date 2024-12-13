const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  experienceRequired: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User ", required: true }, // Référence au modèle User
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;