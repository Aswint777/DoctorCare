import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import About from "./pages/About";
import PatientDoctorsList from "./pages/PatientDoctorsList";
import BookAppointment from "./pages/user/BookAppointment";
import DoctorsList from "./pages/admin/DoctorsList";
import AddDoctor from "./pages/admin/AddDoctor";
import Layout from "./components/Layout";
import PatientDashboard from "./pages/user/PatientDashboard";
import Profile from "./pages/user/Profile";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import Dashboard from "./pages/admin/Dashboard";
import Error404 from "./pages/Error404";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor-appointments" replace />;
    return <Navigate to="/" replace />; 
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor-appointments" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  PUBLIC ROUTES  */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<PatientDoctorsList />} />

        {/*  AUTH ROUTES */}
        <Route path="/register" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/signIn" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/*  COMMON PROTECTED ROUTES */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/*  PATIENT ONLY ROUTES  */}
        <Route path="/book-appointment/:id" element={
          <ProtectedRoute allowedRoles={['user', 'patient']}> 
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['user', 'patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />

        {/*   DOCTOR ONLY ROUTES */}
        <Route path="/doctor-appointments" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorAppointments />
          </ProtectedRoute>
        } />

        {/*  ADMIN ONLY ROUTES */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/admin/doctors" element={<DoctorsList />} />
          <Route path="/admin/add-doctor" element={<AddDoctor />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        {/*  CATCH ALL (404)*/}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;