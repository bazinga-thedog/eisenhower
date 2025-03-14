import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translations from './locales/config'

i18n.use(LanguageDetector).init({
  resources: translations,
  fallbackLng: 'en',
  defaultNS: 'translations',
})
export default i18n
