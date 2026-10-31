# sBLOOM Affiliate Programme — Telugu Translation Native Review Deck

**Date:** 27 October 2026  
**Status:** Working Draft (English & Confirmed Telugu Kit vs. Draft Translations)  
**Instructions:** All strings marked `[needs native review]` are initial draft translations in conversational *“meeru”* tone. They must be reviewed and approved by a native Telugu speaker prior to public production release.

---

## 1. Confirmed Telugu Strings (From `docs/copy-deck.md` Section 6)

These strings are already approved in the copy deck:

| English Source | Approved Telugu (Section 6) | Location / Usage |
| :--- | :--- | :--- |
| **Help someone find the right service. Earn when it works out.** | మీకు తెలిసిన వారికి సరైన సేవను చూపించండి. ఫలితం వస్తే మీకూ సంపాదన. | Hero Headline |
| **Your word carries weight.** | మీ మాటకు విలువ ఉంది. | Subhead / Core principle |
| **You’re already the person people ask.** | అందరూ అడిగే వ్యక్తి మీరే. | "Sound familiar?" Section |
| **Express Your Interest** | మీ ఆసక్తిని తెలియజేయండి | Navigation & Primary CTA |
| **Free to join** | చేరడం పూర్తిగా ఉచితం | Hero Trust Row / Chips |
| **How it works** | ఇది ఎలా పనిచేస్తుంది | Navigation link / Section header |
| **You don’t need to be an expert.** | మీరు నిపుణులు కానవస్సిన అవసరం లేదు. | Subhead / Body |
| **You introduce. The experts advise.** | మీరు పరిచయం చేయండి. సలహా ఇచ్చేది నిపుణులే. | Core Promise Section |
| **Healthcare · Education · Professional services** | ఆరోగ్యం · విద్య · ప్రొఫెషనల్ సేవలు | Sectors list |
| **Every provider sets its own terms.** | ప్రతి సేవా సంస్థ తమ నిబంధనలను తామే నిర్ణయిస్తుంది. | Earning Section Headline |
| **Track every referral** | ప్రతి రిఫరల్ స్థితిని చూడండి | Hero Trust Row / Tools |
| **No income is guaranteed.** | ఆదాయానికి హామీ లేదు. | Compensation Caution |
| **Ask first. Share details only after a yes.** | ముందు అడగండి. అంగీకారం తర్వాతే వివరాలు పంచండి. | Core Promises card |
| **From home, in your own time** | ఇంటి నుంచి, మీ సమయంలో | Persona card (Homemaker) |

---

## 2. Draft Telugu Strings Requiring Native Review (`src/i18n/teDraft.js`)

All strings below are currently flagged as `[needs native review]`. If any string is rejected or unconfirmed, the UI automatically falls back to the canonical English string.

### A. Navigation
- `Why join` → `ఎందుకు చేరాలి` `[needs native review]`
- `Who can join` → `ఎవరు చేరవచ్చు` `[needs native review]`
- `Earning` → `సంపాదన` `[needs native review]`
- `FAQ` → `ప్రశ్నలు` `[needs native review]`
- `Affiliate Programme` (wordmark subtitle) → `అఫిలియేట్ ప్రోగ్రామ్` `[needs native review]`

