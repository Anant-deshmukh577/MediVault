import React, { useContext, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// GSAP + ScrollTrigger
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Tuned to feel snappy but smooth
const ANIMATION_CONFIG = {
  onboarding: {
    delay: 0.05,
    ease: "power3.out",
    containerDuration: 0.6,
    itemDuration: 0.5,
    cardDuration: 0.45,
    stagger: 0.08,
  },
  cards: {
    staggerEach: 0.05,
    from: "center", // center-out reveal
  },
  parallax: {
    ambientY: -50,
    scrub: 0.25,
  },
  hoverTilt: {
    enabled: true,  // 3D tilt on pointer devices
    maxX: 6,        // degrees up/down
    maxY: 8,        // degrees left/right
    scale: 1.01,
    duration: 0.25,
  },
};

const Star = ({ className = "w-4 h-4 text-yellow-400" }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118L10.5 13.347a1 1 0 00-1.175 0l-2.937 2.136c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.754 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  // Filter valid + available cards
  const availableDoctors = doctors.filter((doc) => doc && doc._id && doc.name && doc.image);
  const items = availableDoctors.slice(0, 8);

  const open = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Refs for animations
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const ambientRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const gridRef = useRef(null);
  const moreCtaRef = useRef(null);

  // Reveal-on-scroll + parallax (re-runs when items length changes)
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
      cardDuration,
      stagger,
    } = ANIMATION_CONFIG.onboarding;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      const cards = q(".doc-card");
      const imgs = q(".doc-card .doc-img");

      // Prevent FOUC
      gsap.set(containerRef.current, { autoAlpha: 0, y: 24 });
      gsap.set([titleRef.current, subtextRef.current], { autoAlpha: 0, y: 16 });
      gsap.set(cards, { autoAlpha: 0, y: 18, scale: 0.985 });
      gsap.set(moreCtaRef.current, { autoAlpha: 0, y: 12 });

      // Reveal timeline
      const tl = gsap.timeline({
        defaults: { ease },
        delay,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
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

      // 2) Header
      tl.to(
        [titleRef.current, subtextRef.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: itemDuration,
          stagger,
          clearProps: "transform,opacity",
        },
        "-=0.45"
      );

      // 3) Cards + image lift
      if (cards.length) {
        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: cardDuration,
            stagger: {
              each: ANIMATION_CONFIG.cards.staggerEach,
              grid: "auto",
              from: ANIMATION_CONFIG.cards.from,
            },
            clearProps: "transform,opacity",
          },
          "-=0.25"
        );
      }
      if (imgs.length) {
        tl.from(
          imgs,
          {
            y: 14,
            autoAlpha: 0,
            duration: 0.35,
            stagger: { each: 0.03, grid: "auto", from: ANIMATION_CONFIG.cards.from },
            clearProps: "transform,opacity",
          },
          "<"
        );
      }

      // 4) Bottom CTA
      tl.to(
        moreCtaRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: itemDuration,
          clearProps: "transform,opacity",
        },
        "-=0.15"
      );

      // 5) Ambient parallax (soft drift)
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
  }, [items.length]);

  // Card hover 3D tilt micro-interaction (manual cleanup, no ctx.add)
  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion || !ANIMATION_CONFIG.hoverTilt.enabled || !hasFinePointer) return;

    const removers = [];
    const q = gsap.utils.selector(sectionRef);
    const cards = q(".doc-card");

    cards.forEach((card) => {
      // 3D perspective for tilt
      gsap.set(card, { transformPerspective: 800 });

      const qx = gsap.quickTo(card, "rotateX", { duration: ANIMATION_CONFIG.hoverTilt.duration, ease: "power3.out" });
      const qy = gsap.quickTo(card, "rotateY", { duration: ANIMATION_CONFIG.hoverTilt.duration, ease: "power3.out" });
      const qs = gsap.quickTo(card, "scale",   { duration: ANIMATION_CONFIG.hoverTilt.duration, ease: "power3.out" });

      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((rect.height / 2 - y) / rect.height) * ANIMATION_CONFIG.hoverTilt.maxX;
        const ry = ((x - rect.width / 2) / rect.width) * ANIMATION_CONFIG.hoverTilt.maxY;
        qx(rx);
        qy(ry);
      };
      const onEnter = () => qs(ANIMATION_CONFIG.hoverTilt.scale);
      const onLeave = () => {
        qx(0);
        qy(0);
        qs(1);
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      removers.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => removers.forEach((fn) => fn());
  }, [items.length]);

  // Keep ScrollTrigger positions correct as content/images load
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[1] px-4 sm:px-6 lg:px-8 my-12 md:my-16">
      {/* Card container */}
      <div
        ref={containerRef}
        className="
          relative mx-auto max-w-6xl lg:max-w-7xl
          rounded-3xl bg-white
          ring-1 ring-black/10
          shadow-[0_28px_60px_rgba(0,0,0,0.20),0_12px_26px_rgba(0,0,0,0.14),0_3px_10px_rgba(0,0,0,0.10)]
          overflow-hidden
          will-change-transform transform-gpu
        "
      >
        {/* Ambient background (parallax animated) */}
        <div
          ref={ambientRef}
          className="
            absolute inset-0 z-0 pointer-events-none
            bg-[radial-gradient(900px_400px_at_-10%_-20%,rgba(59,130,246,0.10),transparent_60%),
                radial-gradient(700px_350px_at_110%_-10%,rgba(45,212,191,0.10),transparent_60%)]
          "
        />

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-8 lg:px-12 pt-10 md:pt-12 pb-10 md:pb-12">
          {/* Header */}
          <div className="text-center">
            <h1 ref={titleRef} className="text-3xl md:text-4xl font-semibold text-slate-900">
              Top Doctors to Book
            </h1>
            <p ref={subtextRef} className="mt-2 text-sm md:text-base text-slate-600 max-w-xl mx-auto">
              Simply browse through our extensive list of trusted doctors.
            </p>
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <div className="mt-10 text-center text-slate-500">
              <p>No doctors available at the moment.</p>
              <p className="text-sm mt-2">Please check back later or contact support.</p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7"
            >
              {items.map((item, idx) => {
                const id = item._id ?? idx;
                const available = item.available ?? true;
                const rating = item.rating ?? item.avgRating ?? 4.8;
                const reviews = item.reviews ?? item.totalReviews ?? 120;

                return (
                  <div
                    key={id}
                    onClick={() => open(id)}
                    className="
                      doc-card group relative isolate cursor-pointer overflow-hidden rounded-2xl bg-white
                      ring-1 ring-slate-200
                      shadow-[0_10px_25px_rgba(0,0,0,0.07)]
                      transition-all duration-300
                      hover:-translate-y-1.5
                      hover:shadow-[0_30px_60px_rgba(0,0,0,0.18),0_12px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]
                      will-change-transform transform-gpu
                    "
                  >
                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition
                                 bg-[radial-gradient(800px_200px_at_20%_-10%,rgba(45,212,191,0.15),transparent_60%)]"
                    />

                    {/* Image area */}
                    <div className="relative bg-sky-50/70">
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc]" />
                      <div className="relative h-44 sm:h-48 md:h-52 px-3 sm:px-4 pb-0 overflow-hidden flex items-end justify-center">
                        <img
                          src={item.image}
                          alt={item.name || "Doctor"}
                          loading="lazy"
                          className="
                            doc-img h-full w-auto max-w-full object-contain object-bottom
                            drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)]
                            transition-transform duration-300 group-hover:scale-[1.03]
                          "
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 py-4">
                      <div className="flex items-center gap-2 text-[13px]">
                        <span
                          className={`
                            inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset
                            ${available ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}
                          `}
                        >
                          <span className={`w-2 h-2 rounded-full ${available ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {available ? "Available" : "Not Available"}
                        </span>

                        <span className="ml-auto inline-flex items-center gap-1 text-slate-600">
                          <Star />
                          <span className="text-sm font-medium">{rating}</span>
                          <span className="text-xs text-slate-400">({reviews})</span>
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="text-[17px] font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.speciality}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            open(id);
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
          )}

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              ref={moreCtaRef}
              onClick={() => {
                navigate("/doctors");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="
                inline-flex items-center justify-center rounded-full px-10 py-3 text-sm font-medium
                text-white bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] ring-1 ring-slate-200
                shadow-[inset_0_-1px_0_rgba(255,255,255,0.12),0_8px_18px_rgba(59,130,246,0.35),0_2px_6px_rgba(0,0,0,0.18)]
                hover:brightness-105 transition
                will-change-transform transform-gpu
              "
            >
              More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;