import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * WhyJoinNetworkCanvas
 * Restrained, elegant particle-network visual that seamlessly receives the flow
 * from the Hero network and reinforces the section's message about everyday recommendations
 * and genuine connections behind the Why Join narrative and 3 value pillars.
 */
export default function WhyJoinNetworkCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

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

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let prefersReducedMotion = motionQuery.matches
    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches
    }
    motionQuery.addEventListener('change', handleMotionChange)

    const handleResize = () => {
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      width = rect.width || window.innerWidth
      height = rect.height || 800
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

    // Generate ambient network particles across the Why Join section
    const isMobile = width < 768
    const particleCount = isMobile ? 22 : 44

    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.35 + 0.15,
        color: i % 3 === 0 ? '#6B3CFF' : i % 3 === 1 ? '#FF4FA3' : '#D6F36B',
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.0015,
      })
    }

    // 3 Constellation clusters corresponding to the 3 Value Pillars
    const getClusterCenters = () => {
      if (width >= 1024) {
        return [
          { x: width * 0.22, y: height * 0.78, color: '#6B3CFF', labelColor: '#6B3CFF' },
          { x: width * 0.5, y: height * 0.78, color: '#FF4FA3', labelColor: '#FF4FA3' },
          { x: width * 0.78, y: height * 0.78, color: '#16A34A', labelColor: '#16A34A' },
        ]
      } else {
        return [
          { x: width * 0.3, y: height * 0.65, color: '#6B3CFF', labelColor: '#6B3CFF' },
          { x: width * 0.7, y: height * 0.78, color: '#FF4FA3', labelColor: '#FF4FA3' },
          { x: width * 0.5, y: height * 0.9, color: '#16A34A', labelColor: '#16A34A' },
        ]
      }
    }

    // ScrollTrigger to tie entrance of Why Join with constellation illumination
    const trigger = ScrollTrigger.create({
      trigger: '#why-join',
      start: 'top 85%',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: (self) => {
        scrollProgress = self.progress
      },
    })

    // IntersectionObserver to pause loop when outside viewport
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

    const render = (time) => {
      if (!isVisible && !prefersReducedMotion) {
        animationFrameId = null
        return
      }

      ctx.clearRect(0, 0, width, height)

      const clusters = getClusterCenters()

      // 1. Draw top receiving flow from Hero (subtle incoming stream paths)
      const streamCount = isMobile ? 4 : 7
      for (let s = 0; s < streamCount; s++) {
        const startX = width * (0.45 + (s / streamCount) * 0.45)
        const targetCluster = clusters[s % clusters.length]
        const progressMod = (scrollProgress * 1.5 + (s * 0.15)) % 1

        const currentY = progressMod * (height * 0.65)
        const currentX = startX + (targetCluster.x - startX) * progressMod

        // Faint guide spline
        ctx.beginPath()
        ctx.moveTo(startX, 0)
        ctx.quadraticCurveTo(startX + 30, height * 0.3, targetCluster.x, targetCluster.y)
        ctx.strokeStyle = s % 2 === 0 ? 'rgba(107, 60, 255, 0.08)' : 'rgba(255, 79, 163, 0.06)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 6])
        ctx.stroke()
        ctx.setLineDash([])

        // Subtle moving packet
        if (!prefersReducedMotion && progressMod > 0.05 && progressMod < 0.95) {
          ctx.beginPath()
          ctx.arc(currentX, currentY, 2.2, 0, Math.PI * 2)
          ctx.fillStyle = s % 2 === 0 ? 'rgba(107, 60, 255, 0.6)' : 'rgba(255, 79, 163, 0.6)'
          ctx.fill()
        }
      }

      // 2. Draw connections between nearby particles (restrained threshold)
      const maxDistance = isMobile ? 80 : 120
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18 * (0.8 + scrollProgress * 0.5)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(107, 60, 255, ${alpha})`
            ctx.lineWidth = 0.9
            ctx.stroke()
          }
        }
      }

      // 3. Render ambient drifting particles
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += Math.sin(time * p.speed + p.phase) * 0.45 + p.vx
          p.y += Math.cos(time * p.speed + p.phase) * 0.45 + p.vy

          // Wrap bounds smoothly
          if (p.x < 0) p.x = width
          if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          if (p.y > height) p.y = 0
        }

        const pulse = 0.8 + 0.3 * Math.sin(time * p.speed * 2 + p.phase)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * (0.7 + scrollProgress * 0.3)
        ctx.fill()
        ctx.globalAlpha = 1.0
      })

      // 4. Render the 3 Pillar Constellation Nodes with soft radiant glow
      clusters.forEach((cluster, idx) => {
        const clusterPulse = 1 + 0.15 * Math.sin(time * 0.002 + idx * 2)
        const glowRadius = (isMobile ? 32 : 46) * clusterPulse

        // Radial diffuse halo
        const grad = ctx.createRadialGradient(
          cluster.x,
          cluster.y,
          2,
          cluster.x,
          cluster.y,
          glowRadius
        )
        grad.addColorStop(0, `${cluster.color}40`)
        grad.addColorStop(0.5, `${cluster.color}15`)
        grad.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(cluster.x, cluster.y, glowRadius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core bright node
        ctx.beginPath()
        ctx.arc(cluster.x, cluster.y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = cluster.color
        ctx.shadowColor = cluster.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0

        // Inter-cluster connecting filament
        if (idx < clusters.length - 1) {
          const nextCluster = clusters[idx + 1]
          ctx.beginPath()
          ctx.moveTo(cluster.x, cluster.y)
          ctx.quadraticCurveTo(
            (cluster.x + nextCluster.x) * 0.5,
            cluster.y - 20,
            nextCluster.x,
            nextCluster.y
          )
          ctx.strokeStyle = 'rgba(107, 60, 255, 0.15)'
          ctx.lineWidth = 1.2
          ctx.stroke()
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
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      motionQuery.removeEventListener('change', handleMotionChange)
      io.disconnect()
      trigger.kill()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none -z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
