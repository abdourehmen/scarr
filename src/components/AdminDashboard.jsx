import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  Upload,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  RotateCcw,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './AdminDashboard.css';

const DEFAULT_SIZES = [38, 39, 40, 41, 42, 43, 44, 45];

export default function AdminDashboard({ onBackToStore }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // حالة التعديل
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  // حقول نموذج المنتج
  const [name, setName] = useState('');
  const [category, setCategory] = useState('رياضية');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [badge, setBadge] = useState('');
  const [availableSizes, setAvailableSizes] = useState(DEFAULT_SIZES);
  const [selectedSizes, setSelectedSizes] = useState([40, 41, 42, 43, 44]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && isSupabaseConfigured && supabase) {
      fetchOrders();
      fetchProducts();
    }
  }, [session]);

  const notify = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const clearSelectedImages = () => {
    selectedImages.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setSelectedImages([]);
  };

  const resetForm = () => {
    setEditingProductId(null);
    setExistingImages([]);
    setName('');
    setCategory('رياضية');
    setPrice('');
    setOldPrice('');
    setBadge('');
    setAvailableSizes(DEFAULT_SIZES);
    setSelectedSizes([40, 41, 42, 43, 44]);
    setCustomSizeInput('');
    clearSelectedImages();
  };

  const handleStartEdit = (prod) => {
    clearSelectedImages();
    setEditingProductId(prod.id);
    setExistingImages(Array.isArray(prod.images) ? prod.images : []);
    setName(prod.name || '');
    setCategory(prod.category || 'رياضية');
    setPrice(prod.price ?? '');
    setOldPrice(prod.old_price ?? '');
    setBadge(prod.badge || '');

    const prodSizes =
      Array.isArray(prod.sizes) && prod.sizes.length > 0
        ? prod.sizes
        : [40, 41, 42, 43, 44];

    setAvailableSizes(
      Array.from(new Set([...DEFAULT_SIZES, ...prodSizes])).sort((a, b) => a - b)
    );
    setSelectedSizes(prodSizes);
    setCustomSizeInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setSelectedImages((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setSelectedImages((prev) => {
      const target = prev[indexToRemove];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustomSize = () => {
    const parsed = parseInt(customSizeInput, 10);
    if (Number.isNaN(parsed) || parsed < 15 || parsed > 60) {
      notify('أدخل مقاساً صحيحاً (بين 15 و 60)');
      return;
    }
    if (!availableSizes.includes(parsed)) {
      setAvailableSizes((prev) => [...prev, parsed].sort((a, b) => a - b));
    }
    if (!selectedSizes.includes(parsed)) {
      setSelectedSizes((prev) => [...prev, parsed].sort((a, b) => a - b));
    }
    setCustomSizeInput('');
  };

  // حذف مقاس نهائياً من القائمة ومن المقاسات المحددة
  const handleDeleteSize = (e, sizeToRemove) => {
    e.stopPropagation();
    setAvailableSizes((prev) => prev.filter((s) => s !== sizeToRemove));
    setSelectedSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setLoginError('يرجى إضافة مفاتيح Supabase في ملف .env ثم إعادة تشغيل السيرفر');
      return;
    }

    setLoginError('');
    setIsLoggingIn(true);

    const emailToUse = usernameOrEmail.includes('@')
      ? usernameOrEmail.trim()
      : `${usernameOrEmail.trim()}@scarshoess.dz`;

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password
    });

    setIsLoggingIn(false);

    if (error) {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
    } else {
      setPassword('');
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const fetchOrders = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setOrders(data);
    setLoadingData(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setProducts(data);
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const uploadSelectedImages = async () => {
    const uploadedUrls = [];
    for (const item of selectedImages) {
      const file = item.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('shoes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('shoes')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrlData.publicUrl);
    }
    return uploadedUrls;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const totalImagesCount = selectedImages.length + existingImages.length;
    if (!name || !price || totalImagesCount === 0 || selectedSizes.length === 0) {
      notify('يرجى ملء جميع الحقول واختيار مقاس وصورة واحدة على الأقل');
      return;
    }

    setSubmittingProduct(true);
    try {
      const newUploadedUrls = selectedImages.length > 0 ? await uploadSelectedImages() : [];
      const finalImages = [...existingImages, ...newUploadedUrls];

      const payload = {
        name: name.trim(),
        category,
        price: Number(price),
        old_price: oldPrice ? Number(oldPrice) : null,
        sizes: selectedSizes,
        images: finalImages,
        badge: badge.trim() || null
      };

      if (editingProductId) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProductId);

        if (updateError) throw updateError;

        resetForm();
        await fetchProducts();
        notify('تم تحديث بيانات الحذاء بنجاح!');
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([payload]);

        if (insertError) throw insertError;

        resetForm();
        await fetchProducts();
        notify('تمت إضافة الحذاء بنجاح إلى المتجر!');
      }
    } catch (err) {
      console.error('Save Product Error:', err);
      notify(`خطأ: ${err.message || 'تعذر حفظ بيانات المنتج'}`);
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      if (editingProductId === id) resetForm();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      notify('تم حذف المنتج');
    } else {
      notify(`خطأ في الحذف: ${error.message}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      notify(`تم تحديث حالة الطلب إلى: ${newStatus}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('حذف هذه الطلبية نهائياً؟')) return;
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      notify('تم حذف الطلبية');
    }
  };

  if (authLoading) {
    return <div className="admin-loading">جاري التحقق من الجلسة...</div>;
  }

  if (!session) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-lock-icon">
            <Lock size={28} />
          </div>
          <h2>لوحة تحكم scar_shoess</h2>
          <p>سجّل الدخول لإدارة المنتجات ومتابعة طلبيات الزبائن</p>

          {loginError && <div className="admin-error-box">{loginError}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-field">
              <label>اسم المستخدم أو البريد الإلكتروني</label>
              <input
                type="text"
                placeholder="admin"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>

            <div className="admin-field">
              <label>كلمة المرور</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>

            <button type="submit" className="btn-admin-login" disabled={isLoggingIn}>
              {isLoggingIn ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <button type="button" className="btn-back-store" onClick={onBackToStore}>
            <ArrowRight size={16} />
            <span>العودة إلى المتجر</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {statusMsg && <div className="custom-toast">{statusMsg}</div>}

      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div className="admin-brand">
            <span dir="ltr">scar<strong>_shoess</strong></span>
            <span className="admin-pill">لوحة الإدارة</span>
          </div>

          <div className="admin-top-actions">
            <button type="button" className="btn-store-link" onClick={onBackToStore}>
              عرض المتجر
            </button>
            <button type="button" className="btn-logout" onClick={handleLogout}>
              <LogOut size={17} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container admin-main">
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>الطلبيات ({orders.length})</span>
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>المنتجات ({products.length})</span>
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="admin-section-box">
            <div className="admin-section-header">
              <h3>طلبيات الزبائن الواردة</h3>
              <button type="button" className="btn-store-link" onClick={fetchOrders}>
                تحديث الطلبيات
              </button>
            </div>

            {loadingData ? (
              <p>جاري تحميل الطلبيات...</p>
            ) : orders.length === 0 ? (
              <p className="empty-state">لا توجد طلبيات مسجلة حتى الآن.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-glass-card">
                    <div className="order-card-header">
                      <div>
                        <strong>{order.customer_name}</strong>
                        <span className="order-phone" dir="ltr">{order.phone}</span>
                      </div>
                      <span className={`order-status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-meta">
                      <span>الولاية: <strong>{order.wilaya}</strong> {order.commune && `(${order.commune})`}</span>
                      <span>التوصيل: <strong>{order.delivery_type}</strong></span>
                      <span>الإجمالي: <strong className="price-highlight">{Number(order.total_price).toLocaleString()} د.ج</strong></span>
                    </div>

                    <div className="order-items-box">
                      {Array.isArray(order.items) &&
                        order.items.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <span>{item.name}</span>
                            <span>المقاس: <strong>{item.size}</strong> | الكمية: <strong>{item.qty}</strong></span>
                          </div>
                        ))}
                    </div>

                    <div className="order-card-actions">
                      <button
                        type="button"
                        className="btn-status confirm"
                        onClick={() => handleUpdateOrderStatus(order.id, 'مؤكد')}
                      >
                        <CheckCircle size={15} /> تأكيد
                      </button>
                      <button
                        type="button"
                        className="btn-status shipped"
                        onClick={() => handleUpdateOrderStatus(order.id, 'قيد التوصيل')}
                      >
                        <Truck size={15} /> أُرسل
                      </button>
                      <button
                        type="button"
                        className="btn-status cancel"
                        onClick={() => handleUpdateOrderStatus(order.id, 'ملغى')}
                      >
                        <XCircle size={15} /> إلغاء
                      </button>
                      <button
                        type="button"
                        className="btn-delete-small"
                        onClick={() => handleDeleteOrder(order.id)}
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-products-layout">
            <form onSubmit={handleSaveProduct} className="admin-form-card">
              <div className="admin-form-header">
                <h3>
                  {editingProductId ? <Pencil size={18} /> : <Plus size={19} />}
                  <span>{editingProductId ? 'تعديل بيانات الحذاء' : 'إضافة حذاء جديد'}</span>
                </h3>

                {editingProductId && (
                  <button type="button" className="btn-cancel-edit" onClick={resetForm}>
                    <RotateCcw size={14} />
                    <span>إلغاء التعديل</span>
                  </button>
                )}
              </div>

              <div className="admin-field">
                <label>اسم الحذاء</label>
                <input
                  type="text"
                  placeholder="مثال: Nike Air Max Pulse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-row-2">
                <div className="admin-field">
                  <label>التصنيف</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="رياضية">رياضية</option>
                    <option value="يومية">يومية</option>
                    <option value="كلاسيكية">كلاسيكية</option>
                  </select>
                </div>

                <div className="admin-field">
                  <label>شارة (اختياري)</label>
                  <input
                    type="text"
                    placeholder="جديد / تخفيض"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-row-2">
                <div className="admin-field">
                  <label>السعر الحالي (د.ج)</label>
                  <input
                    type="number"
                    placeholder="7800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>السعر القديم (اختياري)</label>
                  <input
                    type="number"
                    placeholder="9500"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>المقاسات المتوفرة (اضغط للتحديد أو × للحذف)</label>
                <div className="admin-sizes-grid">
                  {availableSizes.map((sz) => (
                    <div key={sz} className="admin-size-wrapper">
                      <button
                        type="button"
                        className={`admin-size-chip ${selectedSizes.includes(sz) ? 'active' : ''}`}
                        onClick={() => toggleSize(sz)}
                      >
                        {sz}
                      </button>
                      <button
                        type="button"
                        className="size-delete-badge"
                        onClick={(e) => handleDeleteSize(e, sz)}
                        title={`حذف المقاس ${sz}`}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* خانة إضافة مقاس مخصص */}
                <div className="custom-size-row">
                  <input
                    type="number"
                    min="15"
                    max="60"
                    placeholder="أضف مقاساً آخر (مثل 37 أو 46)"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-size"
                    onClick={handleAddCustomSize}
                  >
                    <Plus size={16} />
                    <span>إضافة مقاس</span>
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label>صور الحذاء (يمكن اختيار عدة صور)</label>
                <label className="file-upload-box">
                  <Upload size={20} />
                  <span>اضغط لاختيار صور الحذاء</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    hidden
                  />
                </label>

                {/* معاينة مصغرة للصور في الأسفل */}
                {(existingImages.length > 0 || selectedImages.length > 0) && (
                  <div className="bottom-thumbs-strip">
                    {existingImages.map((imgUrl, idx) => (
                      <div key={`existing-${idx}`} className="thumb-item">
                        <img src={imgUrl} alt={`Saved ${idx + 1}`} />
                        <button
                          type="button"
                          className="thumb-remove-btn"
                          onClick={() => handleRemoveExistingImage(idx)}
                          title="حذف الصورة"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {selectedImages.map((item, idx) => (
                      <div key={`new-${idx}`} className="thumb-item">
                        <img src={item.previewUrl} alt={`New ${idx + 1}`} />
                        <button
                          type="button"
                          className="thumb-remove-btn"
                          onClick={() => handleRemoveNewImage(idx)}
                          title="إزالة الصورة"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-admin-submit" disabled={submittingProduct}>
                {submittingProduct
                  ? 'جاري الحفظ...'
                  : editingProductId
                  ? 'حفظ التعديلات'
                  : 'نشر الحذاء في المتجر'}
              </button>
            </form>

            <div className="admin-products-list">
              <h3>الأحذية المنشورة ({products.length})</h3>
              <div className="admin-prod-grid">
                {products.map((prod) => (
                  <div key={prod.id} className="admin-prod-item">
                    <img src={prod.images?.[0]} alt={prod.name} />
                    <div className="admin-prod-details">
                      <h4>{prod.name}</h4>
                      <span>{prod.category} • {Number(prod.price).toLocaleString()} د.ج</span>
                    </div>
                    <div className="admin-prod-actions">
                      <button
                        type="button"
                        className="btn-edit-prod"
                        onClick={() => handleStartEdit(prod)}
                        title="تعديل المنتج"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-delete-prod"
                        onClick={() => handleDeleteProduct(prod.id)}
                        title="حذف المنتج"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
