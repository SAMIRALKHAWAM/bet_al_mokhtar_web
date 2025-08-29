import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchOffers, fetchDiscounts, createDiscount } from '../../services/subadmin_offer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const BranchOffersAndDiscountsPage = () => {
  const { branchId } = useParams();
  const [offers, setOffers] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [showDiscountForm, setShowDiscountForm] = useState(false);

  const [newDiscount, setNewDiscount] = useState({
    name: '',
    code: '',
    percent: '',
    from_date: '',
    to_date: ''
  });

  useEffect(() => {
    if (!branchId) return;

    fetchOffers(branchId).then((res) => {
      console.log('📌 Offers for branch', branchId, res.data);
      setOffers(res.data.data); 
    });

    fetchDiscounts(branchId).then((res) => {
      console.log('📌 Discounts for branch', branchId, res.data);
      setDiscounts(res.data.data); 
    });
  }, [branchId]);

  const handleCreateDiscount = async () => {
    try {
      // نرسل branchId ضمن البيانات
      await createDiscount({ ...newDiscount, branches: [branchId] });
      toast.success('تم إنشاء الخصم لهذا الفرع');
      setShowDiscountForm(false);
      setNewDiscount({
        name: '',
        code: '',
        percent: '',
        from_date: '',
        to_date: ''
      });

      // إعادة تحميل الخصومات
      const res = await fetchDiscounts(branchId);
      setDiscounts(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في إنشاء الخصم');
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">📍 عروض وخصومات الفرع {branchId}</h1>

      {/* العروض */}
      <section>
        <h2 className="text-2xl font-semibold">العروض</h2>
        {offers.length === 0 ? (
          <p>لا توجد عروض لهذا الفرع.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="font-bold text-lg">{offer.name}</h3>
                <p>{offer.description}</p>
                <p className="text-sm text-gray-500 mt-1">من {offer.from_date} إلى {offer.to_date}</p>

                <h4 className="mt-2 font-semibold">الأصناف:</h4>
                <ul className="text-sm list-disc list-inside">
                  {offer.offer_items?.map((oi) => (
                    <li key={oi.id}>
                      {oi.item?.name} - {oi.quantity} × {oi.price} ل.س
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* الخصومات */}
      <section>
        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-2xl font-semibold">الخصومات</h2>
          {!showDiscountForm && (
            <Button onClick={() => setShowDiscountForm(true)}>+ إضافة خصم</Button>
          )}
        </div>

        {showDiscountForm && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 mb-6">
            <h3 className="text-xl font-bold">إضافة خصم جديد للفرع</h3>
            <Input placeholder="الاسم" value={newDiscount.name} onChange={e => setNewDiscount({ ...newDiscount, name: e.target.value })} />
            <Input placeholder="الكود" value={newDiscount.code} onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value })} />
            <Input type="number" placeholder="النسبة المئوية (%)" value={newDiscount.percent} onChange={e => setNewDiscount({ ...newDiscount, percent: e.target.value })} />
            <Input type="date" value={newDiscount.from_date} onChange={e => setNewDiscount({ ...newDiscount, from_date: e.target.value })} />
            <Input type="date" value={newDiscount.to_date} onChange={e => setNewDiscount({ ...newDiscount, to_date: e.target.value })} />

            <div className="flex gap-2 mt-2">
              <Button onClick={handleCreateDiscount}>حفظ</Button>
              <Button variant="outline" onClick={() => setShowDiscountForm(false)}>إلغاء</Button>
            </div>
          </div>
        )}

        {discounts.length === 0 ? (
          <p>لا توجد خصومات لهذا الفرع.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {discounts.map((disc) => (
              <div key={disc.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="font-bold text-lg">{disc.name}</h3>
                <p>الكود: {disc.code}</p>
                <p>النسبة: {disc.percent}%</p>
                <p className="text-sm text-gray-500 mt-1">من {disc.from_date} إلى {disc.to_date}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BranchOffersAndDiscountsPage;
