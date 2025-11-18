import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors = [], aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-8 md:my-10">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">All doctors</h1>
            <p className="mt-1 text-sm text-slate-600">Manage availability and view profiles</p>
          </div>

          {/* Grid of doctor cards */}
          {doctors.length === 0 ? (
            <div className="mt-10 text-center text-slate-500">
              <p>No doctors found.</p>
              <p className="text-sm mt-2">Add a doctor to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
              {doctors.map((item, index) => (
                <div
                  key={item._id || index}
                  className="
                    group relative isolate cursor-pointer overflow-hidden rounded-2xl bg-white
                    ring-1 ring-slate-200
                    shadow-[0_10px_25px_rgba(0,0,0,0.07)]
                    transition-all duration-300
                    hover:-translate-y-1.5
                    hover:shadow-[0_30px_60px_rgba(0,0,0,0.18),0_12px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]
                  "
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(800px_200px_at_20%_-10%,rgba(45,212,191,0.15),transparent_60%)]" />

                  {/* Gradient image band (matches site cards) */}
                  <div className="relative bg-sky-50/70">
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]" />
                    <div className="relative h-40 sm:h-44 px-3 sm:px-4 pb-0 overflow-hidden flex items-end justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-[92%] w-auto max-w-full object-contain object-bottom
                                   drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 py-4">
                    <p className="text-[17px] font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.speciality}</p>

                    {/* Availability + chip row (fixed) */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      {/* Availability toggle */}
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
                        <input
                          type="checkbox"
                          checked={item.available}
                          onChange={() => changeAvailability(item._id)}
                          className="peer sr-only"
                        />
                        <span
                          className="
                            relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300
                            peer-checked:bg-emerald-500 transition-colors
                          "
                        >
                          <span
                            className="
                              absolute left-1 h-4 w-4 rounded-full bg-white shadow
                              transition-transform peer-checked:translate-x-5
                            "
                          />
                        </span>
                        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </label>

                      {/* Status chip */}
                      <span
                        className={`sm:ml-auto shrink-0 whitespace-nowrap inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${
                          item.available
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-slate-50 text-slate-700 ring-slate-200"
                        }`}
                      >
                        {item.available ? "Open for booking" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorsList;