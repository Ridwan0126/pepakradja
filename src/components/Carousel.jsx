import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

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
    if (!autoplay || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay, slides.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoplay(false);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setAutoplay(false);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full aspect-[4/1] overflow-hidden rounded-3xl shadow-xl group "
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative min-w-full h-full">
            {/* Background Image */}
            <img
              src={slide.backgroundImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between px-6 md:px-12">
              {/* LEFT CONTENT */}
              <div className="max-w-xl">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-4 border border-white/20">
                  <p className="text-sm font-semibold text-white">
                    {slide.badge}
                  </p>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h2>

                <p className="text-white/90 text-lg mb-6">
                  {slide.description}
                </p>

                <button className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:scale-105 transition-all">
                  {slide.cta}
                </button>
              </div>

              {/* RIGHT IMAGE */}
              <div className="hidden md:flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-64 lg:h-80 object-contain drop-shadow-2xl animate-float"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-smooth backdrop-blur opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-smooth backdrop-blur opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx);
              setAutoplay(false);
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
