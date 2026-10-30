/**
 * Approved copy for the new landing page sections.
 *
 * HOW TO USE
 * - Merge `copyAdditionsEn` into the English copy in src/i18n/copyDeck.js
 *   (e.g. `export const en = { ...existing, ...copyAdditionsEn }`).
 * - Merge `copyAdditionsTe` into the Telugu copy in src/i18n/teDraft.js the same way.
 * - Both objects have identical keys, so `copy.faq.items`, `copy.earning.blocks`, etc.
 *   work in either language. Keep the existing English fallback for any missing Telugu key.
 * - `id` fields are the section anchor ids. The nav already links to
 *   #who-can-join, #earning and #faq, so these must not change.
 *
 * TODO BEFORE LAUNCH (values still to be decided by Admin):
 *   - faq.items[3]  : [X working days]
 *   - faq.items[8]  : [date]
 *   - earning.example rows / total : the ₹ amounts. Until real figures exist, render the
 *     example WITHOUT the amounts (hide `rows` and `total`) instead of showing the brackets.
 *   - footer contact email / phone / address, and the contact reply time.
 *
 * NOTE: `faq.eyebrow` and `faq.headline` were not in the approved copy doc. They are
 * simple additions based on the nav label. Change them if you prefer other wording.
 */

export const copyAdditionsEn = {
  whoCanJoin: {
    id: 'who-can-join',
    eyebrow: 'Who can join',
    headline: 'Anyone people trust can join.',
    subheading:
      'You don’t need a sales background, a shop or a degree. You need people who ask you for suggestions.',
    cards: [
      {
        title: 'Homemakers',
        description: 'Family and neighbours ask you about doctors, tuition and schools.',
      },
      {
        title: 'Students',
        description:
          'Friends and juniors ask about courses and coaching. Introduce them and earn in your free time.',
      },
      {
        title: 'Shopkeepers',
        description: 'Customers talk to you every day, and they trust you.',
      },
      {
        title: 'Working professionals',
        description: 'Colleagues and friends ask you for recommendations.',
      },
      {
        title: 'Anyone else',
        description:
          'Retired people, community volunteers, or anyone whose circle trusts them.',
      },
    ],
    closing: 'Open to anyone in India. Free to join. Our team reviews every sign-up.',
  },

  whatYouCanIntroduce: {
    id: 'what-you-can-introduce',
    eyebrow: 'What you can introduce',
    headline: 'Three areas, one platform.',
    subheading:
      'You introduce. The providers advise. Available services vary by city and provider.',
    tiles: [
      {
        title: 'Education',
        description: 'Coaching, courses, admissions and career guidance.',
      },
      {
        title: 'Healthcare',
        description: 'Clinics, consultations, diagnostic and care services.',
      },
      {
        title: 'Professional services',
        description:
          'Business paperwork, accounting, legal and financial help from qualified providers.',
      },
    ],
    note: 'You can introduce one service or several, across any of these areas.',
  },

  earning: {
    id: 'earning',
    eyebrow: 'Earning',
    headline: 'You earn when an introduction works out.',
    subheading:
      'Every service shows its terms before you choose it, so you know how you will be paid.',
    blocks: [
      {
        title: 'Pick a payment model',
        description:
          'Depending on the provider, you earn a commission for each successful introduction, or a monthly retainer plus commission.',
      },
      {
        title: 'Paid for results the provider confirms',
        description:
          'An introduction counts once the provider confirms it. You can see its status on your dashboard.',
      },
      {
        title: 'One invoice a month',
        description:
          'At month end we add up everything confirmed that month, across all providers, into a single invoice for you.',
      },
      {
        title: 'Paid to your bank account',
        description:
          'Add your bank details when you choose a paid service. You don’t need them before that.',
      },
    ],
    example: {
      title: 'A sample month',
      intro:
        'In one month, 3 introductions to a clinic and 2 to a coaching centre were confirmed. You get one invoice with both, grouped by provider, and one total.',
      // TODO: fill real amounts, or hide rows and total until figures are available
      rows: [
        'Clinic: 3 × ₹[commission] = ₹[subtotal]',
        'Coaching centre: 2 × ₹[commission] = ₹[subtotal]',
      ],
      total: 'Invoice total: ₹[total]',
      footnote:
        'Illustration only. Actual amounts depend on each provider’s terms. Introductions confirmed after month end go into the next month’s invoice.',
    },
    noGuarantee:
      'Your earnings depend on how many of your introductions the providers confirm. We don’t promise a fixed income.',
  },

  faq: {
    id: 'faq',
    eyebrow: 'FAQ',
    headline: 'Common questions',
    items: [
      {
        question: 'Who can become an affiliate?',
        answer:
          'Anyone people ask for suggestions: homemakers, students, shopkeepers, working professionals and others. You don’t need sales experience.',
      },
      {
        question: 'Does it cost anything to join?',
        answer: 'No. Joining is free, and we never ask you for a payment.',
      },
      {
        question: 'What do I need to start?',
        answer:
          'Your name, your area and an email address (or a mobile number if you don’t have email). Bank details are needed only when you choose a paid service.',
      },
      {
        question: 'How long does approval take?',
        answer:
          'Our team reviews every sign-up and lets you know by email.',
      },
      {
        question: 'Can I introduce more than one service?',
        answer: 'Yes. You can choose one or many services, in any area.',
      },
      {
        question: 'What if I don’t know enough about a service?',
        answer:
          'The sBLOOM knowledge platform has simple briefs for every service. You don’t have to memorise anything, and you can ask your questions there.',
      },
      {
        question: 'Can I share someone’s details?',
        answer:
          'Only after they clearly say yes. You confirm their permission when you submit an introduction.',
      },
      {
        question: 'How do I know my introduction counted?',
        answer:
          'Your dashboard shows the status of every introduction. It is marked confirmed when the provider confirms it.',
      },
      {
        question: 'When and how do I get paid?',
        answer:
          'Once a month. At month end you get an invoice, and we pay it to your bank account.',
      },
      {
        question: 'Do I need to know English?',
        answer:
          'No. The site is also in Telugu. Some service material may be in English only for now, and we are adding Telugu step by step.',
      },
    ],
  },

  finalCta: {
    id: 'final-cta',
    headline: 'Ready to start introducing?',
    subheading: 'Free to join. Our team reviews every sign-up.',
    primaryCta: 'Become an affiliate — it’s free',
    secondaryLink: 'Read the programme terms',
  },

  contact: {
    id: 'contact',
    heading: 'Still have a question?',
    body: 'Write to us and we’ll reply by email.',
    fields: {
      name: 'Your name',
      email: 'Your email',
      message: 'Your message',
    },
    button: 'Send message',
    privacy: 'We use your details only to reply to you.',
    success: 'Thank you. We’ll reply by email soon.',
    errorEmail: 'Please enter a valid email address.',
    errorSend: 'We couldn’t send your message. Please try again.',
  },
}

