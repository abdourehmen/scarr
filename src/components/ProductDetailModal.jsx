import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Zap, ShieldCheck, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import './ProductDetailModal.css';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onQuickBuy, lang = 'ar' }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  const sizesList =
    Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes : [40];

  useEffect(() => {
    if (product) {
      setSelectedImg(0);
      setSelectedSize(sizesList[0]);
      setQty(1);
    }
  }, [product?.id]);

  if (!isOpen || !product) return null;

  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  const activeImage = images[selectedImg] || images[0] || '';
  const activeSize = selectedSize ?? sizesList[0];
  const numericPrice = Number(product?.price) || 0;
  const numericOldPrice = product?.oldPrice ? Number(product.oldPrice) : null;

  const t = {
    ar: {
      size: 'اختر المقاس:',
      quantity: 'الكمية:',
      descTitle: 'تفاصيل ومواصفات الحذاء:',
      descText: 'مصنوع من خامات عالية الجودة توفر تهوية ممتازة وراحة فائقة للقدم طوال اليوم، مع نعل مرن مقاوم للانزلاق يناسب المشي اليومي والأنشطة الرياضية.',
      delivery: 'توصيل سريع لـ 58 ولاية',
      cod: 'معاينة قبل الدفع عند الاستلام',
      exchange: 'ضمان استبدال المقاس',
      quickBuy: 'اطلب الآن',
      addCart: 'أضف إلى السلة',
      currency: 'د.ج'
    },
    en: {
      size: 'Select Size:',
      quantity: 'Quantity:',
      descTitle: 'Product Details & Specs:',
      descText: 'Crafted from premium breathable materials for all-day comfort, featuring a flexible anti-slip sole designed for both daily wear and athletic performance.',
      delivery: 'Fast delivery to 58 Wilayas',
      cod: 'Inspect before Cash on Delivery',
      exchange: 'Easy size exchange',
      quickBuy: 'Order Now',
      addCart: 'Add to Cart',
      currency: 'DZD'
    }
  }[lang];

  const productData = {
    ...product,
    image: images[0] || activeImage
  };

  return (
    <div
      className="detail-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="detail-modal-glass" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="detail-close-btn"
          onClick={onClose}
          aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
        >
          <X size={22} aria-hidden="true" />
        </button>

        <div className="detail-grid">
          {/* قسم الصور */}
          <div className="detail-gallery">
            <div className="detail-main-img">
              {product.badge && <span className="detail-badge">{product.badge}</span>}
              {activeImage && <img src={activeImage} alt={product.name} />}
            </div>

            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={`detail-thumb-btn ${selectedImg === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImg(idx)}
                    aria-label={lang === 'ar' ? `صورة ${idx + 1}` : `Image ${idx + 1}`}
                    aria-pressed={selectedImg === idx}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* قسم التفاصيل والطلب */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h2 className="detail-title" dir="ltr">{product.name}</h2>

            <div className="detail-price-box">
              <span className="detail-price">
                {numericPrice.toLocaleString()} {t.currency}
              </span>
              {numericOldPrice && (
                <del className="detail-old-price">
                  {numericOldPrice.toLocaleString()} {t.currency}
                </del>
              )}
            </div>

            <div className="detail-desc">
              <h4>{t.descTitle}</h4>
              <p>{product.description || t.descText}</p>
            </div>

            {/* اختيار المقاس */}
            <div className="detail-option-group">
              <label>{t.size}</label>
              <div className="detail-sizes">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`detail-size-btn ${activeSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={activeSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* اختيار الكمية */}
            <div className="detail-option-group">
              <label>{t.quantity}</label>
              <div className="detail-qty-box">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label={lang === 'ar' ? 'إنقاص الكمية' : 'Decrease quantity'}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label={lang === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* أزرار الشراء */}
            <div className="detail-actions">
              <button
                type="button"
                className="btn-detail-buy"
                onClick={() => {
                  onClose();
                  onQuickBuy && onQuickBuy(productData, activeSize, qty);
                }}
              >
                <Zap size={18} aria-hidden="true" />
                <span>{t.quickBuy}</span>
              </button>

              <button
                type="button"
                className="btn-detail-cart"
                onClick={() => {
                  for (let i = 0; i < qty; i++) {
                    onAddToCart && onAddToCart(productData, activeSize);
                  }
                  onClose();
                }}
              >
                <ShoppingCart size={18} aria-hidden="true" />
                <span>{t.addCart}</span>
              </button>
            </div>

            {/* ضمانات سريعة */}
            <div className="detail-perks">
              <div><Truck size={16} color="#ff4d00" aria-hidden="true" /> <span>{t.delivery}</span></div>
              <div><ShieldCheck size={16} color="#ff4d00" aria-hidden="true" /> <span>{t.cod}</span></div>
              <div><RefreshCw size={16} color="#ff4d00" aria-hidden="true" /> <span>{t.exchange}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
