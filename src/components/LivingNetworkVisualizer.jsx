import React, { useRef, useEffect } from 'react'
import { useLanguage } from '../context/useLanguage'

export default function LivingNetworkVisualizer() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const { lang } = useLanguage()

  // Bilingual node and status labels strictly aligned with docs/copy-deck.md
  const labels = {
    en: {
      affiliate: 'You (Affiliate)',
      need: 'Person with Need',
      healthcare: 'Healthcare Provider',
      education: 'Education Provider',
      services: 'Advisory Provider',
      tagNeed: '“Looking for guidance”',
      tagAffiliate: '“Trusted introduction”',
      tagProvider: '“Provider terms”',
    },
    te: {
      affiliate: 'మీరు (అనుబంధ భాగస్వామి)',
      need: 'అవసరం ఉన్న వ్యక్తి',
      healthcare: 'ఆరోగ్య ప్రొవైడర్',
      education: 'విద్యా ప్రొవైడర్',
      services: 'ప్రొఫెషనల్ సేవల ప్రొవైడర్',
      tagNeed: '“సరైన సేవ కోసం ఎదురుచూపు”',
      tagAffiliate: '“నమ్మకమైన పరిచయం”',
      tagProvider: '“ప్రొవైడర్ నిబంధనలు”',
    },
  }

  const currentText = labels[lang] || labels.en

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionQuery.matches

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches
    }
    motionQuery.addEventListener('change', handleMotionChange)

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      mouse.targetX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      mouse.targetY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    }

    const handleMouseLeave = () => {
      mouse.targetX = 0
      mouse.targetY = 0
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    const handleResize = () => {
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      const w = rect.width || container.clientWidth || 540
      const h = rect.height || container.clientHeight || 500
      if (w <= 0 || h <= 0) return

      width = w
      height = h
      dpr = window.devicePixelRatio || 1

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    handleResize()
    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)
    window.addEventListener('resize', handleResize, { passive: true })

    // Node definitions forming the Living Community Network
    const nodes = [
      {
        id: 'affiliate',
        role: 'center',
        labelKey: 'affiliate',
        baseX: 0,
        baseY: 10,
        r: 28,
        color: '#6B3CFF',
        glow: 'rgba(107, 60, 255, 0.45)',
        specular: '#C4B5FD',
        pulseRate: 0.0016,
        tagKey: 'tagAffiliate',
      },
      {
        id: 'need',
        role: 'left',
        labelKey: 'need',
        baseX: -160,
        baseY: -80,
        r: 22,
        color: '#FF4FA3',
        glow: 'rgba(255, 79, 163, 0.4)',
        specular: '#FBCFE8',
        pulseRate: 0.0014,
        tagKey: 'tagNeed',
      },
      {
        id: 'healthcare',
        role: 'right-top',
        labelKey: 'healthcare',
        baseX: 165,
        baseY: -110,
        r: 20,
        color: '#FF6B6B',
        glow: 'rgba(255, 107, 107, 0.35)',
        specular: '#FFD8D8',
        pulseRate: 0.0012,
        tagKey: 'tagProvider',
      },
      {
        id: 'education',
        role: 'right-mid',
        labelKey: 'education',
        baseX: 180,
        baseY: 45,
        r: 20,
        color: '#16A34A',
        glow: 'rgba(22, 163, 74, 0.35)',
        specular: '#BBF7D0',
        pulseRate: 0.0015,
        tagKey: null,
      },
      {
        id: 'services',
        role: 'bottom',
        labelKey: 'services',
        baseX: -40,
        baseY: 145,
        r: 19,
        color: '#0D9488',
        glow: 'rgba(13, 148, 136, 0.35)',
        specular: '#99F6E4',
        pulseRate: 0.0013,
        tagKey: null,
      },
    ]

    // Connections linking the referral ecosystem
    const connections = [
      { from: 1, to: 0, color: '#FF4FA3', label: '1. Asks & trusts' }, // Need -> Affiliate
      { from: 0, to: 2, color: '#FF6B6B', label: '2. Introduces' },    // Affiliate -> Healthcare
      { from: 0, to: 3, color: '#16A34A', label: '2. Introduces' },    // Affiliate -> Education
      { from: 0, to: 4, color: '#0D9488', label: '2. Introduces' },    // Affiliate -> Services
      { from: 4, to: 3, color: 'rgba(107, 60, 255, 0.25)', label: null },
    ]

    const render = (time) => {
      ctx.clearRect(0, 0, width, height)

      // Easing mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      const cx = width * 0.5 + mouse.x * 12
      const cy = height * 0.5 + mouse.y * 10

      // Compute dynamic positions with natural breathing motion
      const currentNodes = nodes.map((node, i) => {
        const floatX = Math.sin(time * node.pulseRate + i * 1.3) * 6
        const floatY = Math.cos(time * node.pulseRate * 0.9 + i * 1.5) * 6

        const nx = cx + node.baseX + floatX
        const ny = cy + node.baseY + floatY

        return {
          ...node,
          x: nx,
          y: ny,
          label: currentText[node.labelKey] || '',
          tag: node.tagKey ? currentText[node.tagKey] : null,
        }
      })

      // 1. Draw connecting luminous splines
      connections.forEach((conn, connIdx) => {
        const n1 = currentNodes[conn.from]
        const n2 = currentNodes[conn.to]

        // Curvature control point
        const midX = (n1.x + n2.x) * 0.5
        const midY = (n1.y + n2.y) * 0.5 - 14 * Math.sin(connIdx * 1.2)

        ctx.beginPath()
        ctx.moveTo(n1.x, n1.y)
        ctx.quadraticCurveTo(midX, midY, n2.x, n2.y)
        ctx.strokeStyle = conn.color
        ctx.lineWidth = 1.6
        ctx.globalAlpha = 0.4
        ctx.stroke()
        ctx.globalAlpha = 1.0

        // Luminous energy pulse traveling along the spline
        if (!prefersReducedMotion) {
          const t = ((time * 0.0005) + connIdx * 0.3) % 1
          const qx = (1 - t) * (1 - t) * n1.x + 2 * (1 - t) * t * midX + t * t * n2.x
          const qy = (1 - t) * (1 - t) * n1.y + 2 * (1 - t) * t * midY + t * t * n2.y

          ctx.beginPath()
          ctx.arc(qx, qy, 3.2, 0, Math.PI * 2)
          ctx.fillStyle = conn.color
          ctx.shadowColor = conn.color
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // 2. Render each node with ceramic glass lighting & label badge
      currentNodes.forEach((node) => {
        // Atmospheric outer glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = node.glow
        ctx.fill()

        // Sphere radial gradient
        const lightX = node.x - node.r * 0.35
        const lightY = node.y - node.r * 0.35

        const grad = ctx.createRadialGradient(
          lightX,
          lightY,
          node.r * 0.1,
          node.x,
          node.y,
          node.r
        )
        grad.addColorStop(0, '#FFFFFF')
        grad.addColorStop(0.28, node.specular)
        grad.addColorStop(0.7, node.color)
        grad.addColorStop(1, '#0E0B1E')

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.shadowColor = 'rgba(18, 16, 31, 0.22)'
        ctx.shadowBlur = 14
        ctx.shadowOffsetY = 4
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Specular highlight gloss
        ctx.beginPath()
        ctx.arc(lightX, lightY, node.r * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.fill()

        // Crisp high-contrast label pill
        const fontFam =
          lang === 'te'
            ? '"Noto Sans Telugu", system-ui, sans-serif'
            : '"Plus Jakarta Sans", system-ui, sans-serif'
        ctx.font = `700 ${lang === 'te' ? '12px' : '11px'} ${fontFam}`
        const tw = ctx.measureText(node.label).width
        const pillW = tw + 20
        const pillH = 24
        const pillX = Math.max(8, Math.min(width - pillW - 8, node.x - pillW / 2))
        const pillY = node.y + node.r + 7

        // Pill background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
        ctx.strokeStyle = 'rgba(18, 16, 31, 0.12)'
        ctx.lineWidth = 1.2
        ctx.shadowColor = 'rgba(18, 16, 31, 0.08)'
        ctx.shadowBlur = 6
        ctx.shadowOffsetY = 2
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, pillW, pillH, 12)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Pill text
        ctx.fillStyle = '#12101F'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.label, pillX + pillW / 2, pillY + pillH / 2)

        // Micro-tag speech snippet if present
        if (node.tag) {
          ctx.font = `600 ${lang === 'te' ? '11px' : '10px'} ${fontFam}`
          const tagW = ctx.measureText(node.tag).width
          const tagPillW = tagW + 16
          const tagPillH = 20
          const tagPillX = Math.max(8, Math.min(width - tagPillW - 8, node.x - tagPillW / 2))
          const tagPillY = node.y - node.r - tagPillH - 8

          ctx.fillStyle = '#12101F'
          ctx.beginPath()
          ctx.roundRect(tagPillX, tagPillY, tagPillW, tagPillH, 10)
          ctx.fill()

          ctx.fillStyle = '#FFFFFF'
          ctx.fillText(node.tag, tagPillX + tagPillW / 2, tagPillY + tagPillH / 2)
        }
      })

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    if (prefersReducedMotion) {
      render(0)
    } else {
      animationFrameId = requestAnimationFrame(render)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      motionQuery.removeEventListener('change', handleMotionChange)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [lang, currentText])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center"
      aria-label="Interactive Living Community Network of Affiliates, People, and Providers"
    >
      {/* Concentric subtle radar circles for technical editorial grounding */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0" aria-hidden="true">
        <div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border border-[#12101F]/[0.06] animate-pulse-glow" />
        <div className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full border border-dashed border-[#6B3CFF]/[0.15]" />
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full h-full overflow-visible relative z-10"
      />
    </div>
  )
}
