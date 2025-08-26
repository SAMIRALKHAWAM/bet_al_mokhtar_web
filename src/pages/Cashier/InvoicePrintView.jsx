import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoiceDetails, changeInvoiceStatus } from "../../services/CashierServices/cashierServices";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoicePrintView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getInvoiceDetails(id);
        if (res.data.success) setInvoiceData(res.data.data);
        else setError("فشل في تحميل الفاتورة");
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

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, pdfHeight);
    while (pdfHeight - position > pageHeight) {
      position += pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -position, pageWidth, pdfHeight);
    }

    pdf.save(`invoice_${invoiceData.invoice.id}.pdf`);
  };

  if (loading) return <p className="p-4">جاري التحميل...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const invoice = invoiceData.invoice;
  const items = invoiceData.items;
  const discounts = invoiceData.discounts;

  return (
    <div dir="rtl" className="max-w-4xl mx-auto bg-white shadow p-6 rounded mt-6">
      <div ref={invoiceRef}>
        <h2 className="text-2xl font-bold mb-4">تفاصيل الفاتورة #{invoice.id}</h2>
        <div className="mb-4">
          <p><strong>رقم الطاولة:</strong> {invoice.table_id}</p>
          <p><strong>الفرع:</strong> {invoice.branch_name}</p>
          <p><strong>السعر الكامل:</strong> {invoice.full_price}</p>
          <p><strong>الضريبة:</strong> {invoice.tax}</p>
          <p><strong>الخصم:</strong> {invoice.discount}</p>
          <p><strong>السعر النهائي:</strong> {invoice.final_price}</p>
          <p><strong>الحالة:</strong> {invoice.status}</p>
        </div>

        <h3 className="text-xl font-semibold mt-4 mb-2">العناصر:</h3>
        <ul className="list-disc list-inside">
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} × {item.price} = {item.total_price}
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">الخصومات المطبقة:</h3>
        <ul className="list-disc list-inside">
          {discounts.map((d, index) => (
            <li key={index}>
              {d.discount_name} - {d.percent}% = {d.amount}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">🖨️ طباعة</button>
        <button onClick={handleExportPDF} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">📄 تصدير PDF</button>
        <button onClick={handleDone} disabled={changingStatus} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          {changingStatus ? "جاري الحفظ..." : "تم"}
        </button>
      </div>
    </div>
  );
}
