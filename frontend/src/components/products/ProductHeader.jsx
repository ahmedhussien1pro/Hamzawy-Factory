"use client";
import Link from "next/link";
import { Handbag } from "lucide-react";

export default function ProductHeader() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-800 text-right w-full flex items-center justify-center md:justify-start gap-2">
        قائمة المنتجات
        <Handbag />
      </h1>

      <Link
        href="/products/new"
        className="min-w-max md:w-auto flex justify-center"
      >
        <button className="w-full bg-blue-700 hover:bg-blue-800 transition text-white font-semibold px-6 py-3 rounded-xl shadow-md">
          + إضافة منتج جديد
        </button>
      </Link>
    </div>
  );
}
