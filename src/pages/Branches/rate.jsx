import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getBranchRates } from '../../services/branchRatesService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BranchRatesPage = () => {
  const [rates, setRates] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    branchId: '',
    rate: '',
  });

  const fetchRates = async () => {
    try {
      const data = await getBranchRates(filters);
      setRates(data);
    } catch {
      toast.error('فشل في جلب التقييمات');
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleFilter = () => {
    fetchRates();
  };

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
                  <span className="font-semibold">الوصف:</span> {rate.description}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">التاريخ:</span>{' '}
                  {new Date(rate.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
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
