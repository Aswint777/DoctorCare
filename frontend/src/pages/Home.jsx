import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import UserNavbar from "../components/UserNavbar";
import { useAuth } from "../context/AuthContext";
import { 
  Calendar, 
  Activity, 
  Shield, 
  Clock, 
  ArrowRight,
  Stethoscope
} from "lucide-react";

function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Animation variants for standard staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      {user ? <UserNavbar /> : <Navbar />}

      {/* Hero Section with New Medical Blue Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-b border-blue-100">
        
        {/* Background decorative blob - slightly darkened to show up against the new blue gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-200 opacity-40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-200 opacity-30 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 lg:py-32 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-blue-600 font-medium text-sm mb-6 shadow-sm border border-blue-100">
              <Activity className="w-4 h-4" />
              <span>Modern Healthcare Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Your Health, <br />
              <span className="text-blue-600">Simplified.</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Book appointments, access your medical records, and consult with top specialists from the comfort of your home. MedCare brings the hospital to you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
              {!user && (
                <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-all">
                  Patient Login
                </button>
              )}
            </div>
          </motion.div>

          {/* Hero Image / Graphic Placeholder */}
          <motion.div 
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="aspect-square md:aspect-video lg:aspect-square bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-white shadow-xl flex items-center justify-center relative z-10">
               {/* Replace this div with an actual <img> tag when you have a hero image */}
               <Stethoscope className="w-32 h-32 text-blue-200" />
            </div>
            
            {/* Floating Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 hidden md:flex z-20"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800">24/7 Service</p>
                <p className="text-sm text-slate-500">Always here for you</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Services/Features Section */}
      <div className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Complete Care in One Place</h2>
          <p className="text-slate-600">We provide seamless digital tools to make managing your healthcare easier and more efficient.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Feature Card 1 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group cursor-default">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Easy Scheduling</h3>
            <p className="text-slate-600 leading-relaxed">
              Book, reschedule, or cancel appointments with just a few clicks. No more waiting on hold.
            </p>
          </motion.div>

          {/* Feature Card 2 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group cursor-default">
            <div className="w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Digital Records</h3>
            <p className="text-slate-600 leading-relaxed">
              Access your lab results, prescriptions, and medical history securely from any device.
            </p>
          </motion.div>

          {/* Feature Card 3 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group cursor-default">
            <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Secure & Private</h3>
            <p className="text-slate-600 leading-relaxed">
              Your health data is encrypted and protected with industry-standard security protocols.
            </p>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}

export default Home;