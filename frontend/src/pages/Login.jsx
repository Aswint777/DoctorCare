import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authApi"; // Added missing import
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear the error message as soon as the user starts typing again
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(""); // Reset errors on submit

    // --- Frontend Validation Logic ---
    if (!formData.email.trim() || !formData.password) {
      setValidationError("Please fill in both email and password.");
      return;
    }

    // Optional: Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    try {
      const data = await loginUser(formData);
      setUser(data.user);
      if(data.user.role === 'admin'){
        navigate("/admin/dashboard")
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      // Display backend errors in the UI instead of an alert
      setValidationError(
        error.response?.data?.message || "Invalid email or password. Please try again."
      );
    }
  };

  // Reusable Eye Icon SVG
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  // Reusable Eye Slash Icon SVG
  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  return (
    <div>
      <Navbar />
      <div
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center pt-25"
        style={{
          backgroundImage:
            "url('/Healthcare-professionals-collaborating-in-a-well-lit-hospital-corridor-emphasizing-teamwork-and-patient-care.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Added backdrop-blur for consistency with the signup page */}
        <div className="relative z-10 bg-white/15 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-700">
              Hospital Management
            </h1>
            <p className="text-gray-800 mt-2 font-medium">
              Sign in to your account
            </p>
          </div>

          {/* Error Message Display */}
          {validationError && (
            <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm text-center">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-900">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                // Added bg-white/90 for better readability on translucent card
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-900">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 mt-4"
            >
              Sign In
            </button>
            <p className="text-center mt-4 text-gray-900 font-medium">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-700 font-bold hover:text-blue-900 hover:underline"
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;