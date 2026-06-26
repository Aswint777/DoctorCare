import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allDoctors, removeDoctor, updateDoc } from "../../services/authApi";
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Users,
  Mail,
  Phone,
  Stethoscope,
} from "lucide-react";

function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    qualification: "",
    experience: "",
  });

  useEffect(() => {
    if (selectedDoctor) {
      setFormData({
        userName: selectedDoctor.userName,
        email: selectedDoctor.email,
        phoneNumber: selectedDoctor.phoneNumber,
        qualification: selectedDoctor.qualification,
        experience: selectedDoctor.experience,
        _id: selectedDoctor._id,
      });
    }
  }, [selectedDoctor]);

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

  const handleDelete = async (id) => {
    try {
      await removeDoctor(id);

      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Helper function to get initials for the avatar
  const getInitials = (name) => {
    if (!name) return "Dr";
    return name.substring(0, 2).toUpperCase();
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const editDoctor = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!formData.userName.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.qualification.trim() || !formData.experience) {
      setValidationError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setValidationError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    try {
      await updateDoc(formData);
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === formData._id ? { ...doc, ...formData } : doc,
        ),
      );

      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden sm:block">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Doctors Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                View, search, and manage all registered healthcare professionals
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-doctor")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
          >
            <UserPlus className="w-4 h-4" />
            Add New Doctor
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 text-sm border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Doctor Name</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Qualification</th>
                  <th className="px-6 py-4 font-semibold">Experience</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  /* Loading State */
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-500 mb-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p>Loading doctors data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredDoctors.length === 0 ? (
                  /* Empty State */
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                          <Stethoscope className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">
                          No doctors found
                        </h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                          {searchTerm
                            ? `No doctors match your search for "${searchTerm}". Try different keywords.`
                            : "There are currently no doctors registered in the system."}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => navigate("/admin/add-doctor")}
                            className="text-blue-600 font-medium hover:underline text-sm"
                          >
                            Add your first doctor →
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* Data Rows */
                  filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                            {getInitials(doctor.userName)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {doctor.userName}
                            </div>
                            <div className="text-xs text-slate-500">
                              ID: {doctor._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {doctor.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {doctor.phoneNumber || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Qualification */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {doctor.qualification || "Unspecified"}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {doctor.experience
                          ? `${doctor.experience} Years`
                          : "0 Years"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            // onClick={() => navigate(`/admin/update-doctor/${doctor._id}`)}
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Doctor"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination/Info area */}
          {!isLoading && filteredDoctors.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-sm text-slate-500 flex justify-between items-center">
              <span>Showing {filteredDoctors.length} doctors</span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {selectedDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>

            {validationError && (
              <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
                {validationError}
              </div>
            )}

            <form onSubmit={editDoctor}>
              <input
                className="w-full border p-2 mb-3"
                placeholder="Name"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
              />

              <input
                className="w-full border p-2 mb-3"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                className="w-full border p-2 mb-3"
                placeholder="Phone"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />

              <input
                className="w-full border p-2 mb-3"
                placeholder="Qualification"
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                value={formData.qualification}
              />

              <input
                className="w-full border p-2 mb-3"
                placeholder="Experience"
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                value={formData.experience}
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setValidationError("");
                  }}
                  className="px-4 py-2 border"
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsList;
