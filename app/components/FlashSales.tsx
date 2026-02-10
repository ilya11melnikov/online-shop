"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '../constants/products';
import Link from 'next/link';

import 'swiper/css';

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

const EPOCH = new Date('2024-01-01').getTime();

export default function FlashSales() {
  const t = useTranslations("FlashSales");
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ products: any[], end: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);

    const calculateCurrentCycle = () => {
      let currentStart = EPOCH;
      let cycleIndex = 0;

      while (true) {
        const cycleSeed = `cycle_${cycleIndex}`;
        const durationDays = 1 + Math.floor(seededRandom(cycleSeed + "_duration") * 7);
        const durationMs = durationDays * 24 * 60 * 60 * 1000;
        const currentEnd = currentStart + durationMs;

        if (Date.now() < currentEnd) {
          const selectedProducts = [...ALL_PRODUCTS]
            .sort((a, b) => seededRandom(cycleSeed + a.id) - seededRandom(cycleSeed + b.id))
            .slice(0, 10)
            .map(p => {
              const pSeed = cycleSeed + p.id;
              return {
                ...p,
                discount: Math.floor(seededRandom(pSeed + "disc") * (40 - 15 + 1)) + 15,
                rating: 3 + Math.floor(seededRandom(pSeed + "rat") * 11) * 0.2,
                reviews: Math.floor(seededRandom(pSeed + "rev") * (99 - 10 + 1)) + 10
              };
            });

          return { products: selectedProducts, end: currentEnd };
        }
        currentStart = currentEnd;
        cycleIndex++;
      }
    };

    const currentData = calculateCurrentCycle();
    setData(currentData);

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = currentData.end - now;

      if (distance <= 0) {
        clearInterval(timer);
        window.location.reload(); 
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted || !data) return null;

  return (
    <section className="flash-sales">
      <div className="container">
        {/* Хедер разделен на левую часть и навигацию */}
        <div className="flash-sales__header-main">
          <div className="flash-sales__header-left">
            <div className="flash-sales__title-block">
              <span className="flash-sales__label">{t("label")}</span>
              <h2 className="flash-sales__title">{t("title")}</h2>
            </div>

            <div className="flash-sales__timer">
              {["days", "hours", "minutes", "seconds"].map((unit, idx) => (
                <React.Fragment key={unit}>
                  <div className="flash-sales__timer-item">
                    <span className="flash-sales__timer-label">{t(`timer.${unit}`)}</span>
                    <span className="flash-sales__timer-num">
                      {timeLeft[unit as keyof typeof timeLeft].toString().padStart(2, '0')}
                    </span>
                  </div>
                  {idx < 3 && <span className="flash-sales__timer-sep">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flash-sales__nav">
            <button className="flash-sales__nav-btn nav-prev">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L4 12L11 19M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="flash-sales__nav-btn nav-next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5L20 12L13 19M20 12H4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={4}
          navigation={{
            prevEl: '.nav-prev',
            nextEl: '.nav-next',
          }}
          breakpoints={{
            320: { slidesPerView: 1.3 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 4 },
          }}
          className="flash-sales__slider"
        >
          {data.products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flash-sales__btn-wrap">
          <Link href="/products" className="flash-sales__view-all">
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}