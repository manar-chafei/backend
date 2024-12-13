// models/Test.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  propositions: {
    type: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    validate: [arrayLimit, "{PATH} doit contenir exactement 3 propositions."],
    required: true,
  },
});

// Fonction de validation pour s'assurer qu'il y a exactement 3 propositions
function arrayLimit(val) {
  return val.length === 3;
}

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: {
    type: [questionSchema],
    validate: [
      arrayLimitQuestions,
      "{PATH} doit contenir exactement 10 questions.",
    ],
    required: true,
  },
});

// Fonction de validation pour s'assurer qu'il y a exactement 10 questions
function arrayLimitQuestions(val) {
  return val.length === 10;
}

module.exports = mongoose.model("Test", TestSchema);
