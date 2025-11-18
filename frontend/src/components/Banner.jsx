import React, { useRef, useLayoutEffect, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

// GSAP + ScrollTrigger
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  onboarding: {
    delay: 0.05,
    ease: "power3.out",
    cardDuration: 0.6,
    textDuration: 0.5,
    imageDuration: 0.6,
    ctaDuration: 0.45,
    stagger: 0.08,
    triggerStart: "top 80%",
  },
  scroll: {
    videoZoomFrom: 1.06,
    videoZoomTo: 1,
    doctorY: -40,
    scrub: 0.25,
  },
  ctaPulse: {
    enabled: true,
    scale: 1.02,
    duration: 0.55,
  },
};

const Banner = () => {
  const navigate = useNavigate();

  const videoSrc = assets?.cta_video || "Header.mp4";
  const poster = assets?.cta_poster;

  // Refs for GSAP
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  // Overlays (light depth like Header)
  const scrimRef = useRef(null);
  const overlayRef = useRef(null);
  const vignetteRef = useRef(null);

  // Content
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const ctaRef = useRef(null);

  // Images
  const docImgRef = useRef(null);         // desktop: inside right column
  const docImgMobileRef = useRef(null);   // mobile: inside card, behind content

  // Onboarding + scroll effects
  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const {
      delay,
      ease,
      cardDuration,
      textDuration,
      imageDuration,
      ctaDuration,
      stagger,
      triggerStart,
    } = ANIMATION_CONFIG.onboarding;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(cardRef.current, { autoAlpha: 0, y: 24 });
      gsap.set([line1Ref.current, line2Ref.current, ctaRef.current], { autoAlpha: 0, y: 16 });
      gsap.set(docImgRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(docImgMobileRef.current, { autoAlpha: 0, y: 16 });

      // Reveal timeline
      const tl = gsap.timeline({
        defaults: { ease },
        delay,
        scrollTrigger: { trigger: sectionRef.current, start: triggerStart, once: true },
      });

      tl.to(cardRef.current, { autoAlpha: 1, y: 0, duration: cardDuration, clearProps: "transform,opacity" });

      tl.to(
        [line1Ref.current, line2Ref.current],
        { autoAlpha: 1, y: 0, duration: textDuration, stagger, clearProps: "transform,opacity" },
        "-=0.45"
      );

      tl.to(
        ctaRef.current,
        { autoAlpha: 1, y: 0, duration: ctaDuration, clearProps: "transform,opacity" },
        "-=0.25"
      );

      // Reveal images (per breakpoint)
      tl.to(docImgMobileRef.current, { autoAlpha: 1, y: 0, duration: imageDuration, clearProps: "transform,opacity" }, "-=0.25");
      tl.to(docImgRef.current, { autoAlpha: 1, y: 0, duration: imageDuration, clearProps: "transform,opacity" }, "-=0.25");

      // CTA micro pulse
      if (ANIMATION_CONFIG.ctaPulse.enabled) {
        tl.to(ctaRef.current, {
          scale: ANIMATION_CONFIG.ctaPulse.scale,
          duration: ANIMATION_CONFIG.ctaPulse.duration,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
          clearProps: "transform",
        });
      }

      // Video zoom-out parallax
      if (videoRef.current) {
        gsap.fromTo(
          videoRef.current,
          { scale: ANIMATION_CONFIG.scroll.videoZoomFrom },
          {
            scale: ANIMATION_CONFIG.scroll.videoZoomTo,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: ANIMATION_CONFIG.scroll.scrub,
            },
          }
        );
      }

      // Desktop-only gentle float for the desktop image
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (docImgRef.current) {
          gsap.to(docImgRef.current, {
            y: ANIMATION_CONFIG.scroll.doctorY,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: ANIMATION_CONFIG.scroll.scrub,
            },
          });
        }
        return () => {};
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keep ScrollTrigger positions correct when media loads
  useEffect(() => {
    const onReady = () => ScrollTrigger.refresh();
    const v = videoRef.current;
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
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 my-10 sm:my-12 md:my-20">
      {/* Outer wrapper */}
      <div ref={frameRef} className="relative mx-auto max-w-6xl lg:max-w-7xl">
        {/* Card with video */}
        <div
          ref={cardRef}
          className="
            relative overflow-hidden rounded-3xl
            ring-1 ring-black/5
            shadow-[0_28px_60px_rgba(0,0,0,0.22),0_12px_26px_rgba(0,0,0,0.14),0_3px_10px_rgba(0,0,0,0.10)]
            will-change-transform transform-gpu
          "
        >
          {/* Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover will-change-transform transform-gpu"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
          />

          {/* Light depth overlays (like Header, lighter) */}
          <div ref={scrimRef} aria-hidden="true" className="absolute inset-0 pointer-events-none bg-black/18 sm:bg-black/14 md:bg-black/10 z-10" />
          <div ref={overlayRef} aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/35 via-black/18 to-transparent z-10" />
          <div
            ref={vignetteRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-10"
            style={{ background: "radial-gradient(120% 85% at 50% 60%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.14) 100%)" }}
          />

          {/* Content grid */}
          <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 min-h-[260px] sm:min-h-[320px] md:min-h-[380px]">
            {/* Left side */}
            <div className="flex flex-col justify-center gap-5 px-6 sm:px-10 md:px-12 lg:px-16 py-8 md:py-16">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                <p ref={line1Ref}>Book Appointment</p>
                <p ref={line2Ref} className="mt-3 sm:mt-4">With 100+ Trusted Doctors</p>
              </div>

              <button
                ref={ctaRef}
                onClick={() => {
                  navigate("/login");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="
                  w-fit rounded-full bg-white/95 px-6 sm:px-7 py-3 text-sm sm:text-base font-medium text-gray-700
                  shadow-[0_6px_18px_rgba(0,0,0,0.18)]
                  hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] hover:scale-[1.02] transition
                  focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-offset-2 focus:ring-offset-white
                "
              >
                Create account
              </button>
            </div>

            {/* Right side (desktop image inside card, bottom-aligned, not clipped) */}
            <div className="relative hidden md:flex items-end justify-end pr-2">
              <img
                ref={docImgRef}
                src={assets.appointment_img}
                alt="Healthcare professional"
                className="
                  relative block
                  max-h-full h-[95%] w-auto
                  object-contain origin-bottom-right
                  pointer-events-none select-none
                  drop-shadow-[0_24px_55px_rgba(0,0,0,0.35)]
                  will-change-transform transform-gpu
                  z-[12]
                "
              />
            </div>
          </div>

          {/* Mobile image inside card (behind text/button, above overlays) */}
          <img
            ref={docImgMobileRef}
            src={assets.appointment_img}
            alt="Healthcare professional"
            className="
              md:hidden absolute bottom-0 right-0
              pointer-events-none select-none
              will-change-transform transform-gpu
              z-[12]  /* above overlays (z-10), below content (z-20) */
              w-[58vw] max-w-[260px] sm:w-[52vw] sm:max-w-[320px]
              drop-shadow-[0_16px_40px_rgba(0,0,0,0.28)]
            "
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;