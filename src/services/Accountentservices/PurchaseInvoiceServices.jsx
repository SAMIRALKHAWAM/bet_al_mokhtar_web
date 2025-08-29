import { BASE_URL } from "../../utils/api";

// جلب كل فواتير الشراء لفرع معين
export const fetchPurchaseInvoices = async (branchId) => {
  const res = await fetch(`${BASE_URL}/get_purchase_invoices?branchId=${branchId}`);
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل جلب الفواتير");
  return result;
};

// جلب تفاصيل خطوط الفاتورة (المواد)
export const fetchPurchaseInvoiceLines = async (invoiceId) => {
  const res = await fetch(`${BASE_URL}/get_purchase_invoice_lines/${invoiceId}`);
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل جلب خطوط الفاتورة");
  return result.data;
};

// إنشاء فاتورة شراء جديدة
export const addPurchaseInvoice = async (payload) => {
  const res = await fetch(`${BASE_URL}/add_purchase_invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل إضافة الفاتورة");
  return result.data;
};


// حذف فاتورة شراء
export const deletePurchaseInvoice = async (invoiceId) => {
  const res = await fetch(`${BASE_URL}/delete_purchase_invoice/${invoiceId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل حذف الفاتورة");
  return result.data;
};

// جلب المواد من المستودع لفرع معين
export const fetchWarehouseMaterials = async (branchId) => {
  const res = await fetch(`${BASE_URL}/get_warehouse_materials?branchId=${branchId}`);
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل جلب المواد");
  return result;
};



export const fetchAllDoneInvoices = async (branchId) => {
  let allInvoices = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${BASE_URL}/get_invoices?branchId=${branchId}&status=done&page=${page}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "فشل جلب الفواتير");

    if (data.data && data.data.length) {
      allInvoices = [...allInvoices, ...data.data];
      page += 1;
    } else {
      hasMore = false;
    }
  }

  return allInvoices;
};

