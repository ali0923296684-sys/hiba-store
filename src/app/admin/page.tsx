"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart,
  Plus, Trash2, LogOut, Loader2, X, Upload, Film, Image as ImageIcon,
  CheckCircle2, DollarSign, Tag, Palette, Edit, MapPin, Printer, Download
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import SalesChart from "@/components/SalesChart";
import OrderSound from "@/components/OrderSound";
type AdminTab = "dashboard" | "products" | "orders";

const availableColors = [
  { name: "ذهبي", code: "#D4AF37" }, { name: "فضي", code: "#C0C0C0" }, { name: "أسود", code: "#1a1a1a" },
  { name: "أبيض", code: "#FFFFFF" }, { name: "وردي", code: "#FFC0CB" }, { name: "أحمر", code: "#DC2626" },
  { name: "أزرق", code: "#2563EB" }, { name: "أخضر", code: "#16A34A" }, { name: "بني", code: "#8B4513" },
  { name: "بيج", code: "#E8D5A3" }, { name: "رصاصي", code: "#71717A" }, { name: "نحاسي", code: "#B87333" },
];
const availableSizes = ["S", "M", "L", "XL", "36", "37", "38", "39", "40", "41", "42"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [dbCities, setDbCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [notification, setNotification] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPromo, setNewPromo] = useState({ code: "", discount: "" });
  const [newCity, setNewCity] = useState({ name: "", cost: "" });
  const [productData, setProductData] = useState({
    name: "", price: "", category: "إكسسوارات", description: "", image: "",
    images: [] as string[], videos: [] as string[], colors: [] as string[], sizes: [] as string[]
  });

  const categories = ["عطور فاخرة", "حقائب يد", "مجوهرات", "ساعات فاخرة", "أحذية فاخرة", "إكسسوارات"];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: promos } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    const { data: cities } = await supabase.from('cities').select('*').order('name');
    if (products) setDbProducts(products);
    if (orders) setDbOrders(orders);
    if (promos) setPromoCodes(promos);
    if (cities) setDbCities(cities);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  const handleAddCity = async () => {
    if (!newCity.name) return;
    const { error } = await supabase.from('cities').insert([{ name: newCity.name, shipping_cost: parseInt(newCity.cost) || 0 }]);
    if (!error) { showNotification("✅ تم إضافة المدينة"); setNewCity({ name: "", cost: "" }); fetchData(); }
    else { alert("ربما المدينة موجودة بالفعل!"); }
  };

  const deleteCity = async (id: number) => {
    await supabase.from('cities').delete().eq('id', id);
    fetchData();
    showNotification("🗑 تم حذف المدينة");
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) { showNotification("✅ تم التحديث"); fetchData(); }
  };

  const openAddModal = () => {
    setEditingId(null);
    setProductData({ name: "", price: "", category: "إكسسوارات", description: "", image: "", images: [], videos: [], colors: [], sizes: [] });
    setShowAddProduct(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setProductData({
      name: product.name || "", price: String(product.price || ""),
      category: product.category || "إكسسوارات", description: product.description || "",
      image: product.image || "", images: product.images || [],
      videos: product.videos || [], colors: product.colors || [], sizes: product.sizes || [],
    });
    setShowAddProduct(true);
  };

  const toggleColor = (colorName: string) => {
    setProductData(prev => ({
      ...prev,
      colors: prev.colors.includes(colorName) ? prev.colors.filter(c => c !== colorName) : [...prev.colors, colorName]
    }));
  };

  const toggleSize = (size: string) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
    }));
  };

  const handleAddPromo = async () => {
    if (!newPromo.code || !newPromo.discount) return;
    const { error } = await supabase.from('promo_codes').insert([{
      code: newPromo.code.toUpperCase(),
      discount_percentage: parseInt(newPromo.discount),
      is_active: true
    }]);
    if (!error) { showNotification("✅ تم إضافة كود الخصم"); setNewPromo({ code: "", discount: "" }); fetchData(); }
  };

  const deletePromo = async (id: number) => {
    await supabase.from('promo_codes').delete().eq('id', id);
    fetchData();
    showNotification("🗑 تم الحذف");
  };

  const uploadFile = async (file: File) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('product-media').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsSubmitting(true);
    try {
      if (type === 'main') {
        const url = await uploadFile(files[0]);
        setProductData(prev => ({ ...prev, image: url }));
      } else if (type === 'gallery') {
        const urls = await Promise.all(Array.from(files).map(f => uploadFile(f)));
        setProductData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
      } else if (type === 'video') {
        const url = await uploadFile(files[0]);
        setProductData(prev => ({ ...prev, videos: [...prev.videos, url] }));
      }
      showNotification("✅ تم الرفع");
    } catch (error: any) {
      alert("خطأ: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData.image) return alert("يرجى رفع صورة رئيسية");
    setIsSubmitting(true);
    const dataToSave = {
      name: productData.name, price: parseFloat(productData.price),
      category: productData.category, description: productData.description,
      image: productData.image, images: productData.images,
      videos: productData.videos, colors: productData.colors,
      sizes: productData.sizes, brand: "هبة الرحمن"
    };
    let error;
    if (editingId) {
      const res = await supabase.from('products').update(dataToSave).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('products').insert([{ ...dataToSave, inStock: true, rating: 5.0 }]);
      error = res.error;
    }
    if (!error) {
      showNotification(editingId ? "✅ تم تعديل المنتج" : "✨ تمت إضافة المنتج");
      setShowAddProduct(false);
      setEditingId(null);
      fetchData();
    } else {
      alert("خطأ: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hiba2026") { setIsAuthenticated(true); }
    else { setLoginError("كلمة المرور غير صحيحة"); }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const printInvoice = (order: any) => {
    const items = order.items?.map((item: any) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.name}${item.selectedColor ? ` (${item.selectedColor})` : ""}${item.selectedSize ? ` [${item.selectedSize}]` : ""}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity || 1}</td></tr>`
    ).join("") || "";
    const html = `<html dir="rtl"><head><title>فاتورة ${order.order_number}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#333;max-width:700px;margin:0 auto}h1{color:#C9A96E;margin:0}table{width:100%;border-collapse:collapse;margin:20px 0}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #C9A96E;padding-bottom:20px;margin-bottom:30px}.total{font-size:28px;font-weight:bold;color:#C9A96E;text-align:left;margin-top:20px;padding-top:15px;border-top:2px solid #C9A96E}.info{background:#f9f7f2;padding:15px;border-radius:10px;margin:15px 0}@media print{body{padding:20px}}</style></head><body><div class="header"><div><h1>هبة الرحمن</h1><p style="color:#999;font-size:12px">Luxury Store</p><p style="color:#999;font-size:11px">hibatrahman.xyz</p></div><div style="text-align:left"><p style="font-size:12px;color:#666">فاتورة رقم</p><p style="color:#C9A96E;font-size:22px;font-weight:bold">${order.order_number}</p><p style="color:#999;font-size:11px">${new Date(order.created_at).toLocaleDateString("ar-LY")}</p></div></div><div class="info"><h3 style="margin:0 0 10px;color:#C9A96E">بيانات العميل</h3><p><strong>الاسم:</strong> ${order.customer_name}</p><p><strong>الهاتف:</strong> ${order.phone}</p><p><strong>العنوان:</strong> ${order.city} - ${order.address}</p><p><strong>الحالة:</strong> ${order.status}</p></div><h3 style="color:#C9A96E">المنتجات</h3><table><thead><tr><th style="padding:10px;border-bottom:2px solid #C9A96E;text-align:right;color:#C9A96E">المنتج</th><th style="padding:10px;border-bottom:2px solid #C9A96E;text-align:center;color:#C9A96E">الكمية</th></tr></thead><tbody>${items}</tbody></table><p class="total">الإجمالي: ${order.total_amount || order.total_price} د.ل</p><hr style="margin:30px 0;border:none;border-top:1px solid #eee"><p style="color:#999;font-size:10px;text-align:center">شكراً لتسوقكم من متجر هبة الرحمن<br>واتساب: +218 93-536-4926</p></body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500); }
  };

  const exportOrdersCSV = () => {
    const header = "رقم الطلب,الاسم,الهاتف,المدينة,العنوان,الحالة,الإجمالي,التاريخ,المنتجات\n";
    const rows = dbOrders.map(o => {
      const items = o.items?.map((i: any) => i.name).join(" | ") || "";
      const date = new Date(o.created_at).toLocaleDateString("ar-LY");
      return `${o.order_number},${o.customer_name},${o.phone},${o.city},${o.address},${o.status},${o.total_amount || o.total_price},${date},"${items}"`;
    }).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `طلبات_هبة_الرحمن_${new Date().toLocaleDateString("ar-LY")}.csv`;
    a.click();
    showNotification("✅ تم تصدير الطلبات");
  };

  const navItems = [
    { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard },
    { id: "products", label: "المنتجات", icon: Package },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 max-w-sm w-full border border-luxury-beige/20 text-center">
          <LayoutDashboard className="w-12 h-12 text-luxury-beige mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-6 text-luxury-cream">دخول الإدارة</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5 text-center text-white" placeholder="كلمة المرور" />
            {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
            <button className="w-full btn-primary py-4">دخول</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream flex flex-col md:flex-row">
      <div className="hidden md:flex w-64 bg-dark-900 border-l border-luxury-beige/10 p-6 fixed h-full z-40 flex-col">
        <h2 className="font-serif text-2xl font-bold gold-gradient-text mb-10 text-center">هبة الرحمن</h2>
        <nav className="space-y-2 flex-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as AdminTab)} className={`w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl ${activeTab === item.id ? "bg-luxury-beige text-dark-900 font-bold" : "hover:bg-white/5"}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5">
          <LogOut size={18} /> خروج
        </button>
      </div>

      <header className="md:hidden sticky top-0 z-30 bg-dark-900/90 backdrop-blur-lg border-b border-white/5 p-4 flex justify-between items-center">
        <h2 className="font-serif text-xl font-bold gold-gradient-text">لوحة الإدارة</h2>
        <button onClick={() => setIsAuthenticated(false)} className="text-red-400 p-2"><LogOut size={20} /></button>
      </header>

      <div className="flex-1 md:mr-64 p-4 md:p-8 pb-28 md:pb-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
<div className="flex justify-between items-center flex-row-reverse">
  <h1 className="text-2xl md:text-3xl font-serif">ملخص المتجر</h1>
  <OrderSound enabled={true} />
</div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-card p-4 md:p-6 border-white/5 text-right">
                <DollarSign className="text-luxury-beige mb-2 mr-auto" size={20} />
                <p className="text-[10px] uppercase opacity-40">المبيعات</p>
                <h2 className="text-lg md:text-3xl font-serif gold-gradient-text font-bold">{formatPrice(dbOrders.reduce((a, o) => a + (o.total_amount || o.total_price || 0), 0))}</h2>
              </div>
              <div className="glass-card p-4 md:p-6 border-white/5 text-right">
                <ShoppingCart className="text-luxury-beige mb-2 mr-auto" size={20} />
                <p className="text-[10px] uppercase opacity-40">الطلبات</p>
                <h2 className="text-lg md:text-3xl font-serif font-bold">{dbOrders.length}</h2>
              </div>
              <div className="glass-card p-4 md:p-6 border-white/5 text-right col-span-2 lg:col-span-1">
                <Package className="text-luxury-beige mb-2 mr-auto" size={20} />
                <p className="text-[10px] uppercase opacity-40">المنتجات</p>
                <h2 className="text-lg md:text-3xl font-serif font-bold">{dbProducts.length}</h2>
              </div>
            </div>

            <SalesChart orders={dbOrders} />

            <div className="glass-card p-4 md:p-6 border-luxury-beige/10 text-right">
              <div className="flex items-center justify-end gap-2 mb-4">
                <h2 className="font-serif text-lg">أكواد الخصم</h2>
                <Tag size={18} className="text-luxury-beige" />
              </div>
              <div className="flex flex-col sm:flex-row-reverse gap-2 mb-4">
                <input placeholder="الكود" className="bg-dark-800 p-3 rounded-xl flex-1 border border-white/5 outline-none text-right uppercase text-sm" value={newPromo.code} onChange={e => setNewPromo({ ...newPromo, code: e.target.value })} />
                <input type="number" placeholder="%" className="bg-dark-800 p-3 rounded-xl w-full sm:w-24 border border-white/5 outline-none text-center text-sm" value={newPromo.discount} onChange={e => setNewPromo({ ...newPromo, discount: e.target.value })} />
                <button onClick={handleAddPromo} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">إضافة</button>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {promoCodes.map(p => (
                  <div key={p.id} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2 text-xs">
                    <button onClick={() => deletePromo(p.id)} className="text-red-400"><X size={14} /></button>
                    <span className="opacity-40">({p.discount_percentage}%)</span>
                    <span className="font-bold text-luxury-beige">{p.code}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 md:p-6 border-luxury-beige/10 text-right">
              <div className="flex items-center justify-end gap-2 mb-4">
                <h2 className="font-serif text-lg">مدن التوصيل</h2>
                <MapPin size={18} className="text-luxury-beige" />
              </div>
              <div className="flex flex-col sm:flex-row-reverse gap-2 mb-4">
                <input placeholder="اسم المدينة" className="bg-dark-800 p-3 rounded-xl flex-1 border border-white/5 outline-none text-right text-sm" value={newCity.name} onChange={e => setNewCity({ ...newCity, name: e.target.value })} />
                <input type="number" placeholder="السعر (0=مجاني)" className="bg-dark-800 p-3 rounded-xl w-full sm:w-40 border border-white/5 outline-none text-center text-sm" value={newCity.cost} onChange={e => setNewCity({ ...newCity, cost: e.target.value })} />
                <button onClick={handleAddCity} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">إضافة</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dbCities.map(c => (
                  <div key={c.id} className="bg-white/5 px-3 py-2 rounded-lg flex items-center justify-between gap-2 text-xs">
                    <button onClick={() => deleteCity(c.id)} className="text-red-400"><X size={14} /></button>
                    <div className="text-right">
                      <span className="font-bold text-luxury-cream block">{c.name}</span>
                      <span className={`text-[10px] ${c.shipping_cost === 0 ? 'text-green-400' : 'text-luxury-beige'}`}>
                        {c.shipping_cost === 0 ? "مجاني" : `${c.shipping_cost} د.ل`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-row-reverse">
              <h1 className="text-2xl md:text-3xl font-serif">المنتجات</h1>
              <button onClick={openAddModal} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold">
                <Plus size={16} /> إضافة
              </button>
            </div>
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
              {dbProducts.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex gap-1">
                    <button onClick={async () => { if (confirm("حذف؟")) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} className="text-red-400/50 hover:text-red-400 p-2">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => openEditModal(p)} className="text-blue-400/50 hover:text-blue-400 p-2">
                      <Edit size={18} />
                    </button>
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="font-bold text-sm truncate">{p.name}</p>
                    <p className="text-xs gold-gradient-text font-bold">{formatPrice(p.price)}</p>
                    {p.colors && p.colors.length > 0 && <p className="text-[10px] opacity-40 mt-1">الألوان: {p.colors.join('، ')}</p>}
                  </div>
                  <img src={p.image} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-row-reverse">
              <h1 className="text-2xl md:text-3xl font-serif">الطلبات</h1>
              {dbOrders.length > 0 && (
                <button onClick={exportOrdersCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20">
                  <Download size={14} /> تصدير Excel
                </button>
              )}
            </div>
            <div className="space-y-4">
              {dbOrders.length === 0 && <p className="text-center opacity-40 py-10">لا توجد طلبات بعد</p>}
              {dbOrders.map(o => (
                <div key={o.id} className="glass-card p-4 rounded-2xl border border-white/5 text-right">
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                    <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className={`text-[10px] font-bold p-2 rounded-lg border-none outline-none ${o.status === 'تم التوصيل' ? 'bg-green-500/10 text-green-500' : o.status === 'في الطريق' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      <option value="جاري التجهيز">جاري التجهيز</option>
                      <option value="في الطريق">في الطريق</option>
                      <option value="تم التوصيل">تم التوصيل</option>
                    </select>
                    <span className="font-mono text-luxury-beige font-bold">{o.order_number}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="opacity-40 text-xs">الزبون:</span> {o.customer_name}</p>
                    <p><span className="opacity-40 text-xs">الهاتف:</span> <span dir="ltr">{o.phone}</span></p>
                    <p><span className="opacity-40 text-xs">العنوان:</span> {o.city} - {o.address}</p>
                    <div className="pt-2 mt-2 border-t border-white/5">
                      {o.items?.map((item: any, idx: number) => (
                        <p key={idx} className="text-xs opacity-70">
                          • {item.name} {item.selectedColor && <span className="text-luxury-beige font-bold">({item.selectedColor})</span>}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <button onClick={() => printInvoice(o)} className="flex items-center gap-1 text-[10px] text-luxury-beige/60 hover:text-luxury-beige transition-colors">
                        <Printer size={12} /> طباعة فاتورة
                      </button>
                      <p className="font-bold">الإجمالي: <span className="gold-gradient-text">{formatPrice(o.total_amount || o.total_price)}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-xl border-t border-luxury-beige/10 flex justify-around items-center p-2">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as AdminTab)} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 ${activeTab === item.id ? "text-luxury-beige" : "text-white/40"}`}>
            <item.icon size={22} /><span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-dark-900 border border-white/10 p-6 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex flex-row-reverse justify-between items-center mb-6">
                <h2 className="text-xl font-serif gold-gradient-text">{editingId ? "تعديل المنتج" : "إضافة قطعة"}</h2>
                <button onClick={() => setShowAddProduct(false)}><X /></button>
              </div>
              <form onSubmit={saveProduct} className="space-y-4 text-right">
                <input placeholder="اسم القطعة" required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5" value={productData.name} onChange={e => setProductData({ ...productData, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5 text-sm" value={productData.category} onChange={e => setProductData({ ...productData, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" placeholder="السعر" required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5" value={productData.price} onChange={e => setProductData({ ...productData, price: e.target.value })} />
                </div>
                <textarea placeholder="الوصف..." required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5 h-24" value={productData.description} onChange={e => setProductData({ ...productData, description: e.target.value })} />

                <div className="bg-dark-800/50 p-4 rounded-2xl border border-luxury-beige/10 space-y-4">
                  <div className="flex items-center justify-end gap-2 text-luxury-beige text-sm">
                    <span>اختاري الألوان المتوفرة</span><Palette size={16} />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {availableColors.map(color => (
                      <button type="button" key={color.name} onClick={() => toggleColor(color.name)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-xs font-bold ${productData.colors.includes(color.name) ? 'border-luxury-beige bg-luxury-beige/10 scale-105' : 'border-white/5 opacity-60'}`}>
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color.code }}></span>
                        {color.name}
                        {productData.colors.includes(color.name) && <CheckCircle2 size={14} className="text-luxury-beige" />}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-2 text-luxury-beige text-sm pt-2 border-t border-white/5">
                    <span>المقاسات (اختياري)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {availableSizes.map(size => (
                      <button type="button" key={size} onClick={() => toggleSize(size)} className={`min-w-[40px] px-3 py-2 rounded-lg border-2 transition-all text-xs font-bold ${productData.sizes.includes(size) ? 'border-luxury-beige bg-luxury-beige text-dark-900' : 'border-white/5 opacity-60'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="relative h-24 bg-dark-800 rounded-xl border border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                    {productData.image ? <img src={productData.image} className="w-full h-full object-cover" /> : <Upload size={18} className="text-luxury-beige" />}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0" onChange={e => handleFileUpload(e, 'main')} />
                  </div>
                  <div className="relative h-24 bg-dark-800 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center">
                    <ImageIcon size={18} className="text-luxury-beige" />
                    <span className="text-[8px] opacity-40 mt-1">معرض ({productData.images.length})</span>
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0" onChange={e => handleFileUpload(e, 'gallery')} />
                  </div>
                  <div className="relative h-24 bg-dark-800 rounded-xl border border-dashed border-white/20 flex items-center justify-center">
                    {productData.videos.length > 0 ? <CheckCircle2 className="text-green-500" /> : <Film size={18} className="text-luxury-beige" />}
                    <input type="file" accept="video/*" className="absolute inset-0 opacity-0" onChange={e => handleFileUpload(e, 'video')} />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? "حفظ التعديلات" : "نشر المنتج")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-5 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl z-[100] text-sm">
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}