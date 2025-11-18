import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <section id="about" className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients inside */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">MediVault</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              Empowering clinics and patients with smarter health records and effortless appointments.
            </p>
          </div>

          {/* Main content */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
            {/* Image with soft blob + shadow */}
            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_50%_at_20%_10%,rgba(17,119,166,0.18),transparent_70%),radial-gradient(40%_40%_at_90%_20%,rgba(6,182,212,0.18),transparent_70%)] blur-md" />
                <div className="relative rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_14px_30px_rgba(0,0,0,0.12)] p-3">
                  <img
                    src={assets.about_image}
                    alt="MediVault platform"
                    className="w-full h-auto rounded-xl object-cover drop-shadow-[0_24px_55px_rgba(0,0,0,0.25)]"
                  />
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="md:col-span-7">
              <div className="flex flex-col gap-5 text-sm md:text-[15px] text-slate-600 leading-7">
                <p>
                  Welcome to MediVault, your trusted partner in managing healthcare needs conveniently and efficiently. 
                  We understand the challenges patients face when scheduling doctor appointments and keeping health records organized.
                </p>
                <p>
                  MediVault continuously evolves with the latest health-tech advancements to deliver a delightful experience. 
                  Whether you’re booking your first appointment or managing ongoing care, we’re here to support you every step of the way.
                </p>

                <div className="mt-2">
                  <p className="text-slate-900 font-semibold">Our Vision</p>
                  <p className="mt-1">
                    Create a seamless, secure healthcare journey—bridging the gap between patients and providers 
                    so you can access the care you need, when you need it.
                  </p>
                </div>

                {/* Quick stats */}
                <ul className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { k: "1k+", label: "Appointments" },
                    { k: "300+", label: "Doctors" },
                    { k: "25+", label: "Specialities" },
                    { k: "98%", label: "Satisfaction" },
                  ].map((s, i) => (
                    <li key={i} className="rounded-xl bg-white ring-1 ring-slate-200 shadow-sm px-4 py-3">
                      <p className="text-lg font-semibold text-slate-900">{s.k}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Why choose us */}
          <div className="mt-12">
            <h3 className="text-center text-xl md:text-2xl font-semibold text-slate-900">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">Choose Us</span>
            </h3>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  title: "Efficiency",
                  text: "Streamlined appointment scheduling that fits your busy lifestyle.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 1a1 1 0 0 1 1 1v1h3V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v4H3V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1h3V2a1 1 0 0 1 1-1Zm9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9h18Zm-9 2a1 1 0 0 0-1 1v4h4a1 1 0 1 0 0-2h-2v-2a1 1 0 0 0-1-1Z" />
                    </svg>
                  ),
                },
                {
                  title: "Convenience",
                  text: "Find trusted specialists nearby and manage everything in one place.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                    </svg>
                  ),
                },
                {
                  title: "Personalization",
                  text: "Smart reminders and tailored suggestions that keep you on track.",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10s-2-1.24-4-2.86c-2 1.62-4 2.86-4 2.86Z" />
                    </svg>
                  ),
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="group relative isolate rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.14)] transition"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(700px_200px_at_30%_-10%,rgba(45,212,191,0.15),transparent_60%)]" />
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 bg-white shadow-sm">
                    <span className="grid place-items-center size-6 rounded-full text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
                      {c.icon}
                    </span>
                    {c.title}
                  </div>
                  <p className="mt-3 text-slate-600">{c.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <a
                href="#speciality"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4] shadow-[0_10px_24px_rgba(6,182,212,0.35),0_4px_12px_rgba(0,0,0,0.18)] hover:brightness-105 transition"
              >
                Explore specialities
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;