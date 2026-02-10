"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import StarRating from './StarRating';

export default function ProductCard({ product }: { product: any }) {
  // Используем пространство имен "Products", которое мы создали в JSON
  const t = useTranslations("Products");

  // Считаем цену со скидкой. 
  // Используем toFixed(2) для сохранения двух знаков после запятой (для реализма)
  const discountedPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);
  const originalPrice = product.price.toFixed(2);

  return (
    <div className="product-card">
      <div className="product-card__image-box">
        <span className="product-card__discount">-{product.discount}%</span>
        <div className="product-card__actions">
          <button className="product-card__action-btn">
            <img src="/icons/heart.svg" alt="wishlist" />
          </button>
          <button className="product-card__action-btn">
             <img src="/icons/eye.svg" alt="quick view" />
          </button>
        </div>
        <img src={product.image} alt={t(product.nameKey)} className="product-card__img" />
        <button className="product-card__add-btn">Add To Cart</button>
      </div>
      
      <div className="product-card__info">
        {/* Теперь название берется из перевода по ключу */}
        <h3 className="product-card__title">{t(product.nameKey)}</h3>
        
        <div className="product-card__price-row">
          <span className="product-card__price-new">${discountedPrice}</span>
          <span className="product-card__price-old">${originalPrice}</span>
        </div>
        
        <div className="product-card__rating-row">
          <StarRating rating={product.rating} />
          <span className="product-card__reviews">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
}