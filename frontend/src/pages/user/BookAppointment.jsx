import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Star, 
  Award,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import UserNavbar from "../../components/UserNavbar";
import { useAuth } from "../../context/AuthContext";
import { createBooking, getDoctorAvailability } from "../../services/authApi";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const formatDbDate = (dateObj) => {
    if (!dateObj) return "";
    const offset = dateObj.getTimezoneOffset();
    const date = new Date(dateObj.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const dates = [];
    let currentDate = new Date();
    
    while (dates.length < 14) {
      if (currentDate.getDay() !== 0) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setAvailableDates(dates);
    setSelectedDate(dates[0]); 
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) return;
      
      try {
        setIsLoading(true);
        const dbDate = formatDbDate(selectedDate);
        
        const response = await getDoctorAvailability(id, dbDate);
        
        if (response.success) {
          setDoctor(response.doctor);
          setBookedSlots(response.bookedSlots); 
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setIsLoading(false);
        setSelectedTime(""); 
      }
    };

    fetchAvailability();
  }, [id, selectedDate]);

  const timeSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    const formattedHour = displayHour === 0 ? 12 : displayHour; 
    timeSlots.push(`${formattedHour}:00 ${ampm}`);
    timeSlots.push(`${formattedHour}:30 ${ampm}`);
  }

  // NEW LOGIC: Check if a time slot has already passed today
  const checkIsSlotInPast = (timeStr) => {
    if (!selectedDate) return false;

    const now = new Date();
    
    // If the selected date is not today, past time logic doesn't apply
    if (selectedDate.toDateString() !== now.toDateString()) {
      return false;
    }

    // Parse the slot string (e.g., "2:30 PM") into 24-hour time
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    // Return true if the slot time is earlier than the current exact time
    return slotTime < now;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsBooking(true);
    
    try {
      const dbDate = formatDbDate(selectedDate);
      
      await createBooking({
        doctorId: id,
        date: dbDate,
        timeSlot: selectedTime
      });

      setBookingSuccess(true);
      
      setTimeout(() => {
        navigate("/"); 
      }, 3000);

    } catch (error) {
      console.error("Booking failed:", error);
      alert(error.response?.data?.message || "Failed to book slot. It might be taken.");
      const dbDate = formatDbDate(selectedDate);
      const refresh = await getDoctorAvailability(id, dbDate);
      if (refresh.success) setBookedSlots(refresh.bookedSlots);
    } finally {
      setIsBooking(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "Dr";
    return name.substring(0, 2).toUpperCase();
  };

  const formatDayName = (date) => date.toLocaleDateString("en-US", { weekday: "short" });
  const formatDayNumber = (date) => date.getDate();
  const formatMonth = (date) => date.toLocaleDateString("en-US", { month: "short" });

  if (isLoading && !doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Doctor not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <UserNavbar />

      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 mr-4 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Book Appointment</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {bookingSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-10 text-center max-w-lg mx-auto shadow-xl border border-green-100 mt-10"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Booking Confirmed!</h2>
            <p className="text-slate-600 mb-6">
              Your appointment with <span className="font-semibold text-slate-800">{doctor.userName}</span> has been successfully scheduled for <span className="font-semibold text-blue-600">{selectedDate.toLocaleDateString()} at {selectedTime}</span>.
            </p>
            <p className="text-sm text-slate-400">Redirecting to home...</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-4xl font-bold text-blue-600 mb-4 border-4 border-white shadow-md">
                    {getInitials(doctor.userName)}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{doctor.userName}</h2>
                  <p className="text-blue-600 font-medium">{doctor.qualification || "General Physician"}</p>
                </div>

                <div className="py-6 space-y-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Rating</p>
                      <p className="font-semibold text-slate-800">4.8 out of 5</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Experience</p>
                      <p className="font-semibold text-slate-800">{doctor.experience ? `${doctor.experience} Years` : 'New'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Medical Council</p>
                      <p className="font-semibold text-slate-800">Verified</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Clinic Location</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    MedCare Main Hospital<br/>
                    Block A, 3rd Floor, Room 302.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Select Date
                  </h3>
                  <span className="text-sm font-medium text-slate-500">
                    {selectedDate && selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
                  {availableDates.map((date, index) => {
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center min-w-[4.5rem] py-3 rounded-2xl border transition-all snap-start ${
                          isSelected 
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <span className={`text-xs font-medium mb-1 ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                          {formatDayName(date)}
                        </span>
                        <span className="text-xl font-bold mb-1">{formatDayNumber(date)}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-blue-200" : "text-slate-400"}`}>
                          {formatMonth(date)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Available Time Slots
                  </h3>
                  {isLoading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time, index) => {
                    const isBookedAlready = bookedSlots.includes(time);
                    const isPast = checkIsSlotInPast(time);
                    
                    // The slot is disabled if it's either booked OR in the past
                    const isDisabled = isBookedAlready || isPast;
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={index}
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all border ${
                          isDisabled 
                            ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed" 
                            : isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                              : "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        {time}
                        {isBookedAlready && !isPast && (
                          <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                            Booked
                          </span>
                        )}
                        {isPast && (
                          <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                            Passed
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Consultation Fee</p>
                  <p className="text-2xl font-bold text-slate-800">₹500</p>
                </div>
                <button
                  onClick={handleBooking}
                  disabled={!selectedTime || isBooking}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    !selectedTime 
                      ? "bg-slate-300 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                  }`}
                >
                  {isBooking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}

export default BookAppointment;