import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      settings: "Settings",
      theme: "Theme",
      language: "Language",
      notifications: "Notifications",
      reset: "Reset Settings",
      fontSize: "Font Size",
    },
  },
  ar: {
    translation: {
      settings: "الإعدادات",
      theme: "المظهر",
      language: "اللغة",
      notifications: "الإشعارات",
      reset: "إعادة الإعدادات",
      fontSize: "حجم الخط",
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar', // اللغة الافتراضية
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
