import React, { useRef, useEffect } from 'react'
import { useLanguage } from '../context/useLanguage'

export default function FloatingOrbsCanvas() {
  const canvasRef = useRef(null)
  const { lang } = useLanguage()

  // Approved labels from copy-deck.md Section 6
  const orbLabels = {
    en: {
      you: 'You',
      health: 'Healthcare',
      edu: 'Education',
      prof: 'Professional services',
    },
    te: {
      you: 'మీరు',
      health: 'హెల్త్‌కేర్',
      edu: 'ఎడ్యుకేషన్',
      prof: 'ప్రొఫెషనల్ సర్వీసెస్',
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
    const timer1 = setTimeout(handleResize, 60)
    const timer2 = setTimeout(handleResize, 200)

    let resizeObserver = null
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => handleResize())
      resizeObserver.observe(canvas.parentElement)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // 3D Nodes configuration radiating around the central hero visual
    const nodes3D = [
      {
        id: 'you',
        labelKey: 'you',
        x: -200,
        y: -10,
        z: 35,
        r: 24,
        color: '#6B3CFF',
        specular: '#C4B5FD',
        glow: 'rgba(107, 60, 255, 0.45)',
        orbitSpeed: 0.001,
        phase: 0,
        pillPosition: 'bottom',
      },
      {
        id: 'health',
        labelKey: 'health',
        x: 140,
        y: -140,
        z: -25,
        r: 20,
        color: '#FF4FA3',
        specular: '#FBCFE8',
        glow: 'rgba(255, 79, 163, 0.45)',
        orbitSpeed: 0.0012,
        phase: 1.8,
        pillPosition: 'top',
      },
      {
        id: 'edu',
        labelKey: 'edu',
        x: 225,
        y: 10,
        z: 40,
        r: 20,
        color: '#16A34A',
        specular: '#BBF7D0',
        glow: 'rgba(22, 163, 74, 0.4)',
        orbitSpeed: 0.0009,
        phase: 3.4,
        pillPosition: 'bottom',
      },
      {
        id: 'prof',
        labelKey: 'prof',
        x: -120,
        y: 145,
        z: -20,
        r: 20,
        color: '#0D9488',
        specular: '#99F6E4',
        glow: 'rgba(13, 148, 136, 0.4)',
        orbitSpeed: 0.0011,
        phase: 4.9,
        pillPosition: 'bottom',
      },
    ]

    const links = [
      { from: 0, to: 1, color: '#FF4FA3' },
      { from: 0, to: 2, color: '#16A34A' },
      { from: 0, to: 3, color: '#0D9488' },
      { from: 3, to: 2, color: 'rgba(107, 60, 255, 0.35)' },
    ]

    const cameraZ = 480

    const render = (time) => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse easing for 3D pitch/yaw
      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      const rotY = mouse.x * 0.32
      const rotX = -mouse.y * 0.28

      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      const cx = width * 0.5
      const cy = height * 0.5

      // 1. Calculate projected 3D positions with floating harmonic motion
      const projected = nodes3D.map((node) => {
        const floatZ = Math.sin(time * node.orbitSpeed + node.phase) * 16
        const floatY = Math.cos(time * node.orbitSpeed * 0.8 + node.phase) * 8
        const floatX = Math.sin(time * node.orbitSpeed * 0.6 + node.phase) * 6

        const curX = node.x + floatX
        const curY = node.y + floatY
        const curZ = node.z + floatZ

        // 3D Rotation (Euler Y then X)
        const x1 = curX * cosY + curZ * sinY
        const z1 = -curX * sinY + curZ * cosY

        const y2 = curY * cosX - z1 * sinX
        const z2 = curY * sinX + z1 * cosX

        // Perspective scaling
        const perspective = cameraZ / (cameraZ + z2)
        const sx = cx + x1 * perspective
        const sy = cy + y2 * perspective
        const sr = Math.max(10, node.r * perspective)

        const label = currentLabels[node.labelKey] || node.labelKey

        return {
          ...node,
          label,
          depth: z2,
          scale: perspective,
          sx,
          sy,
          sr,
        }
      })

      // 2. Draw 3D curved connecting threads with energy pulse particles
      links.forEach((link, linkIdx) => {
        const p1 = projected[link.from]
        const p2 = projected[link.to]

        // Midpoint with subtle curvature arch in 3D
        const midX = (p1.sx + p2.sx) * 0.5
        const midY = (p1.sy + p2.sy) * 0.5 - 12 * Math.sin(linkIdx)

        ctx.beginPath()
        ctx.moveTo(p1.sx, p1.sy)
        ctx.quadraticCurveTo(midX, midY, p2.sx, p2.sy)
        ctx.strokeStyle = link.color
        ctx.lineWidth = 1.6
        ctx.globalAlpha = 0.35
        ctx.stroke()
        ctx.globalAlpha = 1.0

        // Traveling energy photon pulse along the 3D curve
        if (!prefersReducedMotion) {
          const t = ((time * 0.0006) + linkIdx * 0.28) % 1
          const qx = (1 - t) * (1 - t) * p1.sx + 2 * (1 - t) * t * midX + t * t * p2.sx
          const qy = (1 - t) * (1 - t) * p1.sy + 2 * (1 - t) * t * midY + t * t * p2.sy

          ctx.beginPath()
          ctx.arc(qx, qy, 3.2, 0, Math.PI * 2)
          ctx.fillStyle = link.color
          ctx.shadowColor = link.color
          ctx.shadowBlur = 8
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // 3. Depth-sort orbs so foreground orbs occlude background orbs
      const sortedOrbs = [...projected].sort((a, b) => a.depth - b.depth)

      // 4. Render 3D Spheres with Specular Lighting & Depth Highlights
      sortedOrbs.forEach((orb) => {
        // Outer atmospheric bloom aura
        ctx.beginPath()
        ctx.arc(orb.sx, orb.sy, orb.sr * 1.45, 0, Math.PI * 2)
        ctx.fillStyle = orb.glow
        ctx.fill()

        // 3D Glass / Ceramic Sphere with dynamic light source
        const lightOffsetX = orb.sx - orb.sr * 0.32
        const lightOffsetY = orb.sy - orb.sr * 0.32

        const sphereGrad = ctx.createRadialGradient(
          lightOffsetX,
          lightOffsetY,
          orb.sr * 0.08,
          orb.sx,
          orb.sy,
          orb.sr
        )
        sphereGrad.addColorStop(0, '#FFFFFF')
        sphereGrad.addColorStop(0.25, orb.specular)
        sphereGrad.addColorStop(0.65, orb.color)
        sphereGrad.addColorStop(1, '#0E0B1E')

        ctx.beginPath()
        ctx.arc(orb.sx, orb.sy, orb.sr, 0, Math.PI * 2)
        ctx.fillStyle = sphereGrad
        ctx.shadowColor = 'rgba(18, 16, 31, 0.22)'
        ctx.shadowBlur = 12 * orb.scale
        ctx.shadowOffsetY = 4 * orb.scale
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Subtle specular highlight gloss arc
        ctx.beginPath()
        ctx.arc(
          lightOffsetX,
          lightOffsetY,
          orb.sr * 0.35,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
        ctx.fill()

        // 5. Label pill with high-contrast typography
        const fontFam =
          lang === 'te'
            ? '"Noto Sans Telugu", system-ui, sans-serif'
            : '"Plus Jakarta Sans", system-ui, sans-serif'
        ctx.font = `700 ${lang === 'te' ? '12.5px' : '12px'} ${fontFam}`
        const tw = ctx.measureText(orb.label).width
        const pillW = tw + 22
        const pillH = 26
        const pillX = Math.max(12, Math.min(width - pillW - 12, orb.sx - pillW / 2))
        const pillY =
          orb.pillPosition === 'top'
            ? orb.sy - orb.sr - pillH - 8
            : orb.sy + orb.sr + 8
        const textCenterX = pillX + pillW / 2

        // Soft glass pill backing
        ctx.shadowColor = 'rgba(18, 16, 31, 0.12)'
        ctx.shadowBlur = 8
        ctx.shadowOffsetY = 2
        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
        ctx.strokeStyle = 'rgba(18, 16, 31, 0.12)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, pillW, pillH, 13)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Crisp dark ink text
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
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      if (resizeObserver) resizeObserver.disconnect()
      motionQuery.removeEventListener('change', handleMotionChange)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [lang, currentLabels])

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full overflow-visible"
      aria-label="Interactive 3D network of trusted service categories"
    />
  )
}

