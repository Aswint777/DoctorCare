const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Assuming your patient collection is 'User'
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Assuming your doctor collection is also 'User'
    required: true 
  },
  date: { 
    type: String, // Storing as YYYY-MM-DD makes querying exact dates much easier
    required: true 
  },
  timeSlot: { 
    type: String, // e.g., "10:30 AM"
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Cancelled', 'Completed'], 
    default: 'Confirmed' 
  }
}, { timestamps: true });

// Prevent duplicate bookings at the database level
bookingSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);