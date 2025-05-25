import express from "express";
import path from "path";
import { fileURLToPath } from "url";
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
    res.status(201).json({ message: "Student detail added successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
