// seed.js is used to insert seed/insert the fake data ih the db.
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import Student from "../models/student.js"; // Import the Student model
import RecycleStudent from "../models/recycle_students.js";

main();

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/studentDB");
    console.log("Connected to database");

    // Seed the database with fake student data
    await seedDatabase();

    console.log("Database seeded successfully");
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    process.exit(1);
  }
}

async function seedDatabase() {
  const departments = [
    {code: "MECH", name: "Mechanical"},
    {code: "CS", name: "Computer Science"},
    {code: "ECE", name: "Electronics And Communication"},
    {code: "IT", name: "Information Technology"},
    {code: "AI", name: "Artificial Intelligence"},
  ];

  const casteList = ["Nadar", "Vanniyar", "Thevar", "Gounder", "Mudaliar", "Other"];
  const students = [];

  for (let i = 1; i <= 5; i++) {
    const universityId = `UMIS${faker.string.numeric(3)}`; // Add missing universityId

    const studentData = {
      studentId: faker.number.int({ min: 10000000, max: 99999999 }),
      name: faker.person.fullName(),
      department: faker.helpers.arrayElement(departments).name,
      batch: faker.date.between({ from: "2022-01-01", to: "2025-12-31" }).getFullYear(),
      age: faker.number.int({ min: 18, max: 24 }),
      rollNumber: `21${faker.helpers.arrayElement(departments).code}${String(i).padStart(3, "0")}`,
      dob: faker.date.between({ from: "1980-01-01", to: "2010-12-31" }).toISOString().split("T")[0],
      gender: faker.person.sex(),
      bloodGroup: faker.helpers.arrayElement(["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"]),
      community: faker.helpers.arrayElement(["OC", "BC", "MBC", "SC", "ST", "DNC"]),
      religion: faker.helpers.arrayElement(["Hindu", "Muslim", "Christian"]),
      caste: faker.helpers.arrayElement(casteList),
      nationality: faker.helpers.arrayElement(["Indian", "American", "European"]),
      motherTongue: faker.helpers.arrayElement(["Tamil", "Hindi", "Telugu"]),
      aadharNo: faker.string.numeric(12),
      city: faker.location.city(),
      state: faker.location.state(),
      district: faker.location.county(),
      pinCode: faker.location.zipCode("#####"),
      phoneNo: faker.number.int({ min: 9000000000, max: 9999999999 }).toString(),
      email: faker.internet.email(),
      scholarship: faker.helpers.arrayElement(["Community", "Merit", "Sports", "None"]),
      transport: faker.helpers.arrayElement(["Bus", "Train", "Two Wheeler", "Four Wheeler"]),
    };

    students.push(studentData);
  }

  // Insert fake student data into the database
  await Student.insertMany(students);
  mongoose.connection.close();
}
