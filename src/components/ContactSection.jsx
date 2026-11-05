import React, { useState } from 'react'
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { submitContact } from '../lib/submitContact'

export default function ContactSection() {
  const { lang, copy } = useLanguage()
  const data = copy.contact || {}

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email.trim())
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'email' && emailError) {
      setEmailError(false)
    }
    if (sendError) {
      setSendError(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(formData.email)) {
      setEmailError(true)
      return
    }

    if (!formData.name.trim() || !formData.message.trim()) {
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
  }

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-24 bg-white scroll-mt-24 border-b border-[#12101F]/6"
      aria-label={data.heading || 'Contact Us'}
    >
      <div className="site-container relative z-10 flex flex-col items-center gap-12">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <Mail size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{lang === 'te' ? 'సంప్రదించండి' : 'Get in Touch'}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.2]">
            {data.heading}
          </h2>
        </div>

        {/* Contact Form Container */}
        <div className="w-full max-w-xl">
          {isSuccess ? (
            <div
              data-reveal="card"
              className="bg-[#FAF7F2] rounded-[32px] p-8 sm:p-10 border border-[#12101F]/8 shadow-sm flex flex-col items-center text-center gap-4"
              role="status"
              aria-live="polite"
            >
              <div className="w-14 h-14 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-headline text-2xl font-bold text-[#12101F] m-0">
                {lang === 'te' ? 'మెసేజ్ అందింది!' : 'Message Received!'}
              </h3>
              <p className="text-sm sm:text-base text-[#575266] m-0 leading-relaxed max-w-md">
                {lang === 'te'
                  ? 'మీ సందేశం మాకు అందింది. త్వరలోనే మిమ్మల్ని సంప్రదిస్తాము.'
                  : 'Thank you for reaching out. Our team will review your enquiry and get back to you shortly.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 text-sm font-semibold text-[#6B3CFF] hover:underline bg-transparent border-none cursor-pointer"
              >
                {lang === 'te' ? 'మరొక మెసేజ్ పంపండి' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[#FAF7F2] rounded-[32px] p-8 sm:p-10 border border-[#12101F]/8 shadow-sm flex flex-col gap-5"
              noValidate
            >
              {/* Honeypot anti-spam field */}
              <input
                type="text"
                name="website_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-name" className="text-xs font-mono font-bold text-[#575266] uppercase tracking-wider">
                  {data.nameLabel} <span className="text-[#6B3CFF]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={lang === 'te' ? 'మీ పూర్తి పేరు' : 'Full name'}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#12101F]/10 text-sm sm:text-base text-[#12101F] placeholder:text-[#827C94]/60 focus:outline-none focus:border-[#6B3CFF] focus:ring-2 focus:ring-[#6B3CFF]/20 transition-all box-border"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="text-xs font-mono font-bold text-[#575266] uppercase tracking-wider">
                  {data.emailLabel} <span className="text-[#6B3CFF]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={lang === 'te' ? 'మీ ఈమెయిల్ అడ్రస్' : 'Email address'}
                  className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-sm sm:text-base text-[#12101F] placeholder:text-[#827C94]/60 focus:outline-none transition-all box-border ${
                    emailError
                      ? 'border-[#EF4444] ring-2 ring-[#EF4444]/20'
                      : 'border-[#12101F]/10 focus:border-[#6B3CFF] focus:ring-2 focus:ring-[#6B3CFF]/20'
                  }`}
                  aria-invalid={emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {emailError && (
                  <span id="email-error" className="text-xs text-[#EF4444] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} />
                    {lang === 'te' ? 'సరైన ఈమెయిల్ ఎంటర్ చేయండి' : 'Please enter a valid email address'}
                  </span>
                )}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs font-mono font-bold text-[#575266] uppercase tracking-wider">
                  {data.messageLabel} <span className="text-[#6B3CFF]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={lang === 'te' ? 'మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి...' : 'Type your message here...'}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#12101F]/10 text-sm sm:text-base text-[#12101F] placeholder:text-[#827C94]/60 focus:outline-none focus:border-[#6B3CFF] focus:ring-2 focus:ring-[#6B3CFF]/20 transition-all resize-y min-h-[100px] box-border"
                />
              </div>

              {/* Server send error feedback */}
              {sendError && (
                <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-[#DC2626] flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{lang === 'te' ? 'సందేశం పంపడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Failed to send message. Please try again.'}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-base bg-[#6B3CFF] hover:bg-[#5025D1] text-white shadow-md shadow-[#6B3CFF]/25 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer border-none mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{lang === 'te' ? 'పంపుతోంది...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <span>{data.buttonText}</span>
                    <Send size={16} />
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-center text-[#827C94] m-0 mt-1 leading-normal">
                {data.privacyNote}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
