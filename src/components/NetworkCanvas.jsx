import React, { useRef, useEffect, useState } from 'react'

export default function NetworkCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hasWebGLOrCanvas, setHasWebGLOrCanvas] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setHasWebGLOrCanvas(false)
      return
    }

    let animationFrameId
    let isVisible = true
    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    // Check for prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionQuery.matches

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches
      if (prefersReducedMotion) {
        drawFrame(0) // Draw one static frame
      }
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // Mouse tracking for subtle 3D tilt
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      mouse.targetX = x * 0.4
      mouse.targetY = y * 0.4
    }

    const handleMouseLeave = () => {
      mouse.targetX = 0
      mouse.targetY = 0
    }

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    // Node definitions (3D coordinate space)
    const baseNodes = [
      {
        id: 'adviser',
        x: 0,
        y: 0,
        z: 0,
        radius: 28,
        color: '#6D45E8',
        glow: 'rgba(109, 69, 232, 0.45)',
        label: 'Service Adviser',
        sub: 'You',
        textColor: '#FFFFFF',
        isCenter: true,
      },
      {
        id: 'customer-1',
        x: -190,
        y: -85,
        z: 40,
        radius: 20,
        color: '#F45BA5',
        glow: 'rgba(244, 91, 165, 0.4)',
        label: 'Customer',
        sub: 'Personal Need',
        textColor: '#FFFFFF',
      },
      {
        id: 'customer-2',
        x: -170,
        y: 110,
        z: -30,
        radius: 20,
        color: '#F45BA5',
        glow: 'rgba(244, 91, 165, 0.4)',
        label: 'Business',
        sub: 'Client Need',
        textColor: '#FFFFFF',
      },
      {
        id: 'healthcare',
        x: 180,
        y: -115,
        z: 50,
        radius: 22,
        color: '#0B6B5B',
        glow: 'rgba(11, 107, 91, 0.4)',
        label: 'Healthcare',
        sub: 'Provider',
        textColor: '#FFFFFF',
      },
      {
        id: 'education',
        x: 205,
        y: 10,
        z: -45,
        radius: 22,
        color: '#5B3FD9',
        glow: 'rgba(91, 63, 217, 0.4)',
        label: 'Education',
        sub: 'Provider',
        textColor: '#FFFFFF',
      },
      {
        id: 'professional',
        x: 165,
        y: 135,
        z: 35,
        radius: 22,
        color: '#64DCE8',
        glow: 'rgba(100, 220, 232, 0.4)',
        label: 'Professional',
        sub: 'Services',
        textColor: '#15152A',
      },
      {
        id: 'knowledge',
        x: 15,
        y: 160,
        z: 20,
        radius: 19,
        color: '#D7F56B',
        glow: 'rgba(215, 245, 107, 0.5)',
        label: 'Knowledge Hub',
        sub: 'Tools & Guidance',
        textColor: '#15152A',
      },
    ]

    // Graph connection links
    const connections = [
      { from: 'customer-1', to: 'adviser', color: '#F45BA5', speed: 0.0035 },
      { from: 'customer-2', to: 'adviser', color: '#F45BA5', speed: 0.004 },
      { from: 'adviser', to: 'healthcare', color: '#0B6B5B', speed: 0.003 },
      { from: 'adviser', to: 'education', color: '#5B3FD9', speed: 0.0032 },
      { from: 'adviser', to: 'professional', color: '#64DCE8', speed: 0.0038 },
      { from: 'knowledge', to: 'adviser', color: '#D7F56B', speed: 0.0025 },
    ]

    // Ambient floating particles
    const ambientParticles = Array.from({ length: 16 }, (_, i) => ({
      x: (Math.random() - 0.5) * 440,
      y: (Math.random() - 0.5) * 360,
      z: (Math.random() - 0.5) * 160,
      radius: 2 + Math.random() * 2,
      speed: 0.001 + Math.random() * 0.002,
      phase: i * 0.5,
      color: ['#6D45E8', '#F45BA5', '#64DCE8', '#D7F56B'][i % 4],
    }))

    // Size canvas to display container
    const handleResize = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = window.devicePixelRatio || 1

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(dpr, dpr)

      if (prefersReducedMotion) {
        drawFrame(0)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })

    // Observe visibility to pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting
          if (isVisible && !prefersReducedMotion) {
            lastTime = performance.now()
            animate(lastTime)
          }
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    let lastTime = performance.now()
    let rotY = 0
    let rotX = 0

    // Render loop
    const drawFrame = (timestamp) => {
      ctx.clearRect(0, 0, width, height)

      // Spring damping mouse tilt
      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      const angleY = rotY + mouse.x
      const angleX = rotX + mouse.y

      const centerX = width / 2
      const centerY = height / 2
      const fov = 520

      // Project 3D coordinate to 2D screen
      const project = (x, y, z) => {
        // Rotate around Y
        const cosY = Math.cos(angleY)
        const sinY = Math.sin(angleY)
        const x1 = x * cosY - z * sinY
        const z1 = z * cosY + x * sinY

        // Rotate around X
        const cosX = Math.cos(angleX)
        const sinX = Math.sin(angleX)
        const y2 = y * cosX - z1 * sinX
        const z2 = z1 * cosX + y * sinX

        const scale = fov / (fov + z2)
        return {
          screenX: centerX + x1 * scale,
          screenY: centerY + y2 * scale,
          scale: Math.max(0.4, scale),
          depth: z2,
        }
      }

      // Draw subtle ambient background glow
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, Math.min(width, height) * 0.6)
      bgGlow.addColorStop(0, 'rgba(109, 69, 232, 0.07)')
      bgGlow.addColorStop(0.6, 'rgba(244, 91, 165, 0.03)')
      bgGlow.addColorStop(1, 'rgba(247, 248, 252, 0)')
      ctx.fillStyle = bgGlow
      ctx.fillRect(0, 0, width, height)

      // Draw ambient floating particles
      ambientParticles.forEach((p) => {
        const oscY = p.y + Math.sin(timestamp * p.speed + p.phase) * 15
        const oscX = p.x + Math.cos(timestamp * p.speed * 0.8 + p.phase) * 12
        const pt = project(oscX, oscY, p.z)

        ctx.beginPath()
        ctx.arc(pt.screenX, pt.screenY, p.radius * pt.scale, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.35 * pt.scale
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Project all main nodes
      const projectedMap = {}
      baseNodes.forEach((node) => {
        const floatOffset = Math.sin(timestamp * 0.0015 + node.x) * 6
        projectedMap[node.id] = {
          ...node,
          ...project(node.x, node.y + floatOffset, node.z),
        }
      })

      // Draw connection lines & traveling energy packets
      connections.forEach((conn) => {
        const from = projectedMap[conn.from]
        const to = projectedMap[conn.to]
        if (!from || !to) return

        // Connecting stroke
        ctx.beginPath()
        ctx.moveTo(from.screenX, from.screenY)
        ctx.lineTo(to.screenX, to.screenY)
        const lineGrad = ctx.createLinearGradient(from.screenX, from.screenY, to.screenX, to.screenY)
        lineGrad.addColorStop(0, from.color)
        lineGrad.addColorStop(1, to.color)
        ctx.strokeStyle = lineGrad
        ctx.lineWidth = 2 * Math.min(from.scale, to.scale)
        ctx.globalAlpha = 0.32
        ctx.stroke()
        ctx.globalAlpha = 1

        // Traveling pulse packet
        if (!prefersReducedMotion) {
          const tNorm = ((timestamp * conn.speed) % 1 + 1) % 1
          const pulseX = from.screenX + (to.screenX - from.screenX) * tNorm
          const pulseY = from.screenY + (to.screenY - from.screenY) * tNorm
          const pulseScale = (from.scale + to.scale) / 2

          ctx.beginPath()
          ctx.arc(pulseX, pulseY, 4 * pulseScale, 0, Math.PI * 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.shadowColor = conn.color
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Sort nodes by depth for proper z-layer rendering
      const sortedNodes = Object.values(projectedMap).sort((a, b) => a.depth - b.depth)

      // Draw nodes and badges
      sortedNodes.forEach((node) => {
        const r = node.radius * node.scale

        // Outer pulsing aura for central adviser
        if (node.isCenter && !prefersReducedMotion) {
          const auraRadius = r + 8 + Math.sin(timestamp * 0.003) * 4
          ctx.beginPath()
          ctx.arc(node.screenX, node.screenY, auraRadius, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(109, 69, 232, 0.16)'
          ctx.fill()
        }

        // Ambient node glow
        ctx.beginPath()
        ctx.arc(node.screenX, node.screenY, r + 4, 0, Math.PI * 2)
        ctx.fillStyle = node.glow
        ctx.fill()

        // Main node sphere
        ctx.beginPath()
        ctx.arc(node.screenX, node.screenY, r, 0, Math.PI * 2)
        const sphereGrad = ctx.createRadialGradient(
          node.screenX - r * 0.3,
          node.screenY - r * 0.3,
          r * 0.1,
          node.screenX,
          node.screenY,
          r
        )
        sphereGrad.addColorStop(0, '#FFFFFF')
        sphereGrad.addColorStop(0.3, node.color)
        sphereGrad.addColorStop(1, node.color)
        ctx.fillStyle = sphereGrad
        ctx.shadowColor = 'rgba(21, 21, 42, 0.18)'
        ctx.shadowBlur = 12 * node.scale
        ctx.shadowOffsetY = 4 * node.scale
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        // Inner core ring
        ctx.beginPath()
        ctx.arc(node.screenX, node.screenY, r * 0.45, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
        ctx.fill()

        // Badge pill with label & subtitle
        const labelText = node.label
        const subText = node.sub
        const fontSize = Math.round(11 * Math.max(0.85, node.scale))
        const subFontSize = Math.round(9 * Math.max(0.85, node.scale))

        ctx.font = `700 ${fontSize}px 'Plus Jakarta Sans', sans-serif`
        const textWidth = ctx.measureText(labelText).width
        const pillWidth = Math.max(textWidth + 18, 76)
        const pillHeight = fontSize + subFontSize + 12
        const pillX = node.screenX - pillWidth / 2
        const pillY = node.screenY + r + 8

        // Pill background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.94)'
        ctx.strokeStyle = 'rgba(220, 225, 234, 0.9)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 8)
        ctx.fill()
        ctx.stroke()

        // Pill text
        ctx.fillStyle = '#15152A'
        ctx.textAlign = 'center'
        ctx.fillText(labelText, node.screenX, pillY + fontSize + 3)

        ctx.font = `500 ${subFontSize}px 'Plus Jakarta Sans', sans-serif`
        ctx.fillStyle = '#596777'
        ctx.fillText(subText, node.screenX, pillY + fontSize + subFontSize + 6)
      })
    }

    // Animation loop
    const animate = (timestamp) => {
      if (!isVisible || prefersReducedMotion) return

      lastTime = timestamp

      // Gentle continuous 3D rotation
      rotY += 0.002
      rotX = Math.sin(timestamp * 0.0008) * 0.1

      drawFrame(timestamp)
      animationFrameId = requestAnimationFrame(animate)
    }

    if (prefersReducedMotion) {
      drawFrame(0)
    } else {
      lastTime = performance.now()
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      motionQuery.removeEventListener('change', handleMotionChange)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[520px] flex items-center justify-center rounded-3xl overflow-hidden select-none" ref={containerRef} aria-hidden="true" role="presentation">
      {hasWebGLOrCanvas ? (
        <canvas ref={canvasRef} className="w-full h-full block" />
      ) : null}

      {/* Static Accessible Visual Fallback if Canvas Fails */}
      <noscript>
        <div className="w-full h-full grid grid-cols-2 gap-4 p-6 bg-white border border-border rounded-3xl">
          <div className="col-span-full bg-brand-violet text-white p-3 rounded-xl font-semibold text-center">Service Adviser (You)</div>
          <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-ink text-center">Customers & Businesses</div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-ink text-center">Healthcare Providers</div>
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-ink text-center">Education Providers</div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-ink text-center">Professional Services</div>
          <div className="col-span-full bg-brand-lime/20 border border-brand-lime/50 text-ink p-3 rounded-xl text-center">Knowledge Platform</div>
        </div>
      </noscript>
    </div>
  )
}
