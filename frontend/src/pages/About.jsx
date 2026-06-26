import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import UserNavbar from "../components/UserNavbar";

function About() {
    const { user, loading } = useAuth();
      if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <>
        <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {user ? <UserNavbar /> : <Navbar />}
      <div className="bg-gradient-to-b from-blue-50 to-slate-50 pt-16 pb-12 px-6 sm:px-8 border-b border-slate-100 mt-12">

        <div className="max-w-6xl mx-auto bg-white/10 shadow-xl rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side */}
            <div className="bg-white/15 text-black flex flex-col items-center justify-center p-10">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-40 h-40 rounded-full flex items-center justify-center font-bold text-8xl">
                    D
                  </div>
                  {/* <h1 className="text-2xl font-bold text-blue-700">DoctorCare</h1> */}
                </div>
              </div>

              <h1 className="text-4xl font-bold mt-6 text-blue-700">DoctorCare Hospital</h1>

              <p className="mt-3 text-blue-700 text-center">
                Excellence in Healthcare & Patient Care
              </p>
            </div>

            {/* Right Side */}
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">
                About Us
              </h2>

              <p className="text-gray-900 leading-8 mb-4">
                DoctorCare Hospital Management System is designed to streamline
                healthcare operations by providing an efficient platform for
                managing patients, doctors, appointments, and medical records.
              </p>

              <p className="text-gray-900 leading-8 mb-4">
                Our goal is to enhance the quality of healthcare services
                through digital transformation. The system allows hospital
                administrators, doctors, and staff to manage daily activities
                seamlessly while ensuring accurate patient information and
                secure record keeping.
              </p>

              <p className="text-gray-900 leading-8">
                With advanced appointment scheduling, doctor management, patient
                tracking, and reporting features, DoctorCare Hospital strives to
                provide a modern and reliable healthcare management solution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default About;
