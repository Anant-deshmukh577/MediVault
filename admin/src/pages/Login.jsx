import React, { useContext,  useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Login = () => {
  const [state, setState] = useState("Admin"); // "Admin" | "Doctor"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  // Use same video as user login or provide a separate admin video asset
  const heroVideo = assets?.auth_video || assets?.hero_video || "Header.mp4";

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin login successful");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor login successful");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // If you redirect after login elsewhere, you can add an effect here to watch tokens.

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients inside */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12">
          {/* Left: video background + centered glass card */}
          <div className="hidden md:block md:col-span-6 relative min-h-[520px]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={assets?.hero_poster}
            />
            {/* Darkened overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/65 via-slate-900/45 to-slate-900/25" />
            {/* Centered glassmorphism card */}
            <div className="relative z-10 h-full flex items-center justify-center p-6 md:p-10">
              <div className="relative w-full max-w-md text-center rounded-2xl bg-white/18 backdrop-blur-xs ring-1 ring-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.45)] px-6 sm:px-8 py-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0)_45%)]"
                />
                <h2 className="relative text-white text-3xl lg:text-4xl font-semibold leading-tight drop-shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
                  MediVault Console
                </h2>
                <p className="relative mt-3 text-white/95 text-sm max-w-sm mx-auto drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]">
                  Sign in as Admin or Doctor to manage schedules, appointments, and clinical data.
                </p>
              </div>
            </div>
          </div>

          {/* Right: form card */}
          <div className="md:col-span-6 p-6 sm:p-8 lg:p-10">
            <form
              onSubmit={onSubmitHandler}
              className="mx-auto w-full max-w-md rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.06)] p-6 sm:p-7"
            >
              {/* Role toggle */}
              <div className="flex justify-center mb-5">
                <div className="inline-flex rounded-full bg-slate-100 p-1 ring-1 ring-slate-200 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setState("Admin")}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                      state === "Admin"
                        ? "bg-white text-slate-900 shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setState("Doctor")}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                      state === "Doctor"
                        ? "bg-white text-slate-900 shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {state} Login
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Enter your credentials to continue
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-slate-600">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="mt-1 w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1177A6]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600">Password</label>
                  <div className="mt-1 relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2.5 pr-20 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1177A6]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[0_12px_26px_rgba(59,130,246,0.35),0_4px_12px_rgba(0,0,0,0.18)] hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Please wait..." : "Login"}
              </button>

              <p className="mt-4 text-center text-sm text-slate-600">
                {state === "Admin" ? (
                  <>
                    Doctor Login?{" "}
                    <button
                      type="button"
                      onClick={() => setState("Doctor")}
                      className="text-[#1177A6] hover:underline"
                    >
                      Click here
                    </button>
                  </>
                ) : (
                  <>
                    Admin Login?{" "}
                    <button
                      type="button"
                      onClick={() => setState("Admin")}
                      className="text-[#1177A6] hover:underline"
                    >
                      Click here
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;