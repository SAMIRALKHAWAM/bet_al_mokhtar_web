import axios from 'axios';

import { BASE_URL } from '../utils/api';

export const getBranchRates = async (filters = {}) => {
  try {
    // const query = new URLSearchParams(filters).toString();
    const res = await axios.get(`${BASE_URL}/get_rates`, { params: filters });
    return res.data.data || [];
  } catch (error) {
    throw new Error('فشل في جلب التقييمات');
  }
};
