import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Only log connection errors, don't show toast for connection refused
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        console.warn(
          "Backend server is not running. Please start the backend server."
        );
        // Don't show error toast for connection issues - page should still load
      } else {
        console.error("Error fetching doctors:", error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [backendUrl]);

  const loadUserProfileData = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Only log connection errors, don't show toast for connection refused
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        console.warn(
          "Backend server is not running. Please start the backend server."
        );
        // Don't show error toast for connection issues
      } else if (error.response?.status === 401) {
        // Token expired or invalid - clear it
        setToken(false);
        localStorage.removeItem("token");
      } else {
        console.error("Error loading user profile:", error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [backendUrl, token, setToken]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token, loadUserProfileData]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
