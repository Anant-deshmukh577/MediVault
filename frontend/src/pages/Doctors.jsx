import React, { useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Star = ({ className = "w-4 h-4 text-yellow-400" }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118L10.5 13.347a1 1 0 00-1.175 0l-2.937 2.136c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.754 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);

  const specialities = useMemo(() => {
    const seen = Array.from(new Set(doctors.map(d => d.speciality).filter(Boolean)));
    const order = [
      "General physician",
      "Gynecologist",
      "Dermatologist",
      "Pediatricians",
      "Neurologist",
      "Gastroenterologist",
    ];
    const ordered = order.filter(o => seen.includes(o));
    const rest = seen.filter(s => !order.includes(s));
    return ["All", ...ordered, ...rest];
  }, [doctors]);

  const filtered = useMemo(() => {
    if (!speciality || speciality === "All") return doctors;
    return doctors.filter(d => d.speciality === speciality);
  }, [doctors, speciality]);

  const setSpec = (s) => {
    if (s === "All") navigate("/doctors");
    else navigate(`/doctors/${encodeURIComponent(s)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {/* Header (centered) */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
                Browse through the doctors specialist.
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-600">
                Filter by speciality and book your appointment.
              </p>
            </div>

            {/* Mobile filter toggle + chips */}
            <div className="md:hidden mt-2 w-full">
              <button
                onClick={() => setShowFilter((p) => !p)}
                className="rounded-full px-4 py-2 text-sm font-medium bg-white ring-1 ring-slate-200 shadow-sm"
              >
                {showFilter ? "Hide filters" : "Show filters"}
              </button>

              {showFilter && (
                <div className="mt-3">
                  <div
                    className="
                      no-scrollbar w-full overflow-x-auto flex gap-2 px-1
                      snap-x snap-mandatory touch-pan-x
                    "
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {specialities.map((s) => {
                      const isActive = (speciality || "All") === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setSpec(s)}
                          className={`
                            shrink-0 snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm ring-1 transition
                            ${isActive
                              ? "bg-gradient-to-r from-[#0E3A67]/10 via-[#1177A6]/10 to-[#06B6D4]/10 text-slate-900 ring-slate-300"
                              : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}
                          `}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content grid with sidebar filter */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] p-4">
                <p className="text-sm font-semibold text-slate-900 mb-3">Speciality</p>
                <div className="space-y-2">
                  {specialities.map((s) => {
                    const isActive = (speciality || "All") === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSpec(s)}
                        className={`w-full text-left rounded-xl px-4 py-3 text-sm transition ring-1 ${
                          isActive
                            ? "bg-gradient-to-r from-[#0E3A67]/8 via-[#1177A6]/8 to-[#06B6D4]/8 text-slate-900 ring-slate-300"
                            : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Doctors grid */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                {filtered.map((item, index) => {
                  const rating = item.rating ?? item.avgRating ?? 4.8;
                  const reviews = item.reviews ?? item.totalReviews ?? 120;

                  return (
                    <div
                      key={item._id || index}
                      onClick={() => {
                        navigate(`/appointment/${item._id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
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

                      {/* Image area — gradient band */}
                      <div className="relative bg-sky-50/70">
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]" />
                        <div className="relative h-44 sm:h-48 md:h-52 px-3 sm:px-4 pb-0 overflow-hidden flex items-end justify-center">
                          <img
                            className="h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-[1.03]"
                            src={item.image}
                            alt={item.name || "Doctor"}
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-5 py-4">
                        <div className="flex items-center gap-2 text-[13px]">
                          <span
                            className={`
                              inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset
                              ${item.available ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}
                            `}
                          >
                            <span className={`w-2 h-2 rounded-full ${item.available ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {item.available ? "Available" : "Not Available"}
                          </span>

                          <span className="ml-auto inline-flex items-center gap-1 text-slate-600">
                            <Star />
                            <span className="text-sm font-medium">{rating}</span>
                            <span className="text-xs text-slate-400">({reviews})</span>
                          </span>
                        </div>

                        <p className="mt-3 text-[17px] font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.speciality}</p>

                        <div className="mt-4 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/appointment/${item._id}`);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="
                              inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white
                              bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]
                              shadow-[inset_0_-1px_0_rgba(255,255,255,0.12),0_8px_18px_rgba(59,130,246,0.35),0_2px_6px_rgba(0,0,0,0.18)]
                              hover:brightness-[1.06] active:scale-[0.98] transition
                            "
                          >
                            Book now
                          </button>

                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition">
                            View Profile →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="mt-10 text-center text-slate-500">
                  No doctors found for “{speciality}”.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar utility (always available) */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Doctors;