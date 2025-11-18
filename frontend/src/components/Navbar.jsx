import React, { useContext, useState, useLayoutEffect, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  onboarding: { variant: "fade-slide", duration: 1.0, stagger: 0.12, delay: 0.15, ease: "power2.out" },
  scroll: { progressBar: true, compressNav: true },
  mobileMenu: { revealItems: true },
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);       // mobile menu
  const [userMenuOpen, setUserMenuOpen] = useState(false); // profile dropdown (mobile-friendly)
  const isLoggedIn = Boolean(token);

  const logout = () => {
    setUserMenuOpen(false);
    setShowMenu(false);
    setToken(null);
    localStorage.removeItem("token");
  };

  const linkClass = ({ isActive }) =>
    [
      "relative inline-flex items-center justify-center rounded-full",
      "px-3 md:px-3.5 py-1.5",
      "text-[13px] md:text-[15px] font-semibold uppercase tracking-wide",
      "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
      isActive
        ? "bg-white text-slate-900 ring-1 ring-black/5 shadow-[0_10px_20px_rgba(0,0,0,0.12),0_3px_8px_rgba(0,0,0,0.08)]"
        : "text-slate-700 hover:text-slate-900 hover:bg-white/70 hover:ring-1 hover:ring-black/5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.08)]",
    ].join(" ");

  // Refs for GSAP scoping and elements
  const rootRef = useRef(null);
  const navShellRef = useRef(null);
  const brandRef = useRef(null);
  const navLinksRef = useRef([]);
  const rightActionsRef = useRef(null);
  const progressBarRef = useRef(null);
  const mobileOverlayRef = useRef(null);
  const mobileListRef = useRef(null);
  const profileRef = useRef(null);

  // GSAP onboarding + scroll effects
  useLayoutEffect(() => {
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const { duration, stagger, delay, ease, variant } = ANIMATION_CONFIG.onboarding;

    const ctx = gsap.context(() => {
      if (variant === "fade-slide") {
        const links = navLinksRef.current.filter(Boolean);
        const tl = gsap.timeline({ defaults: { ease, duration }, delay });

        tl.from(navShellRef.current, { y: -16, opacity: 0, scale: 0.985, transformOrigin: "50% 0%", clearProps: "transform,opacity" });
        tl.from(brandRef.current, { y: 12, opacity: 0, clearProps: "transform,opacity" }, "-=0.5");
        if (links.length) tl.from(links, { y: 12, opacity: 0, stagger, clearProps: "transform,opacity" }, "-=0.6");
        tl.from(rightActionsRef.current, { y: 12, opacity: 0, clearProps: "transform,opacity" }, "-=0.55");
      }

      if (ANIMATION_CONFIG.scroll.progressBar && progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleX: 0 });
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });
      }

      if (ANIMATION_CONFIG.scroll.compressNav && navShellRef.current) {
        gsap.timeline({ scrollTrigger: { trigger: rootRef.current, start: "top top", end: "+=160", scrub: true } })
          .to(navShellRef.current, {
            y: -6,
            boxShadow: "0 22px 45px rgba(0,0,0,0.22), 0 10px 20px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.10)",
            duration: 0.6,
          }, 0)
          .to(navShellRef.current, { backgroundColor: "rgba(255,255,255,0.97)", duration: 0.6 }, 0);
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Mobile menu reveal animation
  useEffect(() => {
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (showMenu && ANIMATION_CONFIG.mobileMenu.revealItems) {
      const ctx = gsap.context(() => {
        if (mobileOverlayRef.current) {
          gsap.fromTo(mobileOverlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power1.out" });
        }
        if (mobileListRef.current) {
          const items = mobileListRef.current.querySelectorAll("a, button");
          gsap.from(items, { y: 14, opacity: 0, stagger: 0.06, duration: 0.38, ease: "power2.out", delay: 0.02, clearProps: "transform,opacity" });
        }
      }, mobileOverlayRef);
      return () => ctx.revert();
    }
  }, [showMenu]);

  // Lock scroll when mobile menu is open + close on ESC
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
      const onEsc = (e) => { if (e.key === "Escape") setShowMenu(false); };
      document.addEventListener("keydown", onEsc);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onEsc);
      };
    }
  }, [showMenu]);

  // Close menus on route change
  useEffect(() => {
    setShowMenu(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Close profile menu on outside click/tap
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, []);

  return (
    <div ref={rootRef} className="px-4 sm:px-6 lg:px-8">
      <div
        ref={navShellRef}
        className="
          relative isolate z-[60]
          mx-auto max-w-6xl lg:max-w-7xl mt-6
          flex items-center justify-between gap-2
          rounded-full bg-white px-4 sm:px-6 lg:px-7
          py-2 md:py-2.5
          ring-1 ring-black/5
          shadow-[0_24px_50px_rgba(0,0,0,0.18),0_10px_20px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.08)]
          will-change-transform transform-gpu
        "
      >
        {/* Progress bar */}
        <span
          ref={progressBarRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400"
        />

        {/* Brand */}
        <Link ref={brandRef} to="/" className="flex items-center gap-2.5">
          <img src={assets.logo} alt="MediVault" className="w-8 h-8 rounded-xl" />
          <span className="text-lg md:text-xl font-semibold text-slate-900">MediVault</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          <NavLink to="/" className={linkClass} ref={(el) => (navLinksRef.current[0] = el)}>HOME</NavLink>
          <NavLink to="/doctors" className={linkClass} ref={(el) => (navLinksRef.current[1] = el)}>ALL DOCTORS</NavLink>
          <NavLink to="/about" className={linkClass} ref={(el) => (navLinksRef.current[2] = el)}>ABOUT</NavLink>
          <NavLink to="/contact" className={linkClass} ref={(el) => (navLinksRef.current[3] = el)}>CONTACT</NavLink>

          <a href="https://medivault-admin-cw6n.onrender.com" target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 hover:bg-gray-50 transition" ref={(el) => (navLinksRef.current[4] = el)}>
            Admin Panel
          </a>
        </nav>

        {/* Right actions */}
        <div ref={rightActionsRef} className="flex items-center gap-2">
          {isLoggedIn ? (
            <div ref={profileRef} className="relative flex items-center gap-2 group">
              {userData?.image ? (
                <img className="w-8 h-8 rounded-full object-cover" src={userData.image} alt="profile" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                  {(userData?.name?.[0] || "U").toUpperCase()}
                </div>
              )}

              {/* Toggle for profile menu (mobile tap + desktop hover) */}
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen((s) => !s);
                }}
                className="p-1 -mr-1 rounded-md hover:bg-slate-100 active:scale-[0.98] transition"
              >
                <img className="w-2.5" src={assets.dropdown_icon} alt="open menu" />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute top-0 right-0 pt-12 text-base font-medium text-gray-600 z-[80]
                            ${userMenuOpen ? "block" : "hidden md:group-hover:block"}`}
                role="menu"
              >
                <div className="min-w-48 bg-white ring-1 ring-black/5 shadow-xl rounded-xl flex flex-col gap-3.5 p-4 pointer-events-auto">
                  <button onClick={() => { setUserMenuOpen(false); navigate("/my-profile"); }} className="text-left hover:text-black" role="menuitem">
                    My Profile
                  </button>
                  <button onClick={() => { setUserMenuOpen(false); navigate("/my-appointments"); }} className="text-left hover:text-black" role="menuitem">
                    My Appointments
                  </button>

                  {/* RED gradient Logout with white glow */}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="
                      mt-1 inline-flex items-center justify-center rounded-full px-4 py-2
                      text-sm font-medium text-white
                      bg-gradient-to-r from-[#b91c1c] via-[#ef4444] to-[#f43f5e]
                      ring-1 ring-white/60
                      shadow-[inset_0_-1px_0_rgba(255,255,255,0.20),0_8px_18px_rgba(239,68,68,0.35),0_2px_6px_rgba(0,0,0,0.18)]
                      hover:brightness-105 active:scale-[0.98] transition
                    "
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center justify-center rounded-full px-5 md:px-6 py-2 text-[15px] text-white font-medium
                         bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[inset_0_-1px_0_rgba(255,255,255,0.12),0_8px_18px_rgba(59,130,246,0.35),0_2px_6px_rgba(0,0,0,0.18)] hover:brightness-105 transition"
            >
              Create account
            </Link>
          )}

          {/* Mobile menu button (TOGGLE) */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-controls="mobile-nav"
            aria-expanded={showMenu}
            onClick={() => setShowMenu((s) => !s)}
            className="md:hidden p-1 rounded-md hover:bg-slate-100 active:scale-[0.98] transition"
          >
            <img className="w-6" src={assets.menu_icon} alt="menu" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileOverlayRef}
        id="mobile-nav"
        className={`
          fixed inset-0 z-[95] md:hidden
          bg-white/95 backdrop-blur-sm
          transition-transform duration-300 will-change-transform
          ${showMenu ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-hidden={!showMenu}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img className="w-8 h-8" src={assets.logo} alt="logo" />
            <span className="text-lg font-semibold text-slate-900">MediVault</span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setShowMenu(false)}
            className="p-2 rounded-md hover:bg-slate-100 active:scale-[0.98] transition"
          >
            <img className="w-7" src={assets.cross_icon} alt="close" />
          </button>
        </div>

        {/* Nav list */}
        <ul ref={mobileListRef} className="flex flex-col gap-2 mt-2 px-6 text-base font-medium pb-24 overflow-y-auto">
          <NavLink onClick={() => setShowMenu(false)} to="/" className={({ isActive }) => `py-3 ${isActive ? "text-slate-900 font-semibold" : "text-slate-700"}`}>
            HOME
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors" className={({ isActive }) => `py-3 ${isActive ? "text-slate-900 font-semibold" : "text-slate-700"}`}>
            ALL DOCTORS
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about" className={({ isActive }) => `py-3 ${isActive ? "text-slate-900 font-semibold" : "text-slate-700"}`}>
            ABOUT
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact" className={({ isActive }) => `py-3 ${isActive ? "text-slate-900 font-semibold" : "text-slate-700"}`}>
            CONTACT
          </NavLink>

          <a onClick={() => setShowMenu(false)} href="https://medivault-admin-cw6n.onrender.com" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition">
            Admin Panel
          </a>

          {!isLoggedIn && (
            <Link
              to="/login"
              onClick={() => setShowMenu(false)}
              className="mt-4 w-full inline-flex items-center justify-center rounded-full px-5 py-3 text-white font-semibold bg-gradient-to-r from-[#1e3a8a] via-[#3082b8] to-[#49aecc] shadow-[inset_0_-1px_0_rgba(255,255,255,0.12),0_8px_18px_rgba(59,130,246,0.35),0_2px_6px_rgba(0,0,0,0.18)] hover:brightness-105 transition"
            >
              Create account
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={() => {
                setShowMenu(false);
                logout();
              }}
              className="
                mt-4 w-full inline-flex items-center justify-center rounded-full px-5 py-3
                text-sm font-semibold text-white
                bg-gradient-to-r from-[#b91c1c] via-[#ef4444] to-[#f43f5e]
                ring-1 ring-white/60
                shadow-[inset_0_-1px_0_rgba(255,255,255,0.20),0_8px_18px_rgba(239,68,68,0.35),0_2px_6px_rgba(0,0,0,0.18)]
                hover:brightness-105 active:scale-[0.98] transition
              "
            >
              Logout
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;