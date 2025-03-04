import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
/*import { initReactI18next } from 'react-i18next'*/

import translations from './locales/config'
console.log(translations)

i18n.use(LanguageDetector).init({
  resources: translations,
  fallbackLng: 'en',
  defaultNS: 'translations',
})
//.use(initReactI18next)

export default i18n
