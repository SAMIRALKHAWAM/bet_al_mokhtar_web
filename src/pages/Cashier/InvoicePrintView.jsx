import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoiceDetails,changeInvoiceStatus } from "../../services/CashierServices/cashierservices";

export default function InvoicePrintView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getInvoiceDetails(id);
        if (res.data.success) {
          setInvoice(res.data.data);
        } else {
          setError("فشل في تحميل الفاتورة");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الفاتورة");
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleDone = async () => {
    setChangingStatus(true);
    try {
      await changeInvoiceStatus(id, { status: "done" });
      navigate("/cashier");
    } catch (err) {
      alert("فشل تغيير حالة الفاتورة");
    }
    setChangingStatus(false);
  };

  if (loading) return <p className="p-4">جاري التحميل...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div dir='rtl' className="max-w-4xl mx-auto bg-white shadow p-6 rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">تفاصيل الفاتورة #{invoice.invoice.id}</h2>

      <div className="mb-4">
        <p><strong>رقم الطاولة:</strong> {invoice.invoice.table_id}</p>
        <p><strong>الفرع:</strong> {invoice.invoice.branch_name}</p>
        <p><strong>السعر الكامل:</strong> {invoice.invoice.full_price}</p>
        <p><strong>الضريبة:</strong> {invoice.invoice.tax}</p>
        <p><strong>الخصم:</strong> {invoice.invoice.discount}</p>
        <p><strong>السعر النهائي:</strong> {invoice.invoice.final_price}</p>
        <p><strong>الحالة:</strong> {invoice.invoice.status}</p>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2">العناصر:</h3>
      <ul className="list-disc list-inside">
        {invoice.items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity} × {item.price} = {item.total_price}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4 mb-2">الخصومات المطبقة:</h3>
      <ul className="list-disc list-inside">
        {invoice.discounts.map((d, index) => (
          <li key={index}>
            {d.discount_name} - {d.percent}% = {d.amount}
          </li>
        ))}
      </ul>

      <button
        onClick={handleDone}
        disabled={changingStatus}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {changingStatus ? "جاري الحفظ..." : "تم"}
      </button>
    </div>
  );
}