### B. Hero Section
- `sBLOOM Affiliate Programme · A network of service advisers` → `sBLOOM అఫిలియేట్ ప్రోగ్రామ్ · సర్వీస్ అడ్వైజర్ల నెట్‌వర్క్` `[needs native review]`
- `People already ask you, “Do you know a good doctor? A good course? Someone who can help with this?” Join sBLOOM free, introduce them to services in healthcare, education and professional services, and earn under each provider’s terms.` → `“మంచి డాక్టర్ ఎవరైనా తెలుసా? మంచి కోర్సు ఏదైనా ఉందా? దీనికి ఎవరైనా సహాయం చేయగలరా?” అని ఇప్పటికే మిమ్మల్ని అడుగుతున్నారా? sBLOOM లో ఉచితంగా చేరండి, హెల్త్‌కేర్, విద్య, ప్రొఫెషనల్ సేవల్లో వారికి పరిచయం చేయండి, సంస్థల నిబంధనల ప్రకారం సంపాదించండి.` `[needs native review]`
- `Express Your Interest — it’s free` → `మీ ఆసక్తిని తెలియజేయండి — ఉచితం` `[needs native review]`
- `See how it works` → `ఇది ఎలా పనిచేస్తుందో చూడండి` `[needs native review]`
- `Open to anyone in India` → `భారతదేశంలో ఎవరైనా చేరవచ్చు` `[needs native review]`
- `You see each provider’s terms first` → `నిబంధనలను ముందే చూడవచ్చు` `[needs native review]`
- Bubble 1: `“Do you know a good doctor?”` → `“మంచి డాక్టర్ ఎవరైనా తెలుసా?”` `[needs native review]`
- Bubble 2: `“I’m part of a platform that connects people to clinics and care services.”` → `“క్లినిక్‌లు మరియు సంరక్షణ సేవలకు ప్రజలను అనుసంధానించే వేదికలో నేను ఉన్నాను.”` `[needs native review]`
- Bubble 1 Speaker: `Neighbor` → `పొరుగువారు` `[needs native review]`
- Bubble 2 Speaker: `You (Affiliate)` → `మీరు (అఫిలియేట్)` `[needs native review]`

### C. Sound familiar?
- `“Which coaching centre is good for my son?”` → `“మా అబ్బాయికి ఏ కోచింగ్ సెంటర్ బాగుంటుంది?”` `[needs native review]`
- `“Do you know a good doctor for my mother?”` → `“మా అమ్మగారి కోసం మంచి డాక్టర్ ఎవరైనా తెలుసా?”` `[needs native review]`
- `“My cousin needs help with business papers. Anyone know someone?”` → `“మా కజిన్‌కి బిజినెస్ పేపర్లలో సహాయం కావాలి. ఎవరైనా తెలుసా?”` `[needs native review]`
- `“Which course should I do after my degree?”` → `“డిగ్రీ తర్వాత ఏ కోర్సు చేస్తే మంచిది?”` `[needs native review]`
- `“Yes, let me introduce you.”` (Reply bubble) → `“అవును, నేను పరిచయం చేస్తాను.”` `[needs native review]`
- `You answer from the heart, for free, every week. sBLOOM gives those moments a structure, and a reward when your introduction leads somewhere.` → `మీరు ప్రతి వారం మనస్ఫూర్తిగా, ఉచితంగా సమాధానం ఇస్తున్నారు. sBLOOM ఆ క్షణాలకు ఒక పద్ధతిని, మీ పరిచయం ద్వారా ఫలితం వచ్చినప్పుడు ఒక ప్రతిఫలాన్ని అందిస్తుంది.` `[needs native review]`

### D. How it works (Four simple steps)
- `Four simple steps` → `నాలుగు సులభమైన దశలు` `[needs native review]`
- Step 1 Title: `Express your interest.` → `మీ ఆసక్తిని తెలియజేయండి.` `[needs native review]`
- Step 1 Body: `Tell us your name, your mobile number and the areas where people trust you. It takes about two minutes and it’s free.` → `మీ పేరు, మొబైల్ నంబర్ మరియు ప్రజలు మిమ్మల్ని నమ్మే రంగాలను తెలపండి. దీనికి రెండు నిమిషాలు పడుతుంది మరియు ఇది పూర్తిగా ఉచితం.` `[needs native review]`
- Step 2 Title: `Learn the service.` → `సేవ గురించి తెలుసుకోండి.` `[needs native review]`
- Step 2 Body: `Open the sBLOOM knowledge platform. Simple briefs tell you what each service is, who it suits and what people usually ask. You don’t have to memorise anything.` → `sBLOOM నాలెడ్జ్ ప్లాట్‌ఫారమ్‌ను తెరవండి. ప్రతి సేవ ఏమిటి, ఎవరికి సరిపోతుంది మరియు ప్రజలు సాధారణంగా ఏమి అడుగుతారు అనేది సులభమైన వివరణలు తెలియజేస్తాయి. మీరు ఏదీ బట్టీ పట్టాల్సిన అవసరం లేదు.` `[needs native review]`
- Step 3 Title: `Introduce.` → `పరిచయం చేయండి.` `[needs native review]`
- Step 3 Body: `When someone you know needs a service and says yes to being introduced, pass on the referral through sBLOOM. You introduce. The provider takes it from there.` → `మీకు తెలిసిన వారికి సేవ అవసరమై, పరిచయానికి అంగీకరించినప్పుడు, sBLOOM ద్వారా రిఫరల్ పంపండి. మీరు పరిచయం చేయండి. అక్కడి నుండి సేవా సంస్థ చూసుకుంటుంది.` `[needs native review]`
- Step 4 Title: `Track and earn.` → `స్థితిని చూడండి, సంపాదించండి.` `[needs native review]`
- Step 4 Body: `See the status of every referral in the platform. If it qualifies under the provider’s terms, you earn.` → `ప్లాట్‌ఫారమ్‌లో ప్రతి రిఫరల్ స్థితిని గమనించండి. ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత పొందితే, మీరు సంపాదిస్తారు.` `[needs native review]`

