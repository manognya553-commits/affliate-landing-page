import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/useLanguage'

gsap.registerPlugin(ScrollTrigger)

/**
 * LivingNetworkVisualizer
 * Immersive 3D-projected particle globe and interconnected referral network.
 * Features:
 * - 3D spherical particle field with Fibonacci distribution & depth projection
 * - Latitude and orbital contour rings reinforcing the globe silhouette
 * - Fine proximity filaments with depth-based luminosity
 * - 5 prominent primary community hub nodes with specular ceramic glass shading
 * - Dynamic energy light pulses traveling along referral pathways
 * - Scroll-linked transition that converges, rotates, and streams into Why Join
 * - IntersectionObserver loop pause & prefers-reduced-motion static fallback
 */
export default function LivingNetworkVisualizer() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const { lang } = useLanguage()

  // Bilingual node labels and speech tags strictly aligned with docs/copy-deck.md
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
      affiliate: 'మీరు (అఫిలియేట్)',
      need: 'నీడ్ ఉన్న వ్యక్తి',
      healthcare: 'డాక్టర్ / హాస్పిటల్',
      education: 'కాలేజ్ / కోచింగ్',
      services: 'బిజినెస్ సర్వీసెస్',
      tagNeed: '“మంచి సర్వీస్ కావాలి”',
      tagAffiliate: '“మంచి పరిచయం”',
      tagProvider: '“ప్రొవైడర్ కండిషన్స్”',
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
    let isVisible = true
    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1
    let scrollProgress = 0

    // Accessibility: Reduced Motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionQuery.matches
    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // Gentle mouse parallax
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

    // Resize handling with devicePixelRatio scaling
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

    // Build 3D Spherical Particle Cloud using Fibonacci Lattice
    const isMobile = width < 640
    const particleCount = isMobile ? 36 : 72
    const baseSphereRadius = isMobile ? 120 : 155
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    const particles = []
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * i
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      particles.push({
        origX: x * baseSphereRadius,
        origY: y * baseSphereRadius,
        origZ: z * baseSphereRadius,
        radius: Math.random() * 1.8 + 1.2,
        color: i % 4 === 0 ? '#6B3CFF' : i % 4 === 1 ? '#FF4FA3' : i % 4 === 2 ? '#D6F36B' : '#827C94',
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.001 + Math.random() * 0.001,
      })
    }

    // 5 Primary Key Hub Nodes in 3D Spherical Coordinates
    const primaryNodes = [
      {
        id: 'affiliate',
        labelKey: 'affiliate',
        tagKey: 'tagAffiliate',
        origX: 0,
        origY: 10,
        origZ: baseSphereRadius * 0.95,
        baseR: 24,
        color: '#6B3CFF',
        glow: 'rgba(107, 60, 255, 0.45)',
        specular: '#C4B5FD',
      },
      {
        id: 'need',
        labelKey: 'need',
        tagKey: 'tagNeed',
        origX: -baseSphereRadius * 0.85,
        origY: -baseSphereRadius * 0.4,
        origZ: baseSphereRadius * 0.45,
        baseR: 20,
        color: '#FF4FA3',
        glow: 'rgba(255, 79, 163, 0.4)',
        specular: '#FBCFE8',
      },
      {
        id: 'healthcare',
        labelKey: 'healthcare',
        tagKey: 'tagProvider',
        origX: baseSphereRadius * 0.82,
        origY: -baseSphereRadius * 0.55,
        origZ: baseSphereRadius * 0.4,
        baseR: 19,
        color: '#FF6B6B',
        glow: 'rgba(255, 107, 107, 0.35)',
        specular: '#FFD8D8',
      },
      {
        id: 'education',
        labelKey: 'education',
        tagKey: null,
        origX: baseSphereRadius * 0.9,
        origY: baseSphereRadius * 0.28,
        origZ: baseSphereRadius * 0.35,
        baseR: 18,
        color: '#16A34A',
        glow: 'rgba(22, 163, 74, 0.35)',
        specular: '#BBF7D0',
      },
      {
        id: 'services',
        labelKey: 'services',
        tagKey: null,
        origX: -baseSphereRadius * 0.25,
        origY: baseSphereRadius * 0.82,
        origZ: baseSphereRadius * 0.5,
        baseR: 18,
        color: '#0D9488',
        glow: 'rgba(13, 148, 136, 0.35)',
        specular: '#99F6E4',
      },
    ]

    // Key referral connections: Need -> Affiliate -> Providers
    const referralSplines = [
      { from: 1, to: 0, color: '#FF4FA3' }, // Need -> Affiliate
      { from: 0, to: 2, color: '#FF6B6B' }, // Affiliate -> Healthcare
      { from: 0, to: 3, color: '#16A34A' }, // Affiliate -> Education
      { from: 0, to: 4, color: '#0D9488' }, // Affiliate -> Services
    ]

    // GSAP ScrollTrigger to tie scroll progression from Hero toward Why Join
    const trigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
      onUpdate: (self) => {
        scrollProgress = self.progress
      },
    })

    // IntersectionObserver to pause loop when Hero is completely off-screen
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisible = entry ? entry.isIntersecting : true
        if (isVisible && !prefersReducedMotion && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render)
        }
      },
      { threshold: 0.05 }
    )
    io.observe(container)

    // 3D Perspective Projection helper
    const fov = 420
    const project = (x, y, z, cx, cy) => {
      const scale = fov / (fov + z)
      return {
        px: cx + x * scale,
        py: cy + y * scale,
        scale,
      }
    }

    // 3D Rotation helper (around Y and X axes)
    const rotate3D = (x, y, z, angleY, angleX) => {
      // Rotate around Y
      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)
      const x1 = x * cosY + z * sinY
      const z1 = -x * sinY + z * cosY

      // Rotate around X
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)
      const y2 = y * cosX - z1 * sinX
      const z2 = y * sinX + z1 * cosX

      return { x: x1, y: y2, z: z2 }
    }

    // Main render loop
    const render = (time) => {
      if (!isVisible && !prefersReducedMotion) {
        animationFrameId = null
        return
      }

      ctx.clearRect(0, 0, width, height)

      // Smooth mouse parallax easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      const cx = width * 0.5 + mouse.x * 12
      // As scroll progresses, the network smoothly translates downward towards Why Join
      const scrollYOffset = scrollProgress * 140
      const cy = height * 0.5 + mouse.y * 10 + scrollYOffset

      // Continuous gentle rotation + scroll scrub acceleration
      const baseAngleY = time * 0.00035 + scrollProgress * Math.PI * 1.4
      const baseAngleX = 0.18 + Math.sin(time * 0.0002) * 0.12 + mouse.y * 0.25

      // Transition dispersion factor (particles expand and stream downward into Why Join)
      const expansion = 1 + scrollProgress * 0.45
      const streamDown = scrollProgress * 120

      // 1. Draw Globe Silhouette Orbital Latitude Rings
      const ringLatitudes = [-0.42, 0, 0.42]
      ringLatitudes.forEach((lat, ringIdx) => {
        const ringRadius = Math.sqrt(Math.max(0, 1 - lat * lat)) * baseSphereRadius * expansion
        const ringY = lat * baseSphereRadius * expansion

        ctx.beginPath()
        const steps = 36
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2
          const rx = Math.cos(theta) * ringRadius
          const rz = Math.sin(theta) * ringRadius
          const rot = rotate3D(rx, ringY, rz, baseAngleY, baseAngleX)
          const proj = project(rot.x, rot.y + (rot.y > 0 ? streamDown * 0.5 : 0), rot.z, cx, cy)

          if (s === 0) ctx.moveTo(proj.px, proj.py)
          else ctx.lineTo(proj.px, proj.py)
        }
        ctx.closePath()
        ctx.strokeStyle = ringIdx === 1 ? 'rgba(107, 60, 255, 0.22)' : 'rgba(255, 79, 163, 0.14)'
        ctx.lineWidth = ringIdx === 1 ? 1.4 : 1
        ctx.setLineDash([3, 5])
        ctx.stroke()
        ctx.setLineDash([])
      })

      // 2. Project and sort all particles by depth (Z)
      const projectedParticles = particles.map((p, idx) => {
        const drift = Math.sin(time * p.driftSpeed + p.driftPhase) * 4
        const rx = p.origX * expansion + drift
        const ry = p.origY * expansion + drift + (p.origY > 0 ? streamDown : streamDown * 0.3)
        const rz = p.origZ * expansion

        const rot = rotate3D(rx, ry, rz, baseAngleY, baseAngleX)
        const proj = project(rot.x, rot.y, rot.z, cx, cy)

        return {
          ...p,
          idx,
          px: proj.px,
          py: proj.py,
          scale: proj.scale,
          z: rot.z,
          origRotX: rot.x,
          origRotY: rot.y,
        }
      })

      // 3. Proximity Filaments between nearby particles (3D proximity)
      const maxDist3D = isMobile ? 65 : 82
      for (let i = 0; i < projectedParticles.length; i++) {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p1 = projectedParticles[i]
          const p2 = projectedParticles[j]

          const dx = p1.origRotX - p2.origRotX
          const dy = p1.origRotY - p2.origRotY
          const dz = p1.z - p2.z
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist3D < maxDist3D) {
            // Brighter lines in front, softer in back; illuminates further with scroll
            const avgZ = (p1.z + p2.z) * 0.5
            const depthFactor = Math.max(0.12, (avgZ + baseSphereRadius) / (baseSphereRadius * 2))
            const lineAlpha = (1 - dist3D / maxDist3D) * depthFactor * (0.35 + scrollProgress * 0.45)

            ctx.beginPath()
            ctx.moveTo(p1.px, p1.py)
            ctx.lineTo(p2.px, p2.py)
            ctx.strokeStyle = `rgba(107, 60, 255, ${lineAlpha})`
            ctx.lineWidth = 0.9 * p1.scale
            ctx.stroke()
          }
        }
      }

      // 4. Render particles with depth fading
      projectedParticles.forEach((p) => {
        const depthAlpha = Math.max(0.18, Math.min(0.9, (p.z + baseSphereRadius) / (baseSphereRadius * 1.8)))
        const r = Math.max(1, p.radius * p.scale)

        ctx.beginPath()
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = depthAlpha * (1 + scrollProgress * 0.3)
        ctx.fill()
        ctx.globalAlpha = 1.0
      })

      // 5. Project Primary Hub Nodes
      const projectedNodes = primaryNodes.map((node) => {
        const rx = node.origX * expansion
        const ry = node.origY * expansion + (node.origY > 0 ? streamDown * 0.6 : 0)
        const rz = node.origZ * expansion

        const rot = rotate3D(rx, ry, rz, baseAngleY * 0.7, baseAngleX)
        const proj = project(rot.x, rot.y, rot.z, cx, cy)

        return {
          ...node,
          px: proj.px,
          py: proj.py,
          scale: proj.scale,
          z: rot.z,
          label: currentText[node.labelKey] || '',
          tag: node.tagKey ? currentText[node.tagKey] : null,
        }
      })

      // 6. Draw Referral Splines between primary nodes
      referralSplines.forEach((spline, sIdx) => {
        const n1 = projectedNodes[spline.from]
        const n2 = projectedNodes[spline.to]

        // Curvature control point
        const midX = (n1.px + n2.px) * 0.5
        const midY = (n1.py + n2.py) * 0.5 - 16 * Math.sin(sIdx * 1.4)

        ctx.beginPath()
        ctx.moveTo(n1.px, n1.py)
        ctx.quadraticCurveTo(midX, midY, n2.px, n2.py)
        ctx.strokeStyle = spline.color
        ctx.lineWidth = 1.8 * ((n1.scale + n2.scale) * 0.5)
        ctx.globalAlpha = 0.45 + scrollProgress * 0.3
        ctx.stroke()
        ctx.globalAlpha = 1.0

        // Luminous energy pulse traveling along the referral spline
        if (!prefersReducedMotion) {
          const pulseSpeed = 0.0006 + scrollProgress * 0.0008
          const t = (time * pulseSpeed + sIdx * 0.28) % 1
          const qx = (1 - t) * (1 - t) * n1.px + 2 * (1 - t) * t * midX + t * t * n2.px
          const qy = (1 - t) * (1 - t) * n1.py + 2 * (1 - t) * t * midY + t * t * n2.py

          ctx.beginPath()
          ctx.arc(qx, qy, 3.4, 0, Math.PI * 2)
          ctx.fillStyle = spline.color
          ctx.shadowColor = spline.color
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // 7. Render Primary Hub Nodes (sort by depth so foreground nodes render over background)
      const sortedNodes = [...projectedNodes].sort((a, b) => a.z - b.z)
      sortedNodes.forEach((node) => {
        const nodeRadius = Math.max(14, node.baseR * node.scale)

        // Atmospheric outer glow
        ctx.beginPath()
        ctx.arc(node.px, node.py, nodeRadius * 1.6, 0, Math.PI * 2)
        ctx.fillStyle = node.glow
        ctx.fill()

        // Ceramic glass 3D sphere shading
        const lightX = node.px - nodeRadius * 0.35
        const lightY = node.py - nodeRadius * 0.35

        const grad = ctx.createRadialGradient(
          lightX,
          lightY,
          nodeRadius * 0.08,
          node.px,
          node.py,
          nodeRadius
        )
        grad.addColorStop(0, '#FFFFFF')
        grad.addColorStop(0.28, node.specular)
        grad.addColorStop(0.72, node.color)
        grad.addColorStop(1, '#0E0B1E')

        ctx.beginPath()
        ctx.arc(node.px, node.py, nodeRadius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.shadowColor = 'rgba(18, 16, 31, 0.25)'
        ctx.shadowBlur = 14
        ctx.shadowOffsetY = 4
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Specular gloss highlight
        ctx.beginPath()
        ctx.arc(lightX, lightY, nodeRadius * 0.32, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)'
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
        const pillX = Math.max(8, Math.min(width - pillW - 8, node.px - pillW / 2))
        const pillY = node.py + nodeRadius + 8

        // Pill background & border
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

        // Micro speech snippet badge if present
        if (node.tag) {
          ctx.font = `600 ${lang === 'te' ? '11px' : '10px'} ${fontFam}`
          const tagW = ctx.measureText(node.tag).width
          const tagPillW = tagW + 16
          const tagPillH = 20
          const tagPillX = Math.max(8, Math.min(width - tagPillW - 8, node.px - tagPillW / 2))
          const tagPillY = node.py - nodeRadius - tagPillH - 8

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
      io.disconnect()
      trigger.kill()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [lang, currentText])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[460px] lg:h-[520px] flex items-center justify-center pointer-events-none"
      aria-label="Interactive Living Network of Affiliates, People, and Providers"
    >
      {/* Concentric subtle radar circles for technical grounding */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0" aria-hidden="true">
        <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#12101F]/[0.05] animate-pulse-glow" />
        <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full border border-dashed border-[#6B3CFF]/[0.12]" />
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full h-full overflow-visible relative z-10"
      />
    </div>
  )
}
