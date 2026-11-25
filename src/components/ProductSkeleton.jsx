import React from 'react';
import './ProductSkeleton.css';

export default function ProductSkeleton({ count = 6 }) {
  const safeCount = Math.max(0, Number(count) || 0);

  return (
    <div className="products-grid" aria-hidden="true">
      {Array.from({ length: safeCount }).map((_, index) => (
        <div key={index} className="skeleton-glass-card">
          <div className="skeleton-image shimmer" />

          <div className="skeleton-body">
            <div className="skeleton-line skeleton-category shimmer" />
            <div className="skeleton-line skeleton-title shimmer" />
            <div className="skeleton-line skeleton-price shimmer" />

            <div className="skeleton-sizes">
              <div className="skeleton-size-pill shimmer" />
              <div className="skeleton-size-pill shimmer" />
              <div className="skeleton-size-pill shimmer" />
              <div className="skeleton-size-pill shimmer" />
            </div>

            <div className="skeleton-actions">
              <div className="skeleton-btn-main shimmer" />
              <div className="skeleton-btn-cart shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}