/**
 * sBLOOM Affiliate Programme — Draft Telugu Translations
 * NOTE: Every string in this file is a working draft translation.
 * Every line is marked [needs native review] per user guidelines.
 * Source translations listed in docs/telugu-review.md.
 */

import { copyAdditionsTe } from './landingCopyAdditions'

export const teDraft = {
  // Navigation [needs native review]
  nav: {
    brandSubtitle: 'అఫిలియేట్ ప్రోగ్రామ్', // [needs native review]
    links: [
      { id: 'why-join', label: 'ఎందుకు చేరాలి', href: '#why-join' }, // [needs native review]
      { id: 'how-it-works', label: 'ఇది ఎలా పనిచేస్తుంది', href: '#how-it-works' }, // Confirmed in Section 6
      { id: 'who-can-join', label: 'ఎవరు చేరవచ్చు', href: '#who-can-join' }, // [needs native review]
      { id: 'earning', label: 'సంపాదన', href: '#earning' }, // [needs native review]
      { id: 'faq', label: 'ప్రశ్నలు', href: '#faq' }, // [needs native review]
    ],
    cta: 'అఫిలియేట్ అవ్వండి', // Confirmed in Section 6
  },

  // Hero Section [needs native review]
  hero: {
    eyebrow: 'sBLOOM అఫిలియేట్ ప్రోగ్రామ్ · సర్వీస్ అడ్వైజర్ల నెట్‌వర్క్', // [needs native review]
    headlineLead: 'మీకు తెలిసిన వారికి సరైన సేవను చూపించండి.', // Confirmed in Section 6
    headlineAccent: 'ఫలితం వస్తే మీకూ సంపాదన.', // Confirmed in Section 6
    subheading:
      'మీ స్నేహితులు, కుటుంబ సభ్యులు మరియు మీ కమ్యూనిటీలోని వారికి సరైన సేవలను కనుగొనడంలో మీరు ఇప్పటికే సహాయం చేస్తున్నారు. sBLOOM తో, మీరు సర్వీస్ ప్రొవైడర్లకు తగిన పరిచయాలు చేయవచ్చు మరియు ఆ పరిచయాలు ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత పొందినప్పుడు సంపాదించే అవకాశాన్ని అన్వేషించవచ్చు.', // [needs native review]
    primaryCta: 'అఫిలియేట్ అవ్వండి — ఉచితం', // [needs native review]
    secondaryCta: 'ఇది ఎలా పనిచేస్తుందో చూడండి', // [needs native review]
    trustRow: [
      'చేరడం పూర్తిగా ఉచితం', // Confirmed in Section 6
      'భారతదేశంలో ఎవరైనా చేరవచ్చు', // [needs native review]
      'నిబంధనలను ముందే చూడవచ్చు', // [needs native review]
      'నిబంధనల ప్రకారం సంపాదన', // [needs native review]
    ],
    bubbles: {
      ask: '“మంచి డాక్టర్ ఎవరైనా తెలుసా?”', // [needs native review]
      reply: '“క్లినిక్‌లు మరియు సంరక్షణ సేవలకు ప్రజలను అనుసంధానించే వేదికలో నేను ఉన్నాను.”', // [needs native review]
      askSpeaker: 'పొరుగువారు', // [needs native review]
      replySpeaker: 'మీరు (అఫిలియేట్)', // [needs native review]
    },
  },

  // Sound familiar? (Why Join Section) [needs native review]
  soundFamiliar: {
    eyebrow: 'ఎందుకు చేరాలి',
    headline: 'మీ పరిచయాలు ఒక సంపాదన అవకాశంగా మారవచ్చు.', // [needs native review]
    subheading:
      'మీ స్నేహితులు, కుటుంబ సభ్యులు మరియు మీ కమ్యూనిటీలోని వారికి సరైన సేవలను కనుగొనడంలో మీరు ఇప్పటికే సహాయం చేస్తున్నారు. sBLOOM తో, మీరు సర్వీస్ ప్రొవైడర్లకు తగిన పరిచయాలు చేయవచ్చు మరియు ఆ పరిచయాలు ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత పొందినప్పుడు సంపాదించే అవకాశాన్ని అన్వేషించవచ్చు.', // [needs native review]
    trustLine: 'చేరడం ఉచితం. సేల్స్ అనుభవం అవసరం లేదు. ఆదాయానికి హామీ లేదు.', // [needs native review]
    conclusion:
      'మీరు ప్రతి వారం మనస్ఫూర్తిగా, ఉచితంగా సమాధానం ఇస్తున్నారు. sBLOOM ఆ క్షణాలకు ఒక పద్ధతిని, మీ పరిచయం ద్వారా ఫలితం వచ్చినప్పుడు ఒక ప్రతిఫలాన్ని అందిస్తుంది.', // [needs native review]
    questions: [
      {
        speaker: 'పొరుగువారు',
        initial: 'పొ',
        text: '“మా అమ్మగారి కోసం మంచి డాక్టర్ ఎవరైనా తెలుసా?”',
        category: 'ఆరోగ్యం',
      },
      {
        speaker: 'తల్లిదండ్రులు',
        initial: 'త',
        text: '“మా అబ్బాయికి ఏ కోచింగ్ సెంటర్ బాగుంటుంది?”',
        category: 'విద్య',
      },
      {
        speaker: 'బంధువు',
        initial: 'బం',
        text: '“మా కజిన్‌కి బిజినెస్ పేపర్లలో సహాయం కావాలి. ఎవరైనా తెలుసా?”',
        category: 'ప్రొఫెషనల్ సేవలు',
      },
      {
        speaker: 'విద్యార్థి',
        initial: 'వి',
        text: '“డిగ్రీ తర్వాత ఏ కోర్సు చేస్తే మంచిది?”',
        category: 'విద్య',
      },
    ],
    pillars: [
      {
        id: 'introduce',
        title: 'తగిన పరిచయాలు', // [needs native review]
        description:
          'నిజమైన అవసరం ఏర్పడినప్పుడు సంబంధిత సర్వీస్ ప్రొవైడర్లకు పరిచయం చేయండి. సేల్స్ అనుభవం అవసరం లేదు.', // [needs native review]
      },
      {
        id: 'earn',
        title: 'సంపాదించే అవకాశం', // [needs native review]
        description:
          'మీ పరిచయం ప్రొవైడర్ నిర్దిష్ట పరిహార నిబంధనల ప్రకారం అర్హత పొందినప్పుడు సంపాదించే అవకాశాన్ని అన్వేషించండి.', // [needs native review]
      },
      {
        id: 'guidance',
        title: 'సమాచారం మరియు మార్గదర్శకత్వం', // [needs native review]
        description:
          'మీరు నమ్మకంతో సరైన పరిచయాలు చేయడానికి sBLOOM సేవా సమాచారం మరియు మార్గదర్శకత్వాన్ని అందిస్తుంది.', // [needs native review]
      },
    ],
    reply: '“అవును, నేను పరిచయం చేస్తాను.”', // [needs native review]
    videoExplainer: {
      badge: 'కథ // ఇది ఎలా పనిచేస్తుంది',
      duration: '00:14',
      scenes: [
        {
          id: 'speaking',
          number: '01',
          tag: 'పరిచయస్తుల సంభాషణ',
          title: 'మీరు ఇప్పటికే ప్రజలకు సహాయం చేస్తున్నారు.',
          speaker: 'సుజాత ఆర్. · కమ్యూనిటీ కనెక్టర్',
          quote: '“స్నేహితులు, బంధువులు నన్ను సలహాలు అడుగుతుంటారు. sBLOOM తో వారి అనుమతితో సరైన ప్రొవైడర్‌కు పరిచయం చేస్తాను.”',
          caption: 'ప్రజలు ఇప్పటికే మీ మాటను నమ్మి సలహాలు అడుగుతుంటారు. మీరు ఉచితంగా సమాధానం ఇస్తున్నారు.',
        },
        {
          id: 'analytics',
          number: '02',
          tag: 'సంపాదన విశ్లేషణ',
          title: 'పరిచయాలు సంపాదనగా ఎలా మారతాయి.',
          statusLabel: 'రిఫరల్ స్థితి: ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత పొందింది',
          metrics: [
            { label: 'పరిచయం', value: 'అనుమతి ధృవీకరించబడింది' },
            { label: 'ప్రొవైడర్ నిబంధనలు', value: 'ప్రమాణాలు పరిశీలించబడ్డాయి' },
            { label: 'పరిహారం', value: 'అర్హత సాధించినప్పుడు పరిహారం' },
          ],
          caption: 'sBLOOM లో మీ రిఫరల్స్‌ను ట్రాక్ చేయండి. ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత సాధించినప్పుడు సంపాదించండి.',
        },
      ],
      disclaimer:
        'ఉదాహరణ మాత్రమే · ఆదాయం ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటుంది · ఎటువంటి హామీ లేదు.',
    },
  },

  // What an introduction sounds like (Three-Phone Conversation Carousel) [needs native review]
  conversations: {
    eyebrow: 'పరిచయం ఎలా ఉంటుంది?',
    headline: 'ఒక స్నేహపూర్వక, అనుమతితో కూడిన సంభాషణ సరిపోతుంది.',
    subheading:
      'గతంలో వారు ప్రస్తావించిన అంశం ఆధారంగా అఫిలియేట్ సంభాషణను ప్రారంభిస్తారు. మూడు రంగాల్లో పరిచయం ఎలా ఉంటుందో ఇక్కడ చూడండి:',
    disclaimer: 'ఉదాహరణ సంభాషణ · సచిత్ర సందర్భం',
    rule: 'మూడింటి వెనుక ఉన్న నియమం: వివరాలు పంచుకునే ముందు స్పష్టమైన అంగీకారం. ఆదాయానికి హామీ లేదు.',
    sectors: [
      {
        id: 'healthcare',
        name: 'ఆరోగ్యం',
        code: '01 · ఆరోగ్యం',
        contactRole: 'పొరుగువారు',
        contactInitial: 'పొ',
        contactMessage: '“మీ అమ్మగారికి డాక్టర్ అవసరమని చెప్పారు కదా. సహాయపడే ఒక సర్వీస్ నాకు తెలుసు.”',
        contactTime: '10:24 AM',
        affiliateRole: 'మీరు (అఫిలియేట్)',
        affiliateMessage: '“సరైన హెల్త్‌కేర్ ప్రొవైడర్‌తో మిమ్మల్ని పరిచయం చేయగలను. మిమ్మల్ని కనెక్ట్ చేయమంటారా?”',
        affiliateTime: '10:26 AM',
        consentTag: 'ముందు అడగండి · అంగీకారం ధృవీకరించబడింది',
        permissionLabel: 'అంగీకారం తర్వాతే పరిచయం',
      },
      {
        id: 'education',
        name: 'విద్య',
        code: '02 · విద్య',
        contactRole: 'స్నేహితుడు',
        contactInitial: 'స్నే',
        contactMessage: '“మీరు కోచింగ్ ఇన్‌స్టిట్యూట్ కోసం చూస్తున్నారని చెప్పారు కదా.”',
        contactTime: '11:15 AM',
        affiliateRole: 'మీరు (అఫిలియేట్)',
        affiliateMessage: '“సంబంధిత కోర్సులు అందించే ఒక ఇన్‌స్టిట్యూట్‌ను మీకు పరిచయం చేయగలను. మరిన్ని వివరాలు తెలుసుకోవాలనుకుంటున్నారా?”',
        affiliateTime: '11:17 AM',
        consentTag: 'ముందు అడగండి · అంగీకారం ధృవీకరించబడింది',
        permissionLabel: 'అంగీకారం తర్వాతే పరిచయం',
      },
      {
        id: 'professional',
        name: 'ప్రొఫెషనల్ సేవలు',
        code: '03 · ప్రొఫెషనల్ సేవలు',
        contactRole: 'వ్యాపారస్తుడు',
        contactInitial: 'వ్యా',
        contactMessage: '“నా వ్యాపారాన్ని ఆన్‌లైన్‌లో మెరుగుపరచడానికి నాకు సహాయం కావాలి.”',
        contactTime: '02:40 PM',
        affiliateRole: 'మీరు (అఫిలియేట్)',
        affiliateMessage: '“సహాయం చేయగల ఒక సర్వీస్ ప్రొవైడర్ నాకు తెలుసు. మీకు పరిచయం చేయమంటారా?”',
        affiliateTime: '02:42 PM',
        consentTag: 'ముందు అడగండి · అంగీకారం ధృవీకరించబడింది',
        permissionLabel: 'అంగీకారం తర్వాతే పరిచయం',
      },
    ],
  },

  // How it works [needs native review]
  howItWorks: {
    eyebrow: 'ఇది ఎలా పనిచేస్తుంది', // Confirmed in Section 6
    headline: 'పరిచయం చేయండి. నిబంధనలు తెలుసుకోండి. అర్హత సాధించినప్పుడు సంపాదించండి.', // [needs native review]
    subheading: 'నిజమైన అవసరాన్ని గుర్తించడం నుండి అర్హత కలిగిన రిఫరల్ వరకు నాలుగు దశలు:', // [needs native review]
    steps: [
      {
        number: '1',
        title: 'నిజమైన అవసరాన్ని గుర్తించండి.', // [needs native review]
        description:
          'మీ నెట్‌వర్క్‌లోని ఒకరు సేవ కోసం చూస్తున్నారు.', // [needs native review]
      },
      {
        number: '2',
        title: 'పరిచయం చేయండి.', // [needs native review]
        description:
          'వారి అనుమతితో, సంబంధిత ప్రొవైడర్‌తో అనుసంధానించండి.', // [needs native review]
      },
      {
        number: '3',
        title: 'ప్రొవైడర్ నిబంధనలను అర్థం చేసుకోండి.', // [needs native review]
        description:
          'రిఫరల్ చేసే ముందు పరిహారానికి ఏమి అర్హత సాధిస్తుందో పరిశీలించండి.', // [needs native review]
      },
      {
        number: '4',
        title: 'నిబంధనలు నెరవేరినప్పుడు సంపాదించండి.', // [needs native review]
        description:
          'పరిహారం నిర్దిష్ట ప్రొవైడర్ నిబంధనలు మరియు రిఫరల్ అర్హతపై ఆధారపడి ఉంటుంది.', // [needs native review]
      },
    ],
  },

  // Promises [needs native review]
  promises: {
    headline: 'మీరు పరిచయం చేయండి. సలహా ఇచ్చేది నిపుణులే.', // Confirmed in Section 6
    lead:
      'మీరు చికిత్స, కోర్సు సిలబస్ లేదా చట్టపరమైన అంశాలను వివరించాల్సిన అవసరం లేదు. మీ పని సులభం: అవసరాన్ని గుర్తించండి, అనుమతి అడగండి, పరిచయం చేయండి.', // [needs native review]
    subhead: 'ప్రతి అఫిలియేట్ పాటించాల్సిన మూడు వాగ్దానాలు:', // [needs native review]
    items: [
      {
        title: 'ముందు అడగండి.', // [needs native review]
        description: 'ఎవరైనా స్పష్టంగా అంగీకరించిన తర్వాత మాత్రమే వివరాలను పంచుకోండి.', // [needs native review]
      },
      {
        title: 'మీ పరిధిలోనే ఉండండి.', // [needs native review]
        description: 'వైద్య, చట్ట లేదా ఆర్థిక సలహాలు ఇవ్వకండి. ఆ పనిని సేవా సంస్థకే వదిలేయండి.', // [needs native review]
      },
      {
        title: 'నిజం మాత్రమే చెప్పండి.', // [needs native review]
        description: 'సేవా వివరణలో ఉన్నది మాత్రమే చెప్పండి. ఒత్తిడి లేదా పెద్ద వాగ్దానాలు వద్దు.', // [needs native review]
      },
    ],
  },

  // Who can join [needs native review]
  whoCanJoin: {
    headline: 'ప్రజలు మీ మాట వింటే, మీరు ఇక్కడ ఉండదగినవారే', // [needs native review]
    lead:
      'సంబంధిత పరిచయాలు ఉండి, సహాయం చేయాలనే ఆసక్తి ఉన్న భారతదేశంలోని ఎవరైనా ఆసక్తి వ్యక్తం చేయవచ్చు. మీరు నిపుణులు కానవసరం లేదు.', // [needs native review]
    personas: [
      {
        id: 'homemaker',
        title: 'గృహిణులు', // [needs native review]
        description:
          'అపార్ట్‌మెంట్‌లోని ప్రతి కుటుంబం మీకు తెలుసు, మీ మాటకు విలువ ఉంది. ఇంటి నుంచే, మీ సమయంలో ప్రారంభించండి.', // [needs native review]
      },
      {
        id: 'professional',
        title: 'ఉద్యోగులు', // [needs native review]
        description:
          'సహోద్యోగులు, స్నేహితులు మీ సలహా అడుగుతారు. మీ ఉద్యోగంతో పాటే ఒక అదనపు అవకాశాన్ని పరిశీలించండి.', // [needs native review]
      },
      {
        id: 'community',
        title: 'కమ్యూనిటీ నాయకులు', // [needs native review]
        description:
          'అసోసియేషన్లు, ఆలయ కమిటీలు, పూర్వ విద్యార్థుల బృందాలు: మీ వారికి సరైన సేవను కనుగొనడంలో సహాయపడండి.', // [needs native review]
      },
      {
        id: 'shop-tutor',
        title: 'షాపు యజమానులు మరియు ట్యూటర్లు', // [needs native review]
        description:
          'మీరు ప్రతి వారం ఎన్నో కుటుంబాలను కలుస్తారు, ఒక పరిచయానికి ఒక్క నిమిషం చాలు.', // [needs native review]
      },
      {
        id: 'retired',
        title: 'పదవీ విరమణ చేసినవారు', // [needs native review]
        description:
          'సంవత్సరాల అనుభవం మరియు విస్తృత పరిచయాలు. మీ మాటకు ఇప్పటికీ విలువ ఉంది.', // [needs native review]
      },
      {
        id: 'young-adult',
        title: 'యువత (18+)', // [needs native review]
        description:
          'మీ స్నేహితులు ఇప్పటికే మీ అభిప్రాయాన్ని అడుగుతున్నారు. ఇప్పుడు దానికి విలువ చేకూరుతుంది.', // [needs native review]
      },
    ],
    closingCta: 'ఇది మీకు సరిపోతుందో లేదో తెలియదా? మీ ఆసక్తిని తెలియజేయండి, మేము వివరిస్తాము.', // [needs native review]
  },

  // Sectors [needs native review]
  sectors: {
    headline: 'పరిచయాల ఒకే నెట్‌వర్క్. అవకాశాల మూడు రంగాలు.', // [needs native review]
    items: [
      {
        id: 'healthcare',
        title: 'హెల్త్‌కేర్', // [needs native review]
        description: 'తగిన హెల్త్‌కేర్ సేవ కోసం చూస్తున్న వారిని సంబంధిత ప్రొవైడర్‌కు పరిచయం చేయండి.', // [needs native review]
      },
      {
        id: 'education',
        title: 'విద్య', // [needs native review]
        description: 'విద్యార్థులు మరియు కుటుంబాలను సంబంధిత విద్యా సేవలతో అనుసంధానించండి.', // [needs native review]
      },
      {
        id: 'professional',
        title: 'ప్రొఫెషనల్ సేవలు', // [needs native review]
        description: 'వ్యాపారాలు మరియు వ్యక్తులను వారి అవసరాలకు సరిపోయే సర్వీస్ ప్రొవైడర్లకు పరిచయం చేయండి.', // [needs native review]
      },
    ],
    note: 'రిఫరల్ యొక్క అర్హత మరియు పరిహారం సంబంధిత ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటాయి.', // [needs native review]
  },

  // Introduction simulator [needs native review]
  introductionSimulator: {
    headline: 'పరిచయం ఎలా ఉంటుంది?', // [needs native review]
    lead:
      'స్నేహపూర్వక, అనుమతితో కూడిన సందేశం చాలు. పేజీలో చూపించాల్సిన ఉదాహరణలు:', // [needs native review]
    examples: [
      {
        sector: 'హెల్త్‌కేర్', // [needs native review]
        text: '“రాధా, మీ అమ్మగారికి స్పెషలిస్ట్ కావాలని చెప్పారు కదా. క్లినిక్‌లు, కేర్ సర్వీసులకు అనుసంధానించే ప్లాట్‌ఫారమ్‌లో నేను ఉన్నాను. వారి బృందం మీకు కాల్ చేయడానికి మీ వివరాలను పంచుకోమంటారా? మీకు సమ్మతమైతేనే.”', // [needs native review]
      },
      {
        sector: 'విద్య', // [needs native review]
        text: '“రవి, నువ్వు పై చదువుల కోర్సు ఆలోచిస్తున్నావు కదా, ఆప్షన్లు వివరించే బృందానికి నిన్ను పరిచయం చేయగలను. నీ నంబర్ ఇవ్వమంటావా?”', // [needs native review]
      },
      {
        sector: 'ప్రొఫెషనల్ సేవలు', // [needs native review]
        text: '“సురేష్ గారు, బిజినెస్ పేపర్లు సిద్ధం చేయడం గురించి అడుగుతున్నారు కదా. సహాయం చేసే బృందంతో మిమ్మల్ని అనుసంధానించగలను. మీ కాంటాక్ట్ షేర్ చేయమంటారా?”', // [needs native review]
      },
    ],
    rule: 'మూడింటి వెనుక ఉన్న నియమం: వివరాలు పంచుకునే ముందు స్పష్టమైన అంగీకారం.', // [needs native review]
  },

  // Earning [needs native review]
  earning: {
    headline: 'కేవలం రిఫరల్స్ చేయడం కంటే ఎక్కువ.', // [needs native review]
    subheading:
      'నమ్మకంతో పరిచయం చేయడానికి sBLOOM మీకు సమాచారం, స్పష్టత మరియు విధానాన్ని అందిస్తుంది:', // [needs native review]
    blocks: [
      {
        title: 'పరిచయం చేసే ముందే తెలుసుకోండి', // [needs native review]
        description: 'సేవలు మరియు ప్రొవైడర్ల గురించి అర్థం చేసుకోండి.', // [needs native review]
      },
      {
        title: 'ఆత్మవిశ్వాసంతో రిఫర్ చేయండి', // [needs native review]
        description: 'మరింత సమాచారంతో కూడిన పరిచయాలు చేయడానికి సంబంధిత వివరాలను ఉపయోగించండి.', // [needs native review]
      },
      {
        title: 'నిబంధనలను తెలుసుకోండి', // [needs native review]
        description: 'రిఫర్ చేసే ముందే ప్రొవైడర్ పరిహార నిబంధనలను సమీక్షించండి.', // [needs native review]
      },
      {
        title: 'మీ నెట్‌వర్క్ చుట్టూ నిర్మించండి', // [needs native review]
        description: 'ప్రజల అవసరాలకు నిజంగా సరిపోయే సేవలను పరిచయం చేయండి.', // [needs native review]
      },
    ],
    caution:
      'పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది మరియు వర్తించే నిబంధనలకు లోబడి ఉంటుంది. చేరడం మరియు రిఫరల్ చేయడం వల్ల ఆదాయానికి హామీ ఉండదు.', // [needs native review]
    noGuarantee:
      'ఆదాయం ప్రతి ప్రొవైడర్ నిబంధనలు మరియు మీ రిఫరల్స్ అర్హతపై ఆధారపడి ఉంటుంది. ఆదాయానికి హామీ లేదు.', // [needs native review]
  },

  // Tools [needs native review]
  tools: {
    headline: 'అన్నీ ఒకే చోట, కాబట్టి మీకు ఎలాంటి అయోమయం ఉండదు', // [needs native review]
    bento: [
      {
        title: 'సులభమైన భాషలో సేవా వివరణలు.', // [needs native review]
        description: 'ఆ సేవ ఏమిటి, ఎవరికి సరిపోతుంది, మీరు ఏమి చెప్పవచ్చు మరియు ఏమి చెప్పకూడదు.', // [needs native review]
      },
      {
        title: 'సాధారణ ప్రశ్నలకు సమాధానాలు.', // [needs native review]
        description: 'మీరు నమ్మకంతో స్పందించడానికి.', // [needs native review]
      },
      {
        title: 'రిఫరల్ ట్రాకర్.', // [needs native review]
        description: 'ప్రతి పరిచయాన్ని మరియు దాని స్థితిని ఒకే చోట చూడండి.', // [needs native review]
      },
      {
        title: 'ఒకే చోట సంస్థ నిబంధనలు.', // [needs native review]
        description: 'అడుగు ముందుకు వేసే ముందే ప్రతిదీ సరిపోల్చి చూసుకోండి.', // [needs native review]
      },
    ],
  },

  // Trust Strip [needs native review]
  trustStrip: {
    headline: 'మీకు మరియు మీరు పరిచయం చేసే వారికి సురక్షితంగా అనిపించేలా రూపొందించబడింది', // [needs native review]
    items: [
      { title: 'చేరడం ఉచితం.', description: 'ఎలాంటి జాయినింగ్ ఫీజు లేదు.' }, // [needs native review]
      { title: 'ముందుగా అనుమతి.', description: 'వారు అంగీకరిస్తే తప్ప ఎవరినీ సంప్రదించరు.' }, // [needs native review]
      { title: 'చర్యకు ముందే నిబంధనలు.', description: 'పరిచయం చేసే ముందే సంస్థ ఇచ్చే నిబంధనలను మీరు చూస్తారు.' }, // [needs native review]
      { title: 'కనిపించే స్థితి.', description: 'ప్లాట్‌ఫారమ్ మీ రిఫరల్స్ మరియు వాటి పురోగతిని ట్రాక్ చేస్తుంది.' }, // [needs native review]
      { title: 'మీ వివరాలు సురక్షితం.', description: '[గోప్యతా నోటీసు లింక్]' }, // [needs native review]
    ],
  },

  // FAQ [needs native review]
  faq: {
    headline: 'తరచుగా అడిగే ప్రశ్నలు', // [needs native review]
    tabs: ['సంపాదన', 'చేరడం', 'భద్రత'], // [needs native review]
    questions: [
      {
        q: 'sBLOOM అఫిలియేట్‌గా నేను డబ్బు సంపాదించవచ్చా?',
        a: 'అవును, అర్హత కలిగిన రిఫరల్స్ ద్వారా సంపాదించే అవకాశాన్ని ఈ ప్రోగ్రామ్ అందిస్తుంది. రిఫరల్ అర్హత పొందుతుందా లేదా మరియు ఏ పరిహారం వర్తిస్తుంది అనేది సంబంధిత సర్వీస్ ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటుంది. ఆదాయానికి హామీ లేదు.',
        category: 'సంపాదన',
      },
      {
        q: 'ప్రతి రిఫరల్‌కు నేను ఎంత సంపాదించగలను?',
        a: 'పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది. వర్తించే మొత్తం లేదా చెల్లింపు విధానం మరియు అర్హత షరతులు ప్రొవైడర్ ద్వారా తెలియజేయబడతాయి. మేము సార్వత్రిక కమీషన్ రేటును ప్రచురించము.',
        category: 'సంపాదన',
      },
      {
        q: 'నేను పరిచయం చేసే ప్రతి వ్యక్తికి నాకు చెల్లింపు లభిస్తుందా?',
        a: 'ఖచ్చితంగా కాదు. పరిహారం ప్రొవైడర్ నిబంధనలు మరియు రిఫరల్ వర్తించే షరతులను నెరవేరుస్తుందా లేదా అనే దానిపై ఆధారపడి ఉంటుంది.',
        category: 'సంపాదన',
      },
      {
        q: 'చేరడానికి నేను డబ్బు చెల్లించాలా?',
        a: 'లేదు. sBLOOM అఫిలియేట్ ప్రోగ్రామ్‌లో చేరడం పూర్తిగా ఉచితం.',
        category: 'చేరడం',
      },
      {
        q: 'నాకు చెల్లింపు ఎప్పుడు అందుతుంది?',
        a: 'చెల్లింపు సమయం సంబంధిత ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటుంది. నిర్దిష్ట కాలక్రమం ధృవీకరించబడినప్పుడు మాత్రమే తెలియజేయబడుతుంది.',
        category: 'సంపాదన',
      },
      { q: 'చేరడం నిజంగా ఉచితమేనా?', a: 'అవును. ఎలాంటి జాయినింగ్ ఫీజు లేదు.', category: 'చేరడం' }, // [needs native review]
      { q: 'నేను గృహిణిని. నేను ఇది చేయవచ్చా?', a: 'అవును. మీ చుట్టూ ఉన్నవారు మీ మాటను నమ్మితే, మీరు ఆసక్తి వ్యక్తం చేయవచ్చు. మీ ఫోన్ నుండి రెండు నిమిషాల్లో చేయవచ్చు.', category: 'చేరడం' }, // [needs native review]
      { q: 'నేను నిపుణురాలిని/నిపుణుడిని కావాలా?', a: 'కాదు. మీరు పరిచయం చేస్తారు, సేవా సంస్థ సలహా ఇస్తుంది. ప్లాట్‌ఫారమ్‌లోని వివరణలు ప్రతి సేవను అర్థం చేసుకోవడానికి సహాయపడతాయి.', category: 'చేరడం' }, // [needs native review]
      { q: 'నేను ప్రజలను ఒప్పించాలా లేదా ఒత్తిడి చేయాలా?', a: 'లేదు. సేవ అవసరమై, పరిచయానికి అంగీకరించిన వారిని మాత్రమే మీరు పరిచయం చేస్తారు. ఒత్తిడి లేదు.', category: 'భద్రత' }, // [needs native review]
      { q: 'నాకు ఉద్యోగం ఉంది. నేను చేరవచ్చా?', a: 'మీ ఉద్యోగంతో పాటే మీరు ఆసక్తిని వ్యక్తం చేయవచ్చు. మేము సంప్రదించినప్పుడు వివరాలు వివరిస్తాము.', category: 'చేరడం' }, // [needs native review]
      { q: 'నేను దీన్ని తెలుగులో ఉపయోగించవచ్చా?', a: 'ఈ పేజీ తెలుగు మరియు ఇంగ్లీషులో అందుబాటులో ఉంది. ప్లాట్‌ఫారమ్ ఏయే భాషలకు మద్దతు ఇస్తుందో చేరిన తర్వాత తెలియజేస్తాము.', category: 'చేరడం' }, // [needs native review]
      { q: 'నా సమాచారం, నా స్నేహితుల సమాచారం సురక్షితమేనా?', a: 'ఎవరైనా అంగీకరించిన తర్వాత మాత్రమే వివరాలను పంచుకోండి. సమాచారం ప్రోగ్రామ్ కోసం మాత్రమే ఉపయోగించబడుతుంది. [గోప్యతా నోటీసు లింక్]', category: 'భద్రత' }, // [needs native review]
    ],
  },

  // Final CTA [needs native review]
  finalCta: {
    headline: 'మీ తదుపరి పరిచయం ఒక అవకాశాన్ని తెరవవచ్చు.', // [needs native review]
    subheading:
      'sBLOOM అఫిలియేట్ ప్రోగ్రామ్‌లో ఉచితంగా చేరండి మరియు మీ నమ్మకమైన పరిచయాలు ఎలా సంపాదన అవకాశంగా మారవచ్చో అన్వేషించండి.', // [needs native review]
    disclaimer:
      'పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది మరియు వర్తించే నిబంధనలకు లోబడి ఉంటుంది. చేరడం మరియు రిఫరల్ చేయడం వల్ల ఆదాయానికి హామీ ఉండదు.', // [needs native review]
    primaryCta: 'అఫిలియేట్ అవ్వండి — ఉచితం', // [needs native review]
    secondaryLink: 'ప్రోగ్రామ్ నిబంధనలు చదవండి', // [needs native review]
    button: 'అఫిలియేట్ అవ్వండి', // Confirmed in Section 6
  },

  // Form [needs native review]
  form: {
    title: 'మీ గురించి మాకు చెప్పండి', // [needs native review]
    step1: {
      title: 'మీ వివరాలు', // [needs native review]
      nameLabel: 'పూర్తి పేరు', // [needs native review]
      mobileLabel: 'మొబైల్ నంబర్ (WhatsApp ప్రాధాన్యత)', // [needs native review]
      locationLabel: 'నగరం మరియు రాష్ట్రం', // [needs native review]
      langLabel: 'ప్రాధాన్య భాష', // [needs native review]
      langOptions: ['తెలుగు', 'English', 'Hindi', 'ఇతర'], // [needs native review]
    },
    step2: {
      title: 'మీ పరిచయాలు', // [needs native review]
      sectorsQuestion: 'మీ పరిచయస్తులు ఎక్కువగా ఏ రంగాల గురించి అడుగుతారు?', // [needs native review]
      sectorsOptions: ['హెల్త్‌కేర్', 'విద్య', 'ప్రొఫెషనల్ సేవలు', 'ఇంకా తెలియదు'], // [needs native review]
      channelsQuestion: 'మీరు సాధారణంగా ప్రజలతో ఎక్కడ కలుస్తారు?', // [needs native review]
      channelsOptions: ['కుటుంబం మరియు స్నేహితులు', 'అపార్ట్‌మెంట్ లేదా కమ్యూనిటీ', 'పని ప్రదేశం', 'WhatsApp గ్రూపులు', 'సోషల్ మీడియా', 'నా షాపు లేదా వ్యాపారం', 'ఇతర'], // [needs native review]
      noteLabel: 'మాకు ఏదైనా చెప్పాలనుకుంటున్నారా? (ఐచ్ఛికం)', // [needs native review]
    },
    step3: {
      title: 'ధృవీకరించండి', // [needs native review]
      consent: 'అఫిలియేట్ ప్రోగ్రామ్ గురించి sBLOOM నన్ను సంప్రదించడానికి మరియు నా వివరాలను ఈ ప్రయోజనం కోసం ఉపయోగించడానికి నేను అంగీకరిస్తున్నాను.', // [needs native review]
      submitButton: 'ఆసక్తిని సమర్పించండి', // [needs native review]
      subtext: 'ఉచితం. ఈ దశలో ఎటువంటి చెల్లింపు అడగబడదు.', // [needs native review]
    },
    success: {
      title: 'ధన్యవాదాలు, {name}!', // [needs native review]
      message: 'మీ ఆసక్తి మాకు అందింది. తదుపరి దశలను వివరించడానికి మా బృందం WhatsApp లేదా ఫోన్ ద్వారా మిమ్మల్ని సంప్రదిస్తుంది.', // [needs native review]
    },
  },

  // Footer [needs native review]
  footer: {
    descriptor: 'సర్వీస్ అడ్వైజర్ల నెట్‌వర్క్', // [needs native review]
    termsLink: 'ప్రోగ్రామ్ నిబంధనలు', // [needs native review]
    privacyLink: 'గోప్యతా నోటీసు', // [needs native review]
    contactPlaceholder: '',
    legalDrawerTitle: 'sBLOOM అఫిలియేట్ ప్రోగ్రామ్ నిబంధనలు', // [needs native review]
    legalPlaceholder: 'సర్వీస్ యాక్టివేషన్‌కు ముందే ప్రతి అఫిలియేట్‌కు ప్రోగ్రామ్ నిబంధనలు అందించబడతాయి. ఎవరినైనా పరిచయం చేసే ముందే మీరు ప్రతి ప్రొవైడర్ నిబంధనలను చూడవచ్చు.', // [needs native review]
  },
  ...copyAdditionsTe,
}
