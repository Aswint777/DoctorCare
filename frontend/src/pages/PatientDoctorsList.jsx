import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Calendar,
  Clock,
  Award,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { allDoctors } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import UserNavbar from "../components/UserNavbar";

function PatientDoctorsList() {
  const navigate = useNavigate();
  const [doctors,setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const data = await allDoctors();
        setDoctors(data.allDoctors || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = [
    "All",
    ...new Set(doctors.map((doc) => doc.qualification).filter(Boolean)),
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      activeSpecialty === "All" || doctor.qualification === activeSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const getInitials = (name) => {
    if (!name) return "Dr";
    return name.substring(0, 2).toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {user ? <UserNavbar /> : <Navbar />}

      <div className="bg-gradient-to-b from-blue-50 to-slate-50 pt-16 pb-12 px-6 sm:px-8 border-b border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6"
          >
            Find Your <span className="text-blue-600">Specialist</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Book appointments with the best doctors in the city. Filter by
            specialty, experience, and patient ratings.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto relative shadow-lg rounded-2xl bg-white border border-slate-100 flex items-center p-2"
          >
            <div className="pl-4 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 outline-none text-slate-700 bg-transparent rounded-xl"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-10">
        {!isLoading && doctors.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {specialties.map((specialty, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSpecialty(specialty)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSpecialty === specialty
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                {specialty || "General"}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Finding the best doctors for you...</p>
          </div>
        ) : (
          /* Doctors Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    variants={cardVariants}
                    layout
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 pt-8 pb-6 px-6 flex flex-col items-center text-center relative border-b border-slate-50">
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Available
                      </div>

                      <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 mb-4 border-4 border-white group-hover:scale-105 transition-transform duration-300">
                        {getInitials(doctor.userName)}
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
                        {doctor.userName}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm mt-1">
                        {doctor.qualification || "General Physician"}
                      </p>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">
                            {doctor.experience
                              ? `${doctor.experience} Yrs Exp.`
                              : "New"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold text-slate-700">
                            4.8
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-start gap-3 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <p>Mon - Fri, 09:00 AM - 05:00 PM</p>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-600">
                          <Stethoscope className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <p className="line-clamp-2">
                            Consultation & regular checkups.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/book-appointment/${doctor._id}`)
                        }
                        className="w-full bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-semibold py-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 group/btn border border-slate-100 hover:border-blue-600"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100 border-dashed"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    We couldn't find any specialists matching "{searchTerm}".
                    Try adjusting your filters.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PatientDoctorsList;
