import React, { useRef, useLayoutEffect, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

// GSAP + ScrollTrigger
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/**
 * Faster animation configuration
 * - onboarding: quicker reveal cadence
 * - parallax: more responsive drift
 */
const ANIMATION_CONFIG = {
  onboarding: {
    delay: 0.02,          // was 0.05
    ease: "power3.out",
    containerDuration: 0.45, // was 0.6
    blockDuration: 0.4,      // was 0.5
    itemDuration: 0.35,      // was 0.45
    stagger: 0.06,           // was 0.08
    socialStagger: 0.045,    // was 0.06
    triggerStart: "top 88%", // slightly earlier
  },
  parallax: {
    ambientY: -35,
    scrub: 0.22,            // faster response (was 0.3)
  },
};

const Footer = () => {
  // Put your real social links here
  const socials = {
    x: "https://x.com", // new Twitter (X)
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com/in/anant-deshmukh-611051272",
    github: "https://https://github.com/Anant-deshmukh577",
  };

  // Refs for GSAP
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const ambientRef = useRef(null);
  const brandBlockRef = useRef(null);
  const descRef = useRef(null);
  const bottomBarRef = useRef(null);

  // Reveal-on-scroll + ambient parallax
  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const {
      delay,
      ease,
      containerDuration,
      blockDuration,
      itemDuration,
      stagger,
      socialStagger,
      triggerStart,
    } = ANIMATION_CONFIG.onboarding;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      // Node lists
      const socialsEls = q(".social");         // social icons
      const linkItems = q(".link-item");       // footer link items
      const contactItems = q(".contact-item"); // contact list items

      // Initial states to prevent FOUC
      gsap.set(containerRef.current, { autoAlpha: 0, y: 22 });
      gsap.set([brandBlockRef.current, descRef.current], { autoAlpha: 0, y: 12 });
      gsap.set(socialsEls, { autoAlpha: 0, y: 10, scale: 0.9 });
      gsap.set(linkItems, { autoAlpha: 0, y: 10 });
      gsap.set(contactItems, { autoAlpha: 0, y: 10 });
      gsap.set(bottomBarRef.current, { autoAlpha: 0, y: 10 });

      // Reveal timeline (plays once as footer enters)
      const tl = gsap.timeline({
        defaults: { ease },
        delay,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: triggerStart,
          once: true,
        },
      });

      // 1) Container card
      tl.to(containerRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: containerDuration,
        clearProps: "transform,opacity",
      });

      // 2) Brand row + description
      tl.to(
        [brandBlockRef.current, descRef.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: blockDuration,
          stagger,
          clearProps: "transform,opacity",
        },
        "-=0.35"
      );

      // 3) Social icons stagger
      if (socialsEls.length) {
        tl.to(
          socialsEls,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: itemDuration,
            stagger: socialStagger,
            clearProps: "transform,opacity",
          },
          "-=0.2"
        );
      }

      // 4) Link items
      if (linkItems.length) {
        tl.to(
          linkItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: itemDuration,
            stagger: 0.04,
            clearProps: "transform,opacity",
          },
          "-=0.1"
        );
      }

      // 5) Contact items
      if (contactItems.length) {
        tl.to(
          contactItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: itemDuration,
            stagger: 0.04,
            clearProps: "transform,opacity",
          },
          "<"
        );
      }

      // 6) Bottom bar
      tl.to(bottomBarRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: itemDuration,
        clearProps: "transform,opacity",
      });

      // Ambient parallax (soft drift on scroll)
      if (ambientRef.current) {
        gsap.to(ambientRef.current, {
          y: ANIMATION_CONFIG.parallax.ambientY,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: ANIMATION_CONFIG.parallax.scrub,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keep ScrollTrigger positions correct
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <footer ref={sectionRef} className="relative isolate px-4 sm:px-6 lg:px-8 mt-24 mb-10">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-6xl lg:max-w-7xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)] will-change-transform transform-gpu"
      >
        {/* Ambient gradients (parallax animated) */}
        <div
          ref={ambientRef}
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]"
        />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* Brand */}
            <div className="md:col-span-6">
              <div ref={brandBlockRef} className="flex items-center gap-3 mb-4">
                <img src={assets.logo} alt="MediVault logo" className="w-12 h-12 rounded-xl" />
                <span className="text-xl md:text-2xl font-semibold text-slate-900">
                  MediVault
                </span>
              </div>

              <p ref={descRef} className="text-slate-600 leading-7 max-w-xl">
                MediVault is committed to redefining healthcare management through secure, intelligent, and seamless digital record solutions. We empower clinics, doctors, and patients with fast access, reliable storage, and modern tools designed for better decision-making and smoother care.
              </p>

              {/* Socials */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MediVault on X"
                  className="social grid place-items-center size-10 rounded-full ring-1 ring-slate-300 bg-white shadow-sm text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition will-change-transform transform-gpu"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2H21.3l-6.64 7.59L22 22h-6.23l-4.86-6.84L5.72 22H2.7l7.38-8.5L2 2h6.28l4.51 6.35L18.244 2Z" />
                  </svg>
                </a>

                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MediVault on Instagram"
                  className="social grid place-items-center size-10 rounded-full ring-1 ring-slate-300 bg-white shadow-sm text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition will-change-transform transform-gpu"
                >
                  <svg viewBox="0 0 24 24" className="w-[25px] h-[25px]" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8,2 L16,2 C19.3137085,2 22,4.6862915 22,8 L22,16 C22,19.3137085 19.3137085,22 16,22 L8,22 C4.6862915,22 2,19.3137085 2,16 L2,8 C2,4.6862915 4.6862915,2 8,2 Z M8,4 C5.790861,4 4,5.790861 4,8 L4,16 C4,18.209139 5.790861,20 8,20 L16,20 C18.209139,20 20,18.209139 20,16 L20,8 C20,5.790861 18.209139,4 16,4 L8,4 Z M12,17 C9.23857625,17 7,14.7614237 7,12 C7,9.23857625 9.23857625,7 12,7 C14.7614237,7 17,9.23857625 17,12 C17,14.7614237 14.7614237,17 12,17 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z M17,8 C16.4477153,8 16,7.55228475 16,7 C16,6.44771525 16.4477153,6 17,6 C17.5522847,6 18,6.44771525 18,7 C18,7.55228475 17.5522847,8 17,8 Z"/>
                  </svg>
                </a>

                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MediVault on LinkedIn"
                  className="social grid place-items-center size-10 rounded-full ring-1 ring-slate-300 bg-white shadow-sm text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition will-change-transform transform-gpu"
                >
                  <svg viewBox="0 0 24 24" className="w-[23px] h-[23px]" fill="currentColor" aria-hidden="true">
                    <path d='M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792zM2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254v12.869z' />
                  </svg>
                </a>

                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MediVault on GitHub"
                  className="social grid place-items-center size-10 rounded-full ring-1 ring-slate-300 bg-white shadow-sm text-slate-800 hover:text-slate-950 hover:bg-slate-50 transition will-change-transform transform-gpu"
                >
                  <svg viewBox="0 0 24 24" className="w-[25px] h-[25px]" fill="currentColor" aria-hidden="true">
                    <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3">
              <p className="text-lg font-semibold text-slate-900 mb-4">Company</p>
              <ul className="space-y-2 text-slate-600">
                <li className="link-item">
                  <Link to="/" className="hover:text-slate-900 transition">Home</Link>
                </li>
                <li className="link-item">
                  <Link to="/about" className="hover:text-slate-900 transition">About us</Link>
                </li>
                <li className="link-item">
                  <Link to="/contact" className="hover:text-slate-900 transition">Contact us</Link>
                </li>
                <li className="link-item">
                  <Link to="/privacy" className="hover:text-slate-900 transition">Privacy policy</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <p className="text-lg font-semibold text-slate-900 mb-4">Get in touch</p>
              <ul className="space-y-3 text-slate-700">
                <li className="contact-item flex items-center gap-3 w-full max-w-full rounded-xl bg-white ring-1 ring-slate-200 px-3 py-2 shadow-sm">
                  <span className="grid place-items-center size-8 rounded-full bg-sky-50 text-sky-600 shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path fill="currentColor" d="M6.6 10.8c1.6 3.1 4.1 5.6 7.2 7.2l2.4-2.4c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 4 .6.6 0 1 .4 1 1V22c0 .6-.4 1-1 1C10.4 23 1 13.6 1 2c0-.6.4-1 1-1h4c.6 0 1 .4 1 1 0 1.4.2 2.8.6 4 .1.4 0 .8-.3 1.1L6.6 10.8Z"/>
                    </svg>
                  </span>
                  <span className="min-w-0 break-words">+91 9373423633</span>
                </li>

                <li className="contact-item flex items-center gap-3 w-full max-w-full rounded-xl bg-white ring-1 ring-slate-200 px-3 py-2 shadow-sm">
                  <span className="grid place-items-center size-8 rounded-full bg-sky-50 text-sky-600 shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path fill="currentColor" d="M20 8V6l-8 5L4 6v2l8 5 8-5Zm0 4l-8 5-8-5v2l8 5 8-5v-2Z"/>
                    </svg>
                  </span>
                  <span className="min-w-0 break-all sm:break-words">anantdeshmukh018@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            ref={bottomBarRef}
            className="mt-10 border-t border-slate-200/70 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          >
            <p className="text-sm text-slate-600">
              Copyright © 2025 MediVault — All rights reserved
            </p>
            <div className="inline-flex items-center gap-2">
              <span className="text-xs text-slate-500">Made by</span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4] shadow-[0_8px_18px_rgba(6,182,212,0.35)]">
                Anant Deshmukh
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;