import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <section id="contact" className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Floating container (theme-matched) */}
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]">
        {/* Ambient gradients inside */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
              Contact <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">Us</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              We’d love to hear from you. Reach out for support, partnerships, or general queries.
            </p>
          </div>

          {/* Content */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
            {/* Image with soft blob + shadow */}
            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_50%_at_20%_10%,rgba(17,119,166,0.18),transparent_70%),radial-gradient(40%_40%_at_90%_20%,rgba(6,182,212,0.18),transparent_70%)] blur-md" />
                <div className="relative rounded-2xl bg-white ring-1 ring-slate-200 shadow-[0_14px_30px_rgba(0,0,0,0.12)] p-3">
                  <img
                    src={assets.contact_image}
                    alt="Contact MediVault"
                    className="w-full h-auto rounded-xl object-cover drop-shadow-[0_24px_55px_rgba(0,0,0,0.25)]"
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {/* Office */}
                <div className="group relative isolate rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.14)] transition">
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(700px_200px_at_30%_-10%,rgba(45,212,191,0.15),transparent_60%)]" />
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 bg-white shadow-sm">
                    <span className="grid place-items-center size-6 rounded-full text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                      </svg>
                    </span>
                    Our Office
                  </div>
                  <address className="not-italic mt-3 text-slate-600 leading-7">
                    Datta Meghe Hospital<br />Sawangi (Meghe), Wardha, Maharashtra 442001, India
                  </address>
                </div>

                {/* Contact */}
                <div className="group relative isolate rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.14)] transition">
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(700px_200px_at_30%_-10%,rgba(45,212,191,0.15),transparent_60%)]" />
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 bg-white shadow-sm">
                    <span className="grid place-items-center size-6 rounded-full text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M6.6 10.8c1.6 3.1 4.1 5.6 7.2 7.2l2.4-2.4c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 4 .6.6 0 1 .4 1 1V22c0 .6-.4 1-1 1C10.4 23 1 13.6 1 2c0-.6.4-1 1-1h4c.6 0 1 .4 1 1 0 1.4.2 2.8.6 4 .1.4 0 .8-.3 1.1L6.6 10.8Z" />
                      </svg>
                    </span>
                    Contact
                  </div>
                  <div className="mt-3 space-y-1 text-slate-600">
                    <p>
                      Tel:{" "}
                      <a href="tel:(415)555-0132" className="text-slate-900 font-medium hover:underline">
                        (+91) 70200-12345
                      </a>
                    </p>
                    <p>
                      Email:{" "}
                      <a href="mailto:elyseniyibizi502@gmail.com" className="text-slate-900 font-medium hover:underline">
                        meghehospital01@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="group relative isolate rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.14)] transition">
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(700px_200px_at_30%_-10%,rgba(45,212,191,0.15),transparent_60%)]" />
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 bg-white shadow-sm">
                    <span className="grid place-items-center size-6 rounded-full text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 1a1 1 0 0 1 1 1v1h3V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1h3V2a1 1 0 0 1 1-1Zm7 9H5v9h14v-9Z" />
                      </svg>
                    </span>
                    Hours
                  </div>
                  <div className="mt-3 text-slate-600">
                    Mon–Fri: 9:00 AM – 6:00 PM
                    <br />
                    Sat–Sun: Closed
                  </div>
                </div>

                {/* Careers */}
                <div className="group relative isolate rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.14)] transition">
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(700px_200px_at_30%_-10%,rgba(45,212,191,0.15),transparent_60%)]" />
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 bg-white shadow-sm">
                    <span className="grid place-items-center size-6 rounded-full text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 0 1 1 1v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a1 1 0 0 1 1-1h3V4a2 2 0 0 1 2-2Zm0 4h4V4h-4v2Z" />
                      </svg>
                    </span>
                    Careers at MediVault
                  </div>
                  <p className="mt-3 text-slate-600">Learn more about our teams and job openings.</p>
                  <button className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4] shadow-[0_10px_24px_rgba(6,182,212,0.35),0_4px_12px_rgba(0,0,0,0.18)] hover:brightness-105 transition">
                    Explore Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <a
              href="mailto:meghehospital01@gmail.com"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition"
            >
              Email us directly
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;