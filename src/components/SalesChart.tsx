"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SalesChartProps {
  orders: any[];
}

export default function SalesChart({ orders }: SalesChartProps) {
  const monthlyData = useMemo(() => {
    const months: Record<string, { sales: number; orders: number; name: string }> = {};
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    // تجهيز آخر 6 أشهر
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { sales: 0, orders: 0, name: monthNames[d.getMonth()] };
    }

    // حساب المبيعات لكل شهر
    orders.forEach((order) => {
      if (!order.created_at) return;
      const d = new Date(order.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (months[key]) {
        months[key].sales += order.total_amount || order.total_price || 0;
        months[key].orders += 1;
      }
    });

    return Object.values(months);
  }, [orders]);

  const maxSales = Math.max(...monthlyData.map((m) => m.sales), 1);

  // حساب النمو
  const currentMonth = monthlyData[monthlyData.length - 1]?.sales || 0;
  const lastMonth = monthlyData[monthlyData.length - 2]?.sales || 0;
  const growth = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;

  // إحصائيات إضافية
  const totalSales = monthlyData.reduce((acc, m) => acc + m.sales, 0);
  const totalOrders = monthlyData.reduce((acc, m) => acc + m.orders, 0);
  const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="glass-card p-4 md:p-6 border-luxury-beige/10 text-right">
      {/* الهيدر */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${growth >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
        </div>
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-lg">المبيعات الشهرية</h2>
          <BarChart3 size={18} className="text-luxury-beige" />
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-dark-800/50 rounded-xl p-3 text-center">
          <p className="text-[9px] text-white/30 uppercase">إجمالي 6 أشهر</p>
          <p className="text-sm font-bold gold-gradient-text">{formatPrice(totalSales)}</p>
        </div>
        <div className="bg-dark-800/50 rounded-xl p-3 text-center">
          <p className="text-[9px] text-white/30 uppercase">عدد الطلبات</p>
          <p className="text-sm font-bold text-luxury-cream">{totalOrders}</p>
        </div>
        <div className="bg-dark-800/50 rounded-xl p-3 text-center">
          <p className="text-[9px] text-white/30 uppercase">متوسط الطلب</p>
          <p className="text-sm font-bold text-luxury-beige">{formatPrice(avgOrder)}</p>
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="flex items-end gap-2 md:gap-4 h-48 md:h-56 px-2">
        {monthlyData.map((month, i) => {
          const height = maxSales > 0 ? (month.sales / maxSales) * 100 : 0;
          const isCurrentMonth = i === monthlyData.length - 1;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              {/* القيمة فوق العمود */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-luxury-beige font-bold whitespace-nowrap">
                {formatPrice(month.sales)}
                <br />
                <span className="text-white/30">{month.orders} طلب</span>
              </div>

              {/* العمود */}
              <div className="w-full relative flex items-end justify-center" style={{ height: "100%" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 3)}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  className={`w-full rounded-t-lg transition-all cursor-pointer ${
                    isCurrentMonth
                      ? "bg-gradient-to-t from-luxury-beige to-amber-400 shadow-lg shadow-luxury-beige/20"
                      : "bg-gradient-to-t from-white/10 to-white/20 hover:from-luxury-beige/30 hover:to-luxury-beige/50"
                  }`}
                />
              </div>

              {/* اسم الشهر */}
              <span className={`text-[9px] md:text-[10px] ${isCurrentMonth ? "text-luxury-beige font-bold" : "text-white/30"}`}>
                {month.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* مقارنة الشهر الحالي بالسابق */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center text-xs">
          <div className={`font-bold ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
            {growth >= 0 ? "📈" : "📉"} {growth >= 0 ? "نمو" : "انخفاض"} {Math.abs(growth).toFixed(1)}% عن الشهر السابق
          </div>
          <span className="text-white/30">مقارنة شهرية</span>
        </div>
      </div>
    </div>
  );
}