const express = require("express");
const {
  home,
  signup,
  Login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
} = require("../controller/userController");
const verifyToken = require("../middleware/authMiddleware");
const {
  registerDoctor,
  listDoctors,
  removeDoctor,
  updateDoc,
} = require("../controller/adminDoctorController");
const {
  getDoctorAvailability,
  createBooking,
  getPatientBookings,
  getDoctorBookings,
} = require("../controller/bookingController");
const { getDashboardStats } = require("../controller/dashboardController");

const router = express.Router();

// Common

router.get("/", home);

router.post("/register", signup);

router.post("/signIn", Login);

router.post("/logOut", logout);

router.get("/me", verifyToken, getCurrentUser);

//admin

router.post("/admin/registerDoctor", verifyToken, registerDoctor);
router.get("/admin/doctors", listDoctors);
router.delete("/admin/removeDoctor/:id", verifyToken, removeDoctor);
router.post("/admin/updateDoc", verifyToken, updateDoc);
router.get("/admin/dashboard-stats", verifyToken, getDashboardStats);

//user

router.get("/getDoctorAvailability", getDoctorAvailability);

router.post("/createBooking", verifyToken, createBooking);

router.get("/myBookings", verifyToken, getPatientBookings);

router.put("/updateProfile", verifyToken, updateProfile);
router.put("/changePassword", verifyToken, changePassword);

// Doctor

router.get("/doctorBookings", verifyToken, getDoctorBookings);

module.exports = router;
