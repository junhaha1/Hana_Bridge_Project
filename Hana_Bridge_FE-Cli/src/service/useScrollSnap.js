import { useEffect, useRef } from "react";

// TopButton에서 강제로 초기화 가능하게 변경
const useScrollSnap = (duration = 1200, isModalOpen = false) => {
  const sectionRefs = useRef([]);
  const currentIndex = useRef(0);
  const isScrolling = useRef(false);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < sectionRefs.current.length) {
      currentIndex.current = index;
      isScrolling.current = true;

      sectionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, duration);
    }
  };

  useEffect(() => {
    if (sectionRefs.current.length === 0) return;

    const handleWheel = (e) => {
      if (!isModalOpen) {
        e.preventDefault();
        if (isScrolling.current) return;
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = currentIndex.current + direction;

        scrollToIndex(nextIndex);
      }      
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [duration, isModalOpen]);

  return { sectionRefs, scrollToIndex };
};

export default useScrollSnap;
