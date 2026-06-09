import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CardTicket({ fotos = [] }) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [direction, setDirection] = useState(0); // -1 untuk kiri, 1 untuk kanan
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timerRef = useRef(null);

  const minSwipeDistance = 50;

  // Variasi Animasi dengan transisi interpolation melengkung (Fluid Slider Motion)
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      next();
    }
    if (distance < -minSwipeDistance) {
      prev();
    }
  };

  useEffect(() => {
    if (!autoplay || fotos.length === 0) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % fotos.length);
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [autoplay, fotos.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + fotos.length) % fotos.length);
    setAutoplay(false);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % fotos.length);
    setAutoplay(false);
  };

  if (!fotos || fotos.length === 0) return null;

  return (
    <div className="relative w-full aspect-[4/1] bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden group font-sans antialiased">
      <a href="/ticket" className="">
        <img
          src={fotos[current].backgroundImage}
          alt=""
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
        />
      </a>
    </div>
  );
}
