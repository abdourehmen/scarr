import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Zap, ShieldCheck, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import './ProductDetailModal.css';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onQuickBuy, lang = 'ar' }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImg(0);
      setSelectedSize(product.sizes[0]);
      setQty(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const images = product.images || [product.image];

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
    image: images[0]
  };

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal-glass" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="detail-close-btn" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>

        <div className="detail-grid">
          {/* قسم الصور */}
          <div className="detail-gallery">
            <div className="detail-main-img">
              {product.badge && <span className="detail-badge">{product.badge}</span>}
              <img src={images[selectedImg]} alt={product.name} />
            </div>

            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`detail-thumb-btn ${selectedImg === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImg(idx)}
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
                {product.price.toLocaleString()} {t.currency}
              </span>
              {product.oldPrice && (
                <del className="detail-old-price">
                  {product.oldPrice.toLocaleString()} {t.currency}
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
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`detail-size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
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
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus size={16} />
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)}>
                  <Plus size={16} />
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
                  onQuickBuy(productData, selectedSize, qty);
                }}
              >
                <Zap size={18} />
                <span>{t.quickBuy}</span>
              </button>

              <button
                type="button"
                className="btn-detail-cart"
                onClick={() => {
                  for (let i = 0; i < qty; i++) {
                    onAddToCart(productData, selectedSize);
                  }
                  onClose();
                }}
              >
                <ShoppingCart size={18} />
                <span>{t.addCart}</span>
              </button>
            </div>

            {/* ضمانات سريعة */}
            <div className="detail-perks">
              <div><Truck size={16} color="#ff4d00" /> <span>{t.delivery}</span></div>
              <div><ShieldCheck size={16} color="#ff4d00" /> <span>{t.cod}</span></div>
              <div><RefreshCw size={16} color="#ff4d00" /> <span>{t.exchange}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}