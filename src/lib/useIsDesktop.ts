import { useEffect, useState } from "react";

// true while the viewport is at least `minWidth` wide (1200px = the home
// page's desktop layout; the case study keeps its desktop layout from 810px)
export function useIsDesktop(minWidth = 1200) {
  const query = `(min-width: ${minWidth}px)`;
  const [desktop, setDesktop] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return desktop;
}
