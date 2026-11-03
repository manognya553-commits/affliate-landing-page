import React, { useRef, useEffect } from 'react'

/**
 * ParticleNetworkCanvas
 *
 * Full-bleed, continuous particle-network background component matching the reference
 * recording (@speed innovations / atspeedinnovations.com):
 *
 * 1. Full-screen particle field spanning Hero and Why Join sections without boundaries.
 * 2. Large, translucent 3D spherical particle-network mesh (Fibonacci sphere) with
 *    hundreds of interconnected nodes, organic 3D rotation, and depth fading.
 * 3. Floating violet diamond/square particles of varied sizes, drifting independently
 *    with subtle parallax and sinusoidal float.
 * 4. Ambient constellation particle network with delicate proximity lines.
 * 5. Scroll-linked behavior: composition smoothly translates and rotates as the user
 *    scrolls from Hero into Why Join, and naturally reverses on upward scroll.
 * 6. Pale ivory/near-white atmosphere (#FAF8FC) with soft violet (#6B3CFF, #8B5CF6, #A78BFA) accents.
 * 7. Non-interactive (pointer-events-none), performant, pausing when off-screen.
 */
export default function ParticleNetworkCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId
    let isRunning = true
    let width = 0
    let height = 0
    let dpr = 1

    // Motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionQuery.matches
    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // Interactive mouse parallax (subtle, non-blocking)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e) => {
      if (width <= 0 || height <= 0) return
      mouse.targetX = (e.clientX - width / 2) / (width / 2)
      mouse.targetY = (e.clientY - height / 2) / (height / 2)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Scroll progress relative to parent wrapper
    let currentScrollProgress = 0
    let targetScrollProgress = 0

    const updateScrollProgress = () => {
      const wrapper = document.getElementById('hero-why-join-wrapper')
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      const maxScroll = rect.height - window.innerHeight
      if (maxScroll <= 0) {
        targetScrollProgress = 0
      } else {
        const scrolled = -rect.top
        targetScrollProgress = Math.max(0, Math.min(1, scrolled / maxScroll))
      }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()

    // ------------------------------------------------------------------
    // 1. Fibonacci 3D Spherical Network Geometry
    // ------------------------------------------------------------------
    const NUM_SPHERE_POINTS = 420
    const PHI = Math.PI * (3 - Math.sqrt(5)) // Golden angle ~2.39996 rad
    const spherePoints = []

    for (let i = 0; i < NUM_SPHERE_POINTS; i++) {
      const y = 1 - (i / (NUM_SPHERE_POINTS - 1)) * 2 // from 1 to -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = PHI * i
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY
      spherePoints.push({ x, y, z })
    }

    // Precompute spherical mesh edges (connect points within distance ~0.21 on unit sphere)
    const sphereEdges = []
    const MAX_EDGE_DIST_SQ = 0.21 * 0.21

    for (let i = 0; i < NUM_SPHERE_POINTS; i++) {
      let connections = 0
      for (let j = i + 1; j < NUM_SPHERE_POINTS; j++) {
        const dx = spherePoints[i].x - spherePoints[j].x
        const dy = spherePoints[i].y - spherePoints[j].y
        const dz = spherePoints[i].z - spherePoints[j].z
        const distSq = dx * dx + dy * dy + dz * dz
        if (distSq < MAX_EDGE_DIST_SQ) {
          sphereEdges.push({ i, j, dist: Math.sqrt(distSq) })
          connections++
          if (connections >= 4) break
        }
      }
    }

    // ------------------------------------------------------------------
    // 2. Floating Violet Square Particles (Rotated 45° Diamonds)
    // ------------------------------------------------------------------
    const VIOLET_PALETTE = [
      'rgba(107, 60, 255, ',
      'rgba(124, 58, 237, ',
      'rgba(139, 92, 246, ',
      'rgba(167, 139, 250, ',
    ]

    const NUM_SQUARES = 34
    const squares = []

    const initSquares = (w, h) => {
      squares.length = 0
      for (let i = 0; i < NUM_SQUARES; i++) {
        // Varying sizes: 8-12px (small), 14-20px (medium), 22-32px (large)
        const sizeCategory = Math.random()
        let size
        if (sizeCategory < 0.45) {
          size = 8 + Math.random() * 5 // small
        } else if (sizeCategory < 0.8) {
          size = 14 + Math.random() * 7 // medium
        } else {
          size = 23 + Math.random() * 9 // large prominent squares
        }

        squares.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          baseAlpha: 0.18 + Math.random() * 0.38,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.26,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          angleSpeed: (Math.random() - 0.5) * 0.003,
          floatPhase: Math.random() * Math.PI * 2,
          floatFreq: 0.008 + Math.random() * 0.012,
          floatAmp: 8 + Math.random() * 12,
          parallaxFactor: 0.35 + Math.random() * 0.8,
          colorPrefix: VIOLET_PALETTE[Math.floor(Math.random() * VIOLET_PALETTE.length)],
        })
      }
    }

    // ------------------------------------------------------------------
    // 3. Ambient Full-Screen Constellation Particles
    // ------------------------------------------------------------------
    const NUM_AMBIENT = 180
    const ambientParticles = []

    const initAmbient = (w, h) => {
      ambientParticles.length = 0
      for (let i = 0; i < NUM_AMBIENT; i++) {
        ambientParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.22,
          radius: 1.0 + Math.random() * 1.5,
          alpha: 0.18 + Math.random() * 0.32,
          colorPrefix: VIOLET_PALETTE[Math.floor(Math.random() * VIOLET_PALETTE.length)],
        })
      }
    }

    // ------------------------------------------------------------------
    // Canvas Resize Handler
    // ------------------------------------------------------------------
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      if (squares.length === 0) {
        initSquares(width, height)
        initAmbient(width, height)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Visibility observer to pause RAF when the wrapper is out of viewport
    let isVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting
          if (isVisible && !animationFrameId) {
            render()
          }
        })
      },
      { threshold: 0.01 }
    )

    const wrapper = document.getElementById('hero-why-join-wrapper')
    if (wrapper) {
      observer.observe(wrapper)
    }

    // ------------------------------------------------------------------
    // Animation Loop
    // ------------------------------------------------------------------
    let time = 0
    let rotY = 0.4
    let rotX = 0.22

    const render = () => {
      if (!isRunning) return
      if (!isVisible && !prefersReducedMotion) {
        animationFrameId = null
        return
      }

      time += 0.016

      // Lerp scroll progress for smooth transition
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08
      // Lerp mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Ambient 3D rotation
      if (!prefersReducedMotion) {
        rotY += 0.003
        rotX = 0.22 + Math.sin(time * 0.35) * 0.12
      }

      // Total sphere rotation includes scroll progress and mouse offset
      const curRotY = rotY + currentScrollProgress * 1.5 + mouse.x * 0.25
      const curRotX = rotX + currentScrollProgress * 0.4 - mouse.y * 0.2
      const curRotZ = Math.cos(time * 0.2) * 0.08

      const cosY = Math.cos(curRotY)
      const sinY = Math.sin(curRotY)
      const cosX = Math.cos(curRotX)
      const sinX = Math.sin(curRotX)
      const cosZ = Math.cos(curRotZ)
      const sinZ = Math.sin(curRotZ)

      // Dynamic Sphere Center & Radius (linked to viewport & scroll)
      const isDesktop = width >= 1024
      const sphereRadius = isDesktop
        ? Math.min(width * 0.22, 240)
        : Math.min(width * 0.38, 160)

      // In Hero (scroll=0): right-center on desktop.
      // In Why Join (scroll=1): translates downward and toward center, matching reference recording!
      const startCx = isDesktop ? width * 0.64 : width * 0.5
      const endCx = isDesktop ? width * 0.50 : width * 0.5
      const startCy = isDesktop ? height * 0.48 : height * 0.40
      const endCy = isDesktop ? height * 0.58 : height * 0.52

      const cx = startCx + (endCx - startCx) * currentScrollProgress
      const cy = startCy + (endCy - startCy) * currentScrollProgress

      // Clear frame
      ctx.clearRect(0, 0, width, height)

      // ----------------------------------------------------------------
      // A. Ambient Core Glow for the Sphere (Subtle Translucent Depth)
      // ----------------------------------------------------------------
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereRadius * 1.15)
      coreGrad.addColorStop(0, 'rgba(139, 92, 246, 0.09)')
      coreGrad.addColorStop(0.55, 'rgba(167, 139, 250, 0.035)')
      coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, sphereRadius * 1.15, 0, Math.PI * 2)
      ctx.fill()

      // ----------------------------------------------------------------
      // B. Ambient Constellation Particles & Proximity Lines
      // ----------------------------------------------------------------
      const ambientCount = ambientParticles.length
      for (let i = 0; i < ambientCount; i++) {
        const p = ambientParticles[i]
        if (!prefersReducedMotion) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = width
          if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          if (p.y > height) p.y = 0
        }

        // Draw particle dot
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Proximity lines between close ambient particles
        for (let j = i + 1; j < Math.min(i + 12, ambientCount); j++) {
          const p2 = ambientParticles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const d2 = dx * dx + dy * dy
          if (d2 < 80 * 80) {
            const dist = Math.sqrt(d2)
            const lineAlpha = (1 - dist / 80) * 0.14
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // ----------------------------------------------------------------
      // C. Project 3D Sphere Points to 2D
      // ----------------------------------------------------------------
      const projected = []
      const fov = 380

      for (let i = 0; i < NUM_SPHERE_POINTS; i++) {
        const pt = spherePoints[i]

        // 3D Matrix Rotation (Y -> X -> Z)
        const x1 = pt.x * cosY + pt.z * sinY
        const z1 = -pt.x * sinY + pt.z * cosY
        const y2 = pt.y * cosX - z1 * sinX
        const z2 = pt.y * sinX + z1 * cosX
        const x3 = x1 * cosZ - y2 * sinZ
        const y3 = x1 * sinZ + y2 * cosZ
        const z3 = z2

        // Perspective scale
        const scale = fov / (fov + z3 * sphereRadius)
        const sx = cx + x3 * sphereRadius * scale
        const sy = cy + y3 * sphereRadius * scale

        projected.push({ sx, sy, z: z3, scale })
      }

      // ----------------------------------------------------------------
      // D. Draw Sphere Wireframe Edges (Translucent 3D Depth)
      // ----------------------------------------------------------------
      const numEdges = sphereEdges.length
      for (let e = 0; e < numEdges; e++) {
        const edge = sphereEdges[e]
        const p1 = projected[edge.i]
        const p2 = projected[edge.j]

        const avgZ = (p1.z + p2.z) * 0.5

        // Front vs back face line styling
        if (avgZ > 0) {
          // Front face: crisp translucent violet
          const alpha = 0.22 + avgZ * 0.36
          ctx.strokeStyle = `rgba(107, 60, 255, ${alpha})`
          ctx.lineWidth = 0.85
        } else {
          // Back face: soft lavender depth
          const alpha = 0.05 + (1 + avgZ) * 0.12
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
          ctx.lineWidth = 0.6
        }

        ctx.beginPath()
        ctx.moveTo(p1.sx, p1.sy)
        ctx.lineTo(p2.sx, p2.sy)
        ctx.stroke()
      }

      // ----------------------------------------------------------------
      // E. Draw Sphere Vertices / Nodes
      // ----------------------------------------------------------------
      for (let i = 0; i < NUM_SPHERE_POINTS; i++) {
        const p = projected[i]
        const zNorm = (p.z + 1) * 0.5 // 0 to 1
        const r = (p.z > 0 ? 1.4 : 0.9) * p.scale

        if (p.z > 0) {
          const alpha = 0.35 + zNorm * 0.45
          ctx.fillStyle = `rgba(107, 60, 255, ${alpha})`
        } else {
          const alpha = 0.08 + zNorm * 0.18
          ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`
        }

        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // ----------------------------------------------------------------
      // F. Anchor Lines connecting Sphere Perimeter to Ambient Constellation
      // ----------------------------------------------------------------
      // Connect 6-8 outer sphere nodes to nearby ambient particles
      for (let i = 0; i < 20; i += 3) {
        const sp = projected[i]
        if (sp.z > -0.2 && sp.z < 0.6) {
          // Search closest ambient particle
          for (let j = 0; j < Math.min(30, ambientParticles.length); j++) {
            const ap = ambientParticles[j]
            const dx = sp.sx - ap.x
            const dy = sp.sy - ap.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 40 && dist < 140) {
              const anchorAlpha = (1 - dist / 140) * 0.12
              ctx.strokeStyle = `rgba(107, 60, 255, ${anchorAlpha})`
              ctx.lineWidth = 0.65
              ctx.beginPath()
              ctx.moveTo(sp.sx, sp.sy)
              ctx.lineTo(ap.x, ap.y)
              ctx.stroke()
              break
            }
          }
        }
      }

      // ----------------------------------------------------------------
      // G. Floating Violet Squares (Diamond Particles)
      // ----------------------------------------------------------------
      const numSquares = squares.length
      for (let i = 0; i < numSquares; i++) {
        const sq = squares[i]

        if (!prefersReducedMotion) {
          sq.x += sq.vx
          sq.y += sq.vy
          sq.angle += sq.angleSpeed

          // Wrap horizontally and vertically
          if (sq.x < -40) sq.x = width + 40
          if (sq.x > width + 40) sq.x = -40
          if (sq.y < -40) sq.y = height + 40
          if (sq.y > height + 40) sq.y = -40
        }

        // Sinusoidal organic floating bob
        const floatY = Math.sin(time * 60 * sq.floatFreq + sq.floatPhase) * sq.floatAmp
        const floatX = Math.cos(time * 60 * sq.floatFreq * 0.7 + sq.floatPhase) * (sq.floatAmp * 0.6)

        // Parallax shift based on scroll progress
        const scrollParallaxY = (currentScrollProgress - 0.5) * height * 0.3 * sq.parallaxFactor

        const drawX = sq.x + floatX
        const drawY = sq.y + floatY - scrollParallaxY

        ctx.save()
        ctx.translate(drawX, drawY)
        ctx.rotate(sq.angle)

        // Semi-transparent violet fill
        ctx.fillStyle = `${sq.colorPrefix}${sq.baseAlpha})`
        ctx.fillRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size)

        // Subtle crisp border for depth
        ctx.strokeStyle = `${sq.colorPrefix}${Math.min(1, sq.baseAlpha + 0.15)})`
        ctx.lineWidth = 0.75
        ctx.strokeRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size)

        ctx.restore()
      }

      // ----------------------------------------------------------------
      // H. Subtle Technical Coordinates / Architectural Crosshairs
      // ----------------------------------------------------------------
      const crosshairs = [
        { x: width * 0.12, y: height * 0.22, label: '+ 16° 31\' N' },
        { x: width * 0.88, y: height * 0.18, label: '+ ORIGIN // 01' },
        { x: width * 0.16, y: height * 0.78, label: '+ SYS_ACTIVE' },
        { x: width * 0.84, y: height * 0.82, label: '+ 80° 38\' E' },
      ]

      ctx.font = '10px "JetBrains Mono", ui-monospace, monospace'
      ctx.fillStyle = 'rgba(107, 60, 255, 0.26)'
      ctx.strokeStyle = 'rgba(107, 60, 255, 0.22)'
      ctx.lineWidth = 0.75

      crosshairs.forEach((ch) => {
        // Crosshair mark
        ctx.beginPath()
        ctx.moveTo(ch.x - 4, ch.y)
        ctx.lineTo(ch.x + 4, ch.y)
        ctx.moveTo(ch.x, ch.y - 4)
        ctx.lineTo(ch.x, ch.y + 4)
        ctx.stroke()

        // Label
        ctx.fillText(ch.label, ch.x + 8, ch.y + 3)
      })

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    // Start rendering
    render()

    return () => {
      isRunning = false
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('mousemove', handleMouseMove)
      motionQuery.removeEventListener('change', handleMotionChange)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      aria-hidden="true"
    />
  )
}
