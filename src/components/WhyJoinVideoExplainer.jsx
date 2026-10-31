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
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  GraduationCap,
  Users2,
  Info,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

// Scene duration in seconds
const SCENE_DURATION = 6
const TOTAL_SCENES = 3
const TOTAL_DURATION = SCENE_DURATION * TOTAL_SCENES

export default function WhyJoinVideoExplainer() {
  const { lang, copy } = useLanguage()
  const data = copy.soundFamiliar || {}
  const videoData = data.videoExplainer || {}
  const chapters = videoData.chapters || []

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
  const activeChapter = chapters[activeIndex] || chapters[0] || {}

  // Timer loop for simulated playback
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= TOTAL_DURATION) {
          return 0 // loop continuously
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

  const jumpToChapter = (idx) => {
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
      className={`relative w-full overflow-hidden bg-[#0A0716] text-white select-none ${
        isCinema
          ? 'h-[75vh] max-h-[720px] rounded-2xl border border-white/15'
          : 'rounded-2xl sm:rounded-3xl border border-[#12101F]/15 shadow-xl'
      } flex flex-col justify-between`}
    >
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            activeIndex === 0
              ? 'opacity-100 bg-[radial-gradient(ellipse_at_30%_30%,rgba(107,60,255,0.22),transparent_70%)]'
              : activeIndex === 1
              ? 'opacity-100 bg-[radial-gradient(ellipse_at_50%_30%,rgba(16,185,129,0.20),transparent_70%)]'
              : 'opacity-100 bg-[radial-gradient(ellipse_at_70%_30%,rgba(245,158,11,0.20),transparent_70%)]'
          }`}
        />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Top Telemetry Header Bar */}
      <div className="relative z-10 flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-b from-[#0A0716]/90 to-transparent">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4FA3] opacity-75" />
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#FF4FA3]" />
          </span>
          <span className="font-mono text-[9.5px] sm:text-[10.5px] font-bold tracking-wider text-white/80 uppercase">
            {videoData.badge || 'EXPLAINER // WHY JOIN'} · {activeChapter.number || `0${activeIndex + 1}`} OF 03
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
      <div className="relative z-10 flex-1 flex flex-col justify-center px-3.5 sm:px-7 py-3 sm:py-5 min-h-[220px] sm:min-h-[250px]">
        {/* SCENE 01: You Already Make Recommendations */}
        {activeIndex === 0 && (
          <div className="flex flex-col gap-2.5 sm:gap-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-[#FF4FA3] uppercase tracking-wider flex items-center gap-1.5">
                <Users2 size={13} />
                {activeChapter.tag}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                SCENE 01 // EVERYDAY REALITY
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-bold font-headline text-white m-0 tracking-tight leading-snug">
              {activeChapter.title}
            </h3>

            <p className="text-[11px] sm:text-sm text-white/75 leading-relaxed m-0 max-w-[520px]">
              {activeChapter.subtitle}
            </p>

            {/* Conversation Bubbles Mockup in Scene */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 sm:mt-2">
              <div className="bg-white/7 backdrop-blur-md border border-white/10 rounded-xl p-2.5 sm:p-3 flex items-start gap-2 sm:gap-2.5 shadow-sm">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FF6B6B]/20 text-[#FF6B6B] flex items-center justify-center shrink-0">
                  <HeartPulse size={13} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9.5px] sm:text-[10px] font-mono text-white/50 uppercase">Neighbour · Healthcare</span>
                  <p className="text-[11px] sm:text-xs font-medium text-white/95 m-0 italic leading-snug">
                    {lang === 'te'
                      ? '“మా అమ్మగారి కోసం మంచి డాక్టర్ ఎవరైనా తెలుసా?”'
                      : '“Do you know a good doctor for my mother?”'}
                  </p>
                </div>
              </div>

              <div className="bg-white/7 backdrop-blur-md border border-white/10 rounded-xl p-2.5 sm:p-3 flex items-start gap-2 sm:gap-2.5 shadow-sm">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#16A34A]/20 text-[#34D399] flex items-center justify-center shrink-0">
                  <GraduationCap size={13} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9.5px] sm:text-[10px] font-mono text-white/50 uppercase">Parent · Education</span>
                  <p className="text-[11px] sm:text-xs font-medium text-white/95 m-0 italic leading-snug">
                    {lang === 'te'
                      ? '“మా అబ్బాయికి ఏ కోచింగ్ సెంటర్ బాగుంటుంది?”'
                      : '“Which coaching centre is good for my son?”'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 02: Why Affiliate Should Join - Notice, Permission, Introduce */}
        {activeIndex === 1 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#34D399] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} />
                {activeChapter.tag}
              </span>
              <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                SCENE 02 // AFFILIATE ROLE
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-headline text-white m-0 tracking-tight leading-snug">
              {activeChapter.title}
            </h3>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed m-0 max-w-[520px]">
              {activeChapter.subtitle}
            </p>

            {/* 3-Step Permission Pipeline Graphic */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-white/7 border border-white/10 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1 items-center text-center">
                <div className="w-6 h-6 rounded-full bg-[#6B3CFF]/30 text-[#D6F36B] flex items-center justify-center text-xs font-bold font-mono">
                  1
                </div>
                <span className="text-[11px] font-bold text-white mt-1">
                  {lang === 'te' ? 'అవసరాన్ని గుర్తించండి' : 'Notice Need'}
                </span>
                <span className="text-[9.5px] text-white/60">
                  {lang === 'te' ? 'స్నేహితులు అడిగినప్పుడు' : 'When genuine need arises'}
                </span>
              </div>

              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1 items-center text-center relative">
                <div className="w-6 h-6 rounded-full bg-[#10B981]/40 text-[#34D399] flex items-center justify-center text-xs font-bold font-mono">
                  2
                </div>
                <span className="text-[11px] font-bold text-[#34D399] mt-1">
                  {lang === 'te' ? 'అనుమతి తీసుకోండి' : 'Ask First'}
                </span>
                <span className="text-[9.5px] text-white/60">
                  {lang === 'te' ? 'ఒత్తిడి లేకుండా' : 'Clear permission only'}
                </span>
              </div>

              <div className="bg-white/7 border border-white/10 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1 items-center text-center">
                <div className="w-6 h-6 rounded-full bg-[#6B3CFF]/30 text-[#A78BFA] flex items-center justify-center text-xs font-bold font-mono">
                  3
                </div>
                <span className="text-[11px] font-bold text-white mt-1">
                  {lang === 'te' ? 'పరిచయం చేయండి' : 'Introduce'}
                </span>
                <span className="text-[9.5px] text-white/60">
                  {lang === 'te' ? 'ప్రొవైడర్ సలహా ఇస్తారు' : 'Provider advises'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 03: What Will You Get? Structure, Clarity & Earning */}
        {activeIndex === 2 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#F59E0B] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                {activeChapter.tag}
              </span>
              <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                SCENE 03 // WHAT YOU GET
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-headline text-white m-0 tracking-tight leading-snug">
              {activeChapter.title}
            </h3>

            {/* 4 Tangible Benefits Grid */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-white/7 border border-white/10 rounded-xl p-2.5 flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#34D399] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    {lang === 'te' ? 'చేరడం ఉచితం' : 'Free to Join'}
                  </span>
                  <span className="text-[10px] text-white/60">
                    {lang === 'te' ? 'ఎటువంటి ఫీజులు లేవు' : 'No fees or hidden costs'}
                  </span>
                </div>
              </div>

              <div className="bg-white/7 border border-white/10 rounded-xl p-2.5 flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#34D399] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    {lang === 'te' ? 'నిబంధనలు ముందే' : 'Terms Upfront'}
                  </span>
                  <span className="text-[10px] text-white/60">
                    {lang === 'te' ? 'పరిహార విధానం కనిపిస్తుంది' : 'See criteria beforehand'}
                  </span>
                </div>
              </div>

              <div className="bg-white/7 border border-white/10 rounded-xl p-2.5 flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#34D399] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    {lang === 'te' ? 'రిఫరల్ ట్రాకింగ్' : 'Platform Tracking'}
                  </span>
                  <span className="text-[10px] text-white/60">
                    {lang === 'te' ? 'స్టేటస్ తెలుసుకోవచ్చు' : 'Track your introductions'}
                  </span>
                </div>
              </div>

              <div className="bg-[#6B3CFF]/20 border border-[#6B3CFF]/40 rounded-xl p-2.5 flex items-start gap-2">
                <Sparkles size={15} className="text-[#D6F36B] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#D6F36B]">
                    {lang === 'te' ? 'సంపాదన అవకాశం' : 'Earn When Eligible'}
                  </span>
                  <span className="text-[10px] text-white/70">
                    {lang === 'te' ? 'ప్రొవైడర్ నిబంధనల ప్రకారం' : 'Under provider terms'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-white/60 font-mono mt-1">
              <Info size={12} className="shrink-0 text-white/40" />
              <span>{videoData.disclaimer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Synchronized Subtitles / Captions Banner */}
      {showCaptions && (
        <div className="relative z-10 px-4 sm:px-6 py-2 bg-black/60 backdrop-blur-md border-t border-b border-white/10 flex items-center justify-center text-center min-h-[46px]">
          <p className="text-xs sm:text-[13px] text-white font-medium m-0 leading-snug max-w-[560px]">
            {activeChapter.caption}
          </p>
        </div>
      )}

      {/* Bottom Timeline, Scrubber & Controls Deck */}
      <div className="relative z-10 p-3 sm:p-4 bg-[#0A0716]/95 border-t border-white/10 flex flex-col gap-2.5">
        {/* 3-Segment Progress Bar Scrubber */}
        <div className="w-full flex items-center gap-1.5 cursor-pointer" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL_DURATION} aria-valuenow={currentTime}>
          {[0, 1, 2].map((idx) => {
            const sceneStart = idx * SCENE_DURATION
            const sceneProgress = Math.max(
              0,
              Math.min(1, (currentTime - sceneStart) / SCENE_DURATION)
            )

            return (
              <button
                key={`track-${idx}`}
                type="button"
                onClick={() => jumpToChapter(idx)}
                className="flex-1 h-1.5 sm:h-2 bg-white/15 rounded-full overflow-hidden hover:bg-white/25 transition-all group relative"
                aria-label={`Jump to scene 0${idx + 1}`}
                title={`Jump to Scene 0${idx + 1}`}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#6B3CFF] to-[#FF4FA3] transition-all duration-100 rounded-full"
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
              className="w-8 h-8 rounded-full bg-[#6B3CFF] hover:bg-[#5025D1] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={restart}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Restart video from beginning"
              title="Restart from beginning"
            >
              <RotateCcw size={14} />
            </button>

            <span className="font-mono text-[11px] text-white/60 ml-1">
              {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
            </span>
          </div>

          {/* Chapter Quick Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id || `ch-${idx}`}
                type="button"
                onClick={() => jumpToChapter(idx)}
                className={`px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold transition-all shrink-0 ${
                  activeIndex === idx
                    ? 'bg-white text-[#12101F] shadow-xs'
                    : 'bg-white/8 text-white/65 hover:bg-white/15 hover:text-white'
                }`}
              >
                {ch.number} // {idx === 0 ? (lang === 'te' ? 'ఎందుకు' : 'Why') : idx === 1 ? (lang === 'te' ? 'పద్ధతి' : 'Role') : (lang === 'te' ? 'లాభం' : 'Gain')}
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
          <Sparkles size={12} className="text-[#6B3CFF]" />
          <span>{lang === 'te' ? 'వీడియో వివరణ · 3 దశలు' : '3-Scene Explainer Video'}</span>
        </span>
        <span>{lang === 'te' ? 'అఫిలియేట్ గైడ్' : 'Affiliate Guide'}</span>
      </div>

      {/* Fullscreen Cinema Modal */}
      {isCinemaMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Why Join sBLOOM Video Player"
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          <div className="w-full max-w-4xl flex flex-col gap-3">
            <div className="flex items-center justify-between text-white px-2">
              <span className="font-mono text-xs font-bold text-white/70">
                sBLOOM AFFILIATE PROGRAMME // CINEMA MODE
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
