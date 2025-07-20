import { useEffect, useState } from "react";
import { getDiscounts,getInvoiceDetails,changeInvoiceStatus } from "../../services/CashierServices/cashierservices";
import { useNavigate } from "react-router-dom";


export default function CashierInvoiceDialog({ invoiceId, onClose }) {
    const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [manualDiscount, setManualDiscount] = useState(0);
  const [selectedDiscountId, setSelectedDiscountId] = useState("");

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
      fetchDiscounts();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const res = await getInvoiceDetails(invoiceId);
      if (res.data.success) {
        setInvoice(res.data.data.invoice);
        setItems(res.data.data.items);
      }
    } catch (error) {
      console.error("فشل في جلب بيانات الفاتورة", error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const res = await getDiscounts();
      if (res.data.success) {
        setDiscounts(res.data.data);
      }
    } catch (error) {
      console.error("فشل في جلب الخصومات", error);
    }
  };

  const handlePrint = async () => {
    const cashierId = 2; // عدل حسب المستخدم
    try {
      const payload = {
        table_id: invoice.table_id,
        branch_id: invoice.branch_id,
        status: "print",
        cashier_id: cashierId,
        discount: manualDiscount,
        discount_id: selectedDiscountId,
      };

      const res = await changeInvoiceStatus(invoice.id, payload);
      if (res.data.success) {
        alert("✅ تم تنفيذ أمر الطباعة بنجاح");
        onClose(); // أغلق النافذة
        navigate(`/cashier/print/${invoiceId}`);
      }
    } catch (error) {
      alert("❌ حدث خطأ أثناء تنفيذ الطباعة");
      console.error(error);
    }
  };

  if (!invoice) return <div className="p-4">جاري التحميل...</div>;

  return (
    <div dir='rtl'className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">معلومات الفاتورة #{invoice.id}</h2>
        <p>🪑 رقم الطاولة: {invoice.table_id}</p>
        <p>🏢 الفرع: {invoice.branch_name}</p>
        <p>💰 السعر الكامل: {invoice.full_price}</p>
        <p>💸 الضريبة: {invoice.tax}</p>
        <p>🔻 الخصم: {invoice.discount}</p>
        <p>✅ السعر النهائي: {invoice.final_price}</p>

        <h3 className="mt-4 font-bold">📦 العناصر:</h3>
        <ul className="list-disc pl-6">
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} × {item.price} = {item.total_price}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <label>🔢 خصم يدوي (0 - 5000):</label>
          <input
            type="number"
            min="0"
            max="5000"
            value={manualDiscount}
            onChange={(e) => setManualDiscount(Number(e.target.value))}
            className="border px-2 py-1 rounded w-full mt-1"
          />
        </div>

        <div className="mt-4">
          <label>🎟️ اختر خصم:</label>
          <select
            value={selectedDiscountId}
            onChange={(e) => setSelectedDiscountId(e.target.value)}
            className="border px-2 py-1 rounded w-full mt-1"
          >
            <option value="">— اختر خصم —</option>
            {discounts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} - {d.percent}%
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            🖨️ Print
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
