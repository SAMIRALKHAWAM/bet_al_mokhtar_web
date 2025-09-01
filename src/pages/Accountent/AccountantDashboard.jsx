// AccountantDashboard.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchPurchaseInvoices,
  fetchWarehouseMaterials,
  addPurchaseInvoice,
  deletePurchaseInvoice,
  fetchAllDoneInvoices,
  fetchInvoiceLines,
  fetchInvoiceById
} from "../../services/Accountentservices/PurchaseInvoiceServices";
import { BASE_URL } from "../../utils/api";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import axios from "axios";

import Amiri from "../../fonts/Amiri-Regular.ttf";
Font.register({ family: "Amiri", src: Amiri });

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Amiri", direction: "rtl", backgroundColor: "#fff" },
  header: { fontSize: 20, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#000", marginBottom: 10 },
  tableRow: { flexDirection: "row-reverse" },
  tableCol: { width: "50%", borderStyle: "solid", borderWidth: 1, borderColor: "#000", padding: 6 },
  tableCell: { textAlign: "right", fontSize: 12 }
});


const InvoiceDocument = ({ invoice }) => {
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>فاتورة شراء #{invoice.id ?? "-"}</Text>
        {items.length > 0 ? (
          <>
            <View style={[styles.tableRow, { backgroundColor: "#ddd" }]}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>اسم المادة</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>الكمية</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>السعر</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>الإجمالي</Text></View>
            </View>
            {items.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.material_name ?? "-"}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity ?? 0}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.price?.toLocaleString() ?? 0}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.full_price?.toLocaleString() ?? 0}</Text></View>
              </View>
            ))}
          </>
        ) : <Text>لا يوجد مواد في هذه الفاتورة</Text>}
      </Page>
    </Document>
  );
};


const DoneInvoiceDocument = ({ invoiceData }) => {
  const invoice = invoiceData.invoice;
  const items = invoiceData.items || [];
  const taxes = invoiceData.taxes || [];
  const discounts = invoiceData.discounts || [];

  return (
    <Document>
      <Page style={{ ...styles.page, direction: "rtl" }}>
        <Text style={styles.header}>فاتورة مكتملة #{invoice.id}</Text>

        
        <Text style={{ fontSize: 16, marginBottom: 4, direction: "rtl" }}> المواد</Text>
        {items.length > 0 ? (
          <>
            <View style={[styles.tableRow, { backgroundColor: "#ddd" }]}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>الاسم</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>الوصف</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>السعر</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>الكمية</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>الإجمالي</Text></View>
            </View>
            {items.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.name}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.description}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.price?.toLocaleString() ?? 0}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.total_price?.toLocaleString() ?? 0}</Text></View>
              </View>
            ))}
          </>
        ) : <Text>لا يوجد مواد</Text>}

       
        <Text  style={{ fontSize: 16, marginTop: 10, marginBottom: 4,direction: "rtl"  }}>الضرائب</Text>
        {taxes.length > 0 ? taxes.map((tax) => (
          <Text style={{ fontSize: 16, marginTop: 10 ,direction: "rtl" }} key={tax.id}>{tax.tax_name} - {tax.percent}% - {tax.amount?.toLocaleString()}</Text>
        )) : <Text>لا يوجد ضرائب</Text>}

       
        <Text dir="rtl" style={{ fontSize: 16, marginTop: 10, marginBottom: 4 ,direction: "rtl" }}>الخصومات</Text>
        {discounts.length > 0 ? discounts.map((disc) => (
          <Text style={{ fontSize: 16, marginTop: 10 ,direction: "rtl" }} key={disc.id}>{disc.name} - {disc.amount?.toLocaleString()}</Text>
        )) : <Text style={{ direction: "rtl" }}>لا يوجد خصومات</Text>}

       
        <Text  style={{ fontSize: 16, marginTop: 10 ,direction: "rtl" }}>السعر الكلي: {invoice.full_price?.toLocaleString()}</Text>
        <Text style={{ fontSize: 16, marginTop: 10 ,direction: "rtl" }}>الضريبة: {invoice.tax?.toLocaleString()}</Text>
        <Text style={{ fontSize: 16, marginTop: 10 ,direction: "rtl" }}>الخصم: {invoice.discount?.toLocaleString()}</Text>
        <Text style={{ fontSize: 16, marginTop: 10 ,direction: "rtl" }}>السعر النهائي: {invoice.final_price?.toLocaleString()}</Text>
      </Page>
    </Document>
  );
};

