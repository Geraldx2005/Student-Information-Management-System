import mongoose from "mongoose";

let deleteStudentSchema = new mongoose.Schema({}, { strict: false});
let RecycleStudent = mongoose.model("DeleteStudent", deleteStudentSchema);

export default RecycleStudent;