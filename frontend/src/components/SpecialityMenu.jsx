import React, { useLayoutEffect, useRef, useEffect } from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

// GSAP + ScrollTrigger
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Faster animation configuration
const ANIMATION_CONFIG = {
  onboarding: {
    delay: 0.05,          // was 0.15
    ease: "power3.out",   // a bit snappier than power2
    containerDuration: 0.6, // was 0.9
    itemDuration: 0.5,      // was 0.7
    tileDuration: 0.45,     // was 0.6
    stagger: 0.08,          // was 0.12
  },
  tiles: {
    staggerEach: 0.04,      // was 0.06
    from: "center",
  },
  parallax: {
    ambientY: -40,
    scrub: 0.25,            // faster response (was 0.4)
  },
  cta: {
    pulse: true,
    scale: 1.015,           // slightly subtler bump
    duration: 0.6,          // quicker micro-pulse
  },
};

const slug = (s = "") =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const Tile = ({ item }) => (
  <Link
    to={`/doctors/${slug(item.speciality)}`}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    // "tile" class used for GSAP stagger selection
    className="
      tile group relative isolate shrink-0 snap-center [scroll-snap-stop:always]
      w-[150px] sm:w-[165px] h-[170px]
      rounded-2xl bg-white ring-1 ring-slate-200
      shadow-[0_10px_25px_rgba(0,0,0,0.07)]
      hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.18),0_10px_20px_rgba(0,0,0,0.12)]
      transition-all duration-300
      flex flex-col items-center justify-center text-center px-3
      will-change-transform transform-gpu
    "
  >
    {/* Icon circle */}
    <div className="relative grid place-items-center rounded-full size-20 sm:size-[88px] mb-3 ring-1 ring-slate-200 bg-gradient-to-r from-[#0E3A67] via-[#1177A6] to-[#06B6D4]">
      <img
        src={item.image}
        alt={item.speciality}
        loading="lazy"
        className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
        draggable="false"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(140deg,rgba(255,255,255,0.5),rgba(255,255,255,0)_40%)] opacity-60" />
    </div>

    <p className="text-[13px] sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition">
      {item.speciality}
    </p>

    {/* subtle corner shine */}
    <span className="pointer-events-none absolute -top-px -left-px w-12 h-12 rounded-tl-2xl bg-[radial-gradient(20px_20px_at_100%_100%,rgba(2,132,199,0.15),transparent)]" />
    <span className="pointer-events-none absolute -bottom-px -right-px w-12 h-12 rounded-br-2xl bg-[radial-gradient(20px_20px_at_0%_0%,rgba(2,132,199,0.12),transparent)]" />
  </Link>
);

const VerticalSeparator = () => (
  // "v-sep" for GSAP scaleY reveal
  <span className="v-sep hidden md:block w-[3px] h-24 mx-2 rounded-full bg-gradient-to-b from-slate-200/0 via-slate-200/80 to-slate-200/0 shadow-[inset_0_0_6px_rgba(0,0,0,0.08)] will-change-transform transform-gpu" />
);

