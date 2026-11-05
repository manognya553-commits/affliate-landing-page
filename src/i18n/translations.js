import { enCopy } from './copyDeck'
import { teDraft } from './teDraft'

/**
 * Deep resolve a property path in an object
 */
function getDeep(obj, path) {
  if (!obj) return undefined
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

/**
 * Get translated content for a given key path and language
 */
export function getTranslation(keyPath, lang = 'en') {
  const enVal = getDeep(enCopy, keyPath)

  if (lang === 'en') {
    return enVal
  }

  const teVal = getDeep(teDraft, keyPath)
  if (teVal !== undefined) {
    return teVal
  }

  return enVal
}

/**
 * Helper to get the active translation tree
 */
export function getCopy(lang = 'en') {
  if (lang === 'en') {
    return enCopy
  }

  return {
    nav: {
      brandSubtitle: teDraft.nav?.brandSubtitle || enCopy.nav.brandSubtitle,
      links: enCopy.nav.links.map((link, idx) => ({
        ...link,
        label: teDraft.nav?.links?.[idx]?.label || link.label,
      })),
      login: teDraft.nav?.login || enCopy.nav.login,
      cta: teDraft.nav?.cta || enCopy.nav.cta,
    },
    hero: {
      eyebrow: teDraft.hero?.eyebrow || enCopy.hero.eyebrow,
      headlineLead: teDraft.hero?.headlineLead || enCopy.hero.headlineLead,
      headlineAccent: teDraft.hero?.headlineAccent || enCopy.hero.headlineAccent,
      subheading: teDraft.hero?.subheading || enCopy.hero.subheading,
      primaryCta: teDraft.hero?.primaryCta || enCopy.hero.primaryCta,
      secondaryCta: teDraft.hero?.secondaryCta || enCopy.hero.secondaryCta,
      trustRow: teDraft.hero?.trustRow || enCopy.hero.trustRow,
    },
    soundFamiliar: {
      eyebrow: teDraft.soundFamiliar?.eyebrow || enCopy.soundFamiliar.eyebrow,
      heading: teDraft.soundFamiliar?.heading || enCopy.soundFamiliar.heading,
      description: teDraft.soundFamiliar?.description || enCopy.soundFamiliar.description,
      videoExplainer: teDraft.soundFamiliar?.videoExplainer || enCopy.soundFamiliar.videoExplainer,
    },
    howItWorks: {
      eyebrow: teDraft.howItWorks?.eyebrow || enCopy.howItWorks.eyebrow,
      heading: teDraft.howItWorks?.heading || enCopy.howItWorks.heading,
      steps: teDraft.howItWorks?.steps || enCopy.howItWorks.steps,
      supportingLine: teDraft.howItWorks?.supportingLine || enCopy.howItWorks.supportingLine,
    },
    conversations: {
      eyebrow: teDraft.conversations?.eyebrow || enCopy.conversations.eyebrow,
      heading: teDraft.conversations?.heading || enCopy.conversations.heading,
      label: teDraft.conversations?.label || enCopy.conversations.label,
      note: teDraft.conversations?.note || enCopy.conversations.note,
      cards: teDraft.conversations?.cards || enCopy.conversations.cards,
    },
    promises: {
      eyebrow: teDraft.promises?.eyebrow || enCopy.promises.eyebrow,
      heading: teDraft.promises?.heading || enCopy.promises.heading,
      promises: teDraft.promises?.promises || enCopy.promises.promises,
    },
    whatYouCanIntroduce: {
      eyebrow: teDraft.whatYouCanIntroduce?.eyebrow || enCopy.whatYouCanIntroduce.eyebrow,
      heading: teDraft.whatYouCanIntroduce?.heading || enCopy.whatYouCanIntroduce.heading,
      areas: teDraft.whatYouCanIntroduce?.areas || enCopy.whatYouCanIntroduce.areas,
      note: teDraft.whatYouCanIntroduce?.note || enCopy.whatYouCanIntroduce.note,
    },
    tools: {
      eyebrow: teDraft.tools?.eyebrow || enCopy.tools.eyebrow,
      heading: teDraft.tools?.heading || enCopy.tools.heading,
      description: teDraft.tools?.description || enCopy.tools.description,
      features: teDraft.tools?.features || enCopy.tools.features,
      availabilityNote: teDraft.tools?.availabilityNote || enCopy.tools.availabilityNote,
    },
    whoCanJoin: {
      eyebrow: teDraft.whoCanJoin?.eyebrow || enCopy.whoCanJoin.eyebrow,
      heading: teDraft.whoCanJoin?.heading || enCopy.whoCanJoin.heading,
      description: teDraft.whoCanJoin?.description || enCopy.whoCanJoin.description,
      cards: teDraft.whoCanJoin?.cards || enCopy.whoCanJoin.cards,
    },
    earning: {
      eyebrow: teDraft.earning?.eyebrow || enCopy.earning.eyebrow,
      heading: teDraft.earning?.heading || enCopy.earning.heading,
      steps: teDraft.earning?.steps || enCopy.earning.steps,
      disclaimer: teDraft.earning?.disclaimer || enCopy.earning.disclaimer,
    },
    faq: {
      eyebrow: teDraft.faq?.eyebrow || enCopy.faq.eyebrow,
      heading: teDraft.faq?.heading || enCopy.faq.heading,
      items: teDraft.faq?.items || enCopy.faq.items,
    },
    finalCta: {
      heading: teDraft.finalCta?.heading || enCopy.finalCta.heading,
      description: teDraft.finalCta?.description || enCopy.finalCta.description,
      primaryCta: teDraft.finalCta?.primaryCta || enCopy.finalCta.primaryCta,
      secondaryLink: teDraft.finalCta?.secondaryLink || enCopy.finalCta.secondaryLink,
    },
    contact: {
      heading: teDraft.contact?.heading || enCopy.contact.heading,
      nameLabel: teDraft.contact?.nameLabel || enCopy.contact.nameLabel,
      emailLabel: teDraft.contact?.emailLabel || enCopy.contact.emailLabel,
      messageLabel: teDraft.contact?.messageLabel || enCopy.contact.messageLabel,
      buttonText: teDraft.contact?.buttonText || enCopy.contact.buttonText,
      privacyNote: teDraft.contact?.privacyNote || enCopy.contact.privacyNote,
    },
    footer: {
      brand: teDraft.footer?.brand || enCopy.footer.brand,
      descriptor: teDraft.footer?.descriptor || enCopy.footer.descriptor,
      termsLink: teDraft.footer?.termsLink || enCopy.footer.termsLink,
      privacyLink: teDraft.footer?.privacyLink || enCopy.footer.privacyLink,
      copyright: teDraft.footer?.copyright || enCopy.footer.copyright,
      legalDrawerTitle: teDraft.footer?.legalDrawerTitle || enCopy.footer.legalDrawerTitle,
      legalPlaceholder: teDraft.footer?.legalPlaceholder || enCopy.footer.legalPlaceholder,
    },
  }
}
