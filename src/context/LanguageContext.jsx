import React, { useState, useEffect } from 'react'
import { getCopy, getTranslation } from '../i18n/translations'
import { LanguageContext } from './LanguageContextCore'

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('sbloom_lang')
      if (saved) return saved
    } catch {}
    return 'en'
  })

  const [isCrossfading, setIsCrossfading] = useState(false)

  const setLang = (newLang) => {
    if (newLang === lang) return
    try {
      localStorage.setItem('sbloom_lang', newLang)
    } catch {}
    setIsCrossfading(true)
    setTimeout(() => {
      setLangState(newLang)
      setTimeout(() => {
        setIsCrossfading(false)
      }, 100)
    }, 100)
  }

  const toggleLang = () => {
    setLang(lang === 'en' ? 'te' : 'en')
  }

  useEffect(() => {
    document.documentElement.lang = lang
    if (lang === 'te') {
      document.documentElement.classList.add('lang-te')
    } else {
      document.documentElement.classList.remove('lang-te')
    }
  }, [lang])

  const copy = getCopy(lang)
  const t = (path) => getTranslation(path, lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, copy, t, isCrossfading }}>
      <div className={`lang-wrapper ${isCrossfading ? 'lang-crossfading' : ''}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}
