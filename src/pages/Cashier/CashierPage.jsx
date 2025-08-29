import { useEffect, useState } from "react";
import {
  fetchInvoicesByStatus,
  changeInvoiceStatus,
} from "../../services/CashierServices/cashierServices";
import amiriBase64 from "../../fonts/amiriBase64.js";

const statuses = ["checkout", "print", "done"];

const fetchInvoiceDetails = async (id) => {
  try {
    const res = await fetch(
      `https://samir.comma-test.com/api/admin/get_one_invoice/${id}`
    );
    const data = await res.json();
    if (data.success) return data.data;
    return null;
  } catch (err) {
    console.error("❌ فشل في جلب تفاصيل الفاتورة:", err);
    return null;
  }
};

export default function CashierPage() {
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState("checkout");
  const [branchId, setBranchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.branchId) setBranchId(user.branchId);
  }, []);

  useEffect(() => {
    if (branchId) loadInvoices();
  }, [status, branchId]);

  const loadInvoices = async () => {
    setLoading(true);
    setError("");

    try {
      let allInvoices = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetchInvoicesByStatus(branchId, status, page);

        if (res.success && res.data.length > 0) {
          allInvoices = [...allInvoices, ...res.data];
          page++;
          if (res.meta && page > res.meta.last_page) hasMore = false;
        } else {
          hasMore = false;
        }
      }

      if (allInvoices.length > 0) {
        setInvoices(allInvoices);
      } else {
        setError("لا توجد فواتير حالياً");
      }
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    }

    setLoading(false);
  };

  const generatePDF = async (invoiceData) => {
    const details = await fetchInvoiceDetails(invoiceData.id);
    let items = details?.items || [];
    if (!Array.isArray(items)) items = [];

    window.pdfMake.vfs["Amiri-Regular.ttf"] = amiriBase64;
    window.pdfMake.fonts = {
      Amiri: {
        normal: "Amiri-Regular.ttf",
        bold: "Amiri-Regular.ttf",
        italics: "Amiri-Regular.ttf",
        bolditalics: "Amiri-Regular.ttf",
      },
    };

    const docDefinition = {
      content: [
        { text: `فاتورة #${invoiceData.id}`, style: "header", alignment: "right" },
        { text: `الفرع: ${invoiceData.branch_name}`, margin: [0, 5, 0, 5], alignment: "right" },
        {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              ["الصنف", "الكمية", "السعر", "الإجمالي"],
              ...items.map((item) => [
                item.name,
                item.quantity,
                item.price.toLocaleString(),
                item.total_price.toLocaleString(),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 0],
        },
        {
          text: `السعر النهائي: ${details?.full_price || invoiceData.full_price}`,
          margin: [0, 10, 0, 0],
          bold: true,
          alignment: "right",
        },
      ],
      styles: { header: { fontSize: 16, bold: true } },
      defaultStyle: { font: "Amiri", fontSize: 12 },
      pageOrientation: "portrait",
    };

    window.pdfMake.createPdf(docDefinition).open();
  };

  const handleStatusChange = async (invoice, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("❌ لم يتم تسجيل دخول الكاشير بعد!");
        return;
      }

      const cashierId = user.id;
      const payload = {
        table_id: invoice.table_id,
        branch_id: invoice.branch_id,
        status: newStatus,
        cashier_id: cashierId,
        discount: invoice.discount || 0,
        discount_id: invoice.discount_id || null,
        items: invoice.items || [],
      };

      if (newStatus === "done") {
        await generatePDF(invoice); // PDF يفتح في نافذة جديدة
        payload.status = "done";
      }

      await changeInvoiceStatus(invoice.id, payload);
      alert(`✅ تم تحويل الفاتورة إلى ${newStatus}`);
      loadInvoices();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ فشل في تغيير الحالة");
    }
  };

  return (
    <div dir="rtl" className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h1 className="text-2xl mb-4">فواتير الكاشير</h1>

      <div className="mb-4">
        <label className="mr-2 font-bold">اختر الحالة:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>جاري التحميل...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full table-auto border border-gray-300 mt-4 text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">رقم الطاولة</th>
              <th className="border p-2">الفرع</th>
              <th className="border p-2">السعر النهائي</th>
              <th className="border p-2">الحالة</th>
              <th className="border p-2">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="text-center">
                <td className="border p-2">{inv.id}</td>
                <td className="border p-2">{inv.table_id || "-"}</td>
                <td className="border p-2">{inv.branch_name}</td>
                <td className="border p-2">{inv.full_price}</td>
                <td className="border p-2">{inv.status}</td>
                <td className="border p-2">
                  {inv.status === "checkout" && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleStatusChange(inv, "print")}
                    >
                      🖨️ تحويل إلى print
                    </button>
                  )}
                  {inv.status === "print" && (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => handleStatusChange(inv, "done")}
                    >
                      🖨️ إصدار PDF وتحويل إلى done
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
