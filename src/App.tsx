import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Preloader, shouldShowPreloader } from "./components/Preloader";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { WhatIDo } from "./components/WhatIDo";
import { WorkCards } from "./components/WorkCards";
import { About } from "./components/About";
import { Journey } from "./components/Journey";
import { Closing } from "./components/Closing";
import { Resume } from "./pages/Resume";
import { CaseStudy } from "./pages/CaseStudy";
import { HoverCursorProvider } from "./components/HoverCursor";
import { applyPageMeta } from "./lib/pageMeta";

export default function App() {
  // the reference shows its loader once per browser session
  const [showLoader, setShowLoader] = useState(() => shouldShowPreloader());

  useEffect(() => {
    const lenis = new Lenis();
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  useEffect(() => applyPageMeta(path), [path]);
  const page =
    path === "/resume" ? (
      <Resume />
    ) : path === "/case-study" ? (
      <CaseStudy />
    ) : (
      <>
        <Hero />
        <WhatIDo />
        <WorkCards />
        <About />
        <Journey />
        <Closing />
      </>
    );

  return (
    <HoverCursorProvider>
    <div className="page">
      {page}
      <Nav back={path !== "/"} openAtTop={path !== "/resume"} wideFrom={path === "/case-study" ? 810 : 1200} />
      {showLoader && <Preloader onDone={() => setShowLoader(false)} />}
    </div>
    </HoverCursorProvider>
  );
}
