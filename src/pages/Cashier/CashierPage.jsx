import React, { useEffect, useState } from "react";
import { pdf, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import amiriTTF from "../../fonts/Amiri-Regular.ttf"; 
import {
  fetchInvoicesByStatus,
  changeInvoiceStatus,
  fetchInvoiceById,
  fetchAllReservations,
  deleteReservation
} from "../../services/CashierServices/cashierServices";
import { getBranchId } from "../../utils/api";

// تسجيل خط عربي
Font.register({ family: "Amiri", src: amiriTTF });

// ---------------- PDF Document للفاتورة ----------------
function DoneInvoiceDocument({ invoiceData }) {
  const allItems = [...(invoiceData.items || []), ...(invoiceData.offers || [])];
  const taxes = Array.isArray(invoiceData.taxes) ? invoiceData.taxes : [];
  const discounts = Array.isArray(invoiceData.discounts) ? invoiceData.discounts : [];

  const rtlStyles = StyleSheet.create({
    page: { padding: 20, fontSize: 12, fontFamily: "Amiri", direction: "rtl" },
    header: { fontSize: 18, marginBottom: 15, fontWeight: "bold", textAlign: "center", direction: "rtl" },
    text: { direction: "rtl", textAlign: "right", marginBottom: 5 },
    table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, marginTop: 10, direction: "rtl" },
    tableRow: { flexDirection: "row-reverse", direction: "rtl" },
    tableCol: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 5, direction: "rtl" },
    tableCell: { fontSize: 12, textAlign: "right", direction: "rtl" },
    totals: { marginTop: 10, textAlign: "right", fontSize: 12, direction: "rtl" },
  });

  return (
    <Document>
      <Page style={rtlStyles.page}>
        <Text style={rtlStyles.header}>فاتورة #{invoiceData.invoice.id}</Text>
        <Text style={rtlStyles.text}>الفرع: {invoiceData.invoice.branch_name}</Text>
        <Text style={rtlStyles.text}>رقم الطاولة: {invoiceData.invoice.table_id || "-"}</Text>

        <View style={rtlStyles.table}>
          <View style={[rtlStyles.tableRow, { backgroundColor: "#ddd" }]}>
            <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>الاسم</Text></View>
            <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>الوصف</Text></View>
            <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>السعر</Text></View>
            <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>الكمية</Text></View>
            <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>الإجمالي</Text></View>
          </View>

          {allItems.length > 0 ? allItems.map((item, idx) => (
            <View style={rtlStyles.tableRow} key={idx}>
              <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>{item.name}</Text></View>
              <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>{item.description || "-"}</Text></View>
              <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>{(item.price || 0).toLocaleString()}</Text></View>
              <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>{item.quantity}</Text></View>
              <View style={rtlStyles.tableCol}><Text style={rtlStyles.tableCell}>{(item.total_price || 0).toLocaleString()}</Text></View>
            </View>
          )) : <Text style={rtlStyles.text}>لا يوجد مواد</Text>}
        </View>

        <Text style={rtlStyles.totals}>الضرائب:</Text>
        {taxes.length > 0 ? taxes.map((tax) => (
          <Text key={tax.id} style={rtlStyles.text}>{tax.tax_name} - {tax.percent}% - {(tax.amount || 0).toLocaleString()}</Text>
        )) : <Text style={rtlStyles.text}>لا يوجد ضرائب</Text>}

        <Text style={rtlStyles.totals}>الخصومات:</Text>
        {discounts.length > 0 ? discounts.map((disc) => (
          <Text key={disc.id} style={rtlStyles.text}>{disc.name} - {(disc.amount || 0).toLocaleString()}</Text>
        )) : <Text style={rtlStyles.text}>لا يوجد خصومات</Text>}

        <Text style={rtlStyles.totals}>السعر الكلي: {(invoiceData.invoice.full_price || 0).toLocaleString()}</Text>
        <Text style={rtlStyles.totals}>الضريبة: {(invoiceData.invoice.tax || 0).toLocaleString()}</Text>
        <Text style={rtlStyles.totals}>الخصم: {(invoiceData.invoice.discount || 0).toLocaleString()}</Text>
        <Text style={rtlStyles.totals}>السعر النهائي: {(invoiceData.invoice.final_price || 0).toLocaleString()}</Text>
      </Page>
    </Document>
  );
}