#### Stepper Phone Mockup UI Strings
- Step 1 Badge: `1 of 3` → `1 / 3` `[needs native review]`
- Step 1 Title: `Tell us about yourself` → `మీ గురించి మాకు చెప్పండి` `[needs native review]`
- Step 1 Fields: `Full name` (`పూర్తి పేరు`), `Mobile number` (`మొబైల్ నంబర్`), `City and state` (`నగరం మరియు రాష్ట్రం`), `Continue` (`కొనసాగించండి`) `[needs native review]`
- Step 2 Header: `Service Brief` → `సేవా సంక్షిప్త వివరణ` `[needs native review]`
- Step 2 Subhead: `Plain-language guidance` → `సులభమైన మార్గదర్శకం` `[needs native review]`
- Step 2 Cards: `What to say: Explain the core service in clear words` → `ఏమి చెప్పాలి: ప్రధాన సేవను సులభంగా వివరించండి` `[needs native review]`
- Step 2 Cards: `What not to say: Never give medical or financial advice` → `ఏమి చెప్పకూడదు: వైద్య లేదా ఆర్థిక సలహాలు ఇవ్వవద్దు` `[needs native review]`
- Step 3 Header: `Make an Introduction` → `పరిచయం చేయండి` `[needs native review]`
- Step 3 Subhead: `Consent first` → `ముందుగా అనుమతి` `[needs native review]`
- Step 3 Toggle: `They said yes` → `వారు అంగీకరించారు` `[needs native review]`
- Step 3 Subtext: `I asked before sharing their details` → `వివరాలు పంచుకునే ముందు నేను అడిగాను` `[needs native review]`
- Step 3 Status: `Ready to submit` → `సమర్పించడానికి సిద్ధంగా ఉంది` `[needs native review]`
- Step 4 Header: `Referral Tracker` → `రిఫరల్ ట్రాకర్` `[needs native review]`
- Step 4 Subhead: `Transparent updates` → `పారదర్శక స్థితి` `[needs native review]`
- Step 4 Chips: `Intro Sent` (`పరిచయం పంపబడింది`), `In Review` (`పరిశీలనలో ఉంది`), `Verified` (`ధృవీకరించబడింది`) `[needs native review]`

### E. Promises (You introduce. The experts advise.)
- `You don’t have to explain a treatment, a course syllabus or a legal point. Your job is simple: notice a need, ask permission, make the introduction.` → `మీరు చికిత్స, కోర్సు సిలబస్ లేదా చట్టపరమైన అంశాలను వివరించాల్సిన అవసరం లేదు. మీ పని సులభం: అవసరాన్ని గుర్తించండి, అనుమతి అడగండి, పరిచయం చేయండి.` `[needs native review]`
- `Three promises we ask every affiliate to keep:` → `ప్రతి అఫిలియేట్ పాటించాల్సిన మూడు వాగ్దానాలు:` `[needs native review]`
- `Ask first.` / `Share someone’s details only after they clearly say yes.` → `ముందు అడగండి.` / `ఎవరైనా స్పష్టంగా అంగీకరించిన తర్వాత మాత్రమే వివరాలను పంచుకోండి.` `[needs native review]`
- `Stay in your lane.` / `Don’t give medical, legal or financial advice. Let the provider do that.` → `మీ పరిధిలోనే ఉండండి.` / `వైద్య, చట్ట లేదా ఆర్థిక సలహాలు ఇవ్వకండి. ఆ పనిని సేవా సంస్థకే వదిలేయండి.` `[needs native review]`
- `Tell the truth.` / `Say only what the service brief says. No pressure and no big promises.` → `నిజం మాత్రమే చెప్పండి.` / `సేవా వివరణలో ఉన్నది మాత్రమే చెప్పండి. ఒత్తిడి లేదా పెద్ద వాగ్దానాలు వద్దు.` `[needs native review]`

