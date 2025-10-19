import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import flash from "connect-flash";
import Student from "../models/student.js";
import { authenticate } from "../middleware/authmiddleware.js";

const router = express.Router();

const file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(file_name);

// Route to serve the personal details form.html file
router.get("/",authenticate, (req, res) => {
  res.render("addForm", { title: "Student Form", cssFile: "addForm", jsFile: "addForm"});
});

// Route to handle form submission and save student details
router.post("/submit",authenticate, async (req, res) => {
  try {
    let studData = req.body;
    await Student.insertOne(studData);
    req.flash("success", "Student detail added successfully");
    res.redirect("/form");
    // res.status(201).json({ message: "Student detail added successfully" });
  } catch (error) {
    req.flash("error", "Error adding student detail");
    return res.redirect("/form");
    // return res.status(400).json({ error: error.message });
  }
});

// Route to serve the personal details form.html file
router.get("/edit/:id", authenticate, async (req, res) => {
  let { id } = req.params;

  const student = await Student.findById(id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  // res.send("Edit page under construction");
  res.render("editForm.ejs", { student, title: "Edit Student Form", cssFile: "addForm", jsFile: "addForm"});
});

// The route which handles the update request from the edit student page.
router.put("/edit/:id",authenticate, async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body;
  try {
    const student = await Student.findByIdAndUpdate(id, updatedData);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    req.flash("success", "Student detail updated successfully");
    res.redirect("/studentslist");
  } catch (error) {
    // return res.status(500).json({ error: "Server error" });
    req.flash("error", "Error updating student detail");
    return res.redirect("/studentslist");
  }
});

export default router;
