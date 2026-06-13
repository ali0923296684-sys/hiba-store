"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Plus, Trash2, LogOut, Loader2, X, Upload, Film, Image as ImageIcon, 
  CheckCircle2, DollarSign, Clock, Truck, Check, Tag
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

type AdminTab = "dashboard" | "products" | "orders" | "customers";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]); // حالة الأكواد
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [notification, setNotification] = useState("");
  
  const [newPromo, setNewPromo] = useState({ code: "", discount: "" }); // بيانات الكود الجديد
  const [productData, setProductData] = useState({
    name: "", price: "", category: "إكسسوارات", description: "", image: "", images: [] as string[], videos: [] as string[]
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

  const handleAddPromo = async () => {
    if (!newPromo.code || !newPromo.discount) return;
    const { error } = await supabase.from('promo_codes').insert([{ 
      code: newPromo.code.toUpperCase(), 
      discount_percentage: parseInt(newPromo.discount),
      is_active: true
    }]);
    if (!error) {
      showNotification("✅ تم إضافة كود الخصم بنجاح");
      setNewPromo({ code: "", discount: "" });
      fetchData();
    }
  };

  const deletePromo = async (id: number) => {
    await supabase.from('promo_codes').delete().eq('id', id);
    fetchData();
    showNotification("🗑 تم حذف الكود");
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) { showNotification("✅ تم تحديث حالة الطلب"); fetchData(); }
  };

  const uploadFile = async (file: File) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('product-media').upload(fileName, file);
    if (uploadError) throw uploadError;
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
        const urls = await Promise.all(Array.from(files).map(file => uploadFile(file)));
        setProductData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
      } else if (type === 'video') {
        const url = await uploadFile(files[0]);
        setProductData(prev => ({ ...prev, videos: [...prev.videos, url] }));
      }
      showNotification("✅ تم الرفع بنجاح");
    } catch (error: any) { alert("⚠️ خطأ: " + error.message); }
    finally { setIsSubmitting(false); }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData.image) return alert("يرجى رفع صورة رئيسية");
    setIsSubmitting(true);
    const { error } = await supabase.from('products').insert([{ ...productData, price: parseFloat(productData.price), inStock: true, rating: 5.0, brand: "دار هبة الرحمن" }]);
    if (!error) {
      showNotification("✨ تمت إضافة المنتج بنجاح");
      setShowAddProduct(false);
      setProductData({ name: "", price: "", category: "إكسسوارات", description: "", image: "", images: [], videos: [] });
      fetchData();
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
    setTimeout(() => setNotification(""), 4000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 max-w-sm w-full border border-luxury-beige/20 text-center">
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
    <div className="min-h-screen bg-[#050505] text-luxury-cream flex">
      {/* Sidebar */}
      <div className="w-64 bg-dark-900 border-l border-luxury-beige/10 p-6 fixed h-full z-40 text-right">
         <h2 className="font-serif text-2xl font-bold gold-gradient-text mb-10 text-center">دار هبة الرحمن</h2>
         <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl ${activeTab === "dashboard" ? "bg-luxury-beige text-dark-900 font-bold" : "hover:bg-white/5"}`}><LayoutDashboard size={18}/> الرئيسية</button>
            <button onClick={() => setActiveTab("products")} className={`w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl ${activeTab === "products" ? "bg-luxury-beige text-dark-900 font-bold" : "hover:bg-white/5"}`}><Package size={18}/> المنتجات</button>
            <button onClick={() => setActiveTab("orders")} className={`w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl ${activeTab === "orders" ? "bg-luxury-beige text-dark-900 font-bold" : "hover:bg-white/5"}`}><ShoppingCart size={18}/> الطلبات</button>
            <button onClick={() => setIsAuthenticated(false)} className="w-full flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 mt-20"><LogOut size={18}/> خروج</button>
         </nav>
      </div>

      <div className="flex-1 mr-64 p-8">
        {activeTab === "dashboard" && (
          <div className="space-y-12">
            <h1 className="text-3xl font-serif text-right">ملخص المتجر</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 border-white/5 text-right">
                <DollarSign className="text-luxury-beige mb-2 mr-0 ml-auto" />
                <p className="text-xs uppercase opacity-40">إجمالي المبيعات</p>
                <h2 className="text-3xl font-serif gold-gradient-text font-bold">{formatPrice(dbOrders.reduce((acc, o) => acc + o.total_price, 0))}</h2>
              </div>
              <div className="glass-card p-6 border-white/5 text-right">
                <ShoppingCart className="text-luxury-beige mb-2 mr-0 ml-auto" />
                <p className="text-xs uppercase opacity-40">عدد الطلبات</p>
                <h2 className="text-3xl font-serif font-bold">{dbOrders.length}</h2>
              </div>
              <div className="glass-card p-6 border-white/5 text-right">
                <Package className="text-luxury-beige mb-2 mr-0 ml-auto" />
                <p className="text-xs uppercase opacity-40">المخزون</p>
                <h2 className="text-3xl font-serif font-bold">{dbProducts.length} قطعة</h2>
              </div>
            </div>

            {/* قسم إدارة أكواد الخصم */}
            <div className="glass-card p-8 border-luxury-beige/10 text-right">
              <div className="flex items-center justify-end gap-3 mb-6">
                <h2 className="font-serif text-2xl gold-gradient-text">إدارة أكواد الخصم</h2>
                <Tag className="text-luxury-beige" size={24} />
              </div>
              
              <div className="flex flex-row-reverse gap-4 mb-8">
                <input 
                  placeholder="الكود (مثلاً: HIBA10)" 
                  className="bg-dark-800 p-4 rounded-xl flex-1 border border-white/5 outline-none focus:border-luxury-beige text-right uppercase"
                  value={newPromo.code}
                  onChange={e => setNewPromo({...newPromo, code: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="الخصم %" 
                  className="bg-dark-800 p-4 rounded-xl w-32 border border-white/5 outline-none focus:border-luxury-beige text-center"
                  value={newPromo.discount}
                  onChange={e => setNewPromo({...newPromo, discount: e.target.value})}
                />
                <button onClick={handleAddPromo} className="btn-primary px-8 rounded-xl font-bold">إضافة</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {promoCodes.map(p => (
                  <div key={p.id} className="bg-white/5 p-4 rounded-xl flex flex-row-reverse justify-between items-center border border-white/5">
                    <div className="text-right">
                      <p className="font-bold text-luxury-beige">{p.code}</p>
                      <p className="text-[10px] opacity-40">خصم {p.discount_percentage}%</p>
                    </div>
                    <button onClick={() => deletePromo(p.id)} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ... بقية التبويبات (منتجات، طلبات) تبقى كما هي ... */}
        {activeTab === "products" && (
           <div className="space-y-6">
             <div className="flex justify-between items-center flex-row-reverse">
               <h1 className="text-3xl font-serif">إدارة القطع</h1>
               <button onClick={() => setShowAddProduct(true)} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold"><Plus size={18}/> إضافة قطعة</button>
             </div>
             <div className="glass-card overflow-hidden rounded-2xl border border-white/5">
               <table className="w-full text-right">
                 <thead className="bg-white/5 text-[10px] uppercase text-luxury-beige">
                   <tr><th className="p-6">المنتج</th><th className="p-6">القسم</th><th className="p-6">السعر</th><th className="p-6 text-center">حذف</th></tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {dbProducts.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.01]">
                      <td className="p-6 flex flex-row-reverse items-center gap-4"><img src={p.image} className="w-12 h-12 rounded-lg object-cover" /> <span className="font-bold">{p.name}</span></td>
                      <td className="p-6 opacity-60 text-sm">{p.category}</td>
                      <td className="p-6 font-bold">{formatPrice(p.price)}</td>
                      <td className="p-6 text-center"><button onClick={async () => { if(confirm("حذف؟")) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg"><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {activeTab === "orders" && (
           <div className="space-y-6">
             <h1 className="text-3xl font-serif text-right">طلبات الزبائن</h1>
             <div className="glass-card overflow-hidden rounded-2xl border border-white/5">
               <table className="w-full text-right">
                 <thead className="bg-white/5 text-[10px] uppercase text-luxury-beige">
                   <tr><th className="p-6 text-right">رقم الطلب / الزبون</th><th className="p-6 text-right">المنتجات</th><th className="p-6 text-right">العنوان</th><th className="p-6 text-right">الإجمالي</th><th className="p-6 text-center">الحالة</th></tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {dbOrders.map(o => (
                    <tr key={o.id} className="hover:bg-white/[0.01]">
                      <td className="p-6">
                        <p className="font-bold text-luxury-beige mb-1">{o.order_number}</p>
                        <p className="text-sm">{o.customer_name}</p>
                        <p className="text-[10px] opacity-40">{o.phone}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-row-reverse justify-end -space-x-reverse -space-x-2">
                          {o.items?.map((item: any, idx: number) => (
                            <img key={idx} src={item.image} className="w-8 h-8 rounded-full border border-black object-cover" title={item.name} />
                          ))}
                        </div>
                      </td>
                      <td className="p-6 text-xs opacity-60">{o.address} <br/> {o.city}</td>
                      <td className="p-6 font-bold text-sm">{formatPrice(o.total_price)}</td>
                      <td className="p-6 text-center">
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className={`text-[10px] font-bold p-2 rounded-lg border-none outline-none ${
                            o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                            o.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                          }`}
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="shipped">في الطريق</option>
                          <option value="delivered">تم التوصيل</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}
      </div>

      {/* MODAL ADD PRODUCT (كما هو) */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-dark-900 border border-white/10 p-8 rounded-[30px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex flex-row-reverse justify-between items-center mb-8">
                <h2 className="text-2xl font-serif gold-gradient-text italic">إضافة قطعة ملكية جديدة</h2>
                <button onClick={() => setShowAddProduct(false)}><X/></button>
              </div>
              <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                <div className="space-y-4">
                  <input placeholder="اسم القطعة" required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5" onChange={e => setProductData({...productData, name: e.target.value})} />
                  <input type="number" placeholder="السعر د.ل" required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5" onChange={e => setProductData({...productData, price: e.target.value})} />
                  <select className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5" value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <textarea placeholder="وصف القطعة الفاخرة..." required className="text-right w-full bg-dark-800 p-4 rounded-xl outline-none border border-white/5 h-32" onChange={e => setProductData({...productData, description: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-32 bg-dark-800 rounded-xl border border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                      {productData.image ? <img src={productData.image} className="w-full h-full object-cover"/> : <Upload size={20} className="text-luxury-beige"/>}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'main')}/>
                    </div>
                    <div className="relative h-32 bg-dark-800 rounded-xl border border-dashed border-white/20 flex items-center justify-center">
                      <ImageIcon size={20} className="text-luxury-beige"/>
                      <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'gallery')}/>
                    </div>
                    <div className="relative h-32 bg-dark-800 rounded-xl border border-dashed border-white/20 flex items-center justify-center col-span-2">
                      {productData.videos.length > 0 ? <CheckCircle2 className="text-green-500"/> : <Film size={20} className="text-luxury-beige"/>}
                      <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'video')}/>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin"/> : "نشر الآن"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-10 left-10 bg-white text-black px-6 py-3 rounded-xl font-bold shadow-2xl z-[100] border-r-4 border-luxury-beige">
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}