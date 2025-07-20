import React, { useEffect, useState } from 'react';
import { getInvoices, printInvoiceUrl } from '../../services/invoiceService';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { gettype,getBranchId } from '../../utils/api';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const type = gettype();
const branchId = String(getBranchId() || '');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      console.log('✅ نوع المستخدم:', type);
      console.log('✅ رقم الفرع من localStorage:', branchId);

      const data = await getInvoices();
      console.log('✅ عدد الفواتير المحملة:', data.length);

   const filtered = branchId
  ? data.filter((inv) => String(inv.branch_id) === branchId)
  : data;


      setInvoices(filtered);
    } catch (error) {
      toast.error(error.message || 'فشل في جلب الفواتير');
    }
    setLoading(false);
  };

  const printInvoice = (id) => {
    window.open(printInvoiceUrl(id), '_blank');
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div dir="rtl" 
    className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white  ">
      <h1 className="text-3xl font-bold mb-6">🧾 الفواتير</h1>

      {loading && <p>جاري التحميل...</p>}
      {!loading && invoices.length === 0 && <p>لا توجد فواتير لعرضها.</p>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2"
          >
            <h2 className="font-bold text-xl">فاتورة #{invoice.id}</h2>
            <p>الفرع: {invoice.branch_name}</p>
            <p>الحالة: {invoice.status}</p>
            <p>السعر الكلي: {invoice.full_price} ل.س</p>
            <p>الضريبة: {invoice.tax} ل.س</p>
            <p>الخصم: {invoice.discount} ل.س</p>
            <p>السعر النهائي: {invoice.final_price} ل.س</p>

           
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicePage;
