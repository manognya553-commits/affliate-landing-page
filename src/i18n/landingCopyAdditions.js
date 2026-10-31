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
      'These profiles are examples, not eligibility restrictions. Anyone whose circle trusts their recommendations can join—no sales background or degree required.',
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
          'Entrepreneurs, freelancers, community connectors, retired people, or anyone whose circle trusts them.',
      },
    ],
    closing: 'Open to anyone in India with a trusted network. Free to join.',
  },

  whatYouCanIntroduce: {
    id: 'what-you-can-introduce',
    eyebrow: 'Three service sectors',
    headline: 'One network of connections. Three areas of opportunity.',
    subheading:
      'You can introduce relevant offerings across healthcare, education, and professional services on the platform. You introduce. The providers advise.',
    tiles: [
      {
        title: 'Healthcare',
        description: 'Introduce someone looking for a suitable healthcare service to a relevant provider.',
      },
      {
        title: 'Education',
        description: 'Connect students and families with relevant educational services.',
      },
      {
        title: 'Professional Services',
        description:
          'Introduce businesses and individuals to providers whose services may meet their needs.',
      },
    ],
    note: 'A referral’s eligibility and compensation depend on the relevant provider’s terms.',
  },

  earning: {
    id: 'earning',
    eyebrow: 'Why sBLOOM',
    headline: 'More than just making referrals.',
    subheading:
      'sBLOOM gives you the information, clarity and structure to introduce with confidence:',
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

  faq: {
    id: 'faq',
    eyebrow: 'FAQ',
    headline: 'Frequently asked questions',
    items: [
      {
        question: 'Can I earn money as an sBLOOM affiliate?',
        answer:
          'Yes, the programme offers an opportunity to earn through eligible referrals. Whether a referral qualifies and what compensation applies depend on the relevant service provider’s terms. Earnings are not guaranteed.',
      },
      {
        question: 'How much can I earn per referral?',
        answer:
          'Compensation varies by service provider. The applicable amount or payment arrangement and qualifying conditions should be communicated by the provider. We do not publish a universal commission rate.',
      },
      {
        question: 'Do I get paid for every person I introduce?',
        answer:
          'Not necessarily. Compensation depends on the provider’s terms and whether the referral meets the applicable conditions.',
      },
      {
        question: 'Do I need to pay to join?',
        answer: 'No. Joining the sBLOOM Affiliate Programme is free.',
      },
      {
        question: 'When will I receive payment?',
        answer:
          'Payment timing depends on the relevant provider’s terms. Specific timelines should be communicated only when they have been confirmed.',
      },
      {
        question: 'Who can become an affiliate?',
        answer:
          'Anyone people ask for suggestions: students, homemakers, shopkeepers, working professionals, entrepreneurs, freelancers, and others. These are examples, not restrictions. You don’t need sales experience.',
      },
      {
        question: 'I’m a homemaker. Can I do this?',
        answer:
          'Yes. If people around you trust your word, you can express interest. You can do it from your phone in a couple of minutes.',
      },
      {
        question: 'Do I need to be an expert?',
        answer:
          'No. You introduce, and the provider advises. The briefs in the platform help you understand each service.',
      },
      {
        question: 'Do I have to convince or push people?',
        answer:
          'No. You only introduce people who need a service and say yes to being introduced. No pressure.',
      },
      {
        question: 'I have a job. Can I join?',
        answer:
          'You can express interest while you work. We’ll explain what’s expected when we get in touch.',
      },
      {
        question: 'Can I use this in Telugu?',
        answer:
          'This page is available in Telugu and English. We’ll tell you which languages the platform and briefs support when you join.',
      },
      {
        question: 'Is my information, and my friends’ information, safe?',
        answer:
          'Share details only after someone says yes. Information is used only for the programme.',
      },
    ],
  },

  finalCta: {
    id: 'final-cta',
    headline: 'Your next introduction could open an opportunity.',
    subheading:
      'Join the sBLOOM Affiliate Programme for free and explore how your trusted connections can become an earning opportunity.',
    disclaimer:
      'Compensation varies by service provider and is subject to the applicable terms. Joining and making a referral do not guarantee earnings.',
    primaryCta: 'Become an affiliate — it’s free',
    secondaryLink: 'Read the programme terms',
    button: 'Become an affiliate — it’s free',
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
    headline: 'ప్రజలు మీ మాట వింటే, మీరు చేరవచ్చు.',
    subheading:
      'పరిచయాలు ఉండి, ఇతరులకు సాయం చేసే ఎవరైనా చేరవచ్చు. సేల్స్ అనుభవం అక్కర్లేదు.',
    cards: [
      {
        title: 'గృహిణులు',
        description:
          'డాక్టర్లు, ట్యూషన్ల గురించి ఇరుగుపొరుగు మీ సలహానే అడుగుతారు.',
      },
      {
        title: 'విద్యార్థులు',
        description:
          'కోర్సులు, కోచింగ్‌ల గురించి జూనియర్లు అడుగుతుంటారు. ఖాళీ సమయంలో సంపాదించండి.',
      },
      {
        title: 'షాపు వాళ్లు',
        description: 'కస్టమర్లు రోజూ మాట్లాడతారు, మిమ్మల్ని నమ్ముతారు.',
      },
      {
        title: 'ఉద్యోగులు',
        description: 'స్నేహితులు, కొలీగ్స్‌కు అవసరమైన సేవలను పరిచయం చేయవచ్చు.',
      },
      {
        title: 'ఇంకా ఎవరైనా',
        description:
          'రిటైర్ అయినవాళ్లు, కమ్యూనిటీ లీడర్లు — నమ్మకమైన పరిచయాలు ఉన్న ఎవరైనా.',
      },
    ],
    closing:
      'నమ్మకమైన పరిచయాలు ఉన్న ఎవరైనా చేరవచ్చు. చేరడం పూర్తిగా ఉచితం.',
  },

  whatYouCanIntroduce: {
    id: 'what-you-can-introduce',
    eyebrow: 'సేవా రంగాలు',
    headline: 'ఒకే చోట పరిచయాలు. మూడు రకాల అవకాశాలు.',
    subheading:
      'హెల్త్‌కేర్, విద్య, ప్రొఫెషనల్ సర్వీసుల్లో మీకు తెలిసిన వాళ్లను పరిచయం చేయవచ్చు. సలహాలు నిపుణులే ఇస్తారు.',
    tiles: [
      {
        title: 'హెల్త్‌కేర్',
        description: 'డాక్టర్లు, ఆసుపత్రులు లేదా కేర్ సర్వీసులు కావాల్సిన వాళ్లకు పరిచయం చేయండి.',
      },
      {
        title: 'విద్య',
        description: 'కోర్సులు, కోచింగ్ వెతుకుతున్న విద్యార్థులను మంచి సంస్థలకు కనెక్ట్ చేయండి.',
      },
      {
        title: 'ప్రొఫెషనల్ సేవలు',
        description:
          'వ్యాపారాలు, లీగల్ లేదా అకౌంటింగ్ పనులకు కావాల్సిన నిపుణులను చూపించండి.',
      },
    ],
    note: 'పరిహారం ఆయా సంస్థల నిబంధనలపై ఆధారపడి ఉంటుంది.',
  },

  earning: {
    id: 'earning',
    eyebrow: 'sBLOOM ఎందుకు',
    headline: 'కేవలం పరిచయాలు చేయడం మాత్రమే కాదు.',
    subheading:
      'నమ్మకంగా పరిచయం చేయడానికి sBLOOM మీకు పూర్తి స్పష్టత ఇస్తుంది:',
    blocks: [
      {
        title: 'ముందే తెలుసుకోండి',
        description: 'సేవలు, సంస్థల వివరాలు ముందే అర్థం చేసుకోండి.',
      },
      {
        title: 'నమ్మకంగా చెప్పండి',
        description: 'స్పష్టమైన సమాచారంతో పరిచయం చేయండి.',
      },
      {
        title: 'నిబంధనలు చూడండి',
        description: 'రిఫర్ చేసే ముందే పరిహార షరతులు తెలుసుకోండి.',
      },
      {
        title: 'అవసరమైన వాటినే చెప్పండి',
        description: 'ప్రజల అవసరాలకు సరిపోయే సేవలను మాత్రమే పరిచయం చేయండి.',
      },
    ],
    caution:
      'పరిహారం సంస్థల నిబంధనలపై ఆధారపడి ఉంటుంది. ఆదాయానికి హామీ ఉండదు. చేరడం ఉచితం.',
    noGuarantee:
      'ఆదాయం ప్రొవైడర్ నిబంధనలపై, రిఫరల్ అర్హతపై ఆధారపడి ఉంటుంది. హామీ లేదు.',
  },

  faq: {
    id: 'faq',
    eyebrow: 'ప్రశ్నలు',
    headline: 'తరచుగా అడిగే ప్రశ్నలు',
    items: [
      {
        question: 'sBLOOM లో నేను డబ్బు సంపాదించవచ్చా?',
        answer:
          'అవును. మీ రిఫరల్ ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత సాధిస్తే సంపాదించవచ్చు. అయితే ఆదాయానికి ఎలాంటి గ్యారెంటీ ఉండదు.',
      },
      {
        question: 'ప్రతి రిఫరల్‌కు ఎంత వస్తుంది?',
        answer:
          'ఆ మొత్తం ఆయా సేవా సంస్థ నిబంధనలపై ఆధారపడి ఉంటుంది. ఫిక్స్‌డ్ రేటు ఉండదు, ముందే వివరాలు తెలుస్తాయి.',
      },
      {
        question: 'పరిచయం చేసిన ప్రతిసారీ డబ్బులు వస్తాయా?',
        answer:
          'రాకపోవచ్చు. ఆ వ్యక్తి సర్వీస్ తీసుకుని, ప్రొవైడర్ షరతులు పూర్తయినప్పుడే పరిహారం అందుతుంది.',
      },
      {
        question: 'చేరడానికి డబ్బులు కట్టాలా?',
        answer: 'లేదు. sBLOOM లో చేరడం పూర్తిగా ఉచితం.',
      },
      {
        question: 'డబ్బులు ఎప్పుడు అందుతాయి?',
        answer:
          'ఆయా సంస్థల పేమెంట్ షెడ్యూల్ ప్రకారం అందుతాయి.',
      },
      {
        question: 'ఎవరు అఫిలియేట్ కావచ్చు?',
        answer:
          'నమ్మకమైన పరిచయాలు ఉన్న ఎవరైనా: విద్యార్థులు, గృహిణులు, షాపు వాళ్లు, ఉద్యోగులు. సేల్స్ అనుభవం అక్కర్లేదు.',
      },
      {
        question: 'నేను గృహిణిని. నేను చేయవచ్చా?',
        answer:
          'తప్పకుండా! మీ మాటపై నమ్మకం ఉంటే చాలు. రోజూ ఫోన్ నుంచే చేసుకోవచ్చు.',
      },
      {
        question: 'నేను నిపుణుడిని కావాలా?',
        answer:
          'అక్కర్లేదు. మీరు కేవలం పరిచయం చేస్తారు, సలహాలు నిపుణులే ఇస్తారు.',
      },
      {
        question: 'ఎవరినైనా ఒప్పించాలా లేదా బలవంతం చేయాలా?',
        answer:
          'అస్సలు వద్దు. వాళ్లకి అవసరమై, సరే అన్నప్పుడే పరిచయం చేయండి.',
      },
      {
        question: 'ఉద్యోగం చేస్తూ చేయవచ్చా?',
        answer:
          'చేయవచ్చు. ఉద్యోగానికి ఇబ్బంది లేకుండా ఖాళీ సమయంలో చేసుకోవచ్చు.',
      },
      {
        question: 'దీన్ని తెలుగులో వాడవచ్చా?',
        answer:
          'అవును. ఈ వెబ్‌సైట్ తెలుగు మరియు ఇంగ్లీషులో అందుబాటులో ఉంది.',
      },
      {
        question: 'మా వివరాలు సురక్షితమేనా?',
        answer:
          'పూర్తిగా సురక్షితం. వాళ్ల అనుమతి లేకుండా ఎవరి వివరాలూ ఎవరికీ ఇవ్వము.',
      },
    ],
  },

  finalCta: {
    id: 'final-cta',
    headline: 'మీ పరిచయంతో కొత్త అవకాశం ప్రారంభించండి.',
    subheading:
      'sBLOOM లో ఉచితంగా చేరండి. మీ నమ్మకమైన పరిచయాలతో సంపాదించే మార్గాన్ని చూడండి.',
    disclaimer:
      'పరిహారం సంస్థల నిబంధనలపై ఆధారపడి ఉంటుంది. ఆదాయానికి ఎలాంటి హామీ ఉండదు. చేరడం ఉచితం.',
    primaryCta: 'అఫిలియేట్ అవ్వండి — ఉచితం',
    secondaryLink: 'నిబంధనలు చదవండి',
    button: 'అఫిలియేట్ అవ్వండి',
  },

  contact: {
    id: 'contact',
    heading: 'ఇంకా సందేహాలు ఉన్నాయా?',
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
