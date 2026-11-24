import React, { useState } from 'react';
import { X } from 'lucide-react';
import { reviews } from '../data/reviews';
import './ReviewsSection.css';

export default function ReviewsSection({ lang = 'ar' }) {
  const [previewImage, setPreviewImage] = useState(null);

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
              className="review-photo-only-card"
              onClick={() => setPreviewImage(review.image)}
            >
              <img src={review.image} alt={`Customer ${review.id}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {previewImage && (
        <div className="photo-lightbox" onClick={() => setPreviewImage(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setPreviewImage(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <img src={previewImage} alt="Customer Review" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}