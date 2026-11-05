import React from 'react'
import {
  MessageSquare,
  ShieldCheck,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Info,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const SECTOR_CONFIGS = [
  {
    icon: HeartPulse,
    tagBg: 'bg-[#FF4FA3]/10 text-[#FF4FA3] border-[#FF4FA3]/20',
    topBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
    bubbleBg: 'bg-[#FAF7F2] text-[#12101F]',
    affiliateBg: 'bg-[#6B3CFF] text-white',
  },
  {
    icon: GraduationCap,
    tagBg: 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20',
    topBar: 'bg-gradient-to-r from-[#16A34A] to-[#D6F36B]',
    bubbleBg: 'bg-[#FAF7F2] text-[#12101F]',
    affiliateBg: 'bg-[#6B3CFF] text-white',
  },
  {
    icon: Briefcase,
    tagBg: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
    topBar: 'bg-gradient-to-r from-[#0D9488] to-[#059669]',
    bubbleBg: 'bg-[#FAF7F2] text-[#12101F]',
    affiliateBg: 'bg-[#6B3CFF] text-white',
  },
]

export default function ConversationCarouselSection() {
  const { copy } = useLanguage()
  const data = copy.conversations || {}
  const cards = data.cards || []

  return (
    <section
      id="conversations"
      className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-white scroll-mt-24 border-b border-[#12101F]/6 overflow-hidden"
      aria-label={data.heading || 'What An Introduction Sounds Like'}
    >
      <div className="site-container flex flex-col items-center gap-12 lg:gap-14">
        {/* Section Heading */}
        <div data-reveal="heading" className="text-center max-w-[800px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <MessageSquare size={13} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {data.heading}
          </h2>
        </div>

        {/* 3 Chat Conversation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full" role="list">
          {cards.map((card, idx) => {
            const config = SECTOR_CONFIGS[idx % SECTOR_CONFIGS.length]
            const Icon = config.icon

            return (
              <div
                key={`chat-card-${card.id || idx}`}
                data-reveal="card"
                className="relative bg-[#FAF7F2] rounded-[30px] card-depth p-6 sm:p-7 flex flex-col justify-between gap-6 border border-[#12101F]/8 transition-all duration-300 hover:shadow-lg overflow-hidden group"
                role="listitem"
              >
                {/* Accent Top Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.topBar}`} />

                {/* Card Top: Sector Tag + Ask First Label */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.tagBg}`}>
                    <Icon size={14} aria-hidden="true" />
                    <span>{card.title}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#6B3CFF]/20 text-[11px] font-bold text-[#6B3CFF] shadow-2xs">
                    <ShieldCheck size={13} className="text-[#6B3CFF]" aria-hidden="true" />
                    <span>{data.label}</span>
                  </div>
                </div>

                {/* Chat Bubbles Container */}
                <div className="bg-white rounded-[22px] p-4 sm:p-5 flex flex-col gap-3.5 border border-[#12101F]/6 shadow-2xs">
                  {/* Incoming Message (Friend / Neighbour / Business Owner) */}
                  <div className="flex flex-col items-start gap-1 max-w-[90%]">
                    <span className="text-[11px] font-bold text-[#827C94] px-1 font-mono">
                      {card.contactRole}
                    </span>
                    <div className="bg-[#FAF7F2] text-[#12101F] text-sm sm:text-[14.5px] leading-relaxed p-3.5 rounded-2xl rounded-tl-xs border border-[#12101F]/6">
                      {card.contactMessage}
                    </div>
                  </div>

                  {/* Outgoing Message (You / Affiliate) */}
                  <div className="flex flex-col items-end gap-1 max-w-[92%] self-end">
                    <span className="text-[11px] font-bold text-[#6B3CFF] px-1 font-mono">
                      {card.affiliateRole}
                    </span>
                    <div className="bg-[#6B3CFF] text-white text-sm sm:text-[14.5px] leading-relaxed p-3.5 rounded-2xl rounded-tr-xs shadow-xs">
                      {card.affiliateMessage}
                    </div>
                  </div>
                </div>

                {/* Note at card bottom */}
                <div className="flex items-center gap-1.5 text-xs text-[#827C94] px-1">
                  <Info size={13} className="text-[#827C94]" aria-hidden="true" />
                  <span>{data.note}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
