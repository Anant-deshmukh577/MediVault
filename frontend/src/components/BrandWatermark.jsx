import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Tunable timings for a calm, smooth vibe
const ANIM = {
  reveal: { fromY: 36, fromScale: 1.06, duration: 1.45, ease: "power2.out" },
  parallax: { toY: -32, scrub: 0.75 }, // smoother, less twitchy
  breath: { toLetterSpacing: "-0.016em", duration: 3.2, ease: "sine.inOut" }, // subtle pulse
};

const BrandWatermark = ({
  text = "MediVault",
  opacity = 0.22,
  className = "",
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Initial state to avoid FOUC
      gsap.set(textRef.current, {
        y: ANIM.reveal.fromY,
        scale: ANIM.reveal.fromScale,
        autoAlpha: 0,
        transformOrigin: "50% 100%",
      });

      // Reveal on enter (all breakpoints)
      gsap.to(textRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: ANIM.reveal.duration,
        ease: ANIM.reveal.ease,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 92%",
          once: true,
        },
      });

      // Tablet/desktop only (≥640px): parallax + subtle breath
      mm.add("(min-width: 640px)", () => {
        gsap.to(textRef.current, {
          y: ANIM.parallax.toY,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: ANIM.parallax.scrub,
          },
        });

        gsap.to(textRef.current, {
          letterSpacing: ANIM.breath.toLetterSpacing,
          duration: ANIM.breath.duration,
          ease: ANIM.breath.ease,
          yoyo: true,
          repeat: -1,
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`
        pointer-events-none select-none
        relative w-screen left-1/2 -translate-x-1/2
        overflow-x-hidden overflow-y-hidden
        h-[14vw] min-h-[72px] sm:h-[16vw] sm:min-h-[100px]
        -mt-1 sm:-mt-2 mb-4 sm:mb-6
        ${className}
      `}
    >
      <span
        ref={textRef}
        className="
          absolute left-1/2 -translate-x-1/2 bottom-0
          font-extrabold tracking-tight leading-none whitespace-nowrap
          text-[24vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] xl:text-[14vw] 2xl:text-[12vw]
          will-change-transform transform-gpu
        "
        style={{
          color: `rgba(15, 23, 42, ${opacity})`,
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 65%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 65%)",
          letterSpacing: "-0.02em",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default BrandWatermark;