import React from 'react'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from './Button'

/**
 * Reusable empty state placeholder for upcoming features
 */
export default function ComingSoonState({
  title = 'Feature in Active Enablement',
  description = 'This capability is currently being finalized for production rollout.',
  eta = 'Phase 2',
  backTo = '/app',
  backLabel = 'Return to Dashboard',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center mb-5 ring-8 ring-[#6B3CFF]/5">
        <Sparkles className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#D6F36B] text-[#0E0B1E] mb-3">
        {eta}
      </span>
      <h2 className="text-2xl font-bold font-serif text-[#12101F] tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-sm text-[#575266] leading-relaxed mb-6">
        {description}
      </p>
      {backTo && (
        <Link to={backTo}>
          <Button variant="secondary" leftIcon={ArrowLeft}>
            {backLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}
