import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Top Header Bar */}
        {/* Swapped justify-between for justify-end so the profile stays on the right */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-end px-6 sm:px-8 sticky top-0 z-10 shadow-sm">
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">

            {/* Optional subtle divider */}
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* User Profile Avatar */}
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm hover:shadow-md transition-shadow">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-700 leading-tight">Administrator</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            </button>
            
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-x-hidden">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default Layout;