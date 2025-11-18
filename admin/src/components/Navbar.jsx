import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const role = aToken ? "Admin" : "Doctor";

  const logout = () => {
    // Clear tokens and go home
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    navigate("/");
  };

  return (
    <header className="px-4 sm:px-6 lg:px-8">
      <div
        className="
          relative mx-auto max-w-6xl lg:max-w-7xl mt-6
          flex items-center justify-between gap-3
          rounded-full bg-white px-4 sm:px-6 lg:px-8 py-2 md:py-2.5
          ring-1 ring-black/5
          shadow-[0_24px_50px_rgba(0,0,0,0.18),0_10px_20px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.08)]
        "
      >
        {/* Left: brand + role chip */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
            aria-label="Go to home"
          >
            <img
              src={assets.admin_logo || assets.logo}
              alt="Admin"
              className="h-9 w-auto"
            />
            <span className="hidden sm:inline text-lg md:text-xl font-semibold text-slate-900">
              MediVault Console
            </span>
          </button>

          <span
            className={`
              inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
              ring-1 ring-slate-200 bg-white text-slate-700
            `}
            title={`Logged in as ${role}`}
          >
            {role}
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="
              inline-flex items-center justify-center rounded-full
              px-5 md:px-6 py-2 text-sm font-medium text-white
              bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]
              shadow-[inset_0_-1px_0_rgba(255,255,255,0.12),0_8px_18px_rgba(59,130,246,0.35),0_2px_6px_rgba(0,0,0,0.18)]
              hover:brightness-105 active:scale-[0.98] transition
            "
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;