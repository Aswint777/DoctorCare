import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authApi";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  LogOut, 
  ActivitySquare 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
    const { user, logout } = useAuth();
  

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Centralized navigation configuration for easy maintenance
  const navItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/doctors", name: "Doctors", icon: Users },
    { path: "/admin/add-doctor", name: "Add Doctor", icon: UserPlus },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0">
      
      {/* Logo / Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <ActivitySquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">DoctorCare</h1>
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Admin Portal</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
          Main Menu
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  }`} />
                  {item.name}
                  
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          Log out
        </button>
      </div>
      
    </div>
  );
}

export default Sidebar;