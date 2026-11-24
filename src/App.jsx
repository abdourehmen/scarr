import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductSkeleton from './components/ProductSkeleton';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import RevealOnScroll from './components/RevealOnScroll';
import AdminDashboard from './components/AdminDashboard';
import { products as defaultProducts } from './data/products';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import './App.css';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );
  const [lang, setLang] = useState('ar');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productsList, setProductsList] = useState(defaultProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(
        window.location.pathname === '/admin' || window.location.hash === '#admin'
      );
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            const formatted = data.map((item) => ({
              ...item,
              id: `db-${item.id}`,
              oldPrice: item.old_price,
              images: Array.isArray(item.images) ? item.images : []
            }));
            setProductsList([...formatted, ...defaultProducts]);
          }
        }
      } catch (err) {
        console.error('Load Products Error:', err);
      } finally {
        setTimeout(() => setIsLoadingProducts(false), 450);
      }
    }
    loadProducts();
  }, [selectedCategory, isAdminRoute]);

  if (isAdminRoute) {
    return (
      <AdminDashboard
        onBackToStore={() => {
          window.history.pushState({}, '', '/');
          setIsAdminRoute(false);
        }}
      />
    );
  }

  const texts = {
    ar: {
      sectionTitle: 'تشكيلة الأحذية المتوفرة',
      sectionSub: 'اختر المقاس المناسب واضغط على "اطلب الآن" للدفع عند الاستلام',
      categories: [
        { id: 'all', label: 'الكل' },
        { id: 'رياضية', label: 'رياضية' },
        { id: 'يومية', label: 'يومية' },
        { id: 'كلاسيكية', label: 'كلاسيكية' }
      ],
      addedMsg: (name, size) => `تمت إضافة ${name} (مقاس ${size}) للسلة`
    },
    en: {
      sectionTitle: 'Available Footwear Collection',
      sectionSub: 'Select your size and click "Order Now" for Cash on Delivery',
      categories: [
        { id: 'all', label: 'All' },
        { id: 'رياضية', label: 'Sport' },
        { id: 'يومية', label: 'Casual' },
        { id: 'كلاسيكية', label: 'Classic' }
      ],
      addedMsg: (name, size) => `Added ${name} (Size ${size}) to cart`
    }
  };

  const t = texts[lang];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  const handleAddToCart = (product, size) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, size, qty: 1 }];
    });
    showToast(t.addedMsg(product.name, size));
  };

  const handleUpdateQty = (id, size, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveItem = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const handleQuickBuy = (product, size, qty = 1) => {
    setCheckoutItems([{ ...product, size, qty }]);
  };

  const handleCartCheckout = () => {
    setIsCartOpen(false);
    setCheckoutItems(cart);
  };

  const filteredProducts = productsList.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="app-wrapper">
      {toastMessage && <div className="custom-toast">{toastMessage}</div>}

      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        lang={lang}
        setLang={setLang}
      />

      <div id="hero-section">
        <Hero />
      </div>

      <main className="container" id="products-section">
        <RevealOnScroll animation="fade-up">
          <div className="section-header">
            <div>
              <h2>{t.sectionTitle}</h2>
              <p>{t.sectionSub}</p>
            </div>

            <div className="category-tabs">
              {t.categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {isLoadingProducts ? (
          <ProductSkeleton count={6} />
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <RevealOnScroll
                key={product.id}
                animation="zoom-in"
                delay={(index % 4) * 90}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={handleQuickBuy}
                  onSelectProduct={(prod) => setSelectedProduct(prod)}
                  lang={lang}
                />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </main>

      <RevealOnScroll animation="fade-up" delay={100}>
        <ReviewsSection lang={lang} />
      </RevealOnScroll>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onQuickBuy={handleQuickBuy}
        lang={lang}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
        onCheckout={handleCartCheckout}
        lang={lang}
      />

      <CheckoutModal
        isOpen={Boolean(checkoutItems)}
        onClose={() => setCheckoutItems(null)}
        items={checkoutItems || []}
        onOrderSuccess={() => {
          if (checkoutItems === cart) setCart([]);
        }}
        lang={lang}
      />

      <RevealOnScroll animation="fade-up">
        <div id="footer-section">
          <Footer lang={lang} />
        </div>
      </RevealOnScroll>
    </div>
  );
}