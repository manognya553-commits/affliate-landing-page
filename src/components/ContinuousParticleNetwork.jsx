import React, { useRef, useEffect } from 'react'

/**
 * ContinuousParticleNetwork
 * 
 * Recreates the exact particle-network background component from the reference recording:
 * 1. Full-bleed pale ivory/near-white particle field spanning the combined Hero and Why Join sections.
 * 2. Dense, intricate 3D translucent violet spherical network mesh (hundreds of points connected by delicate lines).
 * 3. Floating violet square/diamond particles drifting at varying depths, sizes, and speeds.
 * 4. Scroll-linked behavior: As the page scrolls, the sphere smoothly shifts, rotates, and scales across both sections.
 * 5. High-performance Canvas renderer with DPR scaling, RAF pause on scroll-out, and prefers-reduced-motion support.
 */
export default function ContinuousParticleNetwork({ containerId = 'hero-whyjoin-universe' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = document.getElementById(containerId) || canvas.parentElement
    if (!container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId = null
    let isVisible = true
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

    // Scroll state tracking
    const scrollState = {
      currentProgress: 0,
      targetProgress: 0,
      scrollY: window.scrollY || 0,
      velocity: 0,
    }

    // Mouse parallax tracking
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    }

    const handleMouseMove = (e) => {
      const ww = window.innerWidth || 1
      const wh = window.innerHeight || 1
      mouse.targetX = (e.clientX / ww - 0.5) * 2 // -1 to 1
      mouse.targetY = (e.clientY / wh - 0.5) * 2
    }

    const handleMouseLeave = () => {
      mouse.targetX = 0
      mouse.targetY = 0
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    // Calculate scroll progress through the combined container
    const updateScrollProgress = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const containerTop = rect.top + window.scrollY
      const containerHeight = rect.height
      const currentScroll = window.scrollY
      const viewportHeight = window.innerHeight || 800

      // Progress 0 when container top is at viewport top
      // Progress 1 when container bottom reaches viewport bottom
      const totalScrollable = Math.max(1, containerHeight - viewportHeight)
      const scrolled = currentScroll - containerTop
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable))

      scrollState.targetProgress = rawProgress
      scrollState.scrollY = currentScroll
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()

    // ----------------------------------------------------
    // GEOMETRY GENERATION
    // ----------------------------------------------------

    // 1. Central 3D Spherical Mesh Generator (Fibonacci sphere + Latitude rings)
    const generateSphereGeometry = (isMobile) => {
      const numPoints = isMobile ? 240 : 420
      const points = []
      const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle ~2.39996

      // A. Fibonacci lattice on unit sphere
      for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2 // from 1 to -1
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
        const theta = phi * i

        const x = Math.cos(theta) * radiusAtY
        const z = Math.sin(theta) * radiusAtY

        // Add subtle radial pulsation frequency and node weight
        const pulseFreq = 0.0015 + (i % 7) * 0.0004
        const isKeyNode = i % 14 === 0 // Special glowing vertex

        points.push({
          x,
          y,
          z,
          pulseFreq,
          isKeyNode,
          phase: (i * 0.37) % (Math.PI * 2),
        })
      }

      // Precalculate connectable pairs within sphere (distance threshold in unit sphere)
      // Unit sphere distance threshold: d < 0.29 gives intricate fine wireframe mesh
      const maxDistUnit = isMobile ? 0.32 : 0.27
      const maxDistSq = maxDistUnit * maxDistUnit
      const connections = []

      for (let i = 0; i < points.length; i++) {
        let count = 0
        const maxPerPoint = isMobile ? 3 : 5
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dz = points[i].z - points[j].z
          const dsq = dx * dx + dy * dy + dz * dz
          if (dsq < maxDistSq) {
            connections.push({ a: i, b: j, dist: Math.sqrt(dsq) })
            count++
            if (count >= maxPerPoint) break
          }
        }
      }

      // B. Latitude rings for the distinct technical globe wireframe look
      const numRings = isMobile ? 6 : 10
      const ringSteps = isMobile ? 20 : 32
      const rings = []

      for (let r = 1; r <= numRings; r++) {
        const ringY = -0.85 + (r / (numRings + 1)) * 1.7
        const ringRad = Math.sqrt(Math.max(0, 1 - ringY * ringY))
        const ringPoints = []

        for (let s = 0; s < ringSteps; s++) {
          const angle = (s / ringSteps) * Math.PI * 2
          ringPoints.push({
            x: Math.cos(angle) * ringRad,
            y: ringY,
            z: Math.sin(angle) * ringRad,
          })
        }
        rings.push(ringPoints)
      }

      return { points, connections, rings }
    }

    // 2. Floating Violet Square/Diamond Particles
    const generateFloatingSquares = (w, h, isMobile) => {
      const count = isMobile ? 22 : 36
      const squares = []

      for (let i = 0; i < count; i++) {
        squares.push({
          relX: Math.random(), // 0 to 1 relative to container width
          relY: Math.random(), // 0 to 1 relative to container height
          z: (Math.random() - 0.5) * 300, // Depth layer (-150 to +150)
          size: Math.floor(Math.random() * (isMobile ? 12 : 18)) + 7, // 7px to 25px
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.008,
          driftX: (Math.random() - 0.5) * 0.25,
          driftY: (Math.random() - 0.5) * 0.25,
          opacity: 0.22 + Math.random() * 0.45,
          pulseRate: 0.001 + Math.random() * 0.002,
          hasInnerDot: Math.random() > 0.4,
        })
      }
      return squares
    }

    // 3. Ambient Full-Screen Particle Field
    const generateAmbientParticles = (w, h, isMobile) => {
      const count = isMobile ? 80 : 180
      const particles = []

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 0.8, // 0.8px to 2.3px
          alpha: 0.2 + Math.random() * 0.45,
          seed: Math.random() * 100,
        })
      }
      return particles
    }

    let sphereData = generateSphereGeometry(window.innerWidth < 768)
    let floatingSquares = generateFloatingSquares(width, height, window.innerWidth < 768)
    let ambientParticles = generateAmbientParticles(width, height, window.innerWidth < 768)

    // Handle Resize & Canvas Resolution
    const handleResize = () => {
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      const w = Math.max(320, rect.width || container.clientWidth || window.innerWidth)
      const h = Math.max(600, rect.height || container.clientHeight)

      width = w
      height = h
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      const isMobile = width < 768
      sphereData = generateSphereGeometry(isMobile)
      floatingSquares = generateFloatingSquares(width, height, isMobile)
      ambientParticles = generateAmbientParticles(width, height, isMobile)

      updateScrollProgress()
    }

    handleResize()
    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)
    window.addEventListener('resize', handleResize, { passive: true })

    // Pause RAF when the combined section is not visible
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting
        })
      },
      { rootMargin: '200px' }
    )
    intersectionObserver.observe(container)

    // ----------------------------------------------------
    // ANIMATION & RENDER LOOP
    // ----------------------------------------------------

    let rotY = 0
    let rotX = 0.35 // Natural downward pitch angle (~20 degrees)
    let lastTime = performance.now()

    const render = (time) => {
      if (!isVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      const _dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      // Smooth scroll lerp (eased progression)
      scrollState.currentProgress += (scrollState.targetProgress - scrollState.currentProgress) * 0.08
      const p = scrollState.currentProgress

      // Mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Continuous sphere rotation (with slight acceleration on scroll)
      if (!prefersReducedMotion) {
        rotY += 0.0035 + Math.abs(scrollState.targetProgress - scrollState.currentProgress) * 0.03
        rotX = 0.32 + Math.sin(time * 0.0006) * 0.08 + mouse.y * 0.15
      }

      // Clear full canvas
      ctx.clearRect(0, 0, width, height)

      const isMobile = width < 768
      const viewportH = window.innerHeight || 800

      // Calculate the sphere's viewport-relative position and map to canvas absolute coordinates
      // At p = 0 (Hero top):
      // Desktop: Sphere sits around X: 64%, viewport Y: 44%
      // Mobile: Sphere sits around X: 50%, viewport Y: 32%
      // As p increases (scrolling down into Why Join):
      // The sphere drifts smoothly towards center (X: 50%) and glides gracefully down through Why Join
      const baseHeroX = isMobile ? width * 0.5 : width * 0.62
      const baseWhyJoinX = isMobile ? width * 0.5 : width * 0.48
      const targetSphereX = baseHeroX + (baseWhyJoinX - baseHeroX) * p + mouse.x * 24

      // Current active scroll offset relative to container top
      const containerRect = container.getBoundingClientRect()
      const scrollRelativeToContainer = -containerRect.top

      // Sphere viewport center oscillates smoothly between 42% and 58% of viewport height
      const viewportTargetY = viewportH * (0.42 + p * 0.16)
      const targetSphereY = scrollRelativeToContainer + viewportTargetY + mouse.y * 20

      // Base radius with dynamic scaling across the scroll journey
      const baseRadius = isMobile ? 120 : 190
      // Sphere gently expands as you scroll into the narrative, matching reference frame 2 & 3
      const currentRadius = baseRadius * (1.0 + Math.sin(p * Math.PI) * 0.18)

      // ----------------------------------------------------
      // LAYER 1: AMBIENT FULL-BLEED PARTICLE FIELD & LINKS
      // ----------------------------------------------------
      ctx.save()
      const maxAmbientDist = isMobile ? 65 : 85
      const maxAmbientDistSq = maxAmbientDist * maxAmbientDist

      // Update and draw ambient particles
      for (let i = 0; i < ambientParticles.length; i++) {
        const pt = ambientParticles[i]

        if (!prefersReducedMotion) {
          pt.x += pt.vx
          pt.y += pt.vy

          // Wrap around canvas edges
          if (pt.x < 0) pt.x = width
          if (pt.x > width) pt.x = 0
          if (pt.y < 0) pt.y = height
          if (pt.y > height) pt.y = 0
        }

        // Only draw connections for particles within current viewport vertical range (+- 400px)
        const inViewport =
          pt.y >= scrollRelativeToContainer - 200 &&
          pt.y <= scrollRelativeToContainer + viewportH + 200

        if (inViewport) {
          // Point
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(107, 60, 255, ${pt.alpha})`
          ctx.fill()

          // Faint connections to nearby ambient points
          for (let j = i + 1; j < Math.min(i + 12, ambientParticles.length); j++) {
            const pt2 = ambientParticles[j]
            const dx = pt.x - pt2.x
            const dy = pt.y - pt2.y
            const dsq = dx * dx + dy * dy
            if (dsq < maxAmbientDistSq) {
              const dist = Math.sqrt(dsq)
              const lineAlpha = (1 - dist / maxAmbientDist) * 0.12
              ctx.beginPath()
              ctx.moveTo(pt.x, pt.y)
              ctx.lineTo(pt2.x, pt2.y)
              ctx.strokeStyle = `rgba(107, 60, 255, ${lineAlpha})`
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }
      }
      ctx.restore()

      // ----------------------------------------------------
      // LAYER 2: TRANSLUCENT RADIAL GLOW BEHIND SPHERICAL MESH
      // ----------------------------------------------------
      ctx.save()
      const glowGrad = ctx.createRadialGradient(
        targetSphereX,
        targetSphereY,
        currentRadius * 0.1,
        targetSphereX,
        targetSphereY,
        currentRadius * 1.9
      )
      glowGrad.addColorStop(0, 'rgba(107, 60, 255, 0.085)')
      glowGrad.addColorStop(0.4, 'rgba(107, 60, 255, 0.035)')
      glowGrad.addColorStop(0.75, 'rgba(230, 220, 255, 0.015)')
      glowGrad.addColorStop(1, 'rgba(250, 247, 242, 0)')

      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(targetSphereX, targetSphereY, currentRadius * 1.9, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ----------------------------------------------------
      // LAYER 3: 3D SPHERICAL WIREFRAME & POINT MESH
      // ----------------------------------------------------
      // Rotation math helper (Rotate around X then Y)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)

      const focalLength = 520

      const projectPoint = (px, py, pz, radius) => {
        // Scale by radius
        const rx = px * radius
        const ry = py * radius
        const rz = pz * radius

        // 1. Rotate around X axis
        const y1 = ry * cosX - rz * sinX
        const z1 = ry * sinX + rz * cosX

        // 2. Rotate around Y axis
        const x2 = rx * cosY + z1 * sinY
        const z2 = -rx * sinY + z1 * cosY

        // Perspective factor
        const scale = focalLength / (focalLength + z2)
        const projX = targetSphereX + x2 * scale
        const projY = targetSphereY + y1 * scale

        return { x: projX, y: projY, z: z2, scale }
      }

      // Project all latitude rings
      ctx.save()
      ctx.lineWidth = 0.55
      for (let r = 0; r < sphereData.rings.length; r++) {
        const ring = sphereData.rings[r]
        ctx.beginPath()
        let started = false

        for (let s = 0; s <= ring.length; s++) {
          const pt = ring[s % ring.length]
          const proj = projectPoint(pt.x, pt.y, pt.z, currentRadius)

          if (!started) {
            ctx.moveTo(proj.x, proj.y)
            started = true
          } else {
            ctx.lineTo(proj.x, proj.y)
          }
        }
        // Rings are faint translucent violet
        ctx.strokeStyle = 'rgba(107, 60, 255, 0.08)'
        ctx.stroke()
      }
      ctx.restore()

      // Project all sphere points
      const projectedPoints = new Array(sphereData.points.length)
      for (let i = 0; i < sphereData.points.length; i++) {
        const pUnit = sphereData.points[i]
        projectedPoints[i] = projectPoint(pUnit.x, pUnit.y, pUnit.z, currentRadius)
      }

      // Draw connections between sphere nodes
      ctx.save()
      for (let i = 0; i < sphereData.connections.length; i++) {
        const conn = sphereData.connections[i]
        const p1 = projectedPoints[conn.a]
        const p2 = projectedPoints[conn.b]

        // Depth-based alpha: front lines are clearer, back lines are ethereal
        const avgZ = (p1.z + p2.z) * 0.5
        const normZ = (avgZ + currentRadius) / (currentRadius * 2) // 0 (far) to 1 (near)
        const lineAlpha = 0.05 + normZ * 0.22

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(107, 60, 255, ${lineAlpha})`
        ctx.lineWidth = 0.65 + normZ * 0.35
        ctx.stroke()
      }
      ctx.restore()

      // Draw sphere points/nodes
      ctx.save()
      for (let i = 0; i < projectedPoints.length; i++) {
        const pProj = projectedPoints[i]
        const pUnit = sphereData.points[i]

        const normZ = (pProj.z + currentRadius) / (currentRadius * 2) // 0 to 1
        const ptAlpha = 0.15 + normZ * 0.65
        const ptRadius = Math.max(0.7, (0.9 + normZ * 1.5) * pProj.scale)

        ctx.beginPath()
        ctx.arc(pProj.x, pProj.y, ptRadius, 0, Math.PI * 2)

        if (pUnit.isKeyNode) {
          // Key pulsing node with subtle lavender glow
          const pulse = Math.sin(time * pUnit.pulseFreq + pUnit.phase) * 0.5 + 0.5
          ctx.fillStyle = `rgba(142, 102, 255, ${0.4 + pulse * 0.5})`
          ctx.fill()

          if (normZ > 0.6) {
            // Tiny outer aura for front key nodes
            ctx.beginPath()
            ctx.arc(pProj.x, pProj.y, ptRadius * 2.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(107, 60, 255, ${0.12 * pulse})`
            ctx.fill()
          }
        } else {
          ctx.fillStyle = `rgba(107, 60, 255, ${ptAlpha})`
          ctx.fill()
        }
      }
      ctx.restore()

      // ----------------------------------------------------
      // LAYER 4: FLOATING VIOLET SQUARE / DIAMOND PARTICLES
      // ----------------------------------------------------
      ctx.save()
      for (let i = 0; i < floatingSquares.length; i++) {
        const sq = floatingSquares[i]

        // Drift motion
        if (!prefersReducedMotion) {
          sq.rotation += sq.rotSpeed
        }

        // Float oscillation around base coordinates
        const timeScale = time * sq.pulseRate
        const offsetX = Math.sin(timeScale + i) * 18
        const offsetY = Math.cos(timeScale * 0.8 + i) * 22

        // Canvas position
        const posX = sq.relX * width + offsetX + mouse.x * 15
        const posY = sq.relY * height + offsetY + mouse.y * 12

        // Render if within or near viewport
        const inView =
          posY >= scrollRelativeToContainer - 250 &&
          posY <= scrollRelativeToContainer + viewportH + 250

        if (inView) {
          ctx.save()
          ctx.translate(posX, posY)
          ctx.rotate(sq.rotation)

          const halfSize = sq.size * 0.5
          const sqAlpha = sq.opacity * (0.8 + Math.sin(timeScale) * 0.2)

          // 1. Semi-translucent violet fill
          ctx.fillStyle = `rgba(107, 60, 255, ${sqAlpha * 0.35})`
          ctx.fillRect(-halfSize, -halfSize, sq.size, sq.size)

          // 2. Crisp hairline stroke
          ctx.strokeStyle = `rgba(107, 60, 255, ${sqAlpha * 0.75})`
          ctx.lineWidth = 1.0
          ctx.strokeRect(-halfSize, -halfSize, sq.size, sq.size)

          // 3. Inner accent dot on select squares
          if (sq.hasInnerDot) {
            ctx.fillStyle = `rgba(142, 102, 255, ${sqAlpha})`
            ctx.fillRect(-1.5, -1.5, 3, 3)
          }

          ctx.restore()
        }
      }
      ctx.restore()

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    // Start loop
    animationFrameId = requestAnimationFrame(render)

    // Cleanup on unmount
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      motionQuery.removeEventListener('change', handleMotionChange)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [containerId])

  return (
    <canvas
      ref={canvasRef}
      id="continuous-particle-network-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
