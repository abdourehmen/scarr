import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { reviews } from '../data/reviews';
import './ReviewsSection.css';

export default function ReviewsSection({ lang = 'ar' }) {
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!previewImage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage]);

  const title = lang === 'ar' ? 'آراء العملاء' : 'Customer Reviews';

  const loopReviews = [...reviews, ...reviews];

  return (
    <section className="reviews-strip-section" id="features-section">
      <div className="container">
        <h2 className="reviews-strip-title">{title}</h2>
      </div>

      <div className="reviews-marquee-wrapper" dir="ltr">
        <div className="reviews-marquee-track">
          {loopReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              role="button"
              tabIndex={0}
              className="review-photo-only-card"
              onClick={() => setPreviewImage(review.image)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPreviewImage(review.image);
                }
              }}
              aria-label={lang === 'ar' ? `عرض رأي العميل ${review.id}` : `View customer review ${review.id}`}
            >
              <img src={review.image} alt={`Customer ${review.id}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {previewImage && (
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setPreviewImage(null)}
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X size={24} aria-hidden="true" />
          </button>
          <img src={previewImage} alt="Customer Review" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