### F. Who can join
- `If people listen to you, you belong here` → `ప్రజలు మీ మాట వింటే, మీరు ఇక్కడ ఉండదగినవారే` `[needs native review]`
- `Anyone in India with a relevant network and an interest in helping can express interest. You do not need to be an expert.` → `సంబంధిత పరిచయాలు ఉండి, సహాయం చేయాలనే ఆసక్తి ఉన్న భారతదేశంలోని ఎవరైనా ఆసక్తి వ్యక్తం చేయవచ్చు. మీరు నిపుణులు కానవసరం లేదు.` `[needs native review]`
- Persona descriptions for Homemakers, Working professionals, Community leaders, Shop owners/tutors, Retired people, and Young adults (18+) are cataloged in `src/i18n/teDraft.js` `[needs native review]`.
- `Not sure if it’s for you? Express your interest and we’ll explain.` → `ఇది మీకు సరిపోతుందో లేదో తెలియదా? మీ ఆసక్తిని తెలియజేయండి, మేము వివరిస్తాము.` `[needs native review]`

### G. Sectors & Introduction Simulator
- `Three areas people ask about most` → `ప్రజలు ఎక్కువగా అడిగే మూడు రంగాలు` `[needs native review]`
- `Services available to introduce depend on the providers on the platform.` → `అందుబాటులో ఉన్న సేవలు ప్లాట్‌ఫారమ్‌లోని సేవా సంస్థలపై ఆధారపడి ఉంటాయి.` `[needs native review]`
- `What an introduction sounds like` → `పరిచయం ఎలా ఉంటుంది?` `[needs native review]`
- `A friendly, permission-first message is all it takes. These are examples to show on the page:` → `స్నేహపూర్వక, అనుమతితో కూడిన సందేశం చాలు. పేజీలో చూపించాల్సిన ఉదాహరణలు:` `[needs native review]`
- `The rule behind all three: a clear yes before any details are shared.` → `మూడింటి వెనుక ఉన్న నియమం: వివరాలు పంచుకునే ముందు స్పష్టమైన అంగీకారం.` `[needs native review]`

### H. Earning, Tools, Trust, FAQs, and Form
- Earning cards: `See the terms first.` / `Watch the status.` / `Earn when it qualifies.` `[needs native review]`
- Bento tool descriptions: Service briefs, Answers to questions, Referral tracker, Provider terms `[needs native review]`.
- Trust strip 5 items: Free to join, Permission first, Terms before action, Status you can see, Your details stay with programme `[needs native review]`.
- 11 FAQ items: Questions and answers in 3 tabs `[needs native review]`.
- 3-step form labels, inputs, consent, and success modal `[needs native review]`.

---

## 3. Working Strings Requiring Native Telugu Review (`src/i18n/landingCopyAdditions.js`)

The following updated strings clarify universal audience positioning (examples, not restrictions) and multi-sector cross-promotion without unconfirmed operational or architectural claims:

