import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoiceDetails, changeInvoiceStatus, printInvoice } from "../../services/CashierServices/cashierServices";

export default function InvoicePrintView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getInvoiceDetails(id);
        if (res.data.success) setInvoice(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleDone = async () => {
    setChangingStatus(true);
    console.log("user id : "+user.id)
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const cashierId=user.id;
      
      const payload = {
        table_id: invoice.invoice.table_id,
        branch_id: invoice.invoice.branch_id,
        status: "done",
        cashier_id: cashierId,
        
        discount: invoice.invoice.discount || 0,
        discount_id: invoice.invoice.discount_id || null,
        items: invoice.items || [],
      };

      // إصدار PDF قبل تحويل الحالة
      const resPDF = await printInvoice(id);
      const url = window.URL.createObjectURL(new Blob([resPDF.data], { type: 'application/pdf' }));
      window.open(url, '_blank');

      // تغيير الحالة إلى done
      await changeInvoiceStatus(id, payload);

      navigate("/cashier");
    } catch (err) {
      console.error(err);
      alert("❌ فشل تغيير حالة الفاتورة");
    }
    setChangingStatus(false);
  };

  if (loading) return <p className="p-4">جاري التحميل...</p>;
  if (!invoice) return <p className="p-4 text-red-500">فشل تحميل الفاتورة</p>;

  return (
    <div dir='rtl' className="max-w-4xl mx-auto bg-white shadow p-6 rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">تفاصيل الفاتورة #{invoice.invoice.id}</h2>
      <p>رقم الطاولة: {invoice.invoice.table_id}</p>
      <p>الفرع: {invoice.invoice.branch_name}</p>
      <p>السعر الكامل: {invoice.invoice.full_price}</p>
      <p>الضريبة: {invoice.invoice.tax}</p>
      <p>الخصم: {invoice.invoice.discount}</p>
      <p>السعر النهائي: {invoice.invoice.final_price}</p>
      <p>الحالة: {invoice.invoice.status}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">العناصر:</h3>
      <ul className="list-disc list-inside">
        {invoice.items.map((item) => (
          <li key={item.id}>{item.name} - {item.quantity} × {item.price} = {item.total_price}</li>
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
