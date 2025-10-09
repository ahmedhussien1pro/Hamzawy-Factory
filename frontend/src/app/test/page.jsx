'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProducts, deleteProduct } from '@/services/productService';
import Swal from 'sweetalert2';
import { Plus, Eye, Pencil, Trash2, Package } from 'lucide-react';

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
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

    setTimeout(fetchProducts, 500);
  }, [token]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن يمكنك التراجع بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.id !== id)
      );
      Swal.fire('تم الحذف!', 'تم حذف المنتج بنجاح.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      Swal.fire('خطأ!', 'حدث خطأ أثناء حذف المنتج.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div dir='rtl' className='min-h-screen bg-gray-50 font-cairo text-gray-800'>
      {/* Header */}
      <header className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 lg:px-8'>
        <h1 className='flex items-center gap-2 text-xl font-semibold text-gray-900'>
          <Package className='h-5 w-5 text-blue-600' />
          قائمة المنتجات
        </h1>

        <Link
          href='/products/new'
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
          <Plus className='h-4 w-4' />
          إضافة منتج جديد
        </Link>
      </header>

      {/* Main Content */}
      <main className='p-4 sm:p-6 lg:p-8'>
        {loading ? (
          <div className='flex justify-center py-20'>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
          </div>
        ) : error ? (
          <div
            className='rounded-lg bg-red-100 p-4 text-center text-red-700'
            role='alert'>
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center'>
            <Package className='mx-auto h-16 w-16 text-gray-400' />
            <h2 className='mt-4 text-xl font-semibold text-gray-800'>
              لا توجد منتجات بعد
            </h2>
            <p className='mt-2 text-sm text-gray-500'>
              ابدأ بإضافة منتجك الأول لتراه هنا.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    الكود
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    اسم المنتج
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    الوحدة
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    الكمية
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    سعر البيع
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500'>
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {products.map((p) => (
                  <tr key={p.id} className='transition-colors hover:bg-gray-50'>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600'>
                      {p.sku || p.itemCode?.code || p.id}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                      {p.name}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-600'>
                      {p.unit || '-'}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-600'>
                      {p.quantity ?? 0}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-600'>
                      {p.salePrice
                        ? `${Number(p.salePrice).toFixed(2)} ج.م`
                        : '-'}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-center text-sm'>
                      <div className='flex items-center justify-center gap-3'>
                        <Link
                          href={`/products/${p.id}`}
                          className='text-red-500 transition-colors hover:text-red-600'
                          title='عرض'>
                          <Eye className='h-5 w-5' />
                        </Link>
                        <Link
                          href={`/products/${p.id}/edit`}
                          className='text-gray-500 transition-colors hover:text-green-600'
                          title='تعديل'>
                          <Pencil className='h-5 w-5' />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className='text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50'
                          title='حذف'>
                          {deletingId === p.id ? (
                            <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent'></div>
                          ) : (
                            <Trash2 className='h-5 w-5' />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
