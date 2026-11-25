import React, { useState } from 'react';
import { X, CheckCircle2, Truck, Building2 } from 'lucide-react';
import { wilayas } from '../data/wilayas';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './CheckoutModal.css';

export default function CheckoutModal({ isOpen, onClose, items, onOrderSuccess }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const [commune, setCommune] = useState('');
  const [deliveryType, setDeliveryType] = useState('home'); // 'home' or 'desk'
  const [orderCompleted, setOrderCompleted] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedWilaya = wilayas.find((w) => w.code === selectedWilayaCode) || wilayas[15];
  const shippingCost = deliveryType === 'home' ? selectedWilaya.home : selectedWilaya.desk;
  const productsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const grandTotal = productsTotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const deliveryLabel = deliveryType === 'home' ? 'توصيل للمنزل' : 'مكتب التوصيل (Stop Desk)';

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('يرجى التحقق من إعدادات Supabase في ملف .env وإعادة تشغيل السيرفر');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('orders').insert([      {        customer_name: fullName.trim(),        phone: phone.trim(),        wilaya: selectedWilaya.name,        commune: commune.trim(),        delivery_type: deliveryLabel,        items: items.map((i) => ({          name: i.name,          size: i.size,          qty: i.qty,          price: i.price        })),        delivery_fee: shippingCost,        total_price: grandTotal      }    ]);

    if (error) {
      console.error('Supabase Order Error:', error);
      setErrorMsg(`تعذر حفظ الطلبية: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    const orderNumber = 'SCAR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderCompleted({
      orderNumber,
      fullName,
      phone,
      wilaya: selectedWilaya.name,
      deliveryType: deliveryLabel,
      grandTotal
    });

    setIsSubmitting(false);
    onOrderSuccess();
  };

  const handleCloseAll = () => {
    setOrderCompleted(null);
    setErrorMsg('');
    setFullName('');
    setPhone('');
    setCommune('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCloseAll}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleCloseAll}>
          <X size={22} />
        </button>

        {orderCompleted ? (
          <div className="order-success-box">
            <CheckCircle2 size={60} color="#16a34a" />
            <h2>تم استلام طلبيتك بنجاح!</h2>
            <p>شكراً لثقتك في <strong>scar_shoess</strong>، سنتصل بك قريباً لتأكيد الطلب.</p>

            <div className="receipt-card">
              <div><span>رقم الطلب:</span> <strong>{orderCompleted.orderNumber}</strong></div>
              <div><span>الاسم:</span> <strong>{orderCompleted.fullName}</strong></div>
              <div><span>الهاتف:</span> <strong dir="ltr">{orderCompleted.phone}</strong></div>
              <div><span>الولاية:</span> <strong>{orderCompleted.wilaya}</strong></div>
              <div><span>التوصيل:</span> <strong>{orderCompleted.deliveryType}</strong></div>
              <div className="receipt-total">
                <span>المبلغ الإجمالي للدفع:</span>
                <strong>{orderCompleted.grandTotal.toLocaleString()} د.ج</strong>
              </div>
            </div>

            <button className="btn-done" onClick={handleCloseAll}>
              العودة للمتجر
            </button>
          </div>
        ) : (
          <>
            <h2 className="modal-title">إتمام الطلب (الدفع عند الاستلام)</h2>

            {errorMsg && (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  marginBottom: '12px'
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label>الاسم واللقب *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد بن علي"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>رقم الهاتف (الجزائر) *</label>
                <input
                  type="tel"
                  required
                  pattern="0[5-7][0-9]{8}"
                  placeholder="0550123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>الولاية (58 ولاية) *</label>
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(e.target.value)}
                  >
                    {wilayas.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>البلدية *</label>
                  <input
                    type="text"
                    required
                    placeholder="اكتب اسم بلديتك"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>طريقة التوصيل</label>
                <div className="delivery-options">
                  <button
                    type="button"
                    className={`delivery-card ${deliveryType === 'home' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('home')}
                  >
                    <Truck size={20} />
                    <div>
                      <strong>للمنزل</strong>
                      <span>{selectedWilaya.home} د.ج</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`delivery-card ${deliveryType === 'desk' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('desk')}
                  >
                    <Building2 size={20} />
                    <div>
                      <strong>للمكتب (Stop Desk)</strong>
                      <span>{selectedWilaya.desk} د.ج</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="summary-box">
                <div className="summary-line">
                  <span>سعر المنتجات ({items.reduce((a, b) => a + b.qty, 0)}):</span>
                  <span>{productsTotal.toLocaleString()} د.ج</span>
                </div>
                <div className="summary-line">
                  <span>تكلفة التوصيل ({selectedWilaya.name}):</span>
                  <span>{shippingCost.toLocaleString()} د.ج</span>
                </div>
                <div className="summary-total">
                  <span>المجموع الكلي:</span>
                  <span>{grandTotal.toLocaleString()} د.ج</span>
                </div>
              </div>

              <button type="submit" className="btn-confirm-order" disabled={isSubmitting}>
                {isSubmitting ? 'جاري إرسال الطلب...' : `تأكيد الطلب الآن (${grandTotal.toLocaleString()} د.ج)`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
