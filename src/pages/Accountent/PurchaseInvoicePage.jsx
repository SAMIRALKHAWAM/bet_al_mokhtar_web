import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchPurchaseInvoices,
  fetchPurchaseInvoiceLines,
  addPurchaseInvoice,
  deletePurchaseInvoice,
  fetchWarehouseMaterials,
} from "../../services/PurchaseInvoiceServices";

export default function PurchaseInvoicePage() {
  const user = JSON.parse(localStorage.getItem("user")); 
  const branchId = user?.branchId;
  const accountantId = user?.id;

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceLines, setInvoiceLines] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (branchId) {
      loadInvoices();
      loadMaterials();
    }
  }, [branchId]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetchPurchaseInvoices(branchId);
      setInvoices(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const loadMaterials = async () => {
    try {
      const res = await fetchWarehouseMaterials(branchId);
      setMaterials(res.data || []);
    } catch (err) {
      toast.error("فشل جلب مواد المستودع");
    }
  };

  const loadInvoiceLines = async (invoiceId) => {
    try {
      const lines = await fetchPurchaseInvoiceLines(invoiceId);
      setInvoiceLines(lines);
      setSelectedInvoiceId(invoiceId);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddInvoice = async () => {
    if (!items.length) return toast.warning("أضف مادة واحدة على الأقل");
    try {
      await addPurchaseInvoice({
        branch_id: branchId,
        accountant_id: accountantId,
        items,
      });
      toast.success("✅ تم إضافة الفاتورة");
      setItems([]);
      loadInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الفاتورة؟")) return;
    try {
      await deletePurchaseInvoice(id);
      toast.success("🗑️ تم حذف الفاتورة");
      loadInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
      dir="rtl"
    >
      <h1 className="text-3xl font-bold mb-6">🧾 فواتير الشراء</h1>

      {/* إضافة فاتورة جديدة */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 mb-6">
        <h2 className="text-2xl font-bold">➕ إضافة فاتورة شراء جديدة</h2>

        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <select
              className="border p-2 rounded w-1/3"
              value={item.material_id}
              onChange={(e) => {
                const updated = [...items];
                updated[idx].material_id = e.target.value;
                setItems(updated);
              }}
            >
              <option value="">اختر مادة</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.material_name} ({m.quantity} متوفرة)
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="الكمية"
              value={item.quantity}
              onChange={(e) => {
                const updated = [...items];
                updated[idx].quantity = e.target.value;
                setItems(updated);
              }}
              className="border p-2 w-20 rounded"
            />

            <input
              type="number"
              placeholder="السعر"
              value={item.price}
              onChange={(e) => {
                const updated = [...items];
                updated[idx].price = e.target.value;
                setItems(updated);
              }}
              className="border p-2 w-28 rounded"
            />

            <button
              className="!text-red-700 !border !border-red-300 px-2 py-1 rounded hover:!bg-red-100"
              onClick={() => {
                const updated = [...items];
                updated.splice(idx, 1);
                setItems(updated);
              }}
            >
              حذف
            </button>
          </div>
        ))}

        <button
          className="!bg-red-100 !text-red-700 px-3 py-1 rounded hover:!bg-red-200"
          onClick={() =>
            setItems([...items, { material_id: "", quantity: 1, price: 0 }])
          }
        >
          + مادة جديدة
        </button>

        <button
          className="!bg-red-700 !text-white px-4 py-2 rounded mt-2 hover:!bg-red-800"
          onClick={handleAddInvoice}
        >
          حفظ الفاتورة
        </button>
      </div>

      {/* قائمة الفواتير */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2"
          >
            <h2 className="font-bold text-xl">فاتورة #{inv.id}</h2>
            <p>السعر الكلي: {inv.full_price.toLocaleString()} ل.س</p>
            <p>تاريخ الإنشاء: {new Date(inv.created_at).toLocaleString()}</p>

            <button
              className="!bg-red-700 !text-white px-3 py-1 rounded hover:!bg-red-800"
              onClick={() => loadInvoiceLines(inv.id)}
            >
              عرض التفاصيل
            </button>
            <button
              className="!text-red-700 !border !border-red-300 px-3 py-1 rounded hover:!bg-red-100 ml-2"
              onClick={() => handleDeleteInvoice(inv.id)}
            >
              حذف
            </button>

            {selectedInvoiceId === inv.id && invoiceLines.length > 0 && (
              <div className="mt-2 border-t pt-2">
                {invoiceLines.map((line) => (
                  <p key={line.id}>
                    {line.material_name} - {line.quantity} قطعة - {line.price}{" "}
                    ل.س
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
