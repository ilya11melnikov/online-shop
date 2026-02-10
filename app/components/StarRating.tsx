import React, { useId } from 'react';

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="rating-stars" style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
        const id = useId();

        return (
          <svg key={star} width="20" height="20" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={id}>
                <stop offset={`${fill}%`} stopColor="#FFAD33" />
                <stop offset={`${fill}%`} stopColor="#BFBFBF" />
              </linearGradient>
            </defs>
            <path 
              fill={`url(#${id})`}
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
            />
          </svg>
        );
      })}
    </div>
  );
}