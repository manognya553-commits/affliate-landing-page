import { enCopy, teConfirmed } from './copyDeck'
import { teDraft } from './teDraft'

/**
 * Helper to deep resolve a property path in an object
 */
function getDeep(obj, path) {
  if (!obj) return undefined
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

/**
 * Get translated content for a given key path and language
 * Fallback order: Confirmed Telugu -> Draft Telugu -> English
 */
export function getTranslation(keyPath, lang = 'en') {
  const enVal = getDeep(enCopy, keyPath)

  if (lang === 'en') {
    return enVal
  }

  // If Telugu requested, check confirmed kit first
  const teConfVal = getDeep(teConfirmed, keyPath)
  if (teConfVal !== undefined) {
    return teConfVal
  }

  // Next check draft Telugu
  const teDraftVal = getDeep(teDraft, keyPath)
  if (teDraftVal !== undefined) {
    return teDraftVal
  }

  // Graceful fallback to English
  return enVal
}

/**
 * Hook or helper to get the active translation tree
 */
export function getCopy(lang = 'en') {
  if (lang === 'en') {
    return enCopy
  }

  // Return a merged Telugu view with English fallbacks
  return {
    nav: {
      brandSubtitle: teDraft.nav?.brandSubtitle || enCopy.nav.brandSubtitle,
      links: enCopy.nav.links.map((link, idx) => ({
        ...link,
        label: teDraft.nav?.links?.[idx]?.label || link.label,
      })),
      cta: teConfirmed.nav?.cta || enCopy.nav.cta,
    },
    hero: {
      eyebrow: teDraft.hero?.eyebrow || enCopy.hero.eyebrow,
      headlineLead: teConfirmed.hero?.headlineLead || enCopy.hero.headlineLead,
      headlineAccent: teConfirmed.hero?.headlineAccent || enCopy.hero.headlineAccent,
      subheading: teDraft.hero?.subheading || enCopy.hero.subheading,
      primaryCta: teDraft.hero?.primaryCta || enCopy.hero.primaryCta,
      secondaryCta: teDraft.hero?.secondaryCta || enCopy.hero.secondaryCta,
      trustRow: teDraft.hero?.trustRow || enCopy.hero.trustRow,
      bubbles: teDraft.hero?.bubbles || enCopy.hero.bubbles,
    },
    soundFamiliar: {
      eyebrow: teDraft.soundFamiliar?.eyebrow || enCopy.soundFamiliar.eyebrow,
      headline: teConfirmed.soundFamiliar?.headline || teDraft.soundFamiliar?.headline || enCopy.soundFamiliar.headline,
      subheading: teDraft.soundFamiliar?.subheading || enCopy.soundFamiliar.subheading,
      trustLine: teDraft.soundFamiliar?.trustLine || enCopy.soundFamiliar.trustLine,
      conclusion: teDraft.soundFamiliar?.conclusion || enCopy.soundFamiliar.conclusion,
      questions: teDraft.soundFamiliar?.questions || enCopy.soundFamiliar.questions,
      pillars: teDraft.soundFamiliar?.pillars || enCopy.soundFamiliar.pillars,
      reply: teDraft.soundFamiliar?.reply || enCopy.soundFamiliar.reply,
      videoExplainer: teDraft.soundFamiliar?.videoExplainer || enCopy.soundFamiliar.videoExplainer,
    },
    conversations: {
      eyebrow: teDraft.conversations?.eyebrow || enCopy.conversations.eyebrow,
      headline: teDraft.conversations?.headline || enCopy.conversations.headline,
      subheading: teDraft.conversations?.subheading || enCopy.conversations.subheading,
      disclaimer: teDraft.conversations?.disclaimer || enCopy.conversations.disclaimer,
      rule: teDraft.conversations?.rule || enCopy.conversations.rule,
      sectors: teDraft.conversations?.sectors || enCopy.conversations.sectors,
    },
    howItWorks: {
      eyebrow: teConfirmed.howItWorks?.eyebrow || teDraft.howItWorks?.eyebrow || enCopy.howItWorks.eyebrow,
      headline: teDraft.howItWorks?.headline || enCopy.howItWorks.headline,
      subheading: teDraft.howItWorks?.subheading || enCopy.howItWorks.subheading,
      steps: teDraft.howItWorks?.steps || enCopy.howItWorks.steps,
    },
    promises: {
      headline: teConfirmed.promises?.headline || enCopy.promises.headline,
      lead: teDraft.promises?.lead || enCopy.promises.lead,
      subhead: teDraft.promises?.subhead || enCopy.promises.subhead,
      items: teDraft.promises?.items || enCopy.promises.items,
    },
    whoCanJoin: teDraft.whoCanJoin || enCopy.whoCanJoin,
    whatYouCanIntroduce: teDraft.whatYouCanIntroduce || enCopy.whatYouCanIntroduce,
    sectors: {
      headline: teDraft.sectors?.headline || enCopy.sectors.headline,
      items: teDraft.sectors?.items || enCopy.sectors.items,
      note: teDraft.sectors?.note || enCopy.sectors.note,
    },
    introductionSimulator: {
      headline: teDraft.introductionSimulator?.headline || enCopy.introductionSimulator.headline,
      lead: teDraft.introductionSimulator?.lead || enCopy.introductionSimulator.lead,
      examples: teDraft.introductionSimulator?.examples || enCopy.introductionSimulator.examples,
      rule: teDraft.introductionSimulator?.rule || enCopy.introductionSimulator.rule,
    },
    earning: teDraft.earning || enCopy.earning,
    tools: {
      headline: teDraft.tools?.headline || enCopy.tools.headline,
      bento: teDraft.tools?.bento || enCopy.tools.bento,
    },
    trustStrip: {
      headline: teDraft.trustStrip?.headline || enCopy.trustStrip.headline,
      items: teDraft.trustStrip?.items || enCopy.trustStrip.items,
    },
    faq: teDraft.faq || enCopy.faq,
    finalCta: teDraft.finalCta || enCopy.finalCta,
    contact: teDraft.contact || enCopy.contact,
    form: {
      title: teDraft.form?.title || enCopy.form.title,
      step1: teDraft.form?.step1 || enCopy.form.step1,
      step2: teDraft.form?.step2 || enCopy.form.step2,
      step3: teDraft.form?.step3 || enCopy.form.step3,
      success: teDraft.form?.success || enCopy.form.success,
    },
    footer: {
      descriptor: teDraft.footer?.descriptor || enCopy.footer.descriptor,
      termsLink: teDraft.footer?.termsLink || enCopy.footer.termsLink,
      privacyLink: teDraft.footer?.privacyLink || enCopy.footer.privacyLink,
      contactPlaceholder: teDraft.footer?.contactPlaceholder || enCopy.footer.contactPlaceholder,
      legalDrawerTitle: teDraft.footer?.legalDrawerTitle || enCopy.footer.legalDrawerTitle,
      legalPlaceholder: teDraft.footer?.legalPlaceholder || enCopy.footer.legalPlaceholder,
    },
  }
}
