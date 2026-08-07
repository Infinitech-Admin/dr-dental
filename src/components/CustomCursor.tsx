"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders a tooth-shaped cursor that follows the mouse, replacing the
 * native OS cursor. This avoids the CSS `cursor: url(...)` route
 * entirely, which Chrome/Edge often silently refuse to honor for SVG
 * images. Automatically disables itself on touch devices, since there
 * is no persistent pointer to track there.
 *
 * Two bugs fixed from the first version:
 * 1. The tracking effect used to depend on `isVisible` state, which
 *    the effect itself updated — every visibility toggle tore down
 *    and re-ran the effect, resetting the tracked position back to
 *    the center of the screen for a frame. That's what caused the
 *    cursor to "jump in another direction" near buttons. Position
 *    tracking now lives entirely in a ref and the effect only runs
 *    once, so nothing it does can invalidate and restart itself.
 * 2. Rendered via a portal straight into document.body, so it can
 *    never be affected by an ancestor element (e.g. a header or menu
 *    with a hover `transform`) which would otherwise create a new
 *    containing block and throw off `position: fixed` coordinates.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(hasTouch);
    if (hasTouch) return;

    let raf = 0;

    const applyTransform = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = 0;
    };

    const handleMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      setIsVisible(true);
      if (!raf) raf = requestAnimationFrame(applyTransform);
    };

    const handleWindowLeave = (e: MouseEvent) => {
      // Only hide when the pointer actually leaves the viewport,
      // not when it moves between child elements.
      if (!e.relatedTarget && !(e as any).toElement) {
        setIsVisible(false);
      }
    };

    const HOVER_SELECTOR =
      'a, button, [role="button"], input[type="submit"], .cursor-pointer, select';

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest(HOVER_SELECTOR));
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleWindowLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleWindowLeave);
      if (raf) cancelAnimationFrame(raf);
    };
    // Empty deps: this must run exactly once. Nothing inside should
    // ever cause it to tear down and restart.
  }, []);

  if (!mounted || isTouch) return null;

  return createPortal(
    <>
      {/* Hide the native cursor everywhere — a blanket `*` selector
          instead of an explicit tag list, so no element (icons inside
          buttons, portalled menus, nested spans, etc.) can slip
          through and show the real OS arrow. Having the real cursor
          visible even briefly next to our lagging custom one is what
          reads as a "jump" near interactive elements. */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Outer node: position ONLY. Touched exclusively by the ref in
          the effect above — React never re-renders its `transform`,
          so nothing here can fight with the hover-scale state below. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 2147483647,
          pointerEvents: "none",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 150ms ease",
          willChange: "transform",
        }}
      >
        {/* Inner node: scale ONLY. Fully React-controlled, transitions
            independently of the outer node's position transform. */}
        <div
          style={{
            transform: `scale(${isHovering ? 1.35 : 1})`,
            transformOrigin: "center",
            transition: "transform 150ms ease",
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 3 C11 3 8 6 7 10 C6 14 7 18 8 22 C8.6 24.5 9.6 27.5 11.2 27.8 C12.6 28 13 25.5 13.4 23.5 C13.7 22 14.2 20 16 20 C17.8 20 18.3 22 18.6 23.5 C19 25.5 19.4 28 20.8 27.8 C22.4 27.5 23.4 24.5 24 22 C25 18 26 14 25 10 C24 6 21 3 16 3 Z"
              fill="#ffffff"
              stroke="#0a2540"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M11.5 8.5 C12.5 6.8 14 6 16 6"
              stroke="#cfe8f7"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </>,
    document.body,
  );
}
