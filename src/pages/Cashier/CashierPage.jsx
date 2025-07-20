import { useEffect, useState } from "react";
import { fetchInvoicesByStatus } from "../../services/CashierServices/cashierservices";
import CashierInvoiceDialog from "./CashierInvoiceDialog";

const statuses = ["print", "checkout", "done"];

export default function CashierPage() {
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState("checkout");
  const [branchId, setBranchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.branchId) {
      setBranchId(user.branchId);
    }
  }, []);

  useEffect(() => {
    if (branchId) {
      loadInvoices();
    }
  }, [status, branchId]);

  const loadInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchInvoicesByStatus(branchId, status);
      if (res.success) {
        setInvoices(res.data);
      } else {
        setInvoices([]);
        setError("لا توجد فواتير حالياً");
      }
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    }
    setLoading(false);
  };

  return (
    <div dir='rtl'className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
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
        <table className="w-full table-auto border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">رقم الطاولة</th>
              <th className="border p-2">الفرع</th>
              <th className="border p-2">السعر الكامل</th>
              <th className="border p-2">الضريبة</th>
              <th className="border p-2">الخصم</th>
              <th className="border p-2">السعر النهائي</th>
              <th className="border p-2">الحالة</th>
              <th className="border p-2">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="text-center">
                <td className="border p-2">{inv.id}</td>
                <td className="border p-2">{inv.table_id}</td>
                <td className="border p-2">{inv.branch_name}</td>
                <td className="border p-2">{inv.full_price}</td>
                <td className="border p-2">{inv.tax}</td>
                <td className="border p-2">{inv.discount}</td>
                <td className="border p-2">{inv.final_price}</td>
                <td className="border p-2">{inv.status}</td>
                <td className="border p-2">
                  {inv.status === "checkout" && (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedInvoiceId(inv.id)}
                    >
                      عرض
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedInvoiceId && (
        <CashierInvoiceDialog
          invoiceId={selectedInvoiceId}
          onClose={() => setSelectedInvoiceId(null)}
        />
      )}
    </div>
  );
}
