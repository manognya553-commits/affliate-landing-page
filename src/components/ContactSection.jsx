import React, { useState } from 'react'
import { Mail, Send, CheckCircle2, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { submitContact } from '../lib/submitContact'

export default function ContactSection() {
  const { lang, copy } = useLanguage()
  const data = copy.contact

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!data) return null

  const validateEmail = (email) => {
    // RFC 5322 standard-compliant email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email.trim())
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'email' && emailError) {
      if (validateEmail(value) || (!hasSubmitted && value.trim() === '')) {
        setEmailError(false)
      }
    }
    if (sendError) {
      setSendError(false)
    }
  }

  const handleEmailBlur = () => {
    // Only display an email error on blur IF the user entered an address that is invalid.
    // Never display an error on blur if the user has not entered an address and not submitted yet.
    if (formData.email.trim() !== '') {
      setEmailError(!validateEmail(formData.email))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setHasSubmitted(true)

    const isEmailValid = validateEmail(formData.email)
    const isNameValid = Boolean(formData.name.trim())
    const isMessageValid = Boolean(formData.message.trim())

    if (!isEmailValid) {
      setEmailError(true)
    }

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return
    }

    setIsSubmitting(true)
    setSendError(false)

    try {
      const res = await submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        honeypot,
      })

      if (res && res.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', message: '' })
        setHoneypot('')
        setHasSubmitted(false)
        setEmailError(false)
      } else {
        setSendError(true)
      }
    } catch {
      setSendError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSuccess(false)
    setSendError(false)
    setEmailError(false)
    setHasSubmitted(false)
  }

  const showEmailError = emailError || (hasSubmitted && !validateEmail(formData.email))
  const showNameError = hasSubmitted && !formData.name.trim()
  const showMessageError = hasSubmitted && !formData.message.trim()

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-[112px] bg-white scroll-mt-24"
      aria-label={data.heading}
    >
      {/* Soft Gradient Fade: Cream to White (80px tall, no hard edge) */}
      <div
        className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="site-container relative z-10 flex flex-col items-center gap-12">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <Mail size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{lang === 'te' ? 'సంప్రదించండి' : 'Get in touch'}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {data.heading}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[640px] m-0">
            {data.body}
          </p>
        </div>

        {/* Contact Form Card */}
        <div data-reveal="contact-card" className="corner-mark w-full max-w-2xl bg-[#FAF7F2] rounded-[28px] card-depth p-8 sm:p-12 border border-[#12101F]/8">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center gap-5 py-8" role="status" aria-live="polite">
              <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="text-2xl font-bold font-headline text-[#12101F] m-0">
                {data.success}
              </h3>

              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-full text-sm font-semibold bg-white border border-[#12101F]/15 text-[#12101F] hover:bg-black/5 transition-colors cursor-pointer"
              >
                {lang === 'te' ? 'మరో సందేశం పంపండి' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              {/* Spam Honeypot Field */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="text-sm font-bold text-[#12101F] font-headline">
                  {data.fields?.name} <span className="text-[#6B3CFF]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={data.fields?.name}
                  aria-invalid={showNameError}
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-[#12101F] placeholder:text-[#827C94] focus:outline-none focus:ring-2 transition-all text-base ${
                    showNameError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#12101F]/15 focus:border-[#6B3CFF] focus:ring-[#6B3CFF]/20'
                  }`}
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="text-sm font-bold text-[#12101F] font-headline">
                  {data.fields?.email} <span className="text-[#6B3CFF]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  placeholder={data.fields?.email}
                  aria-invalid={showEmailError}
                  aria-describedby={showEmailError ? 'email-error-msg' : undefined}
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-[#12101F] placeholder:text-[#827C94] focus:outline-none focus:ring-2 transition-all text-base ${
                    showEmailError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#12101F]/15 focus:border-[#6B3CFF] focus:ring-[#6B3CFF]/20'
                  }`}
                />
                {showEmailError && (
                  <p id="email-error-msg" className="flex items-center gap-1.5 text-xs text-red-600 font-medium m-0">
                    <AlertCircle size={14} />
                    <span>{data.errorEmail}</span>
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-sm font-bold text-[#12101F] font-headline">
                  {data.fields?.message} <span className="text-[#6B3CFF]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={data.fields?.message}
                  aria-invalid={showMessageError}
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-[#12101F] placeholder:text-[#827C94] focus:outline-none focus:ring-2 transition-all text-base resize-y ${
                    showMessageError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#12101F]/15 focus:border-[#6B3CFF] focus:ring-[#6B3CFF]/20'
                  }`}
                />
              </div>

              {/* Error banner if submission fails */}
              {sendError && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{data.errorSend}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-base bg-[#6B3CFF] hover:bg-[#582CD6] text-white shadow-lg shadow-[#6B3CFF]/25 hover:shadow-xl hover:shadow-[#6B3CFF]/35 active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{lang === 'te' ? 'పంపుతోంది...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <span>{data.button}</span>
                    <Send size={16} />
                  </>
                )}
              </button>

              {/* Privacy Notice Line */}
              {data.privacy && (
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#827C94] text-center pt-1">
                  <ShieldCheck size={16} className="text-[#16A34A] shrink-0" aria-hidden="true" />
                  <span>{data.privacy}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
