"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

const slideImages: Record<string, string> = {
  iphone: "/banners/banner-iphone.jpg",
  macbook: "/banners/banner-macbook.jpg",
  watch: "/banners/banner-watch.jpg"
};

export default function HeroSlider() {
  const t = useTranslations("Hero");
  const [current, setCurrent] = useState(0);
  const slides = t.raw("slides");

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides?.length]);

  if (!slides) return null;

  return (
    <div className="hero-slider">
      <div className="hero-slider__wrapper">
        {slides.map((slide: any, index: number) => (
          <div 
            key={slide.id} 
            // Добавили модификатор hero-slide--iphone и т.д.
            className={`hero-slide ${index === current ? "hero-slide--active" : ""} hero-slide--${slide.id}`}
          >
            <img src={slideImages[slide.id]} alt={slide.title} className="hero-slide__img" />
            
            <div className="hero-slide__content">
              <div className="hero-slide__brand">
                <div className="hero-slide__logo-w">
                   <img src="/apple-logo.svg" alt="logo" className="hero-slide__logo" />
                </div>
                <div className="hero-slide__subtitle">{slide.subTitle}</div>
              </div>

              <h2 className="hero-slide__title">{slide.title}</h2>

              <Link href={`/shop/${slide.id}`} className="hero-slide__link">
                <span>{slide.cta}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 12H20M20 12L13 5M20 12L13 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-slider__dots">
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            className={`hero-slider__dot ${index === current ? "hero-slider__dot--active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}