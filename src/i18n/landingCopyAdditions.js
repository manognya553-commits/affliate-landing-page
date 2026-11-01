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
    headline: 'ప్రజలు మీ మాట వింటే, మీరు జాయిన్ అవ్వచ్చు.',
    subheading:
      'నమ్మకమైన పరిచయాలు ఉండి, హెల్ప్ చేసే ఎవరైనా చేరవచ్చు. సేల్స్ ఎక్స్‌పీరియన్స్ అక్కర్లేదు.',
    cards: [
      {
        title: 'హౌస్‌వైవ్స్',
        description:
          'ఫ్యామిలీ, నైబర్స్ డాక్టర్లు, ట్యూషన్ల గురించి మిమ్మల్నే అడుగుతారు.',
      },
      {
        title: 'స్టూడెంట్స్',
        description:
          'ఫ్రెండ్స్, జూనియర్లు కోర్సులు, కోచింగ్ గురించి అడుగుతుంటారు. ఫ్రీ టైమ్‌లో ఎర్న్ చేయండి.',
      },
      {
        title: 'షాపు వాళ్లు',
        description: 'కస్టమర్లు రోజూ మాట్లాడతారు, మిమ్మల్ని నమ్ముతారు.',
      },
      {
        title: 'జాబ్ చేసేవాళ్లు',
        description: 'కొలీగ్స్, ఫ్రెండ్స్‌కు అవసరమైన సర్వీసెస్ పరిచయం చేయవచ్చు.',
      },
      {
        title: 'ఇంకా ఎవరైనా',
        description:
          'రిటైర్ అయినవాళ్లు, కమ్యూనిటీ కనెక్టర్స్ — నమ్మకమైన పరిచయాలు ఉన్న ఎవరైనా.',
      },
    ],
    closing:
      'నమ్మకమైన పరిచయాలు ఉన్న ఎవరైనా చేరవచ్చు. చేరడం పూర్తిగా ఫ్రీ.',
  },

  whatYouCanIntroduce: {
    id: 'what-you-can-introduce',
    eyebrow: 'సర్వీస్ సెక్టార్స్',
    headline: 'ఒకే చోట పరిచయాలు. 3 రకాల అవకాశాలు.',
    subheading:
      'హెల్త్‌కేర్, ఎడ్యుకేషన్, ప్రొఫెషనల్ సర్వీసెస్‌లో మీకు తెలిసిన వాళ్లను పరిచయం చేయవచ్చు. సలహాలు ఎక్స్‌పర్ట్స్ ఇస్తారు.',
    tiles: [
      {
        title: 'హెల్త్‌కేర్',
        description: 'డాక్టర్లు, హాస్పిటల్స్ లేదా కేర్ సర్వీసెస్ కావాల్సిన వాళ్లకు పరిచయం చేయండి.',
      },
      {
        title: 'ఎడ్యుకేషన్',
        description: 'కోర్సులు, కోచింగ్ వెతుకుతున్న వాళ్లను మంచి ఇన్‌స్టిట్యూట్స్‌కి కనెక్ట్ చేయండి.',
      },
      {
        title: 'ప్రొఫెషనల్ సర్వీసెస్',
        description:
          'బిజినెస్, లీగల్ లేదా అకౌంటింగ్ పనులకు కావాల్సిన ఎక్స్‌పర్ట్స్‌ని చూపించండి.',
      },
    ],
    note: 'సంపాదన ఆయా ప్రొవైడర్స్ కండిషన్స్‌పై ఆధారపడి ఉంటుంది.',
  },

  earning: {
    id: 'earning',
    eyebrow: 'sBLOOM ఎందుకు',
    headline: 'కేవలం పరిచయాలు చేయడం మాత్రమే కాదు.',
    subheading:
      'కాన్ఫిడెంట్‌గా పరిచయం చేయడానికి sBLOOM మీకు పూర్తి క్లారిటీ ఇస్తుంది:',
    blocks: [
      {
        title: 'ముందే తెలుసుకోండి',
        description: 'సర్వీసెస్, ప్రొవైడర్స్ డీటెయిల్స్ ముందే అర్థం చేసుకోండి.',
      },
      {
        title: 'కాన్ఫిడెంట్‌గా చెప్పండి',
        description: 'సరైన ఇన్ఫర్మేషన్‌తో పరిచయం చేయండి.',
      },
      {
        title: 'కండిషన్స్ చూడండి',
        description: 'రెఫర్ చేసే ముందే పేమెంట్ రూల్స్ తెలుసుకోండి.',
      },
      {
        title: 'కరెక్ట్ సర్వీస్ చెప్పండి',
        description: 'వాళ్ల నీడ్‌కి సరిపోయే సర్వీసెస్‌ని మాత్రమే పరిచయం చేయండి.',
      },
    ],
    caution:
      'సంపాదన ప్రొవైడర్స్ కండిషన్స్‌పై ఆధారపడి ఉంటుంది. ఆదాయానికి ఎలాంటి గ్యారెంటీ ఉండదు. చేరడం ఫ్రీ.',
    noGuarantee:
      'ఆదాయం ప్రొవైడర్ రూల్స్‌పై, రెఫరల్ ఎలిజిబిలిటీపై ఆధారపడి ఉంటుంది. గ్యారెంటీ లేదు.',
  },

  faq: {
    id: 'faq',
    eyebrow: 'ప్రశ్నలు',
    headline: 'తరచుగా అడిగే ప్రశ్నలు',
    items: [
      {
        question: 'sBLOOM లో నేను మనీ ఎర్న్ చేయవచ్చా?',
        answer:
          'అవును. మీ రెఫరల్ ప్రొవైడర్ కండిషన్స్ ప్రకారం ఎలిజిబుల్ అయితే సంపాదించవచ్చు. అయితే ఆదాయానికి గ్యారెంటీ ఉండదు.',
      },
      {
        question: 'ప్రతి రెఫరల్‌కి ఎంత వస్తుంది?',
        answer:
          'ఆ అమౌంట్ ఆయా సర్వీస్ ప్రొవైడర్ కండిషన్స్‌పై ఆధారపడి ఉంటుంది. ఫిక్స్‌డ్ రేటు ఉండదు, ముందే డీటెయిల్స్ తెలుస్తాయి.',
      },
      {
        question: 'పరిచయం చేసిన ప్రతిసారీ మనీ వస్తుందా?',
        answer:
          'రాకపోవచ్చు. ఆ వ్యక్తి సర్వీస్ తీసుకుని, ప్రొవైడర్ రూల్స్ పూర్తయినప్పుడే పేమెంట్ అందుతుంది.',
      },
      {
        question: 'జాయిన్ అవ్వడానికి మనీ కట్టాలా?',
        answer: 'లేదు. sBLOOM లో చేరడం పూర్తిగా ఫ్రీ.',
      },
      {
        question: 'పేమెంట్ ఎప్పుడు వస్తుంది?',
        answer:
          'ఆయా ప్రొవైడర్స్ పేమెంట్ షెడ్యూల్ ప్రకారం అందుతుంది.',
      },
      {
        question: 'ఎవరు అఫిలియేట్ కావచ్చు?',
        answer:
          'నమ్మకమైన పరిచయాలు ఉన్న ఎవరైనా: స్టూడెంట్స్, హౌస్‌వైవ్స్, షాపు వాళ్లు, ఉద్యోగులు. సేల్స్ ఎక్స్‌పీరియన్స్ అక్కర్లేదు.',
      },
      {
        question: 'నేను హౌస్‌వైఫ్‌ని. నేను చేయవచ్చా?',
        answer:
          'తప్పకుండా! మీ మాటపై నమ్మకం ఉంటే చాలు. రోజూ మొబైల్ నుంచే చేసుకోవచ్చు.',
      },
      {
        question: 'నేను ఎక్స్‌పర్ట్ అయి ఉండాలా?',
        answer:
          'అక్కర్లేదు. మీరు కేవలం పరిచయం చేస్తారు, సలహాలు ఎక్స్‌పర్ట్స్ ఇస్తారు.',
      },
      {
        question: 'ఎవరినైనా కన్విన్స్ చేయాలా లేదా ఫోర్స్ చేయాలా?',
        answer:
          'అస్సలు వద్దు. వాళ్లకి అవసరమై, ఓకే అన్నప్పుడే పరిచయం చేయండి. నో ప్రెజర్.',
      },
      {
        question: 'జాబ్ చేస్తూ చేయవచ్చా?',
        answer:
          'చేయవచ్చు. జాబ్‌కి ఇబ్బంది లేకుండా ఫ్రీ టైమ్‌లో చేసుకోవచ్చు.',
      },
      {
        question: 'దీన్ని తెలుగులో యూజ్ చేయవచ్చా?',
        answer:
          'అవును. ఈ వెబ్‌సైట్ తెలుగు మరియు ఇంగ్లీషులో ఉంది.',
      },
      {
        question: 'మా డీటెయిల్స్ సేఫేనా?',
        answer:
          'పూర్తిగా సేఫ్. వాళ్ల పర్మిషన్ లేకుండా ఎవరి డీటెయిల్స్ ఎవరికీ ఇవ్వము.',
      },
    ],
  },

  finalCta: {
    id: 'final-cta',
    headline: 'మీ పరిచయంతో కొత్త అవకాశం స్టార్ట్ చేయండి.',
    subheading:
      'sBLOOM లో ఫ్రీగా జాయిన్ అవ్వండి. మీకు తెలిసిన వాళ్లకు మంచి సర్వీసెస్ చూపిస్తూ ఎర్న్ చేయండి.',
    disclaimer:
      'సంపాదన ప్రొవైడర్ కండిషన్స్‌పై ఆధారపడి ఉంటుంది. ఆదాయానికి ఎలాంటి గ్యారెంటీ ఉండదు. చేరడం ఫ్రీ.',
    primaryCta: 'అఫిలియేట్ అవ్వండి — ఫ్రీ',
    secondaryLink: 'రూల్స్ చదవండి',
    button: 'అఫిలియేట్ అవ్వండి',
  },

  contact: {
    id: 'contact',
    heading: 'ఇంకా డౌట్స్ ఉన్నాయా?',
    body: 'మాకు మెసేజ్ పంపండి, ఈమెయిల్ ద్వారా రిప్లై ఇస్తాం.',
    fields: {
      name: 'మీ పేరు',
      email: 'మీ ఈమెయిల్',
      message: 'మీ మెసేజ్',
    },
    button: 'మెసేజ్ పంపండి',
    privacy: 'మీకు రిప్లై ఇవ్వడానికి మాత్రమే మీ డీటెయిల్స్ వాడతాం.',
    success: 'ధన్యవాదాలు. త్వరలో ఈమెయిల్ ద్వారా రిప్లై ఇస్తాం.',
    errorEmail: 'దయచేసి సరైన ఈమెయిల్ ఎంటర్ చేయండి.',
    errorSend: 'మెసేజ్ వెళ్లలేదు. దయచేసి మళ్లీ ట్రై చేయండి.',
  },
}
