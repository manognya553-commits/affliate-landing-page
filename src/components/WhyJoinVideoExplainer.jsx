import React, { useState, useEffect } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Subtitles,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

// 2 simple acts: Act 1 (People Speaking), Act 2 (Earning Analytics)
const SCENE_DURATION = 7
const TOTAL_SCENES = 2
const TOTAL_DURATION = SCENE_DURATION * TOTAL_SCENES

export default function WhyJoinVideoExplainer() {
  const { lang, copy } = useLanguage()
  const data = copy.soundFamiliar || {}
  const videoData = data.videoExplainer || {}
  const scenes = videoData.scenes || []

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [showCaptions, setShowCaptions] = useState(true)
  const [isCinemaMode, setIsCinemaMode] = useState(false)

  const activeIndex = Math.min(
    Math.floor(currentTime / SCENE_DURATION),
    TOTAL_SCENES - 1
  )
  const activeScene = scenes[activeIndex] || scenes[0] || {}

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= TOTAL_DURATION) {
          return 0 // loop continuously between the 2 scenes
        }
        return Math.round((prev + 0.1) * 10) / 10
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Handle cinema mode escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCinemaMode) {
        setIsCinemaMode(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCinemaMode])

  const togglePlay = () => setIsPlaying((prev) => !prev)
  const restart = () => setCurrentTime(0)

  const jumpToScene = (idx) => {
    setCurrentTime(idx * SCENE_DURATION)
  }

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Render video stage content
  const renderVideoStage = (isCinema = false) => (
    <div
      className={`relative w-full overflow-hidden bg-[#070510] text-white select-none ${
        isCinema
          ? 'h-[75vh] max-h-[720px] rounded-2xl border border-white/15'
          : 'rounded-2xl sm:rounded-3xl border border-[#12101F]/15 shadow-xl'
      } flex flex-col justify-between`}
    >
      {/* Top Telemetry Header Bar */}
      <div className="relative z-20 flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-b from-[#070510]/95 to-transparent">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#10B981]" />
          </span>
          <span className="font-mono text-[9.5px] sm:text-[10.5px] font-bold tracking-wider text-white/80 uppercase">
            {videoData.badge || 'STORY // HOW IT WORKS'} · {activeScene.number || `0${activeIndex + 1}`} OF 02
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-white/70">
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute video guide' : 'Mute video guide'}
            title={isMuted ? 'Sound simulation: muted' : 'Sound simulation: active'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <button
            type="button"
            onClick={() => setShowCaptions((prev) => !prev)}
            className={`p-1 sm:p-1.5 rounded-lg transition-colors font-mono text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 flex items-center gap-1 ${
              showCaptions
                ? 'bg-[#6B3CFF]/40 text-white border border-[#6B3CFF]/60'
                : 'hover:bg-white/10 text-white/60'
            }`}
            aria-label="Toggle closed captions"
            title="Closed captions"
          >
            <Subtitles size={12} />
            <span className="text-[9.5px] sm:text-[10px]">CC</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCinemaMode((prev) => !prev)}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            aria-label={isCinema ? 'Exit cinema mode' : 'Expand cinema mode'}
            title={isCinema ? 'Exit cinema view' : 'Cinema theater view'}
          >
            {isCinema ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Video Scene Visual Content Stage */}
      <div className="relative z-10 flex-1 flex flex-col justify-center min-h-[260px] sm:min-h-[300px]">
        {/* ACT 1: PEOPLE SPEAKING (Human Conversation & Community Trust) */}
        {activeIndex === 0 && (
          <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-4 sm:p-6 overflow-hidden animate-fadeIn">
            {/* Cinematic Background: Real community photo with slow motion scale */}
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/hero-community.jpg"
                alt="Neighbours in friendly conversation"
                className="w-full h-full object-cover object-center filter brightness-[0.72] transform scale-105 transition-transform duration-[7000ms] ease-out"
              />
              {/* Vignette gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070510] via-[#070510]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070510]/80 via-transparent to-transparent" />
            </div>

            {/* In-Video Speaker Tag & Quote Overlay */}
            <div className="relative z-10 flex flex-col gap-2.5 max-w-[520px]">
              {/* Speaker Badge with animated sound equalizer waves */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/15 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[11px] font-bold text-white tracking-wide">
                  {activeScene.speaker}
                </span>
                {/* Visual Audio Wave */}
                <div className="flex items-center gap-0.5 ml-1" aria-hidden="true">
                  <span className="w-0.5 h-3 bg-[#D6F36B] rounded-full animate-pulse" />
                  <span className="w-0.5 h-2 bg-[#D6F36B] rounded-full animate-pulse delay-75" />
                  <span className="w-0.5 h-3.5 bg-[#D6F36B] rounded-full animate-pulse delay-150" />
                  <span className="w-0.5 h-2 bg-[#D6F36B] rounded-full animate-pulse delay-100" />
                </div>
              </div>

              {/* Dialogue Quote Card */}
              <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-[#D6F36B] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={11} />
                  {lang === 'te' ? 'రోజూ జరిగే సంభాషణ' : 'Real Everyday Conversation'}
                </span>
                <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed m-0 italic font-headline">
                  {activeScene.quote}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACT 2: SHOWING ANALYTICS - HOW TO EARN MONEY THROUGH THIS */}
        {activeIndex === 1 && (
          <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] flex flex-col justify-center px-4 sm:px-7 py-3 animate-fadeIn">
            {/* Background radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(107,60,255,0.22),transparent_70%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-3">
              {/* Analytics Top Status Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#10B981]/20 text-[#34D399] flex items-center justify-center">
                    <TrendingUp size={15} />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] text-white/50 uppercase block">
                      {lang === 'te' ? 'పరిచయం & సంపాదన ట్రాకింగ్' : 'Referral & Earning Analytics'}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white m-0">
                      {activeScene.title}
                    </h4>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
                  <CheckCircle2 size={11} />
                  {lang === 'te' ? 'అర్హత సాధించింది' : 'Qualified Referral'}
                </span>
              </div>

              {/* 3-Stage Progress Pipeline Bar (Introduction -> Review -> Payout) */}
              <div className="bg-white/7 border border-white/10 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono text-white/70">
                  <span className="text-[#D6F36B] font-bold">
                    1. {lang === 'te' ? 'పరిచయం' : 'Introduction'}
                  </span>
                  <span className="text-[#34D399] font-bold">
                    2. {lang === 'te' ? 'పరిశీలన' : 'Provider Review'}
                  </span>
                  <span className="text-[#A78BFA] font-bold">
                    3. {lang === 'te' ? 'సంపాదన' : 'Compensation'}
                  </span>
                </div>

                {/* Animated Gradient Progress Track */}
                <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden relative">
                  <div className="h-full w-full bg-gradient-to-r from-[#10B981] via-[#D6F36B] to-[#6B3CFF] rounded-full animate-pulse" />
                </div>
              </div>

              {/* 3 Analytics Metric Cards */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <div className="bg-white/7 border border-white/10 rounded-xl p-2 sm:p-2.5 flex flex-col gap-0.5">
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/50 truncate">
                    {lang === 'te' ? 'పరిచయం' : 'Introduction'}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-white truncate">
                    {lang === 'te' ? 'అనుమతితో' : 'With Permission'}
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] text-[#34D399]">✓ {lang === 'te' ? 'తీసుకున్నాం' : 'Confirmed'}</span>
                </div>

                <div className="bg-white/7 border border-white/10 rounded-xl p-2 sm:p-2.5 flex flex-col gap-0.5">
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/50 truncate">
                    {lang === 'te' ? 'ప్రొవైడర్ నిబంధనలు' : 'Provider Terms'}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-white truncate">
                    {lang === 'te' ? 'ముందే తెలుస్తాయి' : 'Visible Upfront'}
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] text-[#D6F36B]">✓ {lang === 'te' ? 'పరిశీలన' : 'Criteria Met'}</span>
                </div>

                <div className="bg-[#6B3CFF]/20 border border-[#6B3CFF]/40 rounded-xl p-2 sm:p-2.5 flex flex-col gap-0.5">
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/70 truncate">
                    {lang === 'te' ? 'సంపాదన అవకాశం' : 'Earning'}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#D6F36B] truncate">
                    {lang === 'te' ? 'అర్హత ఉంటే' : 'Earn When Eligible'}
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] text-white/60">{lang === 'te' ? 'చేరడం ఫ్రీ' : 'Free to Join'}</span>
                </div>
              </div>

              {/* Disclaimer Note */}
              <div className="flex items-center gap-1.5 text-[9.5px] text-white/50 font-mono">
                <Info size={11} className="shrink-0 text-white/40" />
                <span>{videoData.disclaimer}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Synchronized Subtitles / Captions Banner */}
      {showCaptions && (
        <div className="relative z-20 px-4 sm:px-6 py-2 bg-black/80 backdrop-blur-md border-t border-b border-white/10 flex items-center justify-center text-center min-h-[42px]">
          <p className="text-[11.5px] sm:text-[13px] text-white font-medium m-0 leading-snug max-w-[560px]">
            {activeScene.caption}
          </p>
        </div>
      )}

      {/* Bottom Timeline, Scrubber & Controls Deck */}
      <div className="relative z-20 p-2.5 sm:p-3.5 bg-[#070510]/95 border-t border-white/10 flex flex-col gap-2">
        {/* 2-Segment Progress Bar Scrubber */}
        <div
          className="w-full flex items-center gap-2 cursor-pointer"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL_DURATION}
          aria-valuenow={currentTime}
        >
          {[0, 1].map((idx) => {
            const sceneStart = idx * SCENE_DURATION
            const sceneProgress = Math.max(
              0,
              Math.min(1, (currentTime - sceneStart) / SCENE_DURATION)
            )

            return (
              <button
                key={`track-${idx}`}
                type="button"
                onClick={() => jumpToScene(idx)}
                className="flex-1 h-1.5 sm:h-2 bg-white/15 rounded-full overflow-hidden hover:bg-white/25 transition-all group relative"
                aria-label={`Jump to act 0${idx + 1}`}
                title={`Jump to Act 0${idx + 1}`}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#10B981] via-[#D6F36B] to-[#6B3CFF] transition-all duration-100 rounded-full"
                  style={{ width: `${sceneProgress * 100}%` }}
                />
              </button>
            )
          })}
        </div>

        {/* Primary Controls Row */}
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#10B981] hover:bg-[#059669] text-black flex items-center justify-center shadow-md transition-transform active:scale-95 font-bold"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={restart}
              className="p-1 sm:p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Restart video from beginning"
              title="Restart from beginning"
            >
              <RotateCcw size={13} />
            </button>

            <span className="font-mono text-[10px] sm:text-[11px] text-white/60 ml-1">
              {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
            </span>
          </div>

          {/* Act Selector Pills: 01 // PEOPLE SPEAKING & 02 // EARNING ANALYTICS */}
          <div className="flex items-center gap-1.5">
            {scenes.map((sc, idx) => (
              <button
                key={sc.id || `sc-${idx}`}
                type="button"
                onClick={() => jumpToScene(idx)}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-mono font-bold transition-all shrink-0 ${
                  activeIndex === idx
                    ? 'bg-white text-[#12101F] shadow-xs'
                    : 'bg-white/8 text-white/65 hover:bg-white/15 hover:text-white'
                }`}
              >
                {sc.number} // {idx === 0 ? (lang === 'te' ? 'సంభాషణ' : 'People Speaking') : (lang === 'te' ? 'సంపాదన విశ్లేషణ' : 'Earning Analytics')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Standard Column Embed */}
      {renderVideoStage(false)}

      {/* Explainer Subtitle Metadata Card */}
      <div className="flex items-center justify-between px-2 text-xs text-[#827C94] font-mono">
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-[#10B981]" />
          <span>{lang === 'te' ? 'వీడియో కథనం · 2 దశలు' : '2-Act Simple Video Story'}</span>
        </span>
        <span>{lang === 'te' ? 'సంపాదన విధానం' : 'How You Earn'}</span>
      </div>

      {/* Fullscreen Cinema Modal */}
      {isCinemaMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="sBLOOM Video Story"
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          <div className="w-full max-w-4xl flex flex-col gap-3">
            <div className="flex items-center justify-between text-white px-2">
              <span className="font-mono text-xs font-bold text-white/70">
                sBLOOM AFFILIATE PROGRAMME // VIDEO STORY
              </span>
              <button
                type="button"
                onClick={() => setIsCinemaMode(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-colors flex items-center gap-1"
                aria-label="Close cinema mode"
              >
                <span>ESC / CLOSE</span> ✕
              </button>
            </div>

            {renderVideoStage(true)}
          </div>
        </div>
      )}
    </div>
  )
}
