import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onRemove, onCheckout }) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>سلة المشتريات ({cart.reduce((acc, item) => acc + item.qty, 0)})</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} color="#9ca3af" />
              <p>سلة المشتريات فارغة حالياً</p>
              <button className="btn-continue" onClick={onClose}>
                تصفح الأحذية
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <span className="cart-item-size">المقاس: {item.size}</span>
                  <span className="cart-item-price">
                    {(item.price * item.qty).toLocaleString()} د.ج
                  </span>

                  <div className="qty-controls">
                    <button onClick={() => onUpdateQty(item.id, item.size, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.size, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => onRemove(item.id, item.size)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>المجموع الفرعي:</span>
              <strong>{subtotal.toLocaleString()} د.ج</strong>
            </div>
            <p className="shipping-note">* يُحسب سعر التوصيل في الخطوة التالية حسب الولاية</p>
            <button className="btn-checkout" onClick={onCheckout}>
              إتمام الطلب الآن
            </button>
          </div>
        )}
      </div>
    </div>
  );
}