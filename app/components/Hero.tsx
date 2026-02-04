"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import HeroSlider from "./HeroSlider";

export default function LanguageSwitcher() {

// Подключаемся к разделу Hero.categories в JSON
const t = useTranslations("Hero.categories");

// Массив ключей. Они должны СТРОГО совпадать с ключами в JSON
const categories = [
  "womensFashion",
  "mensFashion",
  "electronics",
  "homeLifestyle",
  "medicine",
  "sportsOutdoor",
  "babysToys",
  "groceriesPets",
  "healthBeauty",
];

  return (
    <div className="hero">
      <div className="container">
        <div className="hero__w">
          <ul className="hero__list">
            {categories.map((key) => (
              <li key={key} className="hero__item">
                <Link href={`/category/${key}`} className="hero__link">
                  <h3 className="hero__title">{t(key)}</h3>
                </Link>
              </li>
            ))}
          </ul>
          <HeroSlider />
        </div>
      </div>
    </div>
  );
}
