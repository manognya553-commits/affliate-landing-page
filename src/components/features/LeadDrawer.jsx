import React, { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import { CheckCircle2, AlertCircle, Building2, User, Mail, Phone, MapPin, Sparkles } from 'lucide-react'

const AVAILABLE_SERVICES = [
  { id: 'srv-whatsapp-automation', name: 'WhatsApp Automation', commission: '20% commission' },
  { id: 'srv-website-building', name: 'Website Building & Redesign', commission: '25% commission' },
  { id: 'srv-seo', name: 'Search Engine Optimization (SEO)', commission: '20% commission' },
  { id: 'srv-google-ads', name: 'Google Ads & Search PPC', commission: '15% commission' },
  { id: 'srv-meta-ads', name: 'Meta Ads & Social Acquisition', commission: '15% commission' },
]

const SECTORS = [
  { value: 'Healthcare & Clinics', label: 'Healthcare & Clinics' },
  { value: 'Education & Coaching', label: 'Education & Coaching' },
  { value: 'Professional & Financial Services', label: 'Professional & Financial Services' },
  { value: 'Tech & Digital Creators', label: 'Tech & Digital Creators' },
  { value: 'Retail & Local Commerce', label: 'Retail & Local Commerce' },
]

export default function LeadDrawer({
  isOpen = false,
  onClose,
  onSuccess,
  initialServiceId = null,
}) {
  const { user } = useAuth()
  const { lang } = useLanguage()

  const partnerCode = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

  // Form State
  const [businessName, setBusinessName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [sector, setSector] = useState('Healthcare & Clinics')
  const [selectedServices, setSelectedServices] = useState([])
  const [businessRequirements, setBusinessRequirements] = useState('')
  const [preferredMeeting, setPreferredMeeting] = useState('')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [notes, setNotes] = useState('')
  const [consent, setConsent] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')

  // Pre-select service if passed
  useEffect(() => {
    if (initialServiceId) {
      const match = AVAILABLE_SERVICES.find((s) => s.id === initialServiceId || s.name.toLowerCase().includes(initialServiceId.toLowerCase()))
      if (match && !selectedServices.includes(match.name)) {
        setSelectedServices([match.name])
      }
    }
  }, [initialServiceId, isOpen])

  const toggleService = (serviceName) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName))
    } else {
      setSelectedServices([...selectedServices, serviceName])
    }
  }

  const resetForm = () => {
    setBusinessName('')
    setContactName('')
    setEmail('')
    setPhone('')
    setLocation('')
    setSector('Healthcare & Clinics')
    setSelectedServices([])
    setBusinessRequirements('')
    setPreferredMeeting('')
    setNotes('')
    setConsent(false)
    setErrorMsg('')
    setSuccessMsg('')
    setReferenceNumber('')
  }

  const handleClose = () => {
    resetForm()
    onClose?.()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!consent) {
      setErrorMsg(
        lang === 'te'
          ? 'క్లయింట్ సంప్రదింపు అనుమతిని తప్పనిసరిగా ధృవీకరించాలి.'
          : 'You must confirm that the client provided explicit permission for this introduction.'
      )
      return
    }

    if (selectedServices.length === 0) {
      setErrorMsg(
        lang === 'te'
          ? 'కనీసం ఒక సర్వీస్‌ను ఎంచుకోండి.'
          : 'Please select at least one target service of interest.'
      )
      return
    }

    if (businessRequirements.trim().length < 10) {
      setErrorMsg(
        lang === 'te'
          ? 'దయచేసి క్లయింట్ అవసరాలను కనీసం 10 అక్షరాలలో వివరించండి.'
          : 'Please provide at least 10 characters detailing the client requirements.'
      )
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        client_name: contactName.trim(),
        client_mobile: phone.trim(),
        client_city: location.trim(),
        service_category: sector.toLowerCase().includes('health')
          ? 'healthcare'
          : sector.toLowerCase().includes('edu')
          ? 'education'
          : 'professional',
        client_need_notes: `[Organization: ${businessName.trim()}] [Email: ${email.trim()}] [Services: ${selectedServices.join(
          ', '
        )}] [Reqs: ${businessRequirements.trim()}] ${notes.trim() ? `[Notes: ${notes.trim()}]` : ''}`,
        consent_confirmed: true,
        terms_version: 1,
        // Detailed schema fields
        business_name: businessName.trim(),
        contact_name: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        sector: sector,
        services_of_interest: selectedServices,
        business_requirements: businessRequirements.trim(),
        preferred_meeting_datetime: preferredMeeting || null,
        timezone: timezone,
        affiliate_code: partnerCode,
      }

      const res = await api.submitAffiliateReferral(payload)
      const generatedRef =
        res?.reference_number ||
        `SBL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`

      setReferenceNumber(generatedRef)
      setSuccessMsg(
        lang === 'te'
          ? `క్లయింట్ విజయవంతంగా నమోదు చేయబడింది. రిఫరెన్స్ ID: ${generatedRef}`
          : `Client referral successfully registered and attributed to your partner code. Reference ID: ${generatedRef}`
      )

      if (onSuccess) onSuccess(res)

      setTimeout(() => {
        handleClose()
      }, 2500)
    } catch (err) {
      console.error('Lead submission error:', err)
      setErrorMsg(err.message || 'Failed to submit referral lead. Please check details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={lang === 'te' ? 'కొత్త క్లయింట్‌ను పరిచయం చేయండి' : 'Refer an Enterprise Client'}
      subtitle={
        lang === 'te'
          ? `మీ భాగస్వామి కోడ్ ${partnerCode} కి ఆటోమేటిక్‌గా కేటాయించబడుతుంది`
          : `Attributed to your partner code ${partnerCode} with 60-day attribution lock`
      }
      width="max-w-xl"
    >
      {successMsg ? (
        <div className="py-12 px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold font-serif text-[#12101F]">
            {lang === 'te' ? 'రిఫరల్ నమోదు చేయబడింది!' : 'Referral Successfully Attributed!'}
          </h3>
          <p className="text-sm text-[#575266] max-w-md mx-auto">{successMsg}</p>
          <div className="p-4 rounded-xl bg-[#F3ECE1] border border-[#E8E2D8] inline-block font-mono font-bold text-base text-[#12101F]">
            {referenceNumber}
          </div>
          <p className="text-xs text-[#575266]">
            Our solutions team will initiate discovery within 24-48 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Client Organization */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#575266] pb-1 border-b border-[#E8E2D8]">
              1. Organization & Contact Details
            </h4>

            <Input
              label="Business / Organization Name"
              required
              placeholder="e.g. Apollo Super Specialty Clinic or Apex Coaching"
              leftIcon={Building2}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Primary Contact Person"
                required
                placeholder="Dr. S. K. Sharma / Decision Maker"
                leftIcon={User}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />

              <Input
                label="Business Phone / WhatsApp"
                required
                placeholder="+91 98765 43210"
                leftIcon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Business Email"
                required
                type="email"
                placeholder="director@clinic.com"
                leftIcon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="City / Location"
                required
                placeholder="Hyderabad / Vijayawada / Bangalore"
                leftIcon={MapPin}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Select
              label="Industry Sector"
              required
              options={SECTORS}
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
          </div>

          {/* Section 2: Services of Interest */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#575266]">
                2. Target Services of Interest <span className="text-rose-500">*</span>
              </h4>
              <span className="text-[11px] text-[#575266]">Select one or more</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_SERVICES.map((srv) => {
                const isChecked = selectedServices.includes(srv.name)
                return (
                  <button
                    type="button"
                    key={srv.id}
                    onClick={() => toggleService(srv.name)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isChecked
                        ? 'border-[#6B3CFF] bg-[#6B3CFF]/5 ring-1 ring-[#6B3CFF]'
                        : 'border-[#E8E2D8] bg-white/60 hover:bg-white hover:border-[#575266]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold text-[#12101F]">{srv.name}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isChecked ? 'bg-[#6B3CFF] text-white' : 'border border-[#E8E2D8]'
                        }`}
                      >
                        {isChecked && '✓'}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#6B3CFF]">{srv.commission}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Requirements & Scheduling */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#575266] pb-1 border-b border-[#E8E2D8]">
              3. Client Scope & Preferred Meeting
            </h4>

            <Textarea
              label="Business Pain Points & Requirements"
              required
              rows={3}
              placeholder="Describe their immediate goals: e.g. want to automate patient appointments via WhatsApp API, redesign old hospital website, and launch local Google Ads."
              value={businessRequirements}
              onChange={(e) => setBusinessRequirements(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Preferred POC Call Date / Time (Optional)"
                type="datetime-local"
                value={preferredMeeting}
                onChange={(e) => setPreferredMeeting(e.target.value)}
              />

              <Input
                label="Timezone"
                disabled
                value={timezone}
                helperText="Standard India Time (IST)"
              />
            </div>

            <Textarea
              label="Private Notes for sBLOOM Solutions Team (Optional)"
              rows={2}
              placeholder="e.g. Spoke directly with managing director; budget is already approved for Q4."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Section 4: Consent & Terms */}
          <div className="pt-2">
            <div className="p-4 rounded-xl bg-[#F3ECE1]/70 border border-[#E8E2D8] space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#E8E2D8] text-[#6B3CFF] focus:ring-[#6B3CFF]"
                />
                <span className="text-xs text-[#12101F] leading-snug">
                  <span className="font-semibold">Permission-First Confirmation:</span> I confirm that I have spoken with this client and have their explicit consent to introduce them to sBLOOM for these digital solutions.
                </span>
              </label>

              <div className="text-[11px] text-[#575266] pl-6.5">
                Referral attribution code <span className="font-mono font-bold text-[#12101F]">{partnerCode}</span> will be locked with this client lead for 60 days.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              leftIcon={Sparkles}
            >
              Submit & Lock Attribution
            </Button>
          </div>
        </form>
      )}
    </Drawer>
  )
}
