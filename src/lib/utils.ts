import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-LY", {
    style: "currency",
    currency: "LYD",
    minimumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppLink(productName: string, price: number): string {
  const message = encodeURIComponent(
    `مرحباً دار هبة الرحمن، أود الاستفسار عن: ${productName} - السعر: ${price} د.ل`
  );
  return `https://wa.me/218931473373?text=${message}`;
}
