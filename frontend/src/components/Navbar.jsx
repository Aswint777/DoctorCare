import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
              D
            </div>
            <h1 className="text-2xl font-bold text-blue-700">DoctorCare</h1>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700 cursor-pointer">
            <li>
              <a
              onClick={() => navigate("/")}
                className="hover:text-blue-600 transition duration-300"
              >
                Home
              </a>
            </li>

            <li>
              <a
              onClick={() => navigate("/doctors")}
                className="hover:text-blue-600 transition duration-300"
              >
                Doctors
              </a>
            </li>

            <li>
              <a
              onClick={() => navigate("/about")}
                className="hover:text-blue-600 transition duration-300"
              >
                About
              </a>
            </li>

            <li>
              <a
              onClick={() => navigate("/contact")}
                className="hover:text-blue-600 transition duration-300"
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="flex gap-3">
            <a
              onClick={() => navigate("/signIn")}
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer"
            >
              Login
            </a>
            <a
              onClick={() => navigate("/register")}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md cursor-pointer"
            >
              Sign Up
            </a>{" "}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
