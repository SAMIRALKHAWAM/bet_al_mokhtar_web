import { BASE_URL } from "../../utils/api";
import axios from "axios";


export const fetchPurchaseInvoices = async (branchId) => {
  const res = await fetch(`${BASE_URL}/get_purchase_invoices?branchId=${branchId}`);
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل جلب الفواتير");
  return result;
};


export const fetchInvoiceLines = async (invoiceId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/get_purchase_invoice_lines/${invoiceId}`
    );
    return Array.isArray(res.data?.data) ? res.data.data : []; 
  } catch (err) {
    console.error("Error fetching invoice lines:", err);
    return []; // 🔥 رجّع Array فاضية لو صار خطأ
  }
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


export const fetchWarehouseMaterials = async (branchId) => {
  const res = await fetch(`${BASE_URL}/get_warehouse_materials?branchId=${branchId}`);
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل جلب المواد");
  return result;
};




 export const fetchInvoiceById = async (invoiceId) => {
  const res = await fetch(`${BASE_URL}/print_invoice/${invoiceId}`);
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || "فشل جلب الفاتورة");
  return result.data; 
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

