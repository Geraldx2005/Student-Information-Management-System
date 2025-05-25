import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import Student from "../models/student.js";
import RecycleStudent from "../models/recycle_students.js";
const router = express.Router();

// The main recycle bin page.
router.get("/",authenticate, async (req, res) => {
  try {
    let data = {};
    let studentNames = await RecycleStudent.find({});
    res.render("recyleBin.ejs", { studentNames, data, title: "Recycle Bin" });
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
      let studentNames = await RecycleStudent.find(data);
      res.render("recyleBin.ejs", { studentNames, data, title: "Recycle bin - filter" });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  });

  // The route which handles the displays the detailed information of a student.
router.get("/student/:id",authenticate, async (req, res) => {
    let { id } = req.params;
    console.log(id);
    try {
      const student = await RecycleStudent.findById(id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.render("studentsDetails.ejs", { student });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  });

 // The route which handles the displays the detailed information of a student.
router.delete("/student/:id",authenticate, async (req, res) => {
    let { id } = req.params;
    try {
      const student = await RecycleStudent.findByIdAndDelete(id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.send(student);
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  });

  router.post("/student/:id", authenticate, async (req, res) => {
    let { id } = req.params;
    try {
      const recycledElement = await RecycleStudent.findById(id);
      console.log(recycledElement);
      const { _id, __v, ...elementWithoutIdAndV } = recycledElement.toObject();
      const studentInsert = await Student.insertOne(elementWithoutIdAndV);
      const student = await RecycleStudent.findByIdAndDelete(id);
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
