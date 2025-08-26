// src/pages/PublicMenu.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getPublicMenu } from '../services/menuservice';
import { BASE_IMAGE_URL } from '../utils/api';

const PublicMenu = () => {
  const [menu, setMenu] = useState([]);      // [{id, name, image, items: []}]
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');            // بحث نصي

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPublicMenu();
        setMenu(data);
      } catch (e) {
        console.error('Failed to load menu', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // فلترة البحث (بتفلتر الأكلات ضمن كل كاتيجوري)
  const filteredMenu = useMemo(() => {
    if (!q.trim()) return menu;
    const term = q.trim().toLowerCase();
    return menu
      .map((cat) => ({
        ...cat,
        items: (cat.items || []).filter(
          (it) =>
            it.name?.toLowerCase().includes(term) ||
            it.description?.toLowerCase().includes(term)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menu, q]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        جاري تحميل القائمة...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      {/* هيدر */}
      <header className="sticky top-0 bg-white/90 backdrop-blur border-b px-4 sm:px-8 py-4 z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-red-700">
            قائمة الطعام
          </h1>

          <input
            type="text"
            placeholder="ابحث عن وجبتك المفضلة..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-80 border rounded-xl px-4 py-2 outline-none focus:ring focus:ring-red-200"
          />
        </div>
      </header>

      {/* محتوى */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-12">
        {filteredMenu.length === 0 && (
          <p className="text-center text-gray-500">لا توجد نتائج مطابقة.</p>
        )}

        {filteredMenu.map((cat) => (
          <section key={cat.id} className="space-y-5">
            {/* عنوان القسم + صورة (اختياري) */}
            <div className="flex items-center gap-4">
              {cat.image ? (
                <img
                  src={`${BASE_IMAGE_URL}/${cat.image}`} // إذا ما عندك BASE_IMAGE_URL احذف السطر واستعمل cat.image مباشرة
                  alt={cat.name}
                  className="w-16 h-16 object-cover rounded-xl shadow"
                />
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-xl" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-red-700">{cat.name}</h2>
                <p className="text-gray-500 text-sm">({cat.items?.length || 0}) عنصر</p>
              </div>
            </div>

            {/* شبكة الأكلات */}
            {(!cat.items || cat.items.length === 0) ? (
              <p className="text-gray-500">لا توجد أكلات ضمن هذا القسم.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.items.map((it) => {
                  const firstImg = it.item_images?.[0]?.image || null; // غالباً image كامل URL
                  return (
                    <div
                      key={it.id}
                      className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                    >
                      {/* صورة الوجبة */}
                      {firstImg ? (
                        <img
                          src={firstImg}
                          alt={it.name}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-200" />
                      )}

                      {/* معلومات */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">{it.name}</h3>
                          <span className="text-red-600 font-semibold whitespace-nowrap">
                            {it.price } ل.س
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {it.description || '—'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </main>

      {/* فوتر بسيط */}
      <footer className="text-center text-sm text-gray-500 py-8">
        <span>بالهناء والعافية 🍽️</span>
      </footer>
    </div>
  );
};

export default PublicMenu;
