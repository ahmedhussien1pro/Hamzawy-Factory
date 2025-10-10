"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { getProducts, deleteProduct } from "@/services/productService";

import ProductHeader from "@/components/products/ProductHeader";
import ProductTable from "@/components/products/ProductTable";
import LoadingSpinner from "@/components/products/LoadingSpinner";
import EmptyState from "@/components/products/EmptyState";

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getProducts();
        setProducts(res);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("حدث خطأ أثناء تحميل المنتجات.");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [token]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن يمكنك التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("تم الحذف", "تم حذف المنتج بنجاح", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("خطأ", "حدث خطأ أثناء حذف المنتج", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">
      <ProductHeader />

      {loading && <LoadingSpinner />}
      {error && (
        <div className="text-center text-red-600 bg-red-50 py-4 rounded-lg font-medium">
          {error}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <EmptyState message="لا توجد منتجات مسجلة حالياً" />
      )}
      {!loading && !error && products.length > 0 && (
        <ProductTable
          products={products}
          deletingId={deletingId}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
