const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const CryptoJS = require("crypto-js");

const registerDoctor = async (req, res) => {
  console.log(req.body);
  const { name, email, phoneNumber, qualification, experience, password } =
    req.body;

  if (!name || !email || !phoneNumber || !qualification || !experience || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
  }

  const phoneRegex = /^\d{10,}$/;
  if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
    return res.status(400).json({ success: false, message: "Invalid phone number format" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // const hashedPassword = CryptoJS.AES.decrypt(encrypted, secretKey);

  const existingDoctor = await User.findOne({ email: email, role: "doctor" });
  if (existingDoctor) {
    console.log(existingDoctor, "llllllllllllllllll");
    return res.status(400).json({ success: false, message: "Doctor already exists" });
  }
  const newDoctor = await User.create({
    userName: name,
    email: email,
    phoneNumber: phoneNumber,
    qualification: qualification,
    experience: experience,
    password: hashedPassword,
    role: "doctor",
  });

  res.status(200).json({
    success: true,
    newDoctor,
  });
};

const listDoctors = async (req, res) => {
  console.log("list doctors");

  const allDoctors = await User.find({ role: "doctor" });
  console.log(allDoctors);

  res.status(200).json({
    success: true,
    allDoctors,
  });
};

const removeDoctor = async (req, res) => {
  console.log("kkkkkkkk");

  console.log(req.params, "lll");

  const { id } = req.params;
  const remove = await User.deleteOne({ _id: id, role: "doctor" });

  res.status(200).json({
    success: true,
    remove,
  });
};

const updateDoc = async (req, res) => {
  console.log(req.body, "sfkjnskjvdnfskdnf");

  const { userName, email, phoneNumber, qualification, experience, _id } = req.body;

  if (!userName || !email || !phoneNumber || !qualification || !experience) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  const phoneRegex = /^\d{10,}$/;
  if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
    return res.status(400).json({ success: false, message: "Invalid phone number format" });
  }

  const update = await User.findOneAndUpdate(
    { _id },
    {
      $set: {
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        qualification: qualification,
        experience: experience,
      },
    },
  );

  res.status(200).json({
    success: true,
  });
};

module.exports = {
  registerDoctor,
  listDoctors,
  removeDoctor,
  updateDoc,
};
