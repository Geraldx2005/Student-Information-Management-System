import express from "express";
import Student from "../models/student.js";
import RecycleStudent from "../models/recycle_students.js";
import { authenticate } from "../middleware/authmiddleware.js";
const router = express.Router();

// The main students-list page.
router.get("/", authenticate, async (req, res) => {
  try {
    let data = {};
    let studentNames = await Student.find({});
    res.render("studentsList.ejs", { studentNames, data, title: "Students list" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

// The route which handles the filter request from the client side.
router.get("/filter",authenticate , async (req, res) => {
  let data = req.query;

  if (data?.batch) {
    data.batch = Number(data.batch);
  }

  try {
    let studentNames = await Student.find(data);
    res.render("studentsList.ejs", { studentNames, data, title: "Students list - filter" });
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

// Every data deleted from the students list will be moved to the recycle bin.
router.delete("/student/:id",authenticate, async (req, res) => {
  let { id } = req.params;
  try {
    const deletedElement = await Student.findById(id);
    const { _id, __v, ...elementWithoutIdAndV } = deletedElement.toObject();
    const recycleInsert = await RecycleStudent.insertOne(elementWithoutIdAndV);
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
