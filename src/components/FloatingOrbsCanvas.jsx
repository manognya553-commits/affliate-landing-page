import React, { useRef, useEffect } from 'react'
import { useLanguage } from '../context/useLanguage'

export default function FloatingOrbsCanvas() {
  const canvasRef = useRef(null)
  const { lang } = useLanguage()

  // Labels translated in Telugu from copy-deck.md Section 6:
  // "Healthcare · Education · Professional services" -> "ఆరోగ్యం · విద్య · ప్రొఫెషనల్ సేవలు"
  // "You" -> "మీరు"
  const orbLabels = {
    en: {
      you: 'You',
      health: 'Healthcare',
      edu: 'Education',
      prof: 'Professional services',
    },
    te: {
      you: 'మీరు',
      health: 'ఆరోగ్యం',
      edu: 'విద్య',
      prof: 'ప్రొఫెషనల్ సేవలు',
    },
  }

  const currentLabels = orbLabels[lang] || orbLabels.en

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
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

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
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
      if (!canvas) return
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const w = rect.width || parent.clientWidth || 600
      const h = rect.height || parent.clientHeight || 600
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
    const rafResizeId = requestAnimationFrame(handleResize)
    const timer1 = setTimeout(handleResize, 50)
    const timer2 = setTimeout(handleResize, 150)
    const timer3 = setTimeout(handleResize, 350)

    let resizeObserver = null
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(canvas.parentElement)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // 4 Connected Orbs radiating around the central video blob:
    // Move orbs outside the blob edge: "You" to x:-215, "Education" to x:235 (so the whole word shows outside the blob)
    const orbsConfig = [
      {
        id: 'you',
        labelKey: 'you',
        x: -215,
        y: -20,
        r: 22,
        color: '#6B3CFF',
        glow: 'rgba(107, 60, 255, 0.45)',
        speed: 0.001,
        pillPosition: 'bottom',
      },
      {
        id: 'health',
        labelKey: 'health',
        x: 130,
        y: -145,
        r: 18,
        color: '#FF6B6B',
        glow: 'rgba(255, 107, 107, 0.4)',
        speed: 0.0012,
        pillPosition: 'top',
      },
      {
        id: 'edu',
        labelKey: 'edu',
        x: 235,
        y: -10,
        r: 18,
        color: '#D6F36B',
        glow: 'rgba(214, 243, 107, 0.45)',
        speed: 0.0009,
        pillPosition: 'bottom',
      },
      {
        id: 'prof',
        labelKey: 'prof',
        x: -125,
        y: 135,
        r: 18,
        color: '#2DD4BF',
        glow: 'rgba(45, 212, 191, 0.4)',
        speed: 0.0011,
        pillPosition: 'bottom',
      },
    ]

    const links = [
      { from: 0, to: 1, color: '#FF6B6B' },
      { from: 0, to: 2, color: '#D6F36B' },
      { from: 0, to: 3, color: '#2DD4BF' },
      { from: 3, to: 2, color: 'rgba(45, 212, 191, 0.4)' },
    ]

    const render = (time) => {
      ctx.clearRect(0, 0, width, height)

      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      const cx = width * 0.5 + mouse.x * 16
      const cy = height * 0.5 + mouse.y * 16

      // Calculate orb screen positions
      const projected = orbsConfig.map((orb, i) => {
        const floatY = Math.sin(time * orb.speed + i * 1.5) * 5
        const floatX = Math.cos(time * orb.speed * 0.8 + i) * 4
        const label = currentLabels[orb.labelKey] || orb.labelKey
        return {
          ...orb,
          label,
          sx: cx + orb.x + floatX,
          sy: cy + orb.y + floatY,
        }
      })

      // Draw subtle connecting threads behind orbs
      links.forEach((l) => {
        const p1 = projected[l.from]
        const p2 = projected[l.to]

        ctx.beginPath()
        ctx.moveTo(p1.sx, p1.sy)
        ctx.lineTo(p2.sx, p2.sy)
        ctx.strokeStyle = l.color
        ctx.lineWidth = 1.5
        ctx.globalAlpha = 0.32
        ctx.stroke()
        ctx.globalAlpha = 1.0

        // Traveling pulse particle
        if (!prefersReducedMotion) {
          const t = (time * 0.0008 + l.to * 0.3) % 1
          const px = p1.sx + (p2.sx - p1.sx) * t
          const py = p1.sy + (p2.sy - p1.sy) * t

          ctx.beginPath()
          ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fillStyle = l.color
          ctx.shadowColor = l.color
          ctx.shadowBlur = 6
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Draw glass-like orbs with readable translated labels
      projected.forEach((orb) => {
        // Outer aura glow
        ctx.beginPath()
        ctx.arc(orb.sx, orb.sy, orb.r + 6, 0, Math.PI * 2)
        ctx.fillStyle = orb.glow
        ctx.fill()

        // 3D Sphere gradient
        ctx.beginPath()
        ctx.arc(orb.sx, orb.sy, orb.r, 0, Math.PI * 2)
        const grad = ctx.createRadialGradient(
          orb.sx - orb.r * 0.3,
          orb.sy - orb.r * 0.3,
          orb.r * 0.1,
          orb.sx,
          orb.sy,
          orb.r
        )
        grad.addColorStop(0, '#FFFFFF')
        grad.addColorStop(0.35, orb.color)
        grad.addColorStop(1, orb.color)
        ctx.fillStyle = grad
        ctx.shadowColor = 'rgba(18, 16, 31, 0.16)'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0

        // Label pill with clear, readable typography
        const fontFam = lang === 'te' ? '"Noto Sans Telugu", system-ui, sans-serif' : '"Plus Jakarta Sans", system-ui, sans-serif'
        ctx.font = `600 ${lang === 'te' ? '12.5px' : '12px'} ${fontFam}`
        const tw = ctx.measureText(orb.label).width
        const pillW = tw + 20
        const pillH = 24
        // White badge with subtle border & shadow (clamped to prevent clipping)
        const pillX = Math.max(10, Math.min(width - pillW - 10, orb.sx - pillW / 2))
        const pillY = orb.pillPosition === 'top' ? orb.sy - orb.r - pillH - 6 : orb.sy + orb.r + 6
        const textCenterX = pillX + pillW / 2

        ctx.shadowColor = 'rgba(18, 16, 31, 0.08)'
        ctx.shadowBlur = 6
        ctx.shadowOffsetY = 2
        ctx.fillStyle = '#FFFFFF'
        ctx.strokeStyle = 'rgba(18, 16, 31, 0.14)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, pillW, pillH, 12)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Crisp dark text
        ctx.fillStyle = '#12101F'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(orb.label, textCenterX, pillY + pillH / 2)
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
      cancelAnimationFrame(rafResizeId)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      motionQuery.removeEventListener('change', handleMotionChange)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [lang, currentLabels])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}
    />
  )
}