| English Source | Telugu Translation (`[needs native review]`) | Context / Component |
| :--- | :--- | :--- |
| **These profiles are examples, not eligibility restrictions. Anyone whose circle trusts their recommendations can join—no sales background or degree required.** | ఈ వర్గాలు ఉదాహరణలు మాత్రమే, పరిమితులు కావు. తమ పరిచయస్తులు నమ్మే భారతదేశంలోని ఎవరైనా చేరవచ్చు—సేల్స్ అనుభవం లేదా డిగ్రీ అవసరం లేదు. | `whoCanJoin.subheading` |
| **Entrepreneurs, freelancers, community connectors, retired people, or anyone whose circle trusts them.** | వ్యాపారవేత్తలు, ఫ్రీలాన్సర్లు, రిటైర్ అయినవారు, కమ్యూనిటీ కార్యకర్తలు, లేదా ప్రజలు నమ్మే ఎవరైనా. | `whoCanJoin.cards[4].description` |
| **Open to anyone in India with a trusted network. Free to join.** | నమ్మకమైన పరిచయాలు ఉన్న భారతదేశంలోని ఎవరైనా చేరవచ్చు. చేరడం పూర్తిగా ఉచితం. | `whoCanJoin.closing` |
| **You can introduce relevant offerings across healthcare, education, and professional services on the platform. You introduce. The providers advise.** | అఫిలియేట్లు వేదికపై హెల్త్‌కేర్, విద్య, మరియు ప్రొఫెషనల్ సేవలన్నింటిలోనూ సేవలను పరిచయం చేయవచ్చు. మీరు పరిచయం చేయండి, సలహా ఇచ్చేది సేవా సంస్థలే. | `whatYouCanIntroduce.subheading` |
| **You can introduce offerings in one area or across healthcare, education, and professional services depending on what your circle needs.** | మీ పరిచయస్తుల అవసరాలను బట్టి మీరు ఆరోగ్యం, విద్య లేదా ప్రొఫెషనల్ సేవలన్నింటిలోనూ సేవలను పరిచయం చేయవచ్చు. | `whatYouCanIntroduce.note` |
| **Anyone people ask for suggestions: students, homemakers, shopkeepers, working professionals, entrepreneurs, freelancers, and others. These are examples, not restrictions. You don’t need sales experience.** | సలహా కోసం ప్రజలు అడిగే ఎవరైనా: విద్యార్థులు, గృహిణులు, షాపు యజమానులు, ఉద్యోగులు, వ్యాపారవేత్తలు, ఫ్రీలాన్సర్లు, ఇతరులు. ఇవి ఉదాహరణలు మాత్రమే, పరిమితులు కావు. సేల్స్ అనుభవం అవసరం లేదు. | `faq.items[0].answer` |
| **When we get in touch, we will explain the next steps and get you started.** | మేము మిమ్మల్ని సంప్రదించినప్పుడు, తదుపరి దశలను వివరించి ప్రారంభించడానికి సహాయం చేస్తాము. | `faq.items[3].answer` |
| **Yes. You can introduce relevant offerings across healthcare, education, and professional services based on your network’s needs. You are never limited to a single sector.** | చేయవచ్చు. మీ పరిచయస్తుల అవసరాల ఆధారంగా మీరు హెల్త్‌కేర్, విద్య, ప్రొఫెషనల్ సేవలన్నింటిలోనూ సేవలను పరిచయం చేయవచ్చు. మీరు ఎప్పుడూ ఒకే రంగానికి పరిమితం కారు. | `faq.items[4].answer` |
| **Free to join.** | చేరడం ఉచితం. | `finalCta.subheading` |

---

## 4. Earning-Focused Landing Page Copy (`[needs native review]`)

The following draft translations correspond to the earning-focused revision. All strings are marked `[needs native review]`:

