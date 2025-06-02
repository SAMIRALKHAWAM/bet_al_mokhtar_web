import React, { useState } from 'react'
import { useTheme } from '../Context/ThemeContext'
import { useFont } from '../Context/FontContext'
const SettingsPage = () => {
  const { themeName, setThemeName, themes } = useTheme()

  const [language, setLanguage] = useState('ar')
  const [notifications, setNotifications] = useState(true)
  const { fontSize, setFontSize } = useFont()

  const resetSettings = () => {
    setThemeName('light')
    setLanguage('ar')
    setNotifications(true)
    setFontSize('medium')
  }

  return (
    <div className="p-8 min-h-screen transition duration-300">
      <h1 className="text-3xl font-bold mb-8">⚙️ الإعدادات</h1>

      {/* اختيار الثيم */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">المظهر</h2>
        <div className="flex gap-4 flex-wrap">
          {Object.keys(themes).map((key) => (
            <button
              key={key}
              onClick={() => setThemeName(key)}
              className={`px-4 py-2 rounded-lg shadow ${
                themeName === key ? 'ring-2 ring-black dark:ring-white' : ''
              }`}
            >
              {key === 'light'
                ? 'الوضع الفاتح'
                : key === 'dark'
                ? 'الوضع الداكن'
                : key === 'blue'
                ? 'أزرق'
                : key === 'green'
                ? 'أخضر'
                : key}
            </button>
          ))}
        </div>
      </div>

      {/* اللغة */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">اللغة</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* الإشعارات */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">الإشعارات</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          تفعيل الإشعارات
        </label>
      </div>

      {/* حجم الخط */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">حجم الخط</h2>
        <div className="flex gap-4">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-4 py-2 rounded-lg border ${
                fontSize === size ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
            >
              {size === 'small'
                ? 'صغير'
                : size === 'medium'
                ? 'متوسط'
                : 'كبير'}
            </button>
          ))}
        </div>
      </div>

      {/* إعادة ضبط */}
      <div className="mt-10">
        <button
          onClick={resetSettings}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          إعادة الإعدادات الافتراضية
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
