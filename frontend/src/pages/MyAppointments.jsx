import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_"); // d_m_y
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.slice().reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_ROZORPAY_KEY_ID, // ensure this env var exists
      amount: order.amount,
      currency: order.currency,
      name: "MediVault",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyrazorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              My appointments
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl mx-auto">
              Review upcoming, cancelled, and completed bookings.
            </p>
          </div>

          {/* Content */}
          <div className="mt-8 space-y-6">
            {loading && <div className="text-center text-slate-500">Loading appointments…</div>}

            {!loading && appointments.length === 0 && (
              <div className="text-center text-slate-500">You don’t have any appointments yet.</div>
            )}

            {!loading &&
              appointments.map((item) => {
                const isCancelled = item.cancelled;
                const isCompleted = item.isCompleted;
                const isPaid = item.payment; // new flag usage

                const status = isCompleted ? "Completed" : isCancelled ? "Cancelled" : "Upcoming";
                const statusStyle =
                  status === "Completed"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : status === "Cancelled"
                    ? "bg-rose-50 text-rose-700 ring-rose-200"
                    : "bg-sky-50 text-sky-700 ring-sky-200";

                return (
                  <div
                    key={item._id}
                    className="
                      group relative isolate overflow-hidden rounded-2xl bg-white
                      ring-1 ring-slate-200
                      shadow-[0_10px_25px_rgba(0,0,0,0.07)]
                      transition-all duration-300 hover:-translate-y-1.5
                      hover:shadow-[0_30px_60px_rgba(0,0,0,0.18),0_12px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]
                    "
                  >
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(800px_200px_at_20%_-10%,rgba(45,212,191,0.15),transparent_60%)]" />

                    {/* Gradient image band */}
                    <div className="relative bg-sky-50/70">
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]" />
                      <div className="relative h-40 sm:h-44 px-4 sm:px-5 flex items-end justify-start gap-4 overflow-hidden">
                        <img
                          src={item.docData.image}
                          alt={item.docData.name}
                          loading="lazy"
                          className="h-[90%] w-auto max-w-full object-contain object-bottom drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)]"
                        />
                        <div className="absolute right-4 top-4">
                          <span className="inline-flex items-center rounded-full bg-white/95 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-medium shadow-sm">
                            {slotDateFormat(item.slotDate)} • {item.slotTime.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyle}`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              status === "Completed"
                                ? "bg-emerald-500"
                                : status === "Cancelled"
                                ? "bg-rose-500"
                                : "bg-sky-500"
                            }`}
                          />
                          {status}
                        </span>

                        {/* Paid chip if paid */}
                        {isPaid && (
                          <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200">
                            Paid
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <p className="text-[17px] font-semibold text-slate-900">
                          {item.docData.name}
                        </p>
                        <p className="text-sm text-slate-500">{item.docData.speciality}</p>
                      </div>

                      <div className="mt-3 text-sm text-slate-600">
                        <p className="text-slate-700 font-medium">Address:</p>
                        <p className="text-xs">{item.docData.address?.line1}</p>
                        <p className="text-xs">{item.docData.address?.line2}</p>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-slate-500">
                          Ref: <span className="font-medium text-slate-700">{item._id}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* When NOT cancelled or completed */}
                          {!isCancelled && !isCompleted && (
                            <>
                              {/* If NOT paid: show Pay Online */}
                              {!isPaid && (
                                <button
                                  type="button"
                                  onClick={() => appointmentRazorpay(item._id)}
                                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_8px_18px_rgba(59,130,246,0.35)] hover:brightness-[1.06] transition"
                                >
                                  Pay Online
                                </button>
                              )}

                              {/* If paid: show Paid chip (no Pay button) */}
                              {isPaid && (
                                <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200">
                                  Paid
                                </span>
                              )}

                              {/* Cancel always available while not completed/cancelled */}
                              <button
                                type="button"
                                onClick={() => cancelAppointment(item._id)}
                                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-rose-600 bg-white ring-1 ring-rose-200 hover:bg-rose-50 transition"
                              >
                                Cancel appointment
                              </button>
                            </>
                          )}

                          {/* Cancelled */}
                          {isCancelled && !isCompleted && (
                            <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 ring-1 ring-rose-200">
                              Appointment cancelled
                            </span>
                          )}

                          {/* Completed */}
                          {isCompleted && (
                            <span className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
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

export default MyAppointments;