import React, { useState, useEffect } from 'react';
import './Hero.css';

const heroImages = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1920&q=90",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1920&q=90"
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-images-only">
      {heroImages.map((imgUrl, index) => (
        <div
          key={index}
          className={`hero-slide-img ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${imgUrl})` }}
        />
      ))}
    </section>
  );
}