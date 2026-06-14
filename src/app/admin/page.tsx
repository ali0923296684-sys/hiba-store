"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart,
  Plus, Trash2, LogOut, Loader2, X, Upload, Film, Image as ImageIcon, 
  CheckCircle2, DollarSign, Tag, Palette
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

type AdminTab = "dashboard" | "products" | "orders";

// 🎨 قائمة الألوان الجاهزة للاختيار منها (مع أكوادها لعرضها بصرياً)
const availableColors = [
  { name: "ذهبي", code: "#D4AF37" },
  { name: "فضي", code: "#C0C0C0" },
  { name: "أسود", code: "#1a1a1a" },
  { name: "أبيض", code: "#FFFFFF" },
  { name: "وردي", code: "#FFC0CB" },
  { name: "أحمر", code: "#DC2626" },
  { name: "أزرق", code: "#2563EB" },
  { name: "أخضر", code: "#16A34A" },
  { name: "بني", code: "#8B4513" },
  { name: "بيج", code: "#E8D5A3" },
  { name: "رصاصي", code: "#71717A" },
  { name: "نحاسي", code: "#B87333" },
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [notification, setNotification] = useState("");
  
  const [newPromo, setNewPromo] = useState({ code: "", discount: "" });
  // الآن colors و sizes أصبحتا قوائم (Arrays) مباشرة
  const [productData, setProductData] = useState({
    name: "", price: "", category: "إكسسوارات", description: "", image: "", 
    images: [] as string[], videos: [] as string[], 
    colors: [] as string[], sizes: [] as string[]
  });

  const categories = ["عطور فاخرة", "حقائب يد", "مجوهرات", "ساعات فاخرة", "أحذية فاخرة", "إكسسوارات"];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: promos } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    if (products) setDbProducts(products);
    if (orders) setDbOrders(orders);
    if (promos) setPromoCodes(promos);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  // دالة لإضافة/إزالة اللون عند الضغط عليه
  const toggleColor = (colorName: string) => {
    setProductData(prev => ({
      ...prev,
      colors: prev.colors.includes(colorName) 
        ? prev.colors.filter(c => c !== colorName) 
        : [...prev.colors, colorName]
    }));
  };

  // دالة لإضافة/إزالة المقاس
  const toggleSize = (size: string) => {
    setProductData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size) 
        : [...prev.sizes, size]
    }));
  };

  const handleAddPromo = async () => {
    if (!newPromo.code || !newPromo.discount) return;
    const { error } = await supabase.from('promo_codes').insert([{ code: newPromo.code.toUpperCase(), discount_percentage: parseInt(newPromo.discount), is_active: true }]);
    if (!error) { showNotification("✅ تم إضافة كود الخصم"); setNewPromo({ code: "", discount: "" }); fetchData(); }
  };

  const deletePromo = async (id: number) => {
    await supabase.from('promo_codes').delete().eq('id', id);
    fetchData();
    showNotification("🗑 تم الحذف");
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) { showNotification("✅ تم التحديث"); fetchData(); }
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
    } catch (error: any) { alert("خطأ: " + error.message); }
    finally { setIsSubmitting(false); }
  };

  // دالة الحفظ (أصبحت أبسط لأن colors و sizes جاهزة كقوائم)
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData.image) return alert("يرجى رفع صورة رئيسية");
    setIsSubmitting(true);

    const { error } = await supabase.from('products').insert([{ 
      name: productData.name, price: parseFloat(productData.price), category: productData.category,
      description: productData.description, image: productData.image, images: productData.images,
      videos: productData.videos, colors: productData.colors, sizes: productData.sizes,
      inStock: true, rating: 5.0, brand: "هبة الرحمن" 
    }]);

    if (!error) {
      showNotification("✨ تمت إضافة المنتج بنجاح");
      setShowAddProduct(false);
      setProductData({ name: "", price: "", category: "إكسسوارات", description: "", image: "", images: [], videos: [], colors: [], sizes: [] });
      fetchData();
    } else { alert("خطأ: " + error.message); }
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
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5 text-center text-white" placeholder="كلمة المرور" />
            {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
            <button className="w-full btn-primary py-4">دخول</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream flex flex-col md:flex-row">
      {/* Sidebar (كمبيوتر) */}
      <div className="hidden md:flex w-64 bg-dark-900 border-l border-luxury-beige/10 p-6 fixed h-full z-40 flex-col">
         <h2 className="font-serif text-2xl font-bold gold-gradient-text mb-10 text-center">هبة الرحمن</h2>
         <nav className="space-y-2 flex-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id as AdminTab)} className={`w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl ${activeTab === item.id ? "bg-luxury-beige text-dark-900 font-bold" : "hover:bg-white/5"}`}>
                <item.icon size={18}/> {item.label}
              </button>
            ))}
         </nav>
         <button onClick={() => setIsAuthenticated(false)} className="w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5"><LogOut size={18}/> خروج</button>
      </div>

      {/* Header (موبايل) */}
      <header className="md:hidden sticky top-0 z-30 bg-dark-900/90 backdrop-blur-lg border-b border-white/5 p-4 flex justify-between items-center">
        <h2 className="font-serif text-xl font-bold gold-gradient-text">لوحة الإدارة</h2>
        <button onClick={() => setIsAuthenticated(false)} className="text-red-400 p-2"><LogOut size={20}/></button>
      </header>

      <div className="flex-1 md:mr-64 p-4 md:p-8 pb-28 md:pb-8">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-serif text-right">ملخص المتجر</h1>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-card p-4 md:p-6 border-white/5 text-right"><DollarSign className="text-luxury-beige mb-2 mr-auto" size={20} /><p className="text-[10px] uppercase opacity-40">المبيعات</p><h2 className="text-lg md:text-3xl font-serif gold-gradient-text font-bold">{formatPrice(dbOrders.reduce((acc, o) => acc + (o.total_amount || o.total_price || 0), 0))}</h2></div>
              <div className="glass-card p-4 md:p-6 border-white/5 text-right"><ShoppingCart className="text-luxury-beige mb-2 mr-auto" size={20} /><p className="text-[10px] uppercase opacity-40">الطلبات</p><h2 className="text-lg md:text-3xl font-serif font-bold">{dbOrders.length}</h2></div>
              <div className="glass-card p-4 md:p-6 border-white/5 text-right col-span-2 lg:col-span-1"><Package className="text-luxury-beige mb-2 mr-auto" size={20} /><p className="text-[10px] uppercase opacity-40">المنتجات</p><h2 className="text-lg md:text-3xl font-serif font-bold">{dbProducts.length}</h2></div>
            </div>
            <div className="glass-card p-4 md:p-6 border-luxury-beige/10 text-right">
              <div className="flex items-center justify-end gap-2 mb-4"><h2 className="font-serif text-lg">أكواد الخصم</h2><Tag size={18} className="text-luxury-beige" /></div>
              <div className="flex flex-col sm:flex-row-reverse gap-2 mb-4">
                <input placeholder="الكود" className="bg-dark-800 p-3 rounded-xl flex-1 border border-white/5 outline-none text-right uppercase text-sm" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value})} />
                <input type="number" placeholder="%" className="bg-dark-800 p-3 rounded-xl w-full sm:w-24 border border-white/5 outline-none text-center text-sm" value={newPromo.discount} onChange={e => setNewPromo({...newPromo, discount: e.target.value})} />
                <button onClick={handleAddPromo} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">إضافة</button>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {promoCodes.map(p => (<div key={p.id} className="bg-white/5 px-3 py-2 rounded-lg flex items-center gap-2 text-xs"><button onClick={() => deletePromo(p.id)} className="text-red-400"><X size={14}/></button><span className="opacity-40">({p.discount_percentage}%)</span><span className="font-bold text-luxury-beige">{p.code}</span></div>))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-row-reverse">
              <h1 className="text-2xl md:text-3xl font-serif">المنتجات</h1>
              <button onClick={() => setShowAddProduct(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"><Plus size={16}/> إضافة</button>
            </div>
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
              {dbProducts.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                  <button onClick={async () => { if(confirm("حذف؟")) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} className="text-red-400/50 hover:text-red-400 p-2"><Trash2 size={18}/></button>
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

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-serif text-right">الطلبات</h1>
            <div className="space-y-4">
              {dbOrders.length === 0 && <p className="text-center opacity-40 py-10">لا توجد طلبات بعد</p>}
              {dbOrders.map(o => (
                <div key={o.id} className="glass-card p-4 rounded-2xl border border-white/5 text-right">
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                    <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className={`text-[10px] font-bold p-2 rounded-lg border-none outline-none ${o.status === 'تم التوصيل' ? 'bg-green-500/10 text-green-500' : o.status === 'في الطريق' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      <option value="جاري التجهيز">جاري التجهيز</option>
                      <option value="في الطريق">في الطريق</option>
                      <option value="تم التوصيل">تم التوصيل</option>
                    </select>
                    <span className="font-mono text-luxury-beige font-bold">{o.order_number}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="opacity-40 text-xs">الزبون:</span> {o.customer_name}</p>
                    <p><span className="opacity-40 text-xs">الهاتف:</span> <span dir="ltr" className="inline-block">{o.phone}</span></p>
                    <p><span className="opacity-40 text-xs">العنوان:</span> {o.city} - {o.address}</p>
                    <div className="pt-2 mt-2 border-t border-white/5">
                       {o.items?.map((item: any, idx: number) => (
                         <p key={idx} className="text-xs opacity-70">• {item.name} {item.selectedColor && <span className="text-luxury-beige font-bold">(اللون: {item.selectedColor})</span>} {item.selectedSize && <span className="text-blue-400">(المقاس: {item.selectedSize})</span>}</p>
                       ))}
                    </div>
                    <p className="font-bold pt-2">الإجمالي: <span className="gold-gradient-text">{formatPrice(o.total_amount || o.total_price)}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* شريط التنقل السفلي (موبايل) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-xl border-t border-luxury-beige/10 flex justify-around items-center p-2">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as AdminTab)} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-20 transition-colors ${activeTab === item.id ? "text-luxury-beige" : "text-white/40"}`}>
            <item.icon size={22} /><span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* MODAL ADD PRODUCT */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-dark-900 border border-white/10 p-6 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex flex-row-reverse justify-between items-center mb-6">
                <h2 className="text-xl font-serif gold-gradient-text">إضافة قطعة</h2>
                <button onClick={() => setShowAddProduct(false)}><X/></button>
              </div>
              <form onSubmit={saveProduct} className="space-y-4 text-right">
                <input placeholder="اسم القطعة" required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5 text-sm" value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" placeholder="السعر" required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} />
                </div>
                <textarea placeholder="الوصف..." required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5 h-24" value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} />
                
                {/* 🎨 اختيار الألوان بالضغط (الميزة الجديدة) */}
                <div className="bg-dark-800/50 p-4 rounded-2xl border border-luxury-beige/10 space-y-4">
                  <div className="flex items-center justify-end gap-2 text-luxury-beige text-sm"><span>اختاري الألوان المتوفرة (اضغطي عليها)</span><Palette size={16}/></div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {availableColors.map(color => (
                      <button
                        type="button"
                        key={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-xs font-bold ${
                          productData.colors.includes(color.name)
                          ? 'border-luxury-beige bg-luxury-beige/10 scale-105'
                          : 'border-white/5 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color.code }}></span>
                        {color.name}
                        {productData.colors.includes(color.name) && <CheckCircle2 size={14} className="text-luxury-beige" />}
                      </button>
                    ))}
                  </div>

                  {/* اختيار المقاسات */}
                  <div className="flex items-center justify-end gap-2 text-luxury-beige text-sm pt-2 border-t border-white/5"><span>المقاسات (اختياري)</span></div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {availableSizes.map(size => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg border-2 transition-all text-xs font-bold ${
                          productData.sizes.includes(size)
                          ? 'border-luxury-beige bg-luxury-beige text-dark-900'
                          : 'border-white/5 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* رفع الوسائط */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative h-24 bg-dark-800 rounded-xl border border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                    {productData.image ? <img src={productData.image} className="w-full h-full object-cover"/> : <Upload size={18} className="text-luxury-beige"/>}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0" onChange={e => handleFileUpload(e, 'main')}/>
                  </div>
                  <div className="relative h-24 bg-dark-800 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center">
                    <ImageIcon size={18} className="text-luxury-beige"/><span className="text-[8px] opacity-40 mt-1">معرض ({productData.images.length})</span>
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0" onChange={e => handleFileUpload(e, 'gallery')}/>
                  </div>
                  <div className="relative h-24 bg-dark-800 rounded-xl border border-dashed border-white/20 flex items-center justify-center">
                    {productData.videos.length > 0 ? <CheckCircle2 className="text-green-500"/> : <Film size={18} className="text-luxury-beige"/>}
                    <input type="file" accept="video/*" className="absolute inset-0 opacity-0" onChange={e => handleFileUpload(e, 'video')}/>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin"/> : "نشر المنتج"}
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