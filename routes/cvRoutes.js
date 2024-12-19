const express = require("express");
const {
  addCV,
  getUserCVs,
  getCVById,
  deleteCV,
  updateCV,
  getlast,
} = require("../controllers/cvController");
const { authn, authenticate } = require("../middleware/auth");

const router = express.Router();

// Routes sécurisées avec le middleware `authenticateUser`
router.post("/cv", authn, addCV);
router.get("/cvs", authn || authenticate, getUserCVs);
router.get("/cv/:id", authn || authenticate, getCVById);
router.put("/cv/:id", authn || authenticate, updateCV);
router.delete("/cv/:id", authn || authenticate, deleteCV);
router.get("/getLastUserCV", authn, getlast);

module.exports = router;