// ---------------- Reservations Tab ----------------
function ReservationsTab({ branchId }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (branchId) loadReservations();
  }, [branchId]);

  const loadReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const allReservations = await fetchAllReservations(branchId);
      setReservations(allReservations);
      if (allReservations.length === 0) setError("لا توجد حجوزات حالياً");
    } catch (err) {
      setError(err.message || "خطأ أثناء جلب الحجوزات");
      setReservations([]);
    }
    setLoading(false);
  };

  const handleCancel = async (reservationId) => {
    try {
      await deleteReservation(reservationId);
      setReservations(reservations.filter(r => r.id !== reservationId));
    } catch (err) {
      console.error("فشل إلغاء الحجز", err);
      alert("❌ فشل إلغاء الحجز");
    }
  };

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <table className="w-full table-auto border border-gray-300 mt-4 text-right">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">#</th>
          <th className="border p-2">اسم العميل</th>
          <th className="border p-2">رقم الطاولة</th>
          <th className="border p-2">تاريخ الحجز</th>
          <th className="border p-2">من الساعة</th>
          <th className="border p-2">إلى الساعة</th>
          <th className="border p-2">إجراء</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r) => (
          <tr key={r.id} className="text-center">
            <td className="border p-2">{r.id}</td>
            <td className="border p-2">{r.user_name}</td>
            <td className="border p-2">{r.table_id}</td>
            <td className="border p-2">{r.date}</td>
            <td className="border p-2">{r.from_time}</td>
            <td className="border p-2">{r.to_time}</td>
            <td className="border p-2">
              <button
                onClick={() => handleCancel(r.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                ❌ إلغاء الحجز
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------------- Cashier Page ----------------
export default function CashierPage() {
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState("checkout");
  const [branchId, setBranchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("invoices");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.branchId) setBranchId(user.branchId);
  }, []);

  useEffect(() => {
    if (branchId && activeTab === "invoices") loadInvoices();
  }, [status, branchId, activeTab]);

  const loadInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      let allInvoices = [], page = 1, hasMore = true;
      while (hasMore) {
        const res = await fetchInvoicesByStatus(branchId, status, page);
        if (res.success && res.data.length > 0) {
          allInvoices = [...allInvoices, ...res.data];
          page++;
          if (res.meta && page > res.meta.last_page) hasMore = false;
        } else hasMore = false;
      }
      allInvoices.length > 0 ? setInvoices(allInvoices) : setError("لا توجد فواتير حالياً");
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    }
    setLoading(false);
  };

  const openDoneInvoiceInNewTab = async (invoice) => {
    try {
      const data = await fetchInvoiceById(invoice.id);
      const doc = <DoneInvoiceDocument invoiceData={data} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert("❌ فشل عرض الفاتورة");
    }
  };

  const handlePrintToDone = async (invoice) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const cashierId = user?.id;
      const payload = {
        table_id: invoice.table_id,
        branch_id: invoice.branch_id,
        cashier_id: cashierId,
        discount: invoice.discount || 0,
        discount_id: invoice.discount_id || null,
        items: invoice.items || [],
        status: "done"
      };
      await changeInvoiceStatus(invoice.id, payload);
      loadInvoices();
    } catch (err) {
      console.error("فشل تحديث حالة الفاتورة", err);
      alert("❌ فشل تحديث حالة الفاتورة");
    }
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <div className="mb-4 flex space-x-4 space-x-reverse">
        <button
          className={`px-4 py-2 rounded ${activeTab === "invoices" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("invoices")}
        >
          الفواتير
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "other" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("other")}
        >
          الحجوزات
        </button>
      </div>

      {activeTab === "invoices" && (
        <>
          <div className="mb-4">
            <label className="mr-2 font-bold">اختر الحالة:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-2 py-1 rounded">
              {["checkout", "print", "done"].map((s) => (
                <option key={s} value={s}>{s}</option>
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
                    <td className="border p-2 space-x-2 space-x-reverse">
                      {inv.status === "print" && (
                        <>
                          <button
                            onClick={() => openDoneInvoiceInNewTab(inv)}
                            className="bg-gray-600 text-white px-3 py-1 rounded"
                          >
                            📄 عرض PDF
                          </button>
                          <button
                            onClick={() => handlePrintToDone(inv)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            ✅ تم
                          </button>
                        </>
                      )}
                      {inv.status === "done" && (
                        <button
                          onClick={() => openDoneInvoiceInNewTab(inv)}
                          className="bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          📄 عرض PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === "other" && <ReservationsTab branchId={branchId} />}
    </div>
  );
}
