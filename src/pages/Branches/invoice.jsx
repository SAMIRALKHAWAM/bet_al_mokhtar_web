import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getBranchId, BASE_URL } from '../../utils/api';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

// تسجيل الخط العربي
import Amiri from '../../fonts/Amiri-Regular.ttf';
Font.register({
  family: 'Amiri',
  src: Amiri,
});

const getAllInvoices = async (branchId = null) => {
  let allInvoices = [];
  let page = 1;
  let lastPage = 1;

  try {
    do {
      const url = branchId
        ? `${BASE_URL}/get_invoices?branchId=${branchId}&status=done&page=${page}`
        : `${BASE_URL}/get_invoices?page=${page}`;
      const res = await axios.get(url);
      if (res.data.success) {
        allInvoices = [...allInvoices, ...res.data.data];
        lastPage = res.data.last_page;
        page++;
      } else {
        throw new Error(res.data.message || 'فشل في جلب الفواتير');
      }
    } while (page <= lastPage);
    return allInvoices;
  } catch (error) {
    throw new Error(error.message || 'خطأ أثناء الاتصال بالسيرفر');
  }
};

// تنسيقات PDF
// تعديل تنسيقات PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Amiri', direction: 'rtl' },
  header: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf' },
  tableRow: { flexDirection: 'row-reverse' }, // ← لجعل الجدول يبدأ من اليمين
  tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', padding: 4 },
  tableCell: { textAlign: 'right' }, // ← محاذاة نص لكل خلية
});


// مستند الفاتورة
const InvoiceDocument = ({ invoice }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>فاتورة #{invoice.id}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>الفرع</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{invoice.branch_name}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>الحالة</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{invoice.status}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>السعر الكلي</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{invoice.full_price.toLocaleString()} ل.س</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>الضريبة</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{invoice.tax.toLocaleString()} ل.س</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>الخصم</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{invoice.discount.toLocaleString()} ل.س</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>السعر النهائي</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>{invoice.final_price.toLocaleString()} ل.س</Text></View>
        </View>
      </View>
    </Page>
  </Document>
);

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const branchId = String(getBranchId() || '');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getAllInvoices(branchId);
      setInvoices(data);
    } catch (error) {
      toast.error(error.message || 'فشل في جلب الفواتير');
    }
    setLoading(false);
  };

  const openInvoiceInNewTab = async (invoice) => {
    const doc = <InvoiceDocument invoice={invoice} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  useEffect(() => { fetchInvoices(); }, []);

  return (
    <div dir="rtl" className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🧾 الفواتير</h1>

      {loading && <p>جاري التحميل...</p>}
      {!loading && invoices.length === 0 && <p>لا توجد فواتير لعرضها.</p>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
            <h2 className="font-bold text-xl">فاتورة #{invoice.id}</h2>
            <p>الفرع: {invoice.branch_name}</p>
            <p>الحالة: {invoice.status}</p>
            <p>السعر الكلي: {invoice.full_price.toLocaleString()} ل.س</p>
            <p>الضريبة: {invoice.tax.toLocaleString()} ل.س</p>
            <p>الخصم: {invoice.discount.toLocaleString()} ل.س</p>
            <p>السعر النهائي: {invoice.final_price.toLocaleString()} ل.س</p>

            <Button className="flex items-center gap-2 mt-2" onClick={() => openInvoiceInNewTab(invoice)}>
              <Printer size={16} /> عرض الفاتورة
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicePage;
