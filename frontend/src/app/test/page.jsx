'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';
import { getProducts, deleteProduct } from '@/services/productService';
import { Handbag } from 'lucide-react';

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
        console.error('Error fetching products:', err);
        setError('حدث خطأ أثناء تحميل المنتجات.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [token]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن يمكنك التراجع بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      Swal.fire('تم الحذف', 'تم حذف المنتج بنجاح', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('خطأ', 'حدث خطأ أثناء حذف المنتج', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 text-right w-full flex items-center justify-center md:justify-start gap-2">
            قائمة المنتجات
            <Handbag/>
          </h1>

          <Link href="/products/new" className='min-w-max md:w-auto flex justify-center '>
            <button className="w-full bg-blue-700 hover:bg-blue-800 transition text-white font-semibold px-6 py-3 rounded-xl shadow-md">
              + إضافة منتج جديد
            </button>
          </Link>
        </div>

      {/* <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6"> */}
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 bg-red-50 py-4 rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center text-gray-600 bg-gray-50 py-10 rounded-lg font-medium">
            لا توجد منتجات مسجلة حالياً
          </div>
        )}

        {/* Products Table */}
        {!loading && !error && products.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-right border-collapse">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="py-4 px-4 font-semibold">الكود</th>
                  <th className="py-4 px-4 font-semibold">اسم المنتج</th>
                  <th className="py-4 px-4 font-semibold">الوحدة</th>
                  <th className="py-4 px-4 font-semibold">الكمية</th>
                  <th className="py-4 px-4 font-semibold">سعر البيع</th>
                  <th className="py-4 px-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b hover:bg-gray-50 transition ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      {p.sku || p.itemCode?.code || p.id}
                    </td>
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4">{p.unit || '-'}</td>
                    <td className="py-3 px-4">{p.quantity ?? 0}</td>
                    <td className="py-3 px-4">
                      {p.salePrice
                        ? `${Number(p.salePrice).toFixed(2)} ج.م`
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <Link href={`/products/${p.id}`}>
                          <button className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition text-sm font-semibold">
                            عرض
                          </button>
                        </Link>
                        <Link href={`/products/${p.id}/edit`}>
                          <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition text-sm font-semibold">
                            تعديل
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-semibold"
                        >
                          {deletingId === p.id ? 'جارٍ الحذف...' : 'حذف'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {/* </div> */}
    </div>
  );
}