export default function AccountantDashboard() {
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [doneInvoices, setDoneInvoices] = useState([]);
  const [warehouseMaterials, setWarehouseMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [newInvoiceLines, setNewInvoiceLines] = useState([]);
  const [activeTab, setActiveTab] = useState("purchase");

  const [payrollFile, setPayrollFile] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [payrollLoading, setPayrollLoading] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) { toast.error("لم يتم تسجيل الدخول"); return; }
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user?.branchId) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const invoicesRes = await fetchPurchaseInvoices(user.branchId);
        setPurchaseInvoices(invoicesRes.data || []);
        const doneRes = await fetchAllDoneInvoices(user.branchId);
        setDoneInvoices(doneRes || []);
        const warehouseRes = await fetchWarehouseMaterials(user.branchId);
        setWarehouseMaterials(warehouseRes.data || []);
      } catch (err) {
        toast.error(err.message || "فشل جلب البيانات");
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  const handleAddInvoice = async () => {
    if (!newInvoiceLines.length) return toast.error("يجب اختيار مادة واحدة على الأقل");
    const payload = {
      branch_id: user.branchId,
      accountant_id: user.id,
      materials: newInvoiceLines.map(line => ({ material_id: line.material_id, quantity: line.quantity, price: line.price }))
    };
    try {
      await addPurchaseInvoice(payload);
      toast.success("تم إضافة الفاتورة بنجاح");
      setShowAddInvoice(false);
      setNewInvoiceLines([]);
      const invoicesRes = await fetchPurchaseInvoices(user.branchId);
      setPurchaseInvoices(invoicesRes.data || []);
    } catch (err) {
      toast.error(err.message || "فشل إضافة الفاتورة");
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الفاتورة؟")) return;
    try {
      await deletePurchaseInvoice(id);
      toast.success("تم حذف الفاتورة");
      setPurchaseInvoices(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      toast.error(err.message || "فشل حذف الفاتورة");
    }
  };

  const addMaterialLine = () => setNewInvoiceLines(prev => [...prev, { material_id: "", quantity: 1, price: 0 }]);
  const removeMaterialLine = (index) => setNewInvoiceLines(prev => prev.filter((_, i) => i !== index));

  const openInvoiceInNewTab = async (invoice) => {
    try {
      const lines = await fetchInvoiceLines(invoice.id);
      const safeInvoice = { ...invoice, items: lines };
      const doc = <InvoiceDocument invoice={safeInvoice} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      toast.error(err.message || "فشل عرض الفاتورة");
    }
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
      toast.error(err.message || "فشل عرض الفاتورة المكتملة");
    }
  };

  const handlePayrollFileChange = (e) => setPayrollFile(e.target.files[0]);
  const handleUploadPayroll = async () => {
    if (!payrollFile) return toast.error("اختر ملف Excel أولاً");
    const formData = new FormData();
    formData.append("excel", payrollFile);
    setPayrollLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/calculate_payrolls`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) setPayrollData(res.data.data || []);
      else toast.error(res.data.message || "فشل في حساب الرواتب");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
    setPayrollLoading(false);
  };

  return (
    <div dir="rtl" className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white space-y-8">
      <h1 className="text-3xl font-bold mb-4">💼 لوحة المحاسب</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button className={`px-4 py-2 rounded ${activeTab==="purchase"?"bg-red-600 text-white":"bg-gray-300"}`} onClick={()=>setActiveTab("purchase")}>فواتير الشراء</button>
        <button className={`px-4 py-2 rounded ${activeTab==="done"?"bg-red-600 text-white":"bg-gray-300"}`} onClick={()=>setActiveTab("done")}>الفواتير المكتملة</button>
        <button className={`px-4 py-2 rounded ${activeTab==="salary"?"bg-red-600 text-white":"bg-gray-300"}`} onClick={()=>setActiveTab("salary")}>الرواتب</button>
      </div>

      {/* فواتير الشراء */}
      {activeTab==="purchase" && (
        <section className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
          <h2 className="text-2xl font-bold">📦 فواتير الشراء</h2>
          <Button onClick={()=>setShowAddInvoice(prev=>!prev)}>+ إضافة فاتورة شراء</Button>
          {showAddInvoice && (
            <div className="space-y-2 mt-4 border-t pt-4">
              {newInvoiceLines.map((line, idx)=>(
                <div key={idx} className="flex gap-2 items-center">
                  <select className="p-2 rounded border" value={line.material_id} onChange={e=>{ const updated=[...newInvoiceLines]; updated[idx].material_id=e.target.value; setNewInvoiceLines(updated);}}>
                    <option value="">اختر المادة</option>
                    {warehouseMaterials.map(m=><option key={m.id} value={m.material_id}>{m.material_name}</option>)}
                  </select>
                  <input type="number" className="p-2 rounded border w-20" value={line.quantity} onChange={e=>{ const updated=[...newInvoiceLines]; updated[idx].quantity=Number(e.target.value); setNewInvoiceLines(updated);}} placeholder="الكمية" min={1}/>
                  <input type="number" className="p-2 rounded border w-24" value={line.price} onChange={e=>{ const updated=[...newInvoiceLines]; updated[idx].price=Number(e.target.value); setNewInvoiceLines(updated);}} placeholder="السعر" min={0}/>
                  <Button variant="destructive" onClick={()=>removeMaterialLine(idx)}>-</Button>
                </div>
              ))}
              <Button onClick={addMaterialLine}>+ إضافة مادة</Button>
              <Button onClick={handleAddInvoice} className="bg-green-600 text-white">حفظ الفاتورة</Button>
            </div>
          )}
          {loading ? <p>جاري التحميل...</p> : (
            <table className="w-full table-auto border mt-4">
              <thead><tr className="bg-gray-100"><th className="border p-2">#</th><th className="border p-2">إجراءات</th></tr></thead>
              <tbody>
                {purchaseInvoices.map(inv=>(
                  <tr key={inv.id} className="text-center">
                    <td className="border p-2">{inv.id}</td>
                    <td className="border p-2 flex justify-center gap-2">
                      <Button onClick={()=>openInvoiceInNewTab(inv)}><Printer size={16}/> عرض الفاتورة</Button>
                      <Button variant="destructive" onClick={()=>handleDeleteInvoice(inv.id)}>حذف</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* الفواتير المكتملة */}
      {activeTab==="done" && (
        <section className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
          <h2 className="text-2xl font-bold">✅ الفواتير المكتملة لهذا الفرع</h2>
          {loading ? <p>جاري التحميل...</p> : (
            <table className="w-full table-auto border mt-4">
              <thead><tr className="bg-gray-100"><th className="border p-2">#</th><th className="border p-2">إجراءات</th></tr></thead>
              <tbody>
                {doneInvoices.map(inv=>(
                  <tr key={inv.id} className="text-center">
                    <td className="border p-2">{inv.id}</td>
                    <td className="border p-2 flex justify-center gap-2">
                      <Button onClick={()=>openDoneInvoiceInNewTab(inv)}><Printer size={16}/> عرض الفاتورة المكتملة</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* الرواتب */}
      {activeTab==="salary" && (
        <section className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
          <h2 className="text-2xl font-bold">💰 الرواتب</h2>
          <div className="flex gap-4 items-center mb-4">
            <input type="file" accept=".xlsx,.xls" onChange={handlePayrollFileChange} className="border p-2 rounded bg-white dark:bg-gray-800"/>
            <Button onClick={handleUploadPayroll} disabled={payrollLoading}>{payrollLoading ? "جاري الحساب..." : "رفع الملف وحساب الرواتب"}</Button>
          </div>
          {payrollData.length>0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">الاسم</th>
                    <th className="border p-2">السعر بالساعة</th>
                    <th className="border p-2">الحسميات</th>
                    <th className="border p-2">عدد ساعات العمل</th>
                    <th className="border p-2">الإجمالي</th>
                    <th className="border p-2">الصافي</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((row, idx)=>(
                    <tr key={idx} className="text-center">
                      <td className="border p-2">{row.name}</td>
                      <td className="border p-2">{row.hourly_rate.toLocaleString()}</td>
                      <td className="border p-2">{row.deduction.toLocaleString()}</td>
                      <td className="border p-2">{row.total_hours}</td>
                      <td className="border p-2">{row.total.toLocaleString()}</td>
                      <td className="border p-2">{row.net.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
