import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Stethoscope } from "lucide-react";
import UserNavbar from "../../components/UserNavbar";
import { getMyBookings } from "../../services/authApi";

function PatientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Separate upcoming and past bookings based on today's date
  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter(b => b.date >= today);
  const pastBookings = bookings.filter(b => b.date < today);

  const getInitials = (name) => {
    if (!name) return "Dr";
    return name.substring(0, 2).toUpperCase();
  };

  const BookingCard = ({ booking, isPast }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${isPast ? 'border-slate-100 opacity-70' : 'border-blue-100 hover:shadow-md hover:border-blue-200'}`}
    >
      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            {getInitials(booking.doctorId?.userName)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{booking.doctorId?.userName || "Unknown Doctor"}</h3>
            <p className="text-sm text-blue-600 font-medium">{booking.doctorId?.qualification || "General Physician"}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
          booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">{booking.timeSlot}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 col-span-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm">MedCare Main Hospital, Block A</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 ">
      <UserNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 mt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">My Appointments</h1>
          <p className="text-slate-500 mt-2">Manage your upcoming and past medical visits.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Appointments Yet</h2>
            <p className="text-slate-500 mb-6">You haven't booked any medical consultations.</p>
            <a href="/doctors" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              Find a Doctor
            </a>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Upcoming Appointments */}
            {upcomingBookings.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" /> Upcoming Visits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingBookings.map(booking => (
                    <BookingCard key={booking._id} booking={booking} isPast={false} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Appointments */}
            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-slate-400" /> Past Visits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastBookings.map(booking => (
                    <BookingCard key={booking._id} booking={booking} isPast={true} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;