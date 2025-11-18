import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // Refs for horizontal scrollers
  const daysRef = useRef(null);
  const timesRef = useRef(null);

  // Desktop: convert mouse wheel vertical scroll to horizontal
  useEffect(() => {
    const attachWheel = (el) => {
      if (!el) return () => {};
      const handler = (e) => {
        if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      };
      el.addEventListener("wheel", handler, { passive: false });
      return () => el.removeEventListener("wheel", handler);
    };
    const cleanupDays = attachWheel(daysRef.current);
    const cleanupTimes = attachWheel(timesRef.current);
    return () => {
      cleanupDays && cleanupDays();
      cleanupTimes && cleanupTimes();
    };
  }, [docSlots, slotIndex]);

  const scrollByX = (ref, dx) => {
    if (!ref?.current) return;
    ref.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  // Pull selected doctor
  const fetchDocInfo = () => {
    const info = doctors.find((d) => d._id === docId);
    setDocInfo(info || null);
  };

  // Build next 7 days slots
  const getAvailableSlots = () => {
    if (!docInfo) return;
    setDocSlots([]);

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotT = formattedTime;

        const isSlotAvailable = !(
          docInfo?.slots_booked?.[slotDate]?.includes(slotT)
        );

        if (isSlotAvailable) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    if (!docSlots?.[slotIndex]?.length || !slotTime) {
      return toast.info("Please select a day and time slot");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
    setSlotIndex(0);
    setSlotTime("");
  }, [docInfo]);

  useEffect(() => {
    const firstTime = docSlots?.[slotIndex]?.[0]?.time;
    if (firstTime) setSlotTime(firstTime);
  }, [slotIndex, docSlots]);

  if (!docInfo) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Floating container */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* Doc header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Image card */}
            <div className="md:col-span-4">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(60%_50%_at_20%_10%,rgba(17,119,166,0.16),transparent_70%),radial-gradient(40%_40%_at_90%_20%,rgba(6,182,212,0.16),transparent_70%)] blur-md" />
                <div className="relative rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_14px_30px_rgba(0,0,0,0.12)] p-3">
                  <img
                    className="w-full h-auto rounded-xl object-contain bg-sky-50/60"
                    src={docInfo.image}
                    alt={docInfo.name}
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-8">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-2xl md:text-3xl font-semibold text-slate-900">{docInfo.name}</p>
                  <img className="w-5 h-5" src={assets.verified_icon} alt="" />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm mt-2 text-slate-600">
                  <p>
                    {docInfo.degree} — {docInfo.speciality}
                  </p>
                  <span className="px-2 py-1 rounded-full text-xs ring-1 ring-slate-200">
                    {docInfo.experience}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="flex items-center gap-1 text-sm font-medium text-slate-700">
                    About <img className="w-4 h-4" src={assets.info_icon} alt="" />
                  </p>
                  <p className="text-sm text-slate-600 max-w-[700px] mt-1">{docInfo.about}</p>
                </div>

                <p className="text-slate-600 font-medium mt-4">
                  Appointment fee:{" "}
                  <span className="text-slate-900">
                    {currencySymbol}
                    {docInfo.fees}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-slate-200/70" />

          {/* Booking slots */}
          <div>
            <p className="font-semibold text-slate-900">Booking slots</p>

            {/* Days scroller (no chevrons) */}
            <div className="mt-4 -mx-1">
              <div
                ref={daysRef}
                className="
                  flex gap-3 items-center w-full overflow-x-auto px-1
                  no-scrollbar
                  scroll-smooth snap-x snap-mandatory touch-pan-x overscroll-x-contain
                "
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {docSlots.length > 0 &&
                  docSlots.map((arr, idx) => {
                    const first = arr?.[0];
                    const active = slotIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSlotIndex(idx)}
                        className={`shrink-0 snap-start text-center px-4 py-4 min-w-[64px] rounded-full transition ring-1 ${
                          active
                            ? "text-white ring-transparent bg-[linear-gradient(90deg,#0E3A67_0%,#1177A6_50%,#06B6D4_100%)] shadow-[0_10px_24px_rgba(6,182,212,0.35)]"
                            : "text-slate-700 ring-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <p className="text-xs">
                          {first ? daysOfWeek[first.datetime.getDay()] : "--"}
                        </p>
                        <p className="text-base font-semibold">
                          {first ? first.datetime.getDate() : "--"}
                        </p>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Time chips with chevrons at outer card edges */}
            <div className="mt-4 -mx-1 relative">
              {/* Chevrons positioned to the outer card edges by offsetting container padding:
                  px-6 -> -left/right-6, sm:px-8 -> -left/right-8, lg:px-12 -> -left/right-12 */}
              <button
                type="button"
                onClick={() => scrollByX(timesRef, -280)}
                className="hidden md:flex items-center justify-center absolute -left-6 sm:-left-8 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 ring-1 ring-slate-200 shadow hover:bg-white"
                aria-label="Scroll times left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByX(timesRef, 280)}
                className="hidden md:flex items-center justify-center absolute -right-6 sm:-right-8 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 ring-1 ring-slate-200 shadow hover:bg-white"
                aria-label="Scroll times right"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                ref={timesRef}
                className="
                  flex gap-2 w-full overflow-x-auto px-1
                  no-scrollbar
                  scroll-smooth snap-x snap-mandatory touch-pan-x overscroll-x-contain
                "
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {docSlots.length > 0 &&
                  docSlots[slotIndex]?.map((item, i) => {
                    const active = item.time === slotTime;
                    return (
                      <button
                        key={i}
                        onClick={() => setSlotTime(item.time)}
                        className={`shrink-0 snap-start text-sm px-5 py-2 rounded-full transition ring-1 ${
                          active
                            ? "text-white ring-transparent bg-[linear-gradient(90deg,#0E3A67_0%,#1177A6_50%,#06B6D4_100%)] shadow-[0_8px_18px_rgba(6,182,212,0.35)]"
                            : "text-slate-600 ring-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        {item.time.toLowerCase()}
                      </button>
                    );
                  })}
              </div>
            </div>

            <button
              onClick={bookAppointment}
              disabled={!slotTime || !docSlots?.[slotIndex]?.length}
              className={`
                mt-6 inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium
                text-white disabled:opacity-60 disabled:cursor-not-allowed
                bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]
                shadow-[0_12px_26px_rgba(6,182,212,0.35),0_4px_12px_rgba(0,0,0,0.18)]
                hover:brightness-105 transition
              `}
            >
              Book an appointment
            </button>
          </div>
        </div>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

      {/* Scrollbar helpers (keep mobile clean) */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar{ display: none; }
        .no-scrollbar{ -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Appointment;