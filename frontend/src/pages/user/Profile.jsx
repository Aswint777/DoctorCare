import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, Lock, Camera, Award, Activity, 
  ShieldCheck, Droplets, CalendarDays, Edit2, Check
} from "lucide-react";
import UserNavbar from "../../components/UserNavbar";
import { useAuth } from "../../context/AuthContext";
// Import the new API calls
import { updateUserProfile, updateUserPassword } from "../../services/authApi";

function Profile() {
  const { user } = useAuth(); // You might want a setUser/refresh function from context to update the UI globally later
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const isDoctor = user?.role === "doctor" || user?.qualification !== undefined;

  // Profile Form State
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    qualification: "",
    experience: "",
    bloodGroup: "",
    dateOfBirth: "",
  });

  // Security Form State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      // Format date for the input field if it exists (YYYY-MM-DD)
      const formattedDate = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "";
      
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        qualification: user.qualification || "",
        experience: user.experience || "",
        bloodGroup: user.bloodGroup || "",
        dateOfBirth: formattedDate,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // --- SUBMIT PROFILE UPDATE ---
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.userName.trim() || !formData.phoneNumber.trim()) {
      return alert("Name and phone number are required.");
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      return alert("Please enter a valid phone number (at least 10 digits).");
    }

    setIsSaving(true);
    
    try {
      const response = await updateUserProfile(formData);
      if (response.success) {
        setIsEditing(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // --- SUBMIT PASSWORD CHANGE ---
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword.length < 6) {
      return alert("New password must be at least 6 characters long.");
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("New passwords do not match!");
    }

    setIsChangingPassword(true);
    
    try {
      const response = await updateUserPassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      if (response.success) {
        alert("Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" }); 
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <UserNavbar />

      {/* Header Banner */}
      <div className="h-20 bg-gradient-to-r from-blue-400 to-cyan-300 w-full relative">
        <div className="absolute inset-0 bg-white/10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Summary Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center sticky top-24">
              
              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-white shadow-md overflow-hidden">
                  {getInitials(formData.userName)}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-200">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-slate-800">{formData.userName || "User Name"}</h2>
              
              <div className={`mt-2 px-4 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1.5 ${isDoctor ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                {isDoctor ? <Award className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {isDoctor ? "Healthcare Provider" : "Patient"}
              </div>

              <div className="w-full h-px bg-slate-100 my-6"></div>

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">{formData.phoneNumber || "No phone added"}</span>
                </div>
                {isDoctor && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Verified Medical License</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Detailed Info & Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              
              <div className="flex border-b border-slate-100 px-6 pt-4 gap-6 bg-slate-50/50">
                {['details', 'security'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 text-sm font-semibold relative transition-colors ${activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {tab === 'details' ? 'Profile Details' : 'Security Settings'}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  
                  {/* DETAILS TAB */}
                  {activeTab === "details" && (
                    <motion.form 
                      key="details"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      onSubmit={handleSave}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
                        <button
                          type="button"
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                        >
                          {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                          {isEditing ? "Stop Editing" : "Edit Profile"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                          <input name="userName" value={formData.userName} onChange={handleChange} disabled={!isEditing} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                          <input name="email" value={formData.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed" />
                        </div>

                        {/* Doctor Fields */}
                        {isDoctor && (
                          <>
                            <div className="md:col-span-2 mt-4">
                              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4"><Activity className="w-4 h-4" /> Professional Details</h4>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qualification</label>
                              <input name="qualification" value={formData.qualification} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed" />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience (Years)</label>
                              <input name="experience" type="number" value={formData.experience} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed" />
                            </div>
                          </>
                        )}

                        {/* Patient Fields */}
                        {!isDoctor && (
                          <>
                            <div className="md:col-span-2 mt-4">
                              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4"><Activity className="w-4 h-4" /> Health Details</h4>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Blood Group</label>
                              <div className="relative">
                                <Droplets className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditing} className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed appearance-none">
                                  <option value="">Select Blood Group</option>
                                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                              <div className="relative">
                                <CalendarDays className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing} className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <AnimatePresence>
                        {isEditing && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-slate-100 flex justify-end">
                            <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-70">
                              {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Save Changes"}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.form>
                  )}

                  {/* SECURITY TAB */}
                  {activeTab === "security" && (
                    <motion.form
                      key="security"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      onSubmit={submitPasswordChange}
                      className="space-y-6 max-w-md"
                    >
                      <h3 className="text-lg font-bold text-slate-800 mb-6">Change Password</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                        <input name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} required type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                        <input name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required type="password" placeholder="••••••••" minLength="6" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                        <input name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required type="password" placeholder="••••••••" minLength="6" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      
                      <button type="submit" disabled={isChangingPassword} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm w-full sm:w-auto disabled:opacity-70 flex items-center justify-center gap-2">
                        {isChangingPassword ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Update Password"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;