/**
 * sBLOOM Affiliate Programme — Canonical English Copy & Confirmed Telugu Kit
 * Source: docs/copy-deck.md
 */

import { copyAdditionsEn } from './landingCopyAdditions'

export const enCopy = {
  // Navigation
  nav: {
    brandSubtitle: 'Affiliate Programme',
    links: [
      { id: 'why-join', label: 'Why join', href: '#why-join' },
      { id: 'how-it-works', label: 'How it works', href: '#how-it-works' },
      { id: 'who-can-join', label: 'Who can join', href: '#who-can-join' },
      { id: 'earning', label: 'Earning', href: '#earning' },
      { id: 'faq', label: 'FAQ', href: '#faq' },
    ],
    cta: 'Become an affiliate',
  },

  // Hero Section
  hero: {
    eyebrow: 'sBLOOM Affiliate Programme · A network of service advisers',
    headlineLead: 'Help someone find the right service.',
    headlineAccent: 'Earn when it works out.',
    subheading:
      'People already ask you, “Do you know a good doctor? A good course? Someone who can help with this?” Join sBLOOM free, introduce them to services in healthcare, education and professional services, and earn under each provider’s terms.',
    primaryCta: 'Become an affiliate — it’s free',
    secondaryCta: 'See how it works',
    trustRow: [
      'Free to join',
      'Open to anyone in India',
      'You see each provider’s terms first',
      'Track every referral',
    ],
    bubbles: {
      ask: '“Do you know a good doctor?”',
      reply: '“I’m part of a platform that connects people to clinics and care services.”',
      askSpeaker: 'Neighbor',
      replySpeaker: 'You (Affiliate)',
    },
  },

  // Sound familiar? (Stage 2)
  soundFamiliar: {
    headline: 'You’re already the person people ask.',
    questions: [
      '“Which coaching centre is good for my son?”',
      '“Do you know a good doctor for my mother?”',
      '“My cousin needs help with business papers. Anyone know someone?”',
      '“Which course should I do after my degree?”',
    ],
    reply: '“Yes, let me introduce you.”',
    conclusion:
      'You answer from the heart, for free, every week. sBLOOM gives those moments a structure, and a reward when your introduction leads somewhere.',
  },

  // How it works (Stage 2)
  howItWorks: {
    eyebrow: 'How it works',
    headline: 'Four simple steps',
    steps: [
      {
        number: '1',
        title: 'Sign up.',
        description:
          'Tell us your name, your email and the areas where people trust you. It takes about two minutes and it’s free. Our team reviews every sign-up.',
      },
      {
        number: '2',
        title: 'Learn the service.',
        description:
          'Open the sBLOOM knowledge platform. Simple briefs tell you what each service is, who it suits and what people usually ask. You don’t have to memorise anything.',
      },
      {
        number: '3',
        title: 'Introduce.',
        description:
          'When someone you know needs a service and says yes to being introduced, pass on the referral through sBLOOM. You introduce. The provider takes it from there.',
      },
      {
        number: '4',
        title: 'Track and earn.',
        description:
          'See the status of every referral in the platform. If it qualifies under the provider’s terms, you earn.',
      },
    ],
  },

  // Promises (Stage 2)
  promises: {
    headline: 'You introduce. The experts advise.',
    lead:
      'You don’t have to explain a treatment, a course syllabus or a legal point. Your job is simple: notice a need, ask permission, make the introduction.',
    subhead: 'Three promises we ask every affiliate to keep:',
    items: [
      {
        title: 'Ask first.',
        description: 'Share someone’s details only after they clearly say yes.',
      },
      {
        title: 'Stay in your lane.',
        description: 'Don’t give medical, legal or financial advice. Let the provider do that.',
      },
      {
        title: 'Tell the truth.',
        description: 'Say only what the service brief says. No pressure and no big promises.',
      },
    ],
  },

  // Who can join (Stage 3)
  whoCanJoin: {
    headline: 'If people listen to you, you belong here',
    lead:
      'Anyone in India with a relevant network and an interest in helping can express interest. You do not need to be an expert.',
    personas: [
      {
        id: 'homemaker',
        title: 'Homemakers',
        description:
          'You know every family in the building and your recommendation is trusted. Start from home, in your own time.',
      },
      {
        id: 'professional',
        title: 'Working professionals',
        description:
          'Colleagues and friends ask your opinion. Explore a side opportunity alongside your job.',
      },
      {
        id: 'community',
        title: 'Community leaders',
        description:
          'Associations, temple committees, alumni groups: help your people find the right service.',
      },
      {
        id: 'shop-tutor',
        title: 'Shop owners and tutors',
        description:
          'You meet many families every week, and an introduction takes a minute.',
      },
      {
        id: 'retired',
        title: 'Retired people',
        description:
          'Years of experience and a wide circle. Your word still carries weight.',
      },
      {
        id: 'young-adult',
        title: 'Young adults (18+)',
        description:
          'Your friends already ask what you think. Now it can mean something.',
      },
    ],
    closingCta: 'Not sure if it’s for you? Express your interest and we’ll explain.',
  },

  // Sectors (Stage 3)
  sectors: {
    headline: 'Three areas people ask about most',
    items: [
      {
        id: 'healthcare',
        title: 'Healthcare',
        description: 'Introduce people to healthcare providers and care services listed on sBLOOM.',
      },
      {
        id: 'education',
        title: 'Education',
        description: 'Introduce people to courses, institutions and learning programmes.',
      },
      {
        id: 'professional',
        title: 'Professional services',
        description: 'Introduce people and businesses to professional and advisory services.',
      },
    ],
    note: 'Services available to introduce depend on the providers on the platform.',
  },

  // Introduction conversations (Stage 3)
  introductionSimulator: {
    headline: 'What an introduction sounds like',
    lead:
      'A friendly, permission-first message is all it takes. These are examples to show on the page:',
    examples: [
      {
        sector: 'Healthcare',
        text: '“Radha, you said your mother needs a specialist. I’m part of a platform that connects people to clinics and care services. Would you like me to share your details so their team can call you? Only if you’re comfortable.”',
      },
      {
        sector: 'Education',
        text: '“Ravi, since you’re planning your next course, I can introduce you to a team that explains the options. Shall I pass on your number?”',
      },
      {
        sector: 'Professional services',
        text: '“Suresh garu, you were asking about setting up your business papers. I can connect you with a team that helps. Should I share your contact?”',
      },
    ],
    rule: 'The rule behind all three: a clear yes before any details are shared.',
  },

  // Earning (Stage 3)
  earning: {
    headline: 'Every provider sets its own terms, and you see them first.',
    lead:
      'Different services reward referrals in different ways. Some may reward when a person shows genuine interest. Some may reward when the person goes ahead. Some may do both. Before you introduce anyone, you can see how that provider rewards referrals and what has to happen for a referral to count.',
    cards: [
      { title: 'See the terms first.', description: 'No surprises after you’ve introduced someone.' },
      { title: 'Watch the status.', description: 'The platform tracks each referral and its progress.' },
      { title: 'Earn when it qualifies.', description: 'Under the provider’s approved terms.' },
    ],
    caution:
      'Earnings depend on each provider’s terms and on your referrals qualifying. No income is guaranteed.',
  },

  // Tools (Stage 4)
  tools: {
    headline: 'Everything in one place, so you never feel lost',
    bento: [
      {
        title: 'Service briefs in simple language.',
        description: 'What the service is, who it suits, what you can say and what you should not say.',
      },
      {
        title: 'Answers to common questions.',
        description: 'So you can respond with confidence.',
      },
      {
        title: 'A referral tracker.',
        description: 'See every introduction and where it stands.',
      },
      {
        title: 'Provider terms in one place.',
        description: 'Compare how each one works before you act.',
      },
    ],
  },

  // Trust Strip (Stage 4)
  trustStrip: {
    headline: 'Built to feel safe, for you and for the people you introduce',
    items: [
      { title: 'Free to join.', description: 'There is no joining fee.' },
      { title: 'Permission first.', description: 'No one is contacted unless they say yes.' },
      { title: 'Terms before action.', description: 'You see how each provider rewards referrals before you introduce anyone.' },
      { title: 'Status you can see.', description: 'The platform tracks your referrals and their progress.' },
      { title: 'Your details stay with the programme.', description: '[Link to privacy notice]' },
    ],
  },

  // FAQ (Stage 4)
  faq: {
    headline: 'Frequently asked questions',
    tabs: ['Joining', 'Earning', 'Safety'],
    questions: [
      { q: 'Is it really free to join?', a: 'Yes. There is no joining fee.', category: 'Joining' },
      { q: 'I’m a homemaker. Can I do this?', a: 'Yes. If people around you trust your word, you can express interest. You can do it from your phone in a couple of minutes.', category: 'Joining' },
      { q: 'Do I need to be an expert?', a: 'No. You introduce, and the provider advises. The briefs in the platform help you understand each service.', category: 'Joining' },
      { q: 'Do I have to convince or push people?', a: 'No. You only introduce people who need a service and say yes to being introduced. No pressure.', category: 'Safety' },
      { q: 'I have a job. Can I join?', a: 'You can express interest while you work. We’ll explain what’s expected when we get in touch.', category: 'Joining' },
      { q: 'Can I use this in Telugu?', a: 'This page is available in Telugu and English. We’ll tell you which languages the platform and briefs support when you join.', category: 'Joining' },
      { q: 'How much will I earn?', a: 'It depends on each provider’s terms and on whether your referral qualifies. You see the terms first. No income is guaranteed.', category: 'Earning' },
      { q: 'When do I get paid?', a: '[Add approved timing.] You’ll see the payment terms before you introduce anyone.', category: 'Earning' },
      { q: 'How will I know what happened to my referral?', a: 'The platform tracks referrals and shows their status.', category: 'Earning' },
      { q: 'Do I need to live in Andhra Pradesh or Telangana?', a: 'No. Anyone in India with a relevant network can express interest. Which services you can introduce may depend on where providers operate.', category: 'Joining' },
      { q: 'Is my information, and my friends’ information, safe?', a: 'Share details only after someone says yes. Information is used only for the programme. [Link to privacy notice]', category: 'Safety' },
    ],
  },

  // Final CTA (Stage 5)
  finalCta: {
    headline: 'Someone you know is looking for the right help right now.',
    lead: 'Be the person who points them in the right direction. It’s free to join, and it takes about two minutes to start.',
    button: 'Become an affiliate',
  },

  // Form (Stage 5)
  form: {
    title: 'Tell us about yourself',
    step1: {
      title: 'About you',
      nameLabel: 'Full name',
      mobileLabel: 'Mobile number (WhatsApp preferred)',
      locationLabel: 'City and state',
      langLabel: 'Preferred language',
      langOptions: ['Telugu', 'English', 'Hindi', 'Other'],
    },
    step2: {
      title: 'Your circle',
      sectorsQuestion: 'Which areas do your people ask you about?',
      sectorsOptions: ['Healthcare', 'Education', 'Professional services', 'Not sure yet'],
      channelsQuestion: 'Where do you usually connect with people?',
      channelsOptions: ['Family and friends', 'Apartment or community', 'Workplace', 'WhatsApp groups', 'Social media', 'My shop or business', 'Other'],
      noteLabel: 'Anything you’d like us to know? (optional)',
    },
    step3: {
      title: 'Confirm',
      consent: 'I agree to be contacted by sBLOOM about the affiliate programme, and to my details being used for this purpose.',
      submitButton: 'Submit Interest',
      subtext: 'Free. No payment is asked at this stage.',
    },
    success: {
      title: 'Thank you, {name}!',
      message: 'We’ve received your interest. Our team will contact you on WhatsApp or phone to explain the next steps.',
    },
  },

  // Footer
  footer: {
    descriptor: 'A network of service advisers',
    termsLink: 'Programme terms',
    privacyLink: 'Privacy notice',
    contactPlaceholder: '',
    legalDrawerTitle: 'sBLOOM Affiliate Programme Terms',
    legalPlaceholder: 'Programme terms will be provided to all affiliates prior to service activation. You will always see each provider’s terms before introducing anyone.',
  },
  ...copyAdditionsEn,
}

