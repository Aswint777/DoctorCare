import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, Droplets, X, FileText } from "lucide-react";
import UserNavbar from "../../components/UserNavbar";
import { getDoctorBookings } from "../../services/authApi";

function DoctorAppointments() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getDoctorBookings();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch doctor bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const closeModal = () => setSelectedBooking(null);

  const getInitials = (name) => {
    if (!name) return "P";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <UserNavbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Patient Appointments</h1>
          <p className="text-slate-500 mt-2">Manage your schedule and view patient details.</p>
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
            <p className="text-slate-500">Your schedule is currently clear.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 text-sm border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Patient Name</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Time Slot</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {getInitials(booking.patientId?.userName)}
                          </div>
                          <span className="font-semibold text-slate-800">
                            {booking.patientId?.userName || "Unknown Patient"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {booking.timeSlot}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white flex justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-1">Appointment Details</h2>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.timeSlot}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors relative z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 border border-slate-200">
                    {getInitials(selectedBooking.patientId?.userName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {selectedBooking.patientId?.userName || "Unknown Patient"}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Patient Profile</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Phone Number</p>
                      <p className="font-medium text-slate-800">{selectedBooking.patientId?.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Email Address</p>
                      <p className="font-medium text-slate-800">{selectedBooking.patientId?.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Blood Group</p>
                      <p className="font-medium text-slate-800">{selectedBooking.patientId?.bloodGroup || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DoctorAppointments;