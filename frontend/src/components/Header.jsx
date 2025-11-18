import React, { useRef, useLayoutEffect, useEffect } from "react";
import { assets } from "../assets/assets";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  onboarding: {
    delay: 0.2,
    ease: "power2.out",
    containerDuration: 1.0,
    itemDuration: 0.8,
    stagger: 0.12,
    imageDuration: 1.0,
  },
  scroll: { parallax: true },
  cta: { pulse: true, scale: 1.02, duration: 1.8 },
};

const Header = () => {
  const heroVideo = (assets && assets.hero_video) || "Header.mp4";

  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);   // side gradient (lighter)
  const scrimRef = useRef(null);     // uniform scrim (lighter)
  const vignetteRef = useRef(null);  // vignette (lighter)
  const leftColRef = useRef(null);
  const headingRef = useRef(null);
  const groupRef = useRef(null);
  const ctaRef = useRef(null);
  const doctorImgRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const { delay, ease, containerDuration, itemDuration, stagger, imageDuration } =
      ANIMATION_CONFIG.onboarding;

    const ctx = gsap.context(() => {
      gsap.set([cardRef.current], { autoAlpha: 0, y: 30 });
      gsap.set([headingRef.current, groupRef.current, ctaRef.current], { autoAlpha: 0, y: 20 });
      gsap.set(doctorImgRef.current, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({ defaults: { ease }, delay });

      tl.to(cardRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: containerDuration,
        clearProps: "transform,opacity",
      });

      tl.to(
        [headingRef.current, groupRef.current, ctaRef.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: itemDuration,
          stagger,
          clearProps: "transform,opacity",
        },
        "-=0.5"
      );

      tl.to(
        doctorImgRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: imageDuration,
          clearProps: "transform,opacity",
        },
        "-=0.6"
      );

      if (ANIMATION_CONFIG.scroll.parallax) {
        gsap.to(doctorImgRef.current, {
          y: -36,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom+=300 top",
            scrub: true,
          },
        });

        if (videoRef.current) {
          gsap.fromTo(
            videoRef.current,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom+=300 top",
                scrub: true,
              },
            }
          );
        }
      }

      if (ANIMATION_CONFIG.cta.pulse && ctaRef.current) {
        gsap.to(ctaRef.current, {
          scale: ANIMATION_CONFIG.cta.scale,
          duration: ANIMATION_CONFIG.cta.duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    const onReady = () => ScrollTrigger.refresh();
    if (v) {
      v.addEventListener("loadedmetadata", onReady);
      v.addEventListener("loadeddata", onReady);
    }
    window.addEventListener("load", onReady);
    return () => {
      if (v) {
        v.removeEventListener("loadedmetadata", onReady);
        v.removeEventListener("loadeddata", onReady);
      }
      window.removeEventListener("load", onReady);
    };
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8">
      <div
        ref={cardRef}
        className="
          relative mx-auto max-w-6xl lg:max-w-7xl mt-8
          overflow-hidden rounded-3xl
          ring-1 ring-black/5
          shadow-[0_28px_60px_rgba(0,0,0,0.22),0_12px_26px_rgba(0,0,0,0.14),0_3px_10px_rgba(0,0,0,0.10)]
          will-change-transform transform-gpu
        "
      >
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover will-change-transform transform-gpu"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={assets?.hero_poster}
        />

        {/* Lighter overlay stack for readability */}
        {/* 1) Uniform scrim (lighter) */}
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none
                     bg-black/18 sm:bg-black/14 md:bg-black/10"
        />
        {/* 2) Left-to-right gradient (lighter) */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none
                     bg-gradient-to-r from-black/35 via-black/18 to-transparent"
        />
        {/* 3) Vignette (lighter edges) */}
        <div
          ref={vignetteRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 85% at 50% 60%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row min-h-[420px] md:min-h-[520px] lg:min-h-[560px]">
          {/* Left */}
          <div
            ref={leftColRef}
            className="md:w-[46%] flex flex-col items-start justify-center gap-5 px-6 md:px-10 lg:px-16 py-10 md:py-16"
          >
            <h1
              ref={headingRef}
              className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight"
            >
              Empowering Clinics with
              <br className="hidden sm:block" /> Smarter Health Records
            </h1>

            <div ref={groupRef} className="flex items-center gap-3 text-white/90 text-sm">
              <img className="w-24 sm:w-28" src={assets.group_profiles} alt="" />
              <p className="font-light">
                Simply browse through our extensive list of trusted doctors,
                schedule your appointment hassle‑free.
              </p>
            </div>

            <a
              ref={ctaRef}
              href="#speciality"
              className="flex items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-sm font-medium text-gray-700
                         shadow-[0_6px_18px_rgba(0,0,0,0.18)]
                         hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] hover:scale-[1.02] transition
                         focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-offset-2 focus:ring-offset-white"
            >
              Book appointment
              <img className="w-3" src={assets.arrow_icon} alt="" />
            </a>
          </div>

          {/* Right (bigger doctors image) */}
          <div className="md:w-[54%] relative">
            <img
              ref={doctorImgRef}
              src={assets.header_img}
              alt="Doctors"
              className="
                md:absolute bottom-[-6px] right-[-6px]
                w-[96%] md:w-[118%] lg:w-[135%] max-w-none
                object-contain origin-bottom-right
                select-none pointer-events-none
                drop-shadow-[0_28px_55px_rgba(0,0,0,0.45)]
                will-change-transform transform-gpu
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;