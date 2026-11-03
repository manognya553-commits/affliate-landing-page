import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Drawer from '../../components/ui/Drawer'
import {
  HelpCircle,
  ChevronDown,
  MessageSquare,
  LifeBuoy,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react'

export default function AffiliateSupportPage() {
  const { user } = useAuth()
  const { lang } = useLanguage()

  const [openFaq, setOpenFaq] = useState(0) // First FAQ open by default
  const [ticketDrawerOpen, setTicketDrawerOpen] = useState(false)

  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('Attribution')
  const [ticketMessage, setTicketMessage] = useState('')
  const [submittingTicket, setSubmittingTicket] = useState(false)
  const [ticketSuccess, setTicketSuccess] = useState('')

  const partnerCode = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

  const faqs = [
    {
      qEn: 'What is the attribution lock window for client referrals?',
      qTe: 'క్లయింట్ రిఫరల్స్‌కు అట్రిబ్యూషన్ లాక్ కాలపరిమితి ఎంత?',
      aEn: 'All leads submitted through your partner portal or registered via your referral link are protected by an immutable 60-day attribution lock. If the client signs an agreement with sBLOOM anytime within 60 days of your introduction, your commission is guaranteed.',
      aTe: 'మీ భాగస్వామి పోర్టల్ లేదా రిఫరల్ లింక్ ద్వారా నమోదు చేయబడిన ప్రతి క్లయింట్ లీడ్‌కు 60 రోజుల అట్రిబ్యూషన్ లాక్ లభిస్తుంది. 60 రోజుల్లోపు వారు ఏ సర్వీస్ ఒప్పందం కుదుర్చుకున్నా మీ కమీషన్ ఖచ్చితంగా జమ చేయబడుతుంది.',
    },
    {
      qEn: 'How quickly does the sBLOOM sales team verify and contact my lead?',
      qTe: 'నేను పంపిన లీడ్‌ను sBLOOM టీమ్ ఎంత త్వరగా సంప్రదిస్తుంది?',
      aEn: 'Our enterprise solutions team operates under a strict 24–48 hour discovery SLA. As soon as outreach is made, the status in your Leads Pipeline will transition from "Pending" to "Contacted", and you will see notes on meeting progression.',
      aTe: 'మా ఎంటర్‌ప్రైజ్ టీమ్ 24 నుండి 48 గంటల్లోపు క్లయింట్‌ను సంప్రదిస్తుంది. కమ్యూనికేషన్ మొదలవగానే మీ లీడ్స్ పేజీలో స్టేటస్ "Pending" నుండి "Contacted" కి మారుతుంది.',
    },
    {
      qEn: 'When and how are affiliate commissions disbursed?',
      qTe: 'కమీషన్ చెల్లింపులు ఎప్పుడు మరియు ఎలా జరుగుతాయి?',
      aEn: 'Commissions are calculated automatically upon deal conversion and settled in monthly batches on the 10th of every calendar month. Disbursements are transferred directly to your registered UPI ID or Bank NEFT account with official banking UTR confirmation.',
      aTe: 'క్లయింట్ డీల్ ఖరారైన వెంటనే కమీషన్ లెక్కించబడుతుంది మరియు ప్రతి నెలా 10వ తేదీన మీ రిజిస్టర్డ్ UPI ID లేదా బ్యాంక్ NEFT ఖాతాకు నేరుగా జమ చేయబడుతుంది.',
    },
    {
      qEn: 'How does the statutory 5% Section 194H TDS withholding work?',
      qTe: '5% Section 194H TDS పన్ను మినహాయింపు ఎలా పనిచేస్తుంది?',
      aEn: 'Under Section 194H of the Indian Income Tax Act, 5% TDS is withheld from commission earnings paid to Indian resident partners. We file these statutory deductions with the tax department and issue quarterly Form 16A certificates credited to your PAN.',
      aTe: 'భారతీయ ఆదాయపు పన్ను చట్టం సెక్షన్ 194H ప్రకారం, అన్ని కమీషన్లపై 5% TDS చట్టబద్ధంగా మినహాయించబడుతుంది. త్రైమాసికానికి ఒకసారి మీ PAN నంబర్‌కు Form 16A సర్టిఫికెట్ జారీ చేయబడుతుంది.',
    },
    {
      qEn: 'Where can I update my payout UPI ID or bank account details?',
      qTe: 'నా UPI ID లేదా బ్యాంక్ వివరాలను ఎక్కడ అప్‌డేట్ చేయాలి?',
      aEn: 'Navigate to "Profile & Settings" (/app/profile) or the "Earnings" (/app/earnings) page. Enter your UPI handle (e.g. partner@upi), Bank Account Number, and IFSC code, then click "Save Settlement Information".',
      aTe: 'మీరు ప్రొఫైల్ పేజీ (/app/profile) లేదా ఎర్నింగ్స్ పేజీ (/app/earnings) లో మీ UPI ID, బ్యాంక్ ఖాతా మరియు IFSC కోడ్‌ను ఎప్పుడైనా సులభంగా అప్‌డేట్ చేసుకోవచ్చు.',
    },
    {
      qEn: 'What does the "permission-first" principle require before lead submission?',
      qTe: 'లీడ్ సబ్మిట్ చేయడానికి ముందు "అనుమతి సూత్రం" ప్రకారం ఏమి చేయాలి?',
      aEn: 'sBLOOM enforces strict ethics: you must have spoken with the business decision-maker and secured their explicit agreement to be introduced before entering their details into the Lead Drawer. Cold scraping or unauthorized data uploads are strictly prohibited.',
      aTe: 'sBLOOM ఎథిక్స్ ప్రకారం, లీడ్ వివరాలను ఎంటర్ చేయడానికి ముందు సదరు వ్యాపారవేత్తతో వ్యక్తిగతంగా మాట్లాడి వారి స్పష్టమైన అనుమతి తీసుకోవడం తప్పనిసరి. అనధికార డేటా సబ్మిషన్ పూర్తిగా నిషేధం.',
    },
    {
      qEn: 'What is the difference between my referral link and the Lead Drawer?',
      qTe: 'రిఫరల్ లింక్ మరియు లీడ్ డ్రాయర్ మధ్య తేడా ఏమిటి?',
      aEn: 'Your referral link (e.g. sbloom.in/?ref=SBL-XXXX) is best for sharing with prospective partners or clients who want to explore on their own. The Lead Drawer is the high-touch enterprise channel where you input specific client requirements to initiate a managed discovery call immediately.',
      aTe: 'రిఫరల్ లింక్ ద్వారా క్లయింట్లు స్వయంగా సైన్ అప్ కావచ్చు. లీడ్ డ్రాయర్ ద్వారా మీరు నేరుగా క్లయింట్ అవసరాలను నమోదు చేసి 24-48 గంటల్లో మా ఎగ్జిక్యూటివ్‌లతో అపాయింట్‌మెంట్ షెడ్యూల్ చేయవచ్చు.',
    },
    {
      qEn: 'What happens if two affiliates refer the same client organization?',
      qTe: 'ఇద్దరు పార్ట్‌నర్లు ఒకే సంస్థను రిఫర్ చేస్తే ఏమవుతుంది?',
      aEn: 'Attribution is strictly governed by timestamp locking. The first partner to successfully introduce the qualified lead with explicit consent holds the 60-day exclusive attribution lock for all digital services closed with that client.',
      aTe: 'టైమ్‌స్టాంప్ ఆధారంగా మొదట అనుమతితో విజయవంతంగా రిఫర్ చేసిన భాగస్వామికే 60 రోజుల పాటు ఆ క్లయింట్‌పై ప్రత్యేక అట్రిబ్యూషన్ హక్కు ఉంటుంది.',
    },
  ]

  const handleCreateTicket = (e) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketMessage.trim()) return

    setSubmittingTicket(true)
    setTimeout(() => {
      const generatedTicket = `TICK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(
        2,
        '0'
      )}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

      setTicketSuccess(
        `Support ticket ${generatedTicket} has been created. Our partner resolution team will reply via email and dashboard within 12 hours.`
      )
      setSubmittingTicket(false)
      setTicketSubject('')
      setTicketMessage('')

      setTimeout(() => {
        setTicketSuccess('')
        setTicketDrawerOpen(false)
      }, 3500)
    }, 700)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#12101F] tracking-tight flex items-center gap-2.5">
            <LifeBuoy className="w-7 h-7 text-[#6B3CFF]" />
            <span>{lang === 'te' ? 'భాగస్వామి సహాయ కేంద్రం' : 'Partner Helpdesk & Support'}</span>
          </h1>
          <p className="text-sm text-[#575266] mt-1">
            {lang === 'te'
              ? 'అట్రిబ్యూషన్ ప్రశ్నలు, కమిషన్ చెల్లింపులు మరియు విచారణల కోసం వేగవంతమైన పరిష్కారాలు'
              : 'Clear answers on cookie attribution, 10th-of-month payouts, Section 194H TDS, and direct ticket resolution.'}
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={MessageSquare}
          onClick={() => setTicketDrawerOpen(true)}
        >
          {lang === 'te' ? 'సహాయ టికెట్ తెరవండి' : 'Create Support Ticket'}
        </Button>
      </div>

      {/* Quick Help Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="p-5" variant="surface">
          <div className="w-9 h-9 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#12101F]">60-Day Attribution Lock</h3>
          <p className="text-xs text-[#575266] mt-1">
            All leads are cryptographically attributed to your partner code with guaranteed credit protection.
          </p>
        </Card>

        <Card padding="p-5" variant="surface">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#12101F]">24–48h Discovery SLA</h3>
          <p className="text-xs text-[#575266] mt-1">
            Our enterprise solutions team promptly contacts every qualified client lead you introduce.
          </p>
        </Card>

        <Card padding="p-5" variant="surface">
          <div className="w-9 h-9 rounded-xl bg-[#D6F36B]/30 text-[#0E0B1E] flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-[#0E0B1E]" />
          </div>
          <h3 className="font-bold text-sm text-[#12101F]">Direct Partner Desk</h3>
          <p className="text-xs text-[#575266] mt-1">
            Need urgent assistance? Open a ticket or contact <span className="font-semibold text-[#12101F]">partners@sbloom.in</span>.
          </p>
        </Card>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-[#12101F] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#6B3CFF]" />
            <span>Frequently Asked Partner Questions</span>
          </h2>
          <span className="text-xs text-[#575266]">8 Official Guides</span>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E8E2D8] bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
                >
                  <span className="font-bold text-sm text-[#12101F]">
                    {lang === 'te' ? faq.qTe : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#575266] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#6B3CFF]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#575266] leading-relaxed border-t border-[#E8E2D8]/60 bg-[#FAF7F2]/50 animate-in fade-in duration-150">
                    <p>{lang === 'te' ? faq.aTe : faq.aEn}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Support Ticket Drawer */}
      <Drawer
        isOpen={ticketDrawerOpen}
        onClose={() => setTicketDrawerOpen(false)}
        title="Open Support Ticket"
        subtitle={`Partner Code: ${partnerCode} • Dedicated Resolution Desk`}
        width="max-w-lg"
      >
        {ticketSuccess ? (
          <div className="py-12 px-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-serif text-[#12101F]">Ticket Submitted</h3>
            <p className="text-xs text-[#575266] leading-relaxed">{ticketSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <Input
              label="Subject / Topic"
              required
              placeholder="e.g. Attribution inquiry for Apollo Clinic referral"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
            />

            <Select
              label="Inquiry Category"
              required
              options={[
                { value: 'Attribution', label: 'Attribution & Cookie Lock' },
                { value: 'Payment', label: 'Commission Payout & TDS' },
                { value: 'Lead Status', label: 'Lead Discovery & Progression' },
                { value: 'Technical', label: 'Portal Technical Issue' },
              ]}
              value={ticketCategory}
              onChange={(e) => setTicketCategory(e.target.value)}
            />

            <Textarea
              label="Detailed Message"
              required
              rows={5}
              placeholder="Please provide details, client reference number (if applicable), and your questions..."
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
            />

            <div className="p-3.5 rounded-xl bg-[#F3ECE1] border border-[#E8E2D8] text-xs text-[#575266]">
              Tickets are reviewed by senior affiliate managers within 12 business hours.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setTicketDrawerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={submittingTicket} leftIcon={Send}>
                Submit Ticket
              </Button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  )
}
