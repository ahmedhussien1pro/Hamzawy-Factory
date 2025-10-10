'use client';
import Link from 'next/link';

export default function ProductRow({ p, i, deletingId, handleDelete }) {
  return (
    <tr
      key={p.id}
      className={`border-b hover:bg-gray-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
    >
      <td className="py-3 px-4">{p.sku || p.itemCode?.code || p.id}</td>
      <td className="py-3 px-4">{p.name}</td>
      <td className="py-3 px-4">{p.unit || '-'}</td>
      <td className="py-3 px-4">{p.quantity ?? 0}</td>
      <td className="py-3 px-4">
        {p.salePrice ? `${Number(p.salePrice).toFixed(2)} ج.م` : '-'}
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
  );
}
