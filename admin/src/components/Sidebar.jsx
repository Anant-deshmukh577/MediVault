import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const LinkItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 rounded-xl px-3 md:px-4 py-3 mx-1 md:mx-2 transition",
        "ring-1 ring-slate-200 bg-white hover:bg-slate-50 text-slate-600",
        isActive &&
          "text-white ring-0 bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_10px_24px_rgba(59,130,246,0.35)]",
      ]
        .filter(Boolean)
        .join(" ")
    }
  >
    <span
      className={[
        "grid place-items-center size-9 rounded-lg ring-1 ring-slate-200 bg-white/95 shadow-sm",
        "transition group-hover:scale-[1.02]",
      ].join(" ")}
    >
      <img src={icon} alt="" className="w-4.5 h-4.5 opacity-90" draggable="false" />
    </span>
    <span className="hidden md:block text-sm font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isAdmin = Boolean(aToken);
  const isDoctor = Boolean(dToken);

  return (
    <aside
      className="my-10
        sticky z-30
        top-[88px] md:top-[104px]   /* space under navbar — adjust if needed */
        h-[calc(100dvh-88px)] md:h-[calc(100dvh-104px)]
        w-20 md:w-72
        mx-4 sm:mx-6
        rounded-3xl bg-white/95 backdrop-blur-sm
        ring-1 ring-black/5
        shadow-[0_24px_50px_rgba(0,0,0,0.18),0_10px_20px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.08)]
        flex flex-col overflow-hidden
      "
    >
      {/* Brand area */}
      <div className="flex items-center gap-3 px-3 md:px-5 pt-4 pb-3 border-b border-slate-100/80">
        <img
          src={assets.admin_logo || assets.logo}
          alt="MediVault Console"
          className="h-8 w-auto"
          draggable="false"
        />
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-slate-200 bg-white text-slate-700">
            {isAdmin ? "Admin" : isDoctor ? "Doctor" : "Console"}
          </span>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 overflow-y-auto py-3">
        {isAdmin && (
          <ul className="flex flex-col gap-1.5 text-sm text-[#515151]">
            <li>
              <LinkItem to="/admin-dashboard" icon={assets.home_icon} label="Dashboard" />
            </li>
            <li>
              <LinkItem to="/all-appointments" icon={assets.appointment_icon} label="Appointments" />
            </li>
            <li>
              <LinkItem to="/add-doctor" icon={assets.add_icon} label="Add Doctor" />
            </li>
            <li>
              <LinkItem to="/doctor-list" icon={assets.people_icon} label="Doctors List" />
            </li>
          </ul>
        )}

        {isDoctor && (
          <ul className="flex flex-col gap-1.5 text-sm text-[#515151]">
            <li>
              <LinkItem to="/doctor-dashboard" icon={assets.home_icon} label="Dashboard" />
            </li>
            <li>
              <LinkItem to="/doctor-appointments" icon={assets.appointment_icon} label="Appointments" />
            </li>
            <li>
              <LinkItem to="/doctor-profile" icon={assets.people_icon} label="Profile" />
            </li>
          </ul>
        )}
      </nav>

      {/* Footer hint */}
      <div className="mt-auto px-3 md:px-5 py-3 border-t border-slate-100/80 text-[11px] text-slate-500">
        <span className="hidden md:inline">MediVault Console</span>
        <span className="md:hidden">Console</span>
      </div>
    </aside>
  );
};

export default Sidebar;