/**
 * Confirmed Telugu strings directly from docs/copy-deck.md (Section 6)
 */
export const teConfirmed = {
  hero: {
    headlineLead: 'మీకు తెలిసిన వారికి సరైన సేవను చూపించండి.',
    headlineAccent: 'ఫలితం వస్తే మీకూ సంపాదన.',
    trustRow: {
      freeToJoin: 'చేరడం పూర్తిగా ఉచితం',
      trackEveryReferral: 'ప్రతి రిఫరల్ స్థితిని చూడండి',
    },
  },
  nav: {
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    cta: 'అఫిలియేట్ అవ్వండి',
  },
  howItWorks: {
    eyebrow: 'ఇది ఎలా పనిచేస్తుంది',
  },
  soundFamiliar: {
    headline: 'అందరూ అడిగే వ్యక్తి మీరే.',
  },
  promises: {
    headline: 'మీరు పరిచయం చేయండి. సలహా ఇచ్చేది నిపుణులే.',
    askFirst: 'ముందు అడగండి. అంగీకారం తర్వాతే వివరాలు పంచండి.',
  },
  earning: {
    headline: 'ప్రతి సేవా సంస్థ తమ నిబంధనలను తామే నిర్ణయిస్తుంది.',
    caution: 'ఆదాయానికి హామీ లేదు.',
  },
  sectors: {
    headlineItems: 'ఆరోగ్యం · విద్య · ప్రొఫెషనల్ సేవలు',
  },
  common: {
    wordCarriesWeight: 'మీ మాటకు విలువ ఉంది.',
    notExpert: 'మీరు నిపుణులు కానవస్సిన అవసరం లేదు.',
    fromHome: 'ఇంటి నుంచి, మీ సమయంలో',
  },
}
