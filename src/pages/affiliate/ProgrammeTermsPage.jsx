import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { getPortalCopy } from '../../i18n/portalTranslations'
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react'

export default function ProgrammeTermsPage() {
  const { lang } = useLanguage()
  const copy = getPortalCopy(lang)

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/app/onboarding"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6B3CFF] hover:underline no-underline"
          >
            <ArrowLeft size={14} />
            <span>{copy.common.back}</span>
          </Link>

          <span className="font-mono text-xs text-[#827C94] bg-white px-3 py-1 rounded-full border border-[#12101F]/10">
            Terms Version 1.0 // ACTIVE
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#12101F]/10 shadow-xl shadow-[#12101F]/4 flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-6 border-b border-[#12101F]/10">
            <div className="w-12 h-12 rounded-2xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline text-[#12101F] m-0">
                {lang === 'te' ? 'sBLOOM అఫిలియేట్ ప్రోగ్రామ్ నిబంధనలు' : 'sBLOOM Affiliate Programme Terms'}
              </h1>
              <p className="text-xs text-[#827C94] m-0 mt-0.5 font-mono">
                Version 1.0 • Effective 2026
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-sm text-[#575266] leading-relaxed">
            <section className="flex flex-col gap-2">
              <h2 className="text-base font-bold font-headline text-[#12101F] m-0">
                {lang === 'te' ? '1. పరిచయం & ఉద్దేశం' : '1. Overview and Purpose'}
              </h2>
              <p className="m-0">
                {lang === 'te'
                  ? 'sBLOOM అఫిలియేట్ ప్రోగ్రామ్ అనేది ఒక నాలెడ్జ్-ఆధారిత రిఫరల్ నెట్‌వర్క్. అఫిలియేట్లు తమ పరిచయస్తులకు అవసరమైన సర్వీసులను సంబంధిత ప్రొవైడర్లకు పరిచయం చేయడానికి ఒక నిర్మాణాత్మక వేదికను కల్పిస్తుంది.'
                  : 'The sBLOOM Affiliate Programme provides a structured platform enabling affiliates to introduce individuals with genuine service needs to participating, independent service providers.'}
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-bold font-headline text-[#12101F] m-0">
                {lang === 'te' ? '2. అనుమతి మరియు పారదర్శకత' : '2. Permission and Transparent Introductions'}
              </h2>
              <p className="m-0">
                {lang === 'te'
                  ? 'ప్రతి అఫిలియేట్ సంబంధిత వ్యక్తి యొక్క స్పష్టమైన ముందస్తు అనుమతి తీసుకున్న తర్వాతే వివరాలను సమర్పించాలి. ఎలాంటి ఒత్తిడి, తప్పుడు సమాచారం లేదా స్పామ్ అనుమతించబడదు.'
                  : 'All referrals must be made with the explicit prior permission of the prospective client. Misleading statements, unsolicited contact, or pressure tactics are strictly prohibited.'}
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-bold font-headline text-[#12101F] m-0">
                {lang === 'te' ? '3. సంపాదన & ప్రొవైడర్ నిబంధనలు' : '3. Compensation and Provider Terms'}
              </h2>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {lang === 'te'
                    ? 'సంపాదనకు ఎలాంటి హామీ లేదు. చెల్లింపు, అర్హత మరియు టైమింగ్ — అన్నీ ఆయా సర్వీస్ ప్రొవైడర్ నిర్ణయించిన నిబంధనల మీదే ఆధారపడి ఉంటాయి. ప్రతి ప్రొవైడర్ నిబంధనలను రిఫరల్ చేసే ముందే పరిశీలించవచ్చు.'
                    : 'Earnings are not guaranteed. Referral compensation, qualification criteria, and payout timelines are established independently by each participating service provider and subject to their applicable terms.'}
                </span>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-bold font-headline text-[#12101F] m-0">
                {lang === 'te' ? '4. ఖాతా నిర్వహణ & సమీక్ష' : '4. Account Verification & Review'}
              </h2>
              <p className="m-0">
                {lang === 'te'
                  ? 'ప్రోగ్రామ్ నాణ్యతను కాపాడటానికి నిర్వాహకులు ప్రతి దరఖాస్తును సమీక్షిస్తారు. నిబంధనలు పాటించని ఖాతాలను నిలిపివేసే హక్కు sBLOOM కు ఉంటుంది.'
                  : 'All affiliate profiles undergo administrator review. sBLOOM reserves the right to suspend or reject applications that fail to meet programme quality or regulatory standards.'}
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-[#12101F]/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-[#16A34A]">
              <CheckCircle2 size={16} />
              <span>{lang === 'te' ? 'అధికారిక నిబంధనల పత్రం' : 'Official Terms Document'}</span>
            </div>

            <Link
              to="/app/onboarding"
              className="px-6 py-2.5 rounded-full bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5025D1] transition-all no-underline"
            >
              {lang === 'te' ? 'ఆన్‌బోర్డింగ్‌కు తిరిగి వెళ్లండి' : 'Return to Onboarding'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
