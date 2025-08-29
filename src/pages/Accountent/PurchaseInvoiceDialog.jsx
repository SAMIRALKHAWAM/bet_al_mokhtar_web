import { useEffect, useState } from "react";
import { fetchPurchaseInvoiceLines } from "../../services/Accountentservices/PurchaseInvoiceServices";

export default function PurchaseInvoiceDialog({ invoiceId, onClose }) {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLines = async () => {
      try {
        const res = await fetchPurchaseInvoiceLines(invoiceId);
        setLines(res);
      } catch {
        alert("❌ فشل جلب تفاصيل الفاتورة");
      }
      setLoading(false);
    };
    loadLines();
  }, [invoiceId]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">تفاصيل الفاتورة #{invoiceId}</h2>
        {loading && <p>⏳ جاري التحميل...</p>}
        {!loading && lines.length === 0 && <p>لا توجد مواد في هذه الفاتورة</p>}
        {!loading && lines.length > 0 && (
          <table className="w-full table-auto border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">المادة</th>
                <th className="border p-2">الكمية</th>
                <th className="border p-2">سعر الوحدة</th>
                <th className="border p-2">السعر الكامل</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="text-center">
                  <td className="border p-2">{line.material_name}</td>
                  <td className="border p-2">{line.quantity}</td>
                  <td className="border p-2">{line.price}</td>
                  <td className="border p-2">{line.full_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">إغلاق</button>
        </div>
      </div>
    </div>
  );
}
