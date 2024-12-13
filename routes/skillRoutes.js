// routes/skillRoutes.js
const express = require("express");
const router = express.Router();
const SkillController = require("../controllers/SkillController");

router.post("/", SkillController.addSkill);
router.get("/", SkillController.getSkills);

module.exports = router;