const SpecialityMenu = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const ambientRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);

  // Faster reveal-on-scroll + parallax
  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const {
      delay,
      ease,
      containerDuration,
      itemDuration,
      tileDuration,
      stagger,
    } = ANIMATION_CONFIG.onboarding;

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray(".tile");
      const separators = gsap.utils.toArray(".v-sep");

      // Prevent FOUC before animation
      gsap.set(containerRef.current, { autoAlpha: 0, y: 24 });
      gsap.set([titleRef.current, subtextRef.current], { autoAlpha: 0, y: 16 });
      gsap.set(tiles, { autoAlpha: 0, y: 14, scale: 0.985 });
      gsap.set(separators, { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 50%" });
      gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 });

      // Reveal timeline – quicker timings and more overlap
      const tl = gsap.timeline({
        defaults: { ease },
        delay,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // earlier entry for snappier perception
          once: true,
        },
      });

      // 1) Container
      tl.to(containerRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: containerDuration,
        clearProps: "transform,opacity",
      });

      // 2) Title + subtext (with slightly more overlap)
      tl.to(
        [titleRef.current, subtextRef.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: itemDuration,
          stagger,
          clearProps: "transform,opacity",
        },
        "-=0.5"
      );

      // 3) Tiles + separators
      if (tiles.length) {
        tl.to(
          tiles,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: tileDuration,
            stagger: { each: ANIMATION_CONFIG.tiles.staggerEach, from: ANIMATION_CONFIG.tiles.from },
            clearProps: "transform,opacity",
          },
          "-=0.25"
        );
      }
      if (separators.length) {
        tl.to(
          separators,
          {
            autoAlpha: 1,
            scaleY: 1,
            duration: 0.35,
            stagger: 0.02,
            clearProps: "transform,opacity",
          },
          "<"
        );
      }

      // 4) CTA + quick micro pulse
      tl.to(
        ctaRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: itemDuration,
          clearProps: "transform,opacity",
        },
        "-=0.2"
      );

      if (ANIMATION_CONFIG.cta.pulse) {
        tl.to(ctaRef.current, {
          scale: ANIMATION_CONFIG.cta.scale,
          duration: ANIMATION_CONFIG.cta.duration,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
          clearProps: "transform",
        });
      }

      // Ambient parallax
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
    <section id="speciality" ref={sectionRef} className="px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Floating container */}
      <div
        ref={containerRef}
        className="
          relative mx-auto max-w-6xl lg:max-w-7xl
          overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm
          ring-1 ring-black/5
          shadow-[0_28px_60px_rgba(0,0,0,0.18),0_12px_26px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.10)]
          will-change-transform transform-gpu
        "
      >
        {/* Ambient gradients (parallax animated) */}
        <div
          ref={ambientRef}
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]"
        />

        {/* Header */}
        <div className="px-6 sm:px-8 lg:px-12 pt-10 md:pt-12 text-center">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-semibold text-slate-900">
            Find by Speciality
          </h2>
          <p
            ref={subtextRef}
            className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto"
          >
            Simply browse through our extensive list of trusted doctors, schedule your appointment
            hassle-free.
          </p>
        </div>

        {/* Desktop row with separators */}
        <div className="hidden md:flex items-center justify-center gap-0 px-6 sm:px-8 lg:px-12 pt-8">
          {specialityData.map((item, i) => (
            <React.Fragment key={i}>
              <Tile item={item} />
              {i < specialityData.length - 1 && <VerticalSeparator />}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile scroller (polished) */}
        <div className="md:hidden relative -mx-4 px-4 pt-8 pb-10">
          <div
            className="
              relative z-10 flex gap-4 overflow-x-auto no-scrollbar
              snap-x snap-mandatory scroll-smooth touch-pan-x
              will-change-transform transform-gpu
            "
            style={{
              WebkitOverflowScrolling: "touch",
              scrollPaddingLeft: "24px",
              scrollPaddingRight: "24px",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
            }}
          >
            {/* small spacers so first/last tile can center nicely */}
            <div className="shrink-0 w-1" aria-hidden="true" />
            {specialityData.map((item, i) => (
              <Tile key={i} item={item} />
            ))}
            <div className="shrink-0 w-1" aria-hidden="true" />
          </div>

          {/* Hide scrollbar utility */}
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>

        {/* CTA */}
        <div className="px-6 sm:px-8 lg:px-12 pb-14 md:pb-16 pt-6 text-center">
          <Link
            ref={ctaRef}
            to="/doctors"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
              inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white
              bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]
              shadow-[inset_0_-1px_0_rgba(255,255,255,0.12),0_8px_18px_rgba(59,130,246,0.35),0_2px_6px_rgba(0,0,0,0.18)]
              hover:brightness-105 transition
              will-change-transform transform-gpu
            "
          >
            Browse all doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpecialityMenu;