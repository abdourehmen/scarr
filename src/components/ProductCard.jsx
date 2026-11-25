import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, onQuickBuy, onSelectProduct, lang = 'ar' }) {
  const sizesList = Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes : [40];
  const [selectedSize, setSelectedSize] = useState(sizesList[0]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (!sizesList.includes(selectedSize)) {
      setSelectedSize(sizesList[0]);
    }
  }, [product?.id, sizesList, selectedSize]);

  const productImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  useEffect(() => {
    if (currentImgIndex >= productImages.length) {
      setCurrentImgIndex(0);
    }
  }, [currentImgIndex, productImages.length]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (productImages.length <= 1) return;
    setCurrentImgIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (productImages.length <= 1) return;
    setCurrentImgIndex((prev) => (prev + 1) % productImages.length);
  };

  const activeImage = productImages[currentImgIndex] || productImages[0] || '';

  const productWithMainImage = {
    ...product,
    image: activeImage || productImages[0]
  };

  const numericPrice = Number(product?.price) || 0;
  const numericOldPrice = product?.oldPrice ? Number(product.oldPrice) : null;

  return (
    <article className="product-card">
      <div
        className="product-image-box"
        style={{ cursor: 'pointer' }}
        onClick={() => onSelectProduct && onSelectProduct(product)}
      >
        {product.badge && <span className="product-badge">{product.badge}</span>}

        <button
          type="button"
          className="card-view-btn"
          title={lang === 'ar' ? 'التفاصيل' : 'View Details'}
          aria-label={lang === 'ar' ? 'التفاصيل' : 'View Details'}
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct && onSelectProduct(product);
          }}
        >
          <Eye size={16} aria-hidden="true" />
        </button>

        {activeImage && (
          <img
            src={activeImage}
            alt={`${product.name} - ${currentImgIndex + 1}`}
            loading="lazy"
          />
        )}

        {productImages.length > 1 && (
          <>
            <button
              type="button"
              className="card-img-arrow prev"
              onClick={handlePrevImage}
              aria-label={lang === 'ar' ? 'الصورة السابقة' : 'Previous image'}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="card-img-arrow next"
              onClick={handleNextImage}
              aria-label={lang === 'ar' ? 'الصورة التالية' : 'Next image'}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            <div className="card-img-dots" onClick={(e) => e.stopPropagation()}>
              {productImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`card-dot ${idx === currentImgIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImgIndex(idx)}
                  aria-label={lang === 'ar' ? `صورة ${idx + 1}` : `Image ${idx + 1}`}
                  aria-pressed={idx === currentImgIndex}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3
          className="product-title"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectProduct && onSelectProduct(product)}
        >
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="current-price">{numericPrice.toLocaleString()} د.ج</span>
          {numericOldPrice && (
            <span className="old-price">{numericOldPrice.toLocaleString()} د.ج</span>
          )}
        </div>

        <div className="sizes-selector">
          <span className="size-label">{lang === 'ar' ? 'المقاس:' : 'Size:'}</span>
          <div className="sizes-list">
            {sizesList.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                aria-pressed={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="product-actions">
          <button
            type="button"
            className="btn-quick-buy"
            onClick={() => onQuickBuy && onQuickBuy(productWithMainImage, selectedSize)}
          >
            <Zap size={16} aria-hidden="true" />
            <span>{lang === 'ar' ? 'اطلب الآن' : 'Order Now'}</span>
          </button>

          <button
            type="button"
            className="btn-add-cart"
            title={lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
            aria-label={lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
            onClick={() => onAddToCart && onAddToCart(productWithMainImage, selectedSize)}
          >
            <ShoppingCart size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
