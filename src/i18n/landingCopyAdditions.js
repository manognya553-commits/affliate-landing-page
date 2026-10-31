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
    headline: 'ప్రజలు నమ్మే ఎవరైనా చేరవచ్చు.',
    subheading:
      'ఈ వర్గాలు ఉదాహరణలు మాత్రమే, పరిమితులు కావు. తమ పరిచయస్తులు నమ్మే భారతదేశంలోని ఎవరైనా చేరవచ్చు—సేల్స్ అనుభవం లేదా డిగ్రీ అవసరం లేదు.',
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
          'వ్యాపారవేత్తలు, ఫ్రీలాన్సర్లు, రిటైర్ అయినవారు, కమ్యూనిటీ కార్యకర్తలు, లేదా ప్రజలు నమ్మే ఎవరైనా.',
      },
    ],
    closing:
      'నమ్మకమైన పరిచయాలు ఉన్న భారతదేశంలోని ఎవరైనా చేరవచ్చు. చేరడం పూర్తిగా ఉచితం.',
  },

  whatYouCanIntroduce: {
    id: 'what-you-can-introduce',
    eyebrow: 'సేవా రంగాలు',
    headline: 'పరిచయాల ఒకే నెట్‌వర్క్. అవకాశాల మూడు రంగాలు.',
    subheading:
      'అఫిలియేట్లు వేదికపై హెల్త్‌కేర్, విద్య, మరియు ప్రొఫెషనల్ సేవలన్నింటిలోనూ సేవలను పరిచయం చేయవచ్చు. మీరు పరిచయం చేయండి, సలహా ఇచ్చేది సేవా సంస్థలే.',
    tiles: [
      {
        title: 'హెల్త్‌కేర్',
        description: 'తగిన హెల్త్‌కేర్ సేవ కోసం చూస్తున్న వారిని సంబంధిత ప్రొవైడర్‌కు పరిచయం చేయండి.',
      },
      {
        title: 'విద్య',
        description: 'విద్యార్థులు మరియు కుటుంబాలను సంబంధిత విద్యా సేవలతో అనుసంధానించండి.',
      },
      {
        title: 'ప్రొఫెషనల్ సేవలు',
        description:
          'వ్యాపారాలు మరియు వ్యక్తులను వారి అవసరాలకు సరిపోయే సర్వీస్ ప్రొవైడర్లకు పరిచయం చేయండి.',
      },
    ],
    note: 'రిఫరల్ యొక్క అర్హత మరియు పరిహారం సంబంధిత ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటాయి.',
  },

  earning: {
    id: 'earning',
    eyebrow: 'sBLOOM ఎందుకు',
    headline: 'కేవలం రిఫరల్స్ చేయడం కంటే ఎక్కువ.',
    subheading:
      'నమ్మకంతో పరిచయం చేయడానికి sBLOOM మీకు సమాచారం, స్పష్టత మరియు విధానాన్ని అందిస్తుంది:',
    blocks: [
      {
        title: 'పరిచయం చేసే ముందే తెలుసుకోండి',
        description: 'సేవలు మరియు ప్రొవైడర్ల గురించి అర్థం చేసుకోండి.',
      },
      {
        title: 'ఆత్మవిశ్వాసంతో రిఫర్ చేయండి',
        description: 'మరింత సమాచారంతో కూడిన పరిచయాలు చేయడానికి సంబంధిత వివరాలను ఉపయోగించండి.',
      },
      {
        title: 'నిబంధనలను తెలుసుకోండి',
        description: 'రిఫర్ చేసే ముందే ప్రొవైడర్ పరిహార నిబంధనలను సమీక్షించండి.',
      },
      {
        title: 'మీ నెట్‌వర్క్ చుట్టూ నిర్మించండి',
        description: 'ప్రజల అవసరాలకు నిజంగా సరిపోయే సేవలను పరిచయం చేయండి.',
      },
    ],
    caution:
      'పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది మరియు వర్తించే నిబంధనలకు లోబడి ఉంటుంది. చేరడం మరియు రిఫరల్ చేయడం వల్ల ఆదాయానికి హామీ ఉండదు.',
    noGuarantee:
      'ఆదాయం ప్రతి ప్రొవైడర్ నిబంధనలు మరియు మీ రిఫరల్స్ అర్హతపై ఆధారపడి ఉంటుంది. ఆదాయానికి హామీ లేదు.',
  },

  faq: {
    id: 'faq',
    eyebrow: 'ప్రశ్నలు',
    headline: 'తరచుగా అడిగే ప్రశ్నలు',
    items: [
      {
        question: 'sBLOOM అఫిలియేట్‌గా నేను డబ్బు సంపాదించవచ్చా?',
        answer:
          'అవును, అర్హత కలిగిన రిఫరల్స్ ద్వారా సంపాదించే అవకాశాన్ని ఈ ప్రోగ్రామ్ అందిస్తుంది. రిఫరల్ అర్హత పొందుతుందా లేదా మరియు ఏ పరిహారం వర్తిస్తుంది అనేది సంబంధిత సర్వీస్ ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటుంది. ఆదాయానికి హామీ లేదు.',
      },
      {
        question: 'ప్రతి రిఫరల్‌కు నేను ఎంత సంపాదించగలను?',
        answer:
          'పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది. వర్తించే మొత్తం లేదా చెల్లింపు విధానం మరియు అర్హత షరతులు ప్రొవైడర్ ద్వారా తెలియజేయబడతాయి. మేము సార్వత్రిక కమీషన్ రేటును ప్రచురించము.',
      },
      {
        question: 'నేను పరిచయం చేసే ప్రతి వ్యక్తికి నాకు చెల్లింపు లభిస్తుందా?',
        answer:
          'ఖచ్చితంగా కాదు. పరిహారం ప్రొవైడర్ నిబంధనలు మరియు రిఫరల్ వర్తించే షరతులను నెరవేరుస్తుందా లేదా అనే దానిపై ఆధారపడి ఉంటుంది.',
      },
      {
        question: 'చేరడానికి నేను డబ్బు చెల్లించాలా?',
        answer: 'లేదు. sBLOOM అఫిలియేట్ ప్రోగ్రామ్‌లో చేరడం పూర్తిగా ఉచితం.',
      },
      {
        question: 'నాకు చెల్లింపు ఎప్పుడు అందుతుంది?',
        answer:
          'చెల్లింపు సమయం సంబంధిత ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటుంది. నిర్దిష్ట కాలక్రమం ధృవీకరించబడినప్పుడు మాత్రమే తెలియజేయబడుతుంది.',
      },
      {
        question: 'ఎవరు అఫిలియేట్ కావచ్చు?',
        answer:
          'సలహా కోసం ప్రజలు అడిగే ఎవరైనా: విద్యార్థులు, గృహిణులు, షాపు యజమానులు, ఉద్యోగులు, వ్యాపారవేత్తలు, ఫ్రీలాన్సర్లు, ఇతరులు. ఇవి ఉదాహరణలు మాత్రమే, పరిమితులు కావు. సేల్స్ అనుభవం అవసరం లేదు.',
      },
      {
        question: 'నేను గృహిణిని. నేను ఇది చేయవచ్చా?',
        answer:
          'అవును. మీ చుట్టూ ఉన్నవారు మీ మాటను నమ్మితే, మీరు ఆసక్తి వ్యక్తం చేయవచ్చు. మీ ఫోన్ నుండి రెండు నిమిషాల్లో చేయవచ్చు.',
      },
      {
        question: 'నేను నిపుణురాలిని/నిపుణుడిని కావాలా?',
        answer:
          'కాదు. మీరు పరిచయం చేస్తారు, సేవా సంస్థ సలహా ఇస్తుంది. ప్లాట్‌ఫారమ్‌లోని వివరణలు ప్రతి సేవను అర్థం చేసుకోవడానికి సహాయపడతాయి.',
      },
      {
        question: 'నేను ప్రజలను ఒప్పించాలా లేదా ఒత్తిడి చేయాలా?',
        answer:
          'లేదు. సేవ అవసరమై, పరిచయానికి అంగీకరించిన వారిని మాత్రమే మీరు పరిచయం చేస్తారు. ఒత్తిడి లేదు.',
      },
      {
        question: 'నాకు ఉద్యోగం ఉంది. నేను చేరవచ్చా?',
        answer:
          'మీ ఉద్యోగంతో పాటే మీరు ఆసక్తిని వ్యక్తం చేయవచ్చు. మేము సంప్రదించినప్పుడు వివరాలు వివరిస్తాము.',
      },
      {
        question: 'నేను దీన్ని తెలుగులో ఉపయోగించవచ్చా?',
        answer:
          'ఈ పేజీ తెలుగు మరియు ఇంగ్లీషులో అందుబాటులో ఉంది. ప్లాట్‌ఫారమ్ ఏయే భాషలకు మద్దతు ఇస్తుందో చేరిన తర్వాత తెలియజేస్తాము.',
      },
      {
        question: 'నా సమాచారం, నా స్నేహితుల సమాచారం సురక్షితమేనా?',
        answer:
          'ఎవరైనా అంగీకరించిన తర్వాత మాత్రమే వివరాలను పంచుకోండి. సమాచారం ప్రోగ్రామ్ కోసం మాత్రమే ఉపయోగించబడుతుంది.',
      },
    ],
  },

  finalCta: {
    id: 'final-cta',
    headline: 'మీ తదుపరి పరిచయం ఒక అవకాశాన్ని తెరవవచ్చు.',
    subheading:
      'sBLOOM అఫిలియేట్ ప్రోగ్రామ్‌లో ఉచితంగా చేరండి మరియు మీ నమ్మకమైన పరిచయాలు ఎలా సంపాదన అవకాశంగా మారవచ్చో అన్వేషించండి.',
    disclaimer:
      'పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది మరియు వర్తించే నిబంధనలకు లోబడి ఉంటుంది. చేరడం మరియు రిఫరల్ చేయడం వల్ల ఆదాయానికి హామీ ఉండదు.',
    primaryCta: 'అఫిలియేట్ అవ్వండి — ఉచితం',
    secondaryLink: 'ప్రోగ్రామ్ నిబంధనలు చదవండి',
    button: 'అఫిలియేట్ అవ్వండి',
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
