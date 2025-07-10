import React, { useEffect, useState } from 'react';
import { getInvoices } from '../../services/invoiceService';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const printInvoice = (id) => {
    window.open(printInvoiceUrl(id), '_blank');
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🧾 الفواتير</h1>

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

            <Button className="bg-blue-600 mt-2" onClick={() => printInvoice(invoice.id)}>
              طباعة الفاتورة
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicePage;
