import React, { useState } from 'react';
import { ShoppingBag, Globe, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ cartCount, onOpenCart, lang, setLang }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
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
            <Globe size={17} />
            <span>{t.langBtn}</span>
          </button>

          <button
            type="button"
            className="cart-btn"
            onClick={onOpenCart}
            aria-label="Cart"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}