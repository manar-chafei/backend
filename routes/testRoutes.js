// routes/skillRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  addTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
} = require("../controllers/TestController");
const { authenticate, authn } = require("../middleware/auth");

router.post("/addTest", authenticate, addTest);
router.get("/getAllTests", authenticate, getAllTests);
router.get("/getTestById/:id", authenticate, getTestById);
router.put("/updateTest/:id", authenticate, updateTest);
router.delete("/deleteTest/:id", authenticate, deleteTest);
//router.get("/", TestController.getSkills);

module.exports = router;
