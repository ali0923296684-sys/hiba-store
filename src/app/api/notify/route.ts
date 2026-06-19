import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, customerName, phone, city, address, items, total, shipping, discount } = body;

    const YOUR_PHONE = "218935364926";
    const API_KEY = "ضع_الـapikey_هنا"; // ← غيّرها بعد التفعيل

    const itemsList = items
      .map((item: any) => {
        let line = `• ${item.name} × ${item.quantity || 1}`;
        if (item.selectedColor) line += ` (${item.selectedColor})`;
        if (item.selectedSize) line += ` [${item.selectedSize}]`;
        return line;
      })
      .join("\n");

    const message = `🛍️ *طلب جديد!*

📋 رقم الطلب: *${orderNumber}*

👤 الزبون: ${customerName}
📱 الهاتف: ${phone}
📍 العنوان: ${city} - ${address}

📦 المنتجات:
${itemsList}

🚚 التوصيل: ${shipping === 0 ? "مجاني ✅" : shipping + " د.ل"}
${discount > 0 ? `🏷️ الخصم: ${discount}%\n` : ""}💰 الإجمالي: *${total} د.ل*

⏰ ${new Date().toLocaleString("ar-LY")}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${YOUR_PHONE}&text=${encodedMessage}&apikey=${API_KEY}`;

    await fetch(url);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notify error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}