import { createContext, useContext, useEffect, useState } from "react";
// 1. Added logoutUser to your imports
import { getCurrentUser, logoutUser } from "../services/authApi"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();
      console.log(data, 'good');
      
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await logoutUser(); 
      setUser(null);      
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);