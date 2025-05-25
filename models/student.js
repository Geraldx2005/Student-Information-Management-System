import mongoose from "mongoose";

let studentDetailSchema = new mongoose.Schema({}, { strict: false });
let Student = mongoose.model("Student", studentDetailSchema);

export default Student;