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
      'You already help friends, family and people in your community find the right services. sBLOOM gives you a way to turn relevant introductions into an earning opportunity when those introductions qualify under each provider’s terms.',
    primaryCta: 'Become an affiliate — it’s free',
    secondaryCta: 'See how it works',
    trustRow: [
      'Free to join',
      'Open to anyone in India',
      'You see each provider’s terms first',
      'Earnings under provider terms',
    ],
    bubbles: {
      ask: '“Do you know a good doctor?”',
      reply: '“I’m part of a platform that connects people to clinics and care services.”',
      askSpeaker: 'Neighbor',
      replySpeaker: 'You (Affiliate)',
    },
  },

  // Sound familiar? (Why Join Section)
  soundFamiliar: {
    eyebrow: 'Why join',
    headline: 'Your connections could become an earning opportunity.',
    subheading:
      'You already help friends, family and people in your community find the right services. With sBLOOM, you can make relevant introductions to service providers and explore an opportunity to earn when those introductions qualify under the provider’s terms.',
    trustLine: 'Free to join. No sales background required. Earnings are not guaranteed.',
    conclusion:
      'You answer from the heart, for free, every week. sBLOOM gives those moments a structure, and a reward when your introduction leads somewhere.',
    questions: [
      {
        speaker: 'Neighbour',
        initial: 'N',
        text: '“Do you know a good doctor for my mother?”',
        category: 'Healthcare',
      },
      {
        speaker: 'Parent',
        initial: 'P',
        text: '“Which coaching centre is good for my son?”',
        category: 'Education',
      },
      {
        speaker: 'Relative',
        initial: 'R',
        text: '“My cousin needs help with business papers. Anyone know someone?”',
        category: 'Professional Services',
      },
      {
        speaker: 'Student',
        initial: 'S',
        text: '“Which course should I do after my degree?”',
        category: 'Education',
      },
    ],
    pillars: [
      {
        id: 'introduce',
        title: 'Relevant introductions',
        description:
          'Introduce people to relevant service providers when a genuine need arises. No sales background required.',
      },
      {
        id: 'earn',
        title: 'Opportunity to earn',
        description:
          'Explore an opportunity to earn when your introduction qualifies under the provider’s specific compensation terms.',
      },
      {
        id: 'guidance',
        title: 'Information and guidance',
        description:
          'sBLOOM provides service information and guidance so you can make informed, helpful introductions with confidence.',
      },
    ],
    reply: '“Yes, let me introduce you.”',
    videoExplainer: {
      badge: 'STORY // HOW IT WORKS',
      duration: '00:14',
      scenes: [
        {
          id: 'speaking',
          number: '01',
          tag: 'PEOPLE SPEAKING',
          title: 'You already help people find services.',
          speaker: 'Sujatha R. · Community Connector',
          quote: '“Neighbours and family ask me for advice every week. With sBLOOM, I make a friendly, permission-first introduction.”',
          caption: 'People already trust you and ask for advice. You answer from the heart, for free.',
        },
        {
          id: 'analytics',
          number: '02',
          tag: 'EARNING ANALYTICS',
          title: 'How introductions become earnings.',
          statusLabel: 'Referral Status: Qualified under Provider Terms',
          metrics: [
            { label: 'Introduction', value: 'Permission confirmed' },
            { label: 'Provider terms', value: 'Criteria evaluated' },
            { label: 'Compensation', value: 'Earn when eligible' },
          ],
          caption: 'Track your referrals on sBLOOM. When they qualify under provider terms, you earn.',
        },
      ],
      disclaimer:
        'Illustrative scenario · Earnings depend on each provider’s terms · No income is guaranteed.',
    },
  },

  // What an introduction sounds like (Three-Phone Conversation Carousel)
  conversations: {
    eyebrow: 'What an introduction sounds like',
    headline: 'A friendly, permission-first message is all it takes.',
    subheading:
      'The affiliate initiates the conversation based on something previously mentioned. Explore how an introduction looks across each sector:',
    disclaimer: 'Illustrative scenario · Example introduction',
    rule: 'The rule behind all three: a clear yes before any details are shared. No income is guaranteed.',
    sectors: [
      {
        id: 'healthcare',
        name: 'Healthcare',
        code: '01 · HEALTHCARE',
        contactRole: 'Neighbour',
        contactInitial: 'N',
        contactMessage: '“You said your mother needs a doctor. I know a service that might help.”',
        contactTime: '10:24 AM',
        affiliateRole: 'You (Affiliate)',
        affiliateMessage: '“I can introduce you to a relevant healthcare provider. Would you like me to connect you?”',
        affiliateTime: '10:26 AM',
        consentTag: 'Ask first · Permission confirmed',
        permissionLabel: 'Permission-first introduction',
      },
      {
        id: 'education',
        name: 'Education',
        code: '02 · EDUCATION',
        contactRole: 'Friend',
        contactInitial: 'F',
        contactMessage: '“You mentioned you’re looking for a coaching institute.”',
        contactTime: '11:15 AM',
        affiliateRole: 'You (Affiliate)',
        affiliateMessage: '“I can introduce you to an institute that offers relevant programmes. Would you like to know more?”',
        affiliateTime: '11:17 AM',
        consentTag: 'Ask first · Permission confirmed',
        permissionLabel: 'Permission-first introduction',
      },
      {
        id: 'professional',
        name: 'Professional Services',
        code: '03 · PROFESSIONAL SERVICES',
        contactRole: 'Business Owner',
        contactInitial: 'B',
        contactMessage: '“I need help improving my business online.”',
        contactTime: '02:40 PM',
        affiliateRole: 'You (Affiliate)',
        affiliateMessage: '“I know a service provider who may be able to help. Would you like an introduction?”',
        affiliateTime: '02:42 PM',
        consentTag: 'Ask first · Permission confirmed',
        permissionLabel: 'Permission-first introduction',
      },
    ],
  },

  // How it works (Section 2 · How Earning Works)
  howItWorks: {
    eyebrow: 'How it works',
    headline: 'Make a connection. Understand the terms. Earn when eligible.',
    subheading: 'Four steps from finding a genuine need to an eligible referral:',
    steps: [
      {
        number: '1',
        title: 'Find a genuine need.',
        description: 'Someone in your network is looking for a service.',
      },
      {
        number: '2',
        title: 'Make an introduction.',
        description:
          'With their permission, connect them with a relevant provider.',
      },
      {
        number: '3',
        title: 'Understand the provider’s terms.',
        description:
          'Check what qualifies for compensation before making the referral.',
      },
      {
        number: '4',
        title: 'Earn when the conditions are met.',
        description:
          'Compensation depends on the specific provider’s terms and whether the referral qualifies.',
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
    headline: 'One network of connections. Three areas of opportunity.',
    items: [
      {
        id: 'healthcare',
        title: 'Healthcare',
        description: 'Introduce someone looking for a suitable healthcare service to a relevant provider.',
      },
      {
        id: 'education',
        title: 'Education',
        description: 'Connect students and families with relevant educational services.',
      },
      {
        id: 'professional',
        title: 'Professional services',
        description: 'Introduce businesses and individuals to providers whose services may meet their needs.',
      },
    ],
    note: 'A referral’s eligibility and compensation depend on the relevant provider’s terms.',
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

  // Earning (Section 4 · Why sBLOOM)
  earning: {
    headline: 'More than just making referrals.',
    subheading: 'sBLOOM gives you the information, clarity and structure to introduce with confidence:',
    blocks: [
      {
        title: 'Learn before you introduce',
        description: 'Understand the services and providers.',
      },
      {
        title: 'Refer with confidence',
        description: 'Use relevant information to make more informed introductions.',
      },
      {
        title: 'Know the terms',
        description: 'Review the provider’s compensation conditions before referring.',
      },
      {
        title: 'Build around your network',
        description: 'Introduce services that genuinely match people’s needs.',
      },
    ],
    caution:
      'Compensation varies by service provider and is subject to the applicable terms. Joining and making a referral do not guarantee earnings.',
    noGuarantee:
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
    tabs: ['Earning', 'Joining', 'Safety'],
    questions: [
      {
        q: 'Can I earn money as an sBLOOM affiliate?',
        a: 'Yes, the programme offers an opportunity to earn through eligible referrals. Whether a referral qualifies and what compensation applies depend on the relevant service provider’s terms. Earnings are not guaranteed.',
        category: 'Earning',
      },
      {
        q: 'How much can I earn per referral?',
        a: 'Compensation varies by service provider. The applicable amount or payment arrangement and qualifying conditions should be communicated by the provider. We do not publish a universal commission rate.',
        category: 'Earning',
      },
      {
        q: 'Do I get paid for every person I introduce?',
        a: 'Not necessarily. Compensation depends on the provider’s terms and whether the referral meets the applicable conditions.',
        category: 'Earning',
      },
      {
        q: 'Do I need to pay to join?',
        a: 'No. Joining the sBLOOM Affiliate Programme is free.',
        category: 'Joining',
      },
      {
        q: 'When will I receive payment?',
        a: 'Payment timing depends on the relevant provider’s terms. Specific timelines should be communicated only when they have been confirmed.',
        category: 'Earning',
      },
      { q: 'Is it really free to join?', a: 'Yes. There is no joining fee.', category: 'Joining' },
      { q: 'I’m a homemaker. Can I do this?', a: 'Yes. If people around you trust your word, you can express interest. You can do it from your phone in a couple of minutes.', category: 'Joining' },
      { q: 'Do I need to be an expert?', a: 'No. You introduce, and the provider advises. The briefs in the platform help you understand each service.', category: 'Joining' },
      { q: 'Do I have to convince or push people?', a: 'No. You only introduce people who need a service and say yes to being introduced. No pressure.', category: 'Safety' },
      { q: 'I have a job. Can I join?', a: 'You can express interest while you work. We’ll explain what’s expected when we get in touch.', category: 'Joining' },
      { q: 'Can I use this in Telugu?', a: 'This page is available in Telugu and English. We’ll tell you which languages the platform and briefs support when you join.', category: 'Joining' },
      { q: 'Is my information, and my friends’ information, safe?', a: 'Share details only after someone says yes. Information is used only for the programme.', category: 'Safety' },
    ],
  },

  // Final CTA (Stage 5)
  finalCta: {
    headline: 'Your next introduction could open an opportunity.',
    subheading:
      'Join the sBLOOM Affiliate Programme for free and explore how your trusted connections can become an earning opportunity.',
    disclaimer:
      'Compensation varies by service provider and is subject to the applicable terms. Joining and making a referral do not guarantee earnings.',
    primaryCta: 'Become an affiliate — it’s free',
    secondaryLink: 'Read the programme terms',
    button: 'Become an affiliate — it’s free',
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
    headlineLead: 'మీకు తెలిసిన వాళ్లకు మంచి సర్వీసెస్ చూపించండి.',
    headlineAccent: 'రిజల్ట్ వస్తే మీకూ సంపాదన.',
    trustRow: {
      freeToJoin: 'చేరడం ఫ్రీ',
      earningsUnderTerms: 'కండిషన్స్ ప్రకారం సంపాదన',
    },
  },
  nav: {
    howItWorks: 'ఎలా పనిచేస్తుంది',
    cta: 'అఫిలియేట్ అవ్వండి',
  },
  howItWorks: {
    eyebrow: 'ఎలా పనిచేస్తుంది',
  },
  soundFamiliar: {
    headline: 'మీ పరిచయాలే మీకు సంపాదన అవకాశం.',
  },
  promises: {
    headline: 'మీరు పరిచయం చేయండి. సలహాలు ఎక్స్‌పర్ట్స్ ఇస్తారు.',
    askFirst: 'ముందు అడగండి. పర్మిషన్ తర్వాతే చెప్పండి.',
  },
  earning: {
    headline: 'ప్రతి ప్రొవైడర్ తమ కండిషన్స్ తామే నిర్ణయిస్తుంది.',
    caution: 'ఆదాయానికి గ్యారెంటీ లేదు.',
  },
  sectors: {
    headlineItems: 'హెల్త్‌కేర్ · ఎడ్యుకేషన్ · ప్రొఫెషనల్ సర్వీసెస్',
  },
  common: {
    wordCarriesWeight: 'మీ మాటకు విలువ ఉంది.',
    notExpert: 'మీరు ఎక్స్‌పర్ట్ కానక్కర్లేదు.',
    fromHome: 'ఇంట్లోనే, మీ ఫ్రీ టైమ్‌లో',
  },
}
