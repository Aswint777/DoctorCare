const Booking = require("../model/bookingModel");
const User = require("../model/userModel"); // Adjust if your doctor model is named differently

// Fetch doctor details and booked slots for a specific date
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query; // date should be passed as YYYY-MM-DD

    // Fetch the doctor's details
    const doctor = await User.findById(doctorId).select("-password");
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Find all confirmed bookings for this doctor on this specific date
    const bookings = await Booking.find({
      doctorId,
      date,
      status: "Confirmed",
    });

    // Extract just the time slots that are taken (e.g., ["09:00 AM", "10:30 AM"])
    const bookedSlots = bookings.map((booking) => booking.timeSlot);

    res.status(200).json({
      success: true,
      doctor,
      bookedSlots,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new appointment
const createBooking = async (req, res) => {
  try {
      
      console.log(req.body,'klllllllll');
      const { doctorId, date, timeSlot } = req.body;
      const patientId = req.user.userId; 
            console.log(doctorId, date, timeSlot,patientId,'klllllllll');

      // Double-check if the slot was taken milliseconds ago
      const existingBooking = await Booking.findOne({
          doctorId,
          date,
          timeSlot,
          status: "Confirmed",
        });

        if (existingBooking) {
        console.log('klllllllll');
      return res
        .status(400)
        .json({ success: false, message: "This slot is already booked." });
    }

    const newBooking = await Booking.create({
      patientId,
      doctorId,
      date,
      timeSlot,
    });

    res.status(201).json({
      success: true,
      message: "Appointment confirmed successfully",
      booking: newBooking,
    });
  } catch (error) {
    // Catch the MongoDB unique index error just in case
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "This slot is already booked." });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPatientBookings = async (req, res) => {
  try {
    const patientId = req.user.userId; // From verifyToken middleware

    // Fetch bookings and populate the doctor details so we can show their name!
    const bookings = await Booking.find({ patientId })
      .populate('doctorId', 'userName email phoneNumber qualification') 
      .sort({ date: 1, timeSlot: 1 }); // Sort by upcoming dates

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// doctor side 
const getDoctorBookings = async (req, res) => {
  try {
    const doctorId = req.user.userId; 

    // Fetch bookings and populate the PATIENT details
    const bookings = await Booking.find({ doctorId })
      .populate('patientId', 'userName email phoneNumber bloodGroup dateOfBirth') 
      .sort({ date: 1, timeSlot: 1 }); 

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDoctorAvailability,
  createBooking,
  getPatientBookings,
  getDoctorBookings,
};
