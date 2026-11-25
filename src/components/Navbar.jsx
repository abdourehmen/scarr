import React, { useState, useEffect } from 'react';
import { ShoppingBag, Globe, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ cartCount, onOpenCart, lang, setLang }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 820) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
    setMobileMenuOpen(false);
  };

  const navTexts = {
    ar: {
      home: 'الرئيسية',
      products: 'المنتجات',
      langBtn: 'EN'
    },
    en: {
      home: 'Home',
      products: 'Products',
      langBtn: 'عربي'
    }
  };

  const t = navTexts[lang];

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <a href="#hero-section" className="logo" dir="ltr">
          scar<span>_shoess</span>
        </a>

        <nav
          id="primary-nav-links"
          className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
          aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary Navigation'}
        >
          <a href="#hero-section" onClick={() => setMobileMenuOpen(false)}>
            {t.home}
          </a>
          <a href="#products-section" onClick={() => setMobileMenuOpen(false)}>
            {t.products}
          </a>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe size={17} aria-hidden="true" />
            <span>{t.langBtn}</span>
          </button>

          <button
            type="button"
            className="cart-btn"
            onClick={onOpenCart}
            aria-label={lang === 'ar' ? 'سلة المشتريات' : 'Cart'}
          >
            <ShoppingBag size={21} aria-hidden="true" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={lang === 'ar' ? 'القائمة' : 'Menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-nav-links"
          >
            {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
