import React from 'react';
import './Footer.css';

export default function Footer({ lang = 'ar' }) {
  const t = {
    ar: {
      desc: 'متجركم الموثوق لأجود الأحذية العصرية في الجزائر مع توصيل سريع لجميع الولايات الـ 58 والدفع عند الاستلام.',
      quickLinksTitle: 'روابط سريعة',
      home: 'الرئيسية',
      products: 'المنتجات',
      reviews: 'آراء العملاء',
      socialTitle: 'تابعونا على مواقع التواصل',
      rights: '© 2026 scar_shoess الجزائر - جميع الحقوق محفوظة'
    },
    en: {
      desc: 'Your trusted store for stylish, high-quality footwear in Algeria with fast delivery across all 58 Wilayas and Cash on Delivery.',
      quickLinksTitle: 'Quick Links',
      home: 'Home',
      products: 'Products',
      reviews: 'Customer Reviews',
      socialTitle: 'Follow Us',
      rights: '© 2026 scar_shoess Algeria - All Rights Reserved'
    }
  }[lang];

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#hero-section" className="footer-logo" dir="ltr">
            scar<span>_shoess</span>
          </a>
          <p>{t.desc}</p>
        </div>

        <div className="footer-nav">
          <h4>{t.quickLinksTitle}</h4>
          <ul>
            <li><a href="#hero-section">{t.home}</a></li>
            <li><a href="#products-section">{t.products}</a></li>
            <li><a href="#features-section">{t.reviews}</a></li>
          </ul>
        </div>

        <div className="footer-social-col">
          <h4>{t.socialTitle}</h4>

          <div className="social-buttons">
            <a
              href="https://www.instagram.com/scar_shoess/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill instagram"
              aria-label="Instagram"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61568627520437&ref=PROFILE_EDIT_xav_ig_profile_page_web#"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill facebook"
              aria-label="Facebook"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t.rights}</p>
      </div>
    </footer>
  );
}