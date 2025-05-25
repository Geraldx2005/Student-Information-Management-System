import express from "express";
import Student from "../models/student.js";
import { authenticate } from "../middleware/authmiddleware.js";
const app = express();
const router = express.Router();

// The main students-list page.
router.get("/",authenticate, async (req, res) => {
  try {
    let data = {};
    let studentNames = await Student.find({});
    res.render("transport.ejs", { studentNames, data, title: "Transport list", jsFile: "transport", cssFile: "studentsList" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

// The route which handles the filter request from the client side.
router.get("/filter",authenticate, async (req, res) => {
  let data = req.query;

  if (data?.batch) {
    data.batch = Number(data.batch);
  }

  try {
    let studentNames = await Student.find(data);
    res.render("transport.ejs", { studentNames, data, title: "Transport list - filter" , jsFile: "transport", cssFile: "studentsList"});
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

// The route which handles the displays the detailed information of a student.
router.get("/student/:id",authenticate, async (req, res) => {
  let { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.render("studentsDetails.ejs", { student });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

// Every delete request form every route is handled by this route.
router.delete("/student/:id",authenticate, async (req, res) => {
  let { id } = req.params;
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.send(student);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
