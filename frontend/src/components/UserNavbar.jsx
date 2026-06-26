import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authApi";

function UserNavbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate("/signIn");
  };

  const isDoctor = user?.role === "doctor" || user?.qualification !== undefined;

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
              M
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Med<span className="text-blue-600">Care</span>
            </h1>
          </div>

          {/* Menu */}
          <ul className="hidden md:flex items-center gap-8 font-semibold text-slate-600 text-sm">
            <li
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => navigate("/")}
            >
              Home
            </li>

            {/* Hide "Doctors" if the user IS a doctor */}
            {!isDoctor && (
              <li
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => navigate("/doctors")}
              >
                Doctors
              </li>
            )}

            <li
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => navigate("/about")}
            >
              About
            </li>

            {/* Dynamic Appointment Link */}
            <li
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() =>
                navigate(isDoctor ? "/doctor-appointments" : "/appointments")
              }
            >
              {isDoctor ? " Appointments" : "My Appointments"}
            </li>
          </ul>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm hover:shadow transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {user.userName?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="text-left hidden sm:block pr-2">
                <p className="font-semibold text-sm text-slate-800 leading-tight truncate max-w-[100px]">
                  {user.userName}
                </p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                  {isDoctor ? "Doctor" : "Patient"}
                </p>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  My Profile
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
