import React, { useState } from 'react';
import { ShoppingCart, Zap, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, onQuickBuy, onSelectProduct, lang = 'ar' }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const productImages = product.images || [product.image];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % productImages.length);
  };

  const productWithMainImage = {
    ...product,
    image: productImages[0]
  };

  return (
    <div className="product-card">
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
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct && onSelectProduct(product);
          }}
        >
          <Eye size={16} />
        </button>

        <img
          src={productImages[currentImgIndex]}
          alt={`${product.name} - ${currentImgIndex + 1}`}
          loading="lazy"
        />

        {productImages.length > 1 && (
          <>
            <button
              type="button"
              className="card-img-arrow prev"
              onClick={handlePrevImage}
              aria-label="الصورة السابقة"
            >
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              className="card-img-arrow next"
              onClick={handleNextImage}
              aria-label="الصورة التالية"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="card-img-dots" onClick={(e) => e.stopPropagation()}>
              {productImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`card-dot ${idx === currentImgIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImgIndex(idx)}
                  aria-label={`صورة ${idx + 1}`}
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
          <span className="current-price">{product.price.toLocaleString()} د.ج</span>
          {product.oldPrice && (
            <span className="old-price">{product.oldPrice.toLocaleString()} د.ج</span>
          )}
        </div>

        <div className="sizes-selector">
          <span className="size-label">{lang === 'ar' ? 'المقاس:' : 'Size:'}</span>
          <div className="sizes-list">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="product-actions">
          <button
            className="btn-quick-buy"
            onClick={() => onQuickBuy(productWithMainImage, selectedSize)}
          >
            <Zap size={16} />
            <span>{lang === 'ar' ? 'اطلب الآن' : 'Order Now'}</span>
          </button>

          <button
            className="btn-add-cart"
            title={lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
            onClick={() => onAddToCart(productWithMainImage, selectedSize)}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}