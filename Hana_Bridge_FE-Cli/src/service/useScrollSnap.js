import { useEffect, useRef } from "react";

const useScrollSnap = (duration = 1200) => {
  const sectionRefs = useRef([]);
  const currentIndex = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault(); // 기본 휠 스크롤 방지
      if (isScrolling.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex.current + direction;

      if (nextIndex >= 0 && nextIndex < sectionRefs.current.length) {
        currentIndex.current = nextIndex;
        isScrolling.current = true;

        sectionRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setTimeout(() => {
          isScrolling.current = false;
        }, duration);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => window.removeEventListener("wheel", handleWheel);
  }, [duration]);

  return sectionRefs;
};

export default useScrollSnap;