| English Source | Telugu Translation (`[needs native review]`) | Location / Usage |
| :--- | :--- | :--- |
| **Your connections could become an earning opportunity.** | మీ పరిచయాలు ఒక సంపాదన అవకాశంగా మారవచ్చు. | Section 1 · Why Join Headline |
| **You already help friends, family and people in your community find the right services. With sBLOOM, you can make relevant introductions to service providers and explore an opportunity to earn when those introductions qualify under the provider’s terms.** | మీ స్నేహితులు, కుటుంబ సభ్యులు మరియు మీ కమ్యూనిటీలోని వారికి సరైన సేవలను కనుగొనడంలో మీరు ఇప్పటికే సహాయం చేస్తున్నారు. sBLOOM తో, మీరు సర్వీస్ ప్రొవైడర్లకు తగిన పరిచయాలు చేయవచ్చు మరియు ఆ పరిచయాలు ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత పొందినప్పుడు సంపాదించే అవకాశాన్ని అన్వేషించవచ్చు. | Section 1 · Why Join Body |
| **Free to join. No sales background required. Earnings are not guaranteed.** | చేరడం ఉచితం. సేల్స్ అనుభవం అవసరం లేదు. ఆదాయానికి హామీ లేదు. | Section 1 · Why Join Trust Line |
| **Make a connection. Understand the terms. Earn when eligible.** | పరిచయం చేయండి. నిబంధనలు తెలుసుకోండి. అర్హత సాధించినప్పుడు సంపాదించండి. | Section 2 · How Earning Works Headline |
| **Find a genuine need. Someone in your network is looking for a service.** | నిజమైన అవసరాన్ని గుర్తించండి. మీ నెట్‌వర్క్‌లోని ఒకరు సేవ కోసం చూస్తున్నారు. | Step 1 |
| **Make an introduction. With their permission, connect them with a relevant provider.** | పరిచయం చేయండి. వారి అనుమతితో, సంబంధిత ప్రొవైడర్‌తో అనుసంధానించండి. | Step 2 |
| **Understand the provider’s terms. Check what qualifies for compensation before making the referral.** | ప్రొవైడర్ నిబంధనలను అర్థం చేసుకోండి. రిఫరల్ చేసే ముందు పరిహారానికి ఏమి అర్హత సాధిస్తుందో పరిశీలించండి. | Step 3 |
| **Earn when the conditions are met. Compensation depends on the specific provider’s terms and whether the referral qualifies.** | నిబంధనలు నెరవేరినప్పుడు సంపాదించండి. పరిహారం నిర్దిష్ట ప్రొవైడర్ నిబంధనలు మరియు రిఫరల్ అర్హతపై ఆధారపడి ఉంటుంది. | Step 4 |
| **One network of connections. Three areas of opportunity.** | పరిచయాల ఒకే నెట్‌వర్క్. అవకాశాల మూడు రంగాలు. | Section 3 · Three Service Sectors Headline |
| **Introduce someone looking for a suitable healthcare service to a relevant provider.** | తగిన హెల్త్‌కేర్ సేవ కోసం చూస్తున్న వారిని సంబంధిత ప్రొవైడర్‌కు పరిచయం చేయండి. | Sector 1 · Healthcare |
| **Connect students and families with relevant educational services.** | విద్యార్థులు మరియు కుటుంబాలను సంబంధిత విద్యా సేవలతో అనుసంధానించండి. | Sector 2 · Education |
| **Introduce businesses and individuals to providers whose services may meet their needs.** | వ్యాపారాలు మరియు వ్యక్తులను వారి అవసరాలకు సరిపోయే సర్వీస్ ప్రొవైడర్లకు పరిచయం చేయండి. | Sector 3 · Professional Services |
| **A referral’s eligibility and compensation depend on the relevant provider’s terms.** | రిఫరల్ యొక్క అర్హత మరియు పరిహారం సంబంధిత ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటాయి. | Sector Note |
| **More than just making referrals.** | కేవలం రిఫరల్స్ చేయడం కంటే ఎక్కువ. | Section 4 · Why sBLOOM Headline |
| **Learn before you introduce: Understand the services and providers.** | పరిచయం చేసే ముందే తెలుసుకోండి: సేవలు మరియు ప్రొవైడర్ల గురించి అర్థం చేసుకోండి. | Why sBLOOM Block 1 |
| **Refer with confidence: Use relevant information to make more informed introductions.** | ఆత్మవిశ్వాసంతో రిఫర్ చేయండి: మరింత సమాచారంతో కూడిన పరిచయాలు చేయడానికి సంబంధిత వివరాలను ఉపయోగించండి. | Why sBLOOM Block 2 |
| **Know the terms: Review the provider’s compensation conditions before referring.** | నిబంధనలను తెలుసుకోండి: రిఫర్ చేసే ముందే ప్రొవైడర్ పరిహార నిబంధనలను సమీక్షించండి. | Why sBLOOM Block 3 |
| **Build around your network: Introduce services that genuinely match people’s needs.** | మీ నెట్‌వర్క్ చుట్టూ నిర్మించండి: ప్రజల అవసరాలకు నిజంగా సరిపోయే సేవలను పరిచయం చేయండి. | Why sBLOOM Block 4 |
| **Can I earn money as an sBLOOM affiliate? Yes, the programme offers an opportunity to earn through eligible referrals. Whether a referral qualifies and what compensation applies depend on the relevant service provider’s terms. Earnings are not guaranteed.** | sBLOOM అఫిలియేట్‌గా నేను డబ్బు సంపాదించవచ్చా? అవును, అర్హత కలిగిన రిఫరల్స్ ద్వారా సంపాదించే అవకాశాన్ని ఈ ప్రోగ్రామ్ అందిస్తుంది. రిఫరల్ అర్హత పొందుతుందా లేదా మరియు ఏ పరిహారం వర్తిస్తుంది అనేది సంబంధిత సర్వీస్ ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటుంది. ఆదాయానికి హామీ లేదు. | FAQ 1 |
| **How much can I earn per referral? Compensation varies by service provider. The applicable amount or payment arrangement and qualifying conditions should be communicated by the provider. We do not publish a universal commission rate.** | ప్రతి రిఫరల్‌కు నేను ఎంత సంపాదించగలను? పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది. వర్తించే మొత్తం లేదా చెల్లింపు విధానం మరియు అర్హత షరతులు ప్రొవైడర్ ద్వారా తెలియజేయబడతాయి. మేము సార్వత్రిక కమీషన్ రేటును ప్రచురించము. | FAQ 2 |
| **Do I get paid for every person I introduce? Not necessarily. Compensation depends on the provider’s terms and whether the referral meets the applicable conditions.** | నేను పరిచయం చేసే ప్రతి వ్యక్తికి నాకు చెల్లింపు లభిస్తుందా? ఖచ్చితంగా కాదు. పరిహారం ప్రొవైడర్ నిబంధనలు మరియు రిఫరల్ వర్తించే షరతులను నెరవేరుస్తుందా లేదా అనే దానిపై ఆధారపడి ఉంటుంది. | FAQ 3 |
| **Do I need to pay to join? No. Joining the sBLOOM Affiliate Programme is free.** | చేరడానికి నేను డబ్బు చెల్లించాలా? లేదు. sBLOOM అఫిలియేట్ ప్రోగ్రామ్‌లో చేరడం పూర్తిగా ఉచితం. | FAQ 4 |
| **When will I receive payment? Payment timing depends on the relevant provider’s terms. Specific timelines should be communicated only when they have been confirmed.** | నాకు చెల్లింపు ఎప్పుడు అందుతుంది? చెల్లింపు సమయం సంబంధిత ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటుంది. నిర్దిష్ట కాలక్రమం ధృవీకరించబడినప్పుడు మాత్రమే తెలియజేయబడుతుంది. | FAQ 5 |
| **Your next introduction could open an opportunity.** | మీ తదుపరి పరిచయం ఒక అవకాశాన్ని తెరవవచ్చు. | Section 5 · Final CTA Headline |
| **Join the sBLOOM Affiliate Programme for free and explore how your trusted connections can become an earning opportunity.** | sBLOOM అఫిలియేట్ ప్రోగ్రామ్‌లో ఉచితంగా చేరండి మరియు మీ నమ్మకమైన పరిచయాలు ఎలా సంపాదన అవకాశంగా మారవచ్చో అన్వేషించండి. | Section 5 · Final CTA Subhead |
| **Compensation varies by service provider and is subject to the applicable terms. Joining and making a referral do not guarantee earnings.** | పరిహారం సర్వీస్ ప్రొవైడర్‌ను బట్టి మారుతుంది మరియు వర్తించే నిబంధనలకు లోబడి ఉంటుంది. చేరడం మరియు రిఫరల్ చేయడం వల్ల ఆదాయానికి హామీ ఉండదు. | Section 5 · Final CTA Disclaimer |



