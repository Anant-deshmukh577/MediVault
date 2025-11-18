import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const Chip = ({ tone = "slate", children }) => {
  const tones = {
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
};

const DoctorAppointments = () => {
  const {
    dToken,
    appointments = [],
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  // Do not mutate context array with reverse; create a copy
  const rows = appointments.slice().reverse();

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-8 md:my-10">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">All appointments</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage today’s schedule, mark visits complete, or cancel if needed.
            </p>
          </div>

          {/* Table card */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.07)] max-h-[78vh] min-h-[50vh] overflow-y-auto">
            {/* Header row (desktop) */}
            <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center px-6 py-3 border-b sticky top-0 bg-white z-10">
              <p className="text-xs font-semibold text-slate-500">#</p>
              <p className="text-xs font-semibold text-slate-500">Patient</p>
              <p className="text-xs font-semibold text-slate-500">Payment</p>
              <p className="text-xs font-semibold text-slate-500">Age</p>
              <p className="text-xs font-semibold text-slate-500">Date & Time</p>
              <p className="text-xs font-semibold text-slate-500">Fees</p>
              <p className="text-xs font-semibold text-slate-500">Action</p>
            </div>

            {rows.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-500">No appointments yet.</div>
            )}

            {rows.map((item, index) => {
              const isCancelled = item.cancelled;
              const isCompleted = item.isCompleted;
              const payChip = item.payment ? (
                <Chip tone="indigo">ONLINE</Chip>
              ) : (
                <Chip tone="slate">CASH</Chip>
              );
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
                    flex flex-wrap justify-between max-sm:gap-3 max-sm:text-[15px]
                    sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center
                    text-slate-600 px-6 py-3 border-b hover:bg-slate-50/70 transition
                  "
                >
                  {/* Index */}
                  <p className="max-sm:hidden">{index + 1}</p>

                  {/* Patient */}
                  <div className="flex items-center gap-2 min-w-0">
                    <img className="w-8 h-8 rounded-full object-cover ring-2 ring-white" src={item.userData.image} alt="patient" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{item.userData.name}</p>
                      {/* Mobile: status under name */}
                      <div className="sm:hidden mt-0.5">{statusChip}</div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="max-sm:hidden">{payChip}</div>

                  {/* Age */}
                  <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

                  {/* Date & Time */}
                  <p>
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>

                  {/* Fees */}
                  <p className="font-medium text-slate-900">
                    {currency}
                    {item.amount}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {/* Desktop status chip */}
                    <div className="hidden sm:block">{statusChip}</div>

                    {!isCancelled && !isCompleted ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => cancelAppointment(item._id)}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-rose-600 bg-white ring-1 ring-rose-200 hover:bg-rose-50 transition"
                          title="Cancel appointment"
                        >
                          <img src={assets.cancel_icon} alt="cancel" className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => completeAppointment(item._id)}
                          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_6px_16px_rgba(16,185,129,0.35)] hover:brightness-105 transition"
                          title="Mark as completed"
                        >
                          <img src={assets.tick_icon} alt="complete" className="w-4 h-4 invert" />
                          Complete
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* Mobile extras */}
                  <div className="sm:hidden w-full pl-10 -mt-1 text-xs text-slate-500">
                    <p className="mt-1">Payment: {item.payment ? "ONLINE" : "CASH"}</p>
                    <p>Age: {calculateAge(item.userData.dob)}</p>
                    <p>
                      Fees:{" "}
                      <span className="text-slate-700 font-medium">
                        {currency}
                        {item.amount}
                      </span>
                    </p>
                    {!isCancelled && !isCompleted && (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => cancelAppointment(item._id)}
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-rose-600 bg-white ring-1 ring-rose-200 hover:bg-rose-50 transition"
                        >
                          <img src={assets.cancel_icon} alt="" className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => completeAppointment(item._id)}
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_12px_rgba(16,185,129,0.35)] hover:brightness-105 transition"
                        >
                          <img src={assets.tick_icon} alt="" className="w-4 h-4 invert" />
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorAppointments;