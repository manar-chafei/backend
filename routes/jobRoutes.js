// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  addJob,
  updateJob,
  deleteJob,
  myJobs,
  myJob,
  getAllJobs,
} = require("../controllers/JobController");
const { authrec } = require("../middleware/auth");

router.get("/allJobs", getAllJobs);
// Use the middleware in your route
router.get("/myJobs", authrec, myJobs);
router.get("/myJob/:id", authrec, myJob);
router.post("/addJob", authrec, addJob);
router.put("/updateJob/:id", authrec, updateJob);
router.delete("/deleteJob/:id", authrec, deleteJob);
module.exports = router;
