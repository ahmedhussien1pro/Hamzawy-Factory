'use client';
import ProductRow from './ProductRow';

export default function ProductTable({ products, deletingId, handleDelete }) {
  return (
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
            <ProductRow
              key={p.id}
              p={p}
              i={i}
              deletingId={deletingId}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
