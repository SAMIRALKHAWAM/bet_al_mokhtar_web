import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getBranchRates } from '../../services/branchRatesService';
import { getBranchId,gettype } from '../../utils/api';

const BranchRatesPage = () => {
  const [rates, setRates] = useState([]);
   const branchId=getBranchId();
   const type=gettype();

  const fetchRates = async () => {
  try {
    const data = await getBranchRates(); 

    const filtered = branchId
      ? data.filter((inv) => String(inv.branch_id) === String(branchId))
      : data;

    setRates(filtered);
  } catch {
    toast.error('فشل في جلب التقييمات');
  }
};


  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div dir="rtl" className="p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-right">⭐ تقييمات الفروع</h1>

      {rates.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">لا توجد تقييمات </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {rates.map((rate) => (
            <div
              key={rate.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-xl text-right mb-2">
                {rate.user?.user_name || '---'}
              </h3>
              <div className="space-y-2 text-right">
                <p>
                  <span className="font-semibold">التقييم:</span> {rate.rate}
                </p>
                <p>
                  <span className="font-semibold">الوصف:</span> {rate.description||"--"}
                </p>
                <p className="text-sm text-gray-500">
                 
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchRatesPage;
