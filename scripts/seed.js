// seed.js is used to insert seed/insert the fake data ih the db.
import {faker} from "@faker-js/faker";
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
        { code: 'MECH', name: 'Mechanical' },
        { code: 'CSE', name: 'Computer Science'},
        { code: 'ECE', name: 'Electronics And Communication'},
        { code: 'IT', name: 'Information Technology'},
        { code: 'Ai', name: 'Artificial Intelligence'},
    ];

    const admissionModes = ["Government", "Management", "7.5%", "Sports"];
    const casteList = ["Nadar", "Vanniyar", "Thevar", "Gounder", "Mudaliar", "Other"];
    const students = [];
    const scholarship = ["PMSS", "Puthumai Pen", "Tamil Pudhavan", "First Graduate", "Beedi", "Minority", "Central Sector", "Pragadhi", "Financial Assistance", "Single Parent", "Others"]
    const transport = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12", "E13"]

    for (let i = 1; i <= 500; i++) {
        // Generate address object first
        const addressObj = {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
            pincode: faker.location.zipCode("#####")
        };

        // Format full address string
        const address = `${addressObj.street}, ${addressObj.city}, ${addressObj.state} - ${addressObj.pincode}, ${addressObj.country}`;
        
        const universityId = `UMIS${faker.string.numeric(3)}`; // Add missing universityId

        const studentData = {
            student_id: faker.number.int({ min: 2100000000, max: 2199999999 }),
            student_name: faker.person.fullName(),
            department: faker.helpers.arrayElement(departments).name,
            dept_code: faker.helpers.arrayElement(departments).code,
            batch: faker.date.between({ from: '2018-01-01', to: '2023-12-31' }).getFullYear(),
            roll_number: `21${faker.helpers.arrayElement(departments).code}${String(i).padStart(3, '0')}`,
            admission_mode: faker.helpers.arrayElement(admissionModes),
            admission_date: faker.date.between({ from: '2018-06-01', to: '2024-08-31' }).toISOString().split('T')[0],
            dob: faker.date.between({ from: '1980-01-01', to: '2010-12-31' }).toISOString().split('T')[0],
            gender: faker.person.sex(),
            blood_group: faker.helpers.arrayElement(["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"]),
            community: faker.helpers.arrayElement(["OC", "BC", "MBC", "SC", "ST", "DNC"]),
            religion: faker.helpers.arrayElement(["Hindu", "Muslim", "Christian"]),
            caste: faker.helpers.arrayElement(casteList),
            nationality: faker.helpers.arrayElement(["Indian", "American", "European"]),
            mother_tongue: faker.helpers.arrayElement(["Tamil", "Hindi", "Telugu"]),
            aadhar_no: faker.string.numeric(12),
            address: address,
            phone_no: faker.phone.number('9#########'),
            email: faker.internet.email(),
            emis: faker.string.numeric(11),
            umis: "UMIS" + faker.string.numeric(8),
            university_id: universityId,
            father_name: faker.person.fullName({ sex: "male" }),
            father_contact: faker.phone.number('+91 9#########'),
            father_occupation: faker.helpers.arrayElement(["Government Employee", "Engineer", "Businessman", "Farmer", "Accountant"]),
            father_income: `₹${faker.number.int({ min: 300000, max: 1000000 })}`,
            mother_name: faker.person.fullName({ sex: "female" }),
            mother_contact: faker.phone.number('+91 9#########'),
            mother_occupation: faker.helpers.arrayElement(["Teacher", "Homemaker", "Doctor", "Nurse", "Software Developer"]),
            mother_income: `₹${faker.number.int({ min: 200000, max: 800000 })}`,
            siblings: faker.helpers.arrayElement(["1 (Sister)", "1 (Brother)", "2 (Sisters)", "No siblings"]),
            scholarship: faker.helpers.arrayElement(scholarship),
            transport: faker.helpers.arrayElement(transport),
        };

        students.push(studentData);
    }

    // Insert fake student data into the database
    await Student.insertMany(students);
    mongoose.connection.close();
}

