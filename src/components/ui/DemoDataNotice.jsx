import React from 'react'
import { Info } from 'lucide-react'

/**
 * Notice banner explaining sandbox / development environment
 */
export default function DemoDataNotice({ compact = false, className = '' }) {
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs ${className}`}
      >
        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Development Sandbox • Live Database Integration</span>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs ${className}`}
    >
      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-amber-950">Development & Attribution Sandbox</p>
        <p className="mt-0.5 text-amber-900/80 leading-relaxed">
          Lead attribution, referral tracking, and commission calculations are processed live through the sBLOOM backend. Statutory Section 194H TDS estimates are computed automatically upon deal qualification.
        </p>
      </div>
    </div>
  )
}
