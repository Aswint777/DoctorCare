import axiosInstance from "./axiosInstance";
// common
export const registerUser = async (formData) => {
  const response = await axiosInstance.post("/register", formData);

  return response.data;
};

export const loginUser = async (formData) => {
  const response = await axiosInstance.post("/signIn", formData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/me");

  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/logout");

  return response.data;
};

// Admin

export const registerDoctor = async (formData) => {
  const response = await axiosInstance.post("/admin/registerDoctor", formData);
  return response.data;
};

export const allDoctors = async () => {
  const response = await axiosInstance.get("/admin/doctors");
  return response.data;
};

export const removeDoctor = async (id) => {
  const response = await axiosInstance.delete(`/admin/removeDoctor/${id}`);
  return response.data;
};

export const updateDoc = async (formData) => {
  const response = await axiosInstance.post(`/admin/updateDoc`, formData);
  return response.data;
};


export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/dashboard-stats");
  return response.data;
};


// user 


export const getDoctorAvailability = async (doctorId, date) => {
  const response = await axiosInstance.get(
    `/getDoctorAvailability?doctorId=${doctorId}&date=${date}`,
  );
  return response.data;
};

export const createBooking = async (formData) => {
  const response = await axiosInstance.post(`/createBooking`, formData);
  return response.data;
};


export const getMyBookings = async () => {
  const response = await axiosInstance.get("/myBookings");
  return response.data;
};

export const updateUserProfile = async (formData) => {
  const response = await axiosInstance.put("/updateProfile", formData);
  return response.data;
};

export const updateUserPassword = async (passwordData) => {
  const response = await axiosInstance.put("/changePassword", passwordData);
  return response.data;
};

// Doctor 

export const getDoctorBookings = async () => {
  const response = await axiosInstance.get("/doctorBookings");
  return response.data;
};