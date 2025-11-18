import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const Chip = ({ tone = "sky", children }) => {
  const tones = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] px-5 py-4 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.10)] transition">
    <span className="grid place-items-center size-12 rounded-xl ring-1 ring-slate-200 bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4] shadow-sm">
      <img src={icon} alt="" className="w-6 h-6 invert-[1] opacity-95" />
    </span>
    <div>
      <p className="text-xl font-semibold text-slate-900 leading-6">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  if (!dashData) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-8 md:my-10">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Your today’s summary and recent bookings</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={assets.earning_icon}
              label="Earnings"
              value={`${currency} ${dashData.earnings}`}
            />
            <StatCard
              icon={assets.appointments_icon}
              label="Appointments"
              value={dashData.appointments}
            />
            <StatCard
              icon={assets.patients_icon}
              label="Patients"
              value={dashData.patients}
            />
          </div>

          {/* Latest bookings */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b bg-white">
              <img src={assets.list_icon} alt="" className="w-5 h-5" />
              <p className="font-semibold text-slate-900">Latest bookings</p>
            </div>

            <div className="max-h-[56vh] overflow-y-auto">
              {dashData.latestAppointments?.length === 0 && (
                <div className="px-6 py-10 text-center text-slate-500">
                  No recent bookings
                </div>
              )}

              {dashData.latestAppointments?.map((item, index) => {
                const isCancelled = item.cancelled;
                const isCompleted = item.isCompleted;
                const statusChip = isCancelled ? (
                  <Chip tone="rose">Cancelled</Chip>
                ) : isCompleted ? (
                  <Chip tone="emerald">Completed</Chip>
                ) : (
                  <Chip tone="sky">Upcoming</Chip>
                );

                return (
                  <div
                    key={item._id || index}
                    className="
                      flex items-center gap-3 px-5 py-3 border-b
                      hover:bg-slate-50/70 transition
                    "
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                      src={item.userData.image}
                      alt="patient"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-medium truncate">
                        {item.userData.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {slotDateFormat(item.slotDate)} • {item.slotTime.toLowerCase()}
                      </p>
                    </div>

                    {/* Status / Actions */}
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:block">{statusChip}</div>

                      {!isCancelled && !isCompleted ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => cancelAppointment(item._id)}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-rose-600 bg-white ring-1 ring-rose-200 hover:bg-rose-50 transition"
                            title="Cancel appointment"
                          >
                            <img src={assets.cancel_icon} alt="" className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => completeAppointment(item._id)}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_6px_16px_rgba(16,185,129,0.35)] hover:brightness-105 transition"
                            title="Mark as completed"
                          >
                            <img src={assets.tick_icon} alt="" className="w-4 h-4 invert" />
                            Complete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DoctorDashboard;