export const copyAdditionsTe = {
  whoCanJoin: {
    id: 'who-can-join',
    eyebrow: 'ఎవరు చేరవచ్చు',
    headline: 'ప్రజలు నమ్మే ఎవరైనా చేరవచ్చు.',
    subheading:
      'మీకు సేల్స్ అనుభవం, షాపు లేదా డిగ్రీ అవసరం లేదు. సలహా కోసం మిమ్మల్ని అడిగే వాళ్లు ఉంటే చాలు.',
    cards: [
      {
        title: 'గృహిణులు',
        description:
          'డాక్టర్, ట్యూషన్, స్కూల్ గురించి కుటుంబం, పొరుగువారు మిమ్మల్నే అడుగుతారు.',
      },
      {
        title: 'విద్యార్థులు',
        description:
          'కోర్సులు, కోచింగ్ గురించి స్నేహితులు, జూనియర్లు అడుగుతారు. వారికి పరిచయం చేసి, ఖాళీ సమయంలో సంపాదించండి.',
      },
      {
        title: 'షాపు యజమానులు',
        description: 'కస్టమర్లు రోజూ మీతో మాట్లాడతారు, మిమ్మల్ని నమ్ముతారు.',
      },
      {
        title: 'ఉద్యోగులు, నిపుణులు',
        description: 'సహోద్యోగులు, స్నేహితులు సలహా కోసం మిమ్మల్ని అడుగుతారు.',
      },
      {
        title: 'ఇంకా ఎవరైనా',
        description:
          'రిటైర్ అయినవారు, స్వచ్ఛంద కార్యకర్తలు, మిమ్మల్ని నమ్మే వర్గం ఉన్న ఎవరైనా.',
      },
    ],
    closing:
      'భారతదేశంలో ఎవరైనా చేరవచ్చు. చేరడం పూర్తిగా ఉచితం. మా బృందం ప్రతి దరఖాస్తును పరిశీలిస్తుంది.',
  },

  whatYouCanIntroduce: {
    id: 'what-you-can-introduce',
    eyebrow: 'మీరు పరిచయం చేయగల సేవలు',
    headline: 'మూడు రంగాలు, ఒకే వేదిక.',
    subheading:
      'మీరు పరిచయం చేయండి, సలహా ఇచ్చేది సేవా సంస్థలే. సేవలు నగరం, సంస్థను బట్టి మారవచ్చు.',
    tiles: [
      {
        title: 'విద్య',
        description: 'కోచింగ్, కోర్సులు, అడ్మిషన్లు, కెరీర్ మార్గదర్శకత్వం.',
      },
      {
        title: 'ఆరోగ్యం',
        description: 'క్లినిక్‌లు, సంప్రదింపులు, డయాగ్నస్టిక్ మరియు సంరక్షణ సేవలు.',
      },
      {
        title: 'ప్రొఫెషనల్ సేవలు',
        description:
          'వ్యాపార పత్రాలు, అకౌంటింగ్, చట్టపరమైన మరియు ఆర్థిక సహాయం అందించే అర్హత గల నిపుణులు.',
      },
    ],
    note: 'మీరు ఈ రంగాల్లో ఒకటి లేదా అనేక సేవలను పరిచయం చేయవచ్చు.',
  },

  earning: {
    id: 'earning',
    eyebrow: 'సంపాదన',
    headline: 'పరిచయం ఫలిస్తే మీకు సంపాదన.',
    subheading:
      'ప్రతి సేవ నిబంధనలు ముందే కనిపిస్తాయి, కాబట్టి మీకు ఎలా చెల్లిస్తారో తెలుస్తుంది.',
    blocks: [
      {
        title: 'చెల్లింపు విధానాన్ని ఎంచుకోండి',
        description:
          'ప్రొవైడర్‌ను బట్టి, విజయవంతమైన ప్రతి పరిచయానికి కమీషన్ లేదా నెలవారీ రిటైనర్ + కమీషన్ లభిస్తుంది.',
      },
      {
        title: 'ప్రొవైడర్ నిర్ధారించిన ఫలితాలకే చెల్లింపు',
        description:
          'ప్రొవైడర్ నిర్ధారించినప్పుడు రిఫరల్ లెక్కలోకి వస్తుంది. దాని స్థితిని మీ డాష్‌బోర్డ్‌లో చూడవచ్చు.',
      },
      {
        title: 'నెలకు ఒక ఇన్వాయిస్',
        description:
          'నెల చివరలో ఆ నెలలో నిర్ధారించినవన్నీ, అన్ని ప్రొవైడర్లవీ కలిపి మీకు ఒకే ఇన్వాయిస్ ఇస్తాం.',
      },
      {
        title: 'నేరుగా మీ బ్యాంక్ ఖాతాకు',
        description:
          'చెల్లింపు ఉన్న సేవను ఎంచుకున్నప్పుడే బ్యాంక్ వివరాలు ఇవ్వండి, అంతకుముందు అవసరం లేదు.',
      },
    ],
    example: {
      title: 'ఒక నమూనా నెల',
      intro:
        'ఒక నెలలో క్లినిక్‌కు 3 పరిచయాలు, కోచింగ్ సెంటర్‌కు 2 పరిచయాలు నిర్ధారణ అయ్యాయనుకోండి. మీకు రెండూ ప్రొవైడర్ వారీగా చూపిస్తూ ఒకే ఇన్వాయిస్, ఒకే మొత్తం వస్తుంది.',
      // TODO: fill real amounts, or hide rows and total until figures are available
      rows: [
        'క్లినిక్: 3 × ₹[కమీషన్] = ₹[ఉప మొత్తం]',
        'కోచింగ్ సెంటర్: 2 × ₹[కమీషన్] = ₹[ఉప మొత్తం]',
      ],
      total: 'ఇన్వాయిస్ మొత్తం: ₹[మొత్తం]',
      footnote:
        'ఇది ఉదాహరణ మాత్రమే. అసలు మొత్తాలు ప్రతి ప్రొవైడర్ నిబంధనలపై ఆధారపడతాయి. నెల చివరి తర్వాత నిర్ధారణ అయినవి తర్వాతి నెల ఇన్వాయిస్‌లోకి వెళ్తాయి.',
    },
    noGuarantee:
      'మీ సంపాదన ప్రొవైడర్లు ఎన్ని పరిచయాలను నిర్ధారిస్తారనే దానిపై ఆధారపడుతుంది. స్థిరమైన ఆదాయానికి మేము హామీ ఇవ్వము.',
  },

  faq: {
    id: 'faq',
    eyebrow: 'ప్రశ్నలు',
    headline: 'తరచుగా అడిగే ప్రశ్నలు',
    items: [
      {
        question: 'ఎవరు అఫిలియేట్ కావచ్చు?',
        answer:
          'సలహా కోసం ప్రజలు అడిగే ఎవరైనా: గృహిణులు, విద్యార్థులు, షాపు యజమానులు, ఉద్యోగులు, ఇతరులు. సేల్స్ అనుభవం అవసరం లేదు.',
      },
      {
        question: 'చేరడానికి ఖర్చు ఉందా?',
        answer: 'లేదు. చేరడం పూర్తిగా ఉచితం, మేము ఎప్పుడూ చెల్లింపు అడగము.',
      },
      {
        question: 'ప్రారంభించడానికి ఏం కావాలి?',
        answer:
          'మీ పేరు, ప్రాంతం, ఈమెయిల్ (ఈమెయిల్ లేకపోతే మొబైల్ నంబర్). బ్యాంక్ వివరాలు చెల్లింపు ఉన్న సేవను ఎంచుకున్నప్పుడు మాత్రమే అవసరం.',
      },
      {
        question: 'ఆమోదానికి ఎంత సమయం పడుతుంది?',
        answer:
          'మా బృందం ప్రతి దరఖాస్తును పరిశీలిస్తుంది మరియు ఈమెయిల్ ద్వారా తెలియజేస్తుంది.',
      },
      {
        question: 'ఒకటి కంటే ఎక్కువ సేవలను పరిచయం చేయవచ్చా?',
        answer:
          'చేయవచ్చు. మీరు ఏ రంగంలోనైనా ఒకటి లేదా అనేక సేవలను ఎంచుకోవచ్చు.',
      },
      {
        question: 'సేవ గురించి నాకు తెలియకపోతే ఏం చేయాలి?',
        answer:
          'sBLOOM నాలెడ్జ్ ప్లాట్‌ఫారమ్‌లో ప్రతి సేవ గురించి సులభమైన వివరణలు ఉంటాయి. మీరు ఏదీ బట్టీ పట్టాల్సిన అవసరం లేదు, సందేహాలుంటే అక్కడే అడగవచ్చు.',
      },
      {
        question: 'ఇతరుల వివరాలను పంచుకోవచ్చా?',
        answer:
          'వారు స్పష్టంగా అవును అన్న తర్వాత మాత్రమే. పరిచయాన్ని పంపేటప్పుడు వారి అనుమతిని మీరు నిర్ధారించాలి.',
      },
      {
        question: 'నా పరిచయం లెక్కలోకి వచ్చిందో ఎలా తెలుస్తుంది?',
        answer:
          'మీ డాష్‌బోర్డ్‌లో ప్రతి పరిచయం స్థితి కనిపిస్తుంది. ప్రొవైడర్ నిర్ధారించినప్పుడు అది “నిర్ధారించబడింది” అని చూపిస్తుంది.',
      },
      {
        question: 'చెల్లింపు ఎప్పుడు, ఎలా?',
        answer:
          'నెలకు ఒకసారి. నెల చివరలో ఇన్వాయిస్ వస్తుంది, మరియు మీ బ్యాంక్ ఖాతాకు చెల్లిస్తాం.',
      },
      {
        question: 'నాకు ఇంగ్లీష్ రావాలా?',
        answer:
          'అవసరం లేదు. వెబ్‌సైట్ తెలుగులో కూడా ఉంది. కొన్ని సేవల సమాచారం ప్రస్తుతానికి ఇంగ్లీష్‌లో మాత్రమే ఉండవచ్చు, తెలుగును క్రమంగా చేరుస్తున్నాం.',
      },
    ],
  },

  finalCta: {
    id: 'final-cta',
    headline: 'పరిచయం చేయడం ప్రారంభిద్దామా?',
    subheading: 'చేరడం ఉచితం. మా బృందం ప్రతి దరఖాస్తును పరిశీలిస్తుంది.',
    primaryCta: 'అఫిలియేట్ అవ్వండి — ఉచితం',
    secondaryLink: 'ప్రోగ్రామ్ నిబంధనలు చదవండి',
  },

  contact: {
    id: 'contact',
    heading: 'ఇంకా ప్రశ్న ఉందా?',
    body: 'మాకు రాయండి, ఈమెయిల్ ద్వారా సమాధానం ఇస్తాం.',
    fields: {
      name: 'మీ పేరు',
      email: 'మీ ఈమెయిల్',
      message: 'మీ సందేశం',
    },
    button: 'సందేశం పంపండి',
    privacy: 'మీకు సమాధానం ఇవ్వడానికి మాత్రమే మీ వివరాలను వాడతాం.',
    success: 'ధన్యవాదాలు. త్వరలో ఈమెయిల్ ద్వారా సమాధానం ఇస్తాం.',
    errorEmail: 'దయచేసి సరైన ఈమెయిల్ ఇవ్వండి.',
    errorSend: 'సందేశం పంపడం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
  },
}
