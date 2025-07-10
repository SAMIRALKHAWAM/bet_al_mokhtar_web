import axios from 'axios';

import { BASE_URL } from '../utils/api';

export const getInvoices = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/get_one_invoice`);
    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || 'فشل في جلب الفواتير');
    }
  } catch (error) {
    throw new Error('خطأ أثناء الاتصال بالسيرفر');
  }
};

export const printInvoiceUrl = (id) => `${BASE_URL}/print_invoice/${id}`;
