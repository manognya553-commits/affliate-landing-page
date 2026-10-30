# sBLOOM Affiliate Landing Page — Design Plan

Working design plan · 27 October 2026 · Updated for the affiliate-first copy deck (English and Telugu) · Based on a review of the current page recording

## 1. What is wrong with the current page

The copy is strong. The design is a generic SaaS template. These are the specific problems seen in the recording:

- **Internal notes show on the live page.** Labels such as “Draft affiliate journey · design preview,” “Note for design review,” “Prototype experience” and “Scheduled for Phase 4” are visible to visitors. They make the page look unfinished and weaken trust.
- **The main CTA leads nowhere.** “Express Your Interest” has no form behind it, only a note saying the form comes later.
- **Every section looks the same.** Each one is a centred pill, a heading, a grey paragraph and white cards. Nothing sets the pace, so nothing stands out.
- **The navigation is cramped.** “How It Works” wraps onto three lines, and there are seven items plus a CTA.
- **The text is too small.** Card text and diagram labels (including the hero network) look about 10–11px, and low-contrast grey on near-white is hard to read.
- **There are no people, motion or depth.** The page sells trusted human connections but shows no faces, video or tactile elements.
- **Disclaimers interrupt the page.** Boxed legal notes sit between sections, and the 5-step journey appears twice.

**The deepest problem is the audience.** The page talks about the programme. Affiliates are homemakers, employees, tutors and community leaders asking “Is this for me? Is it safe?” The design must answer that in a few seconds, in Telugu or English.

## 2. Design concept: “The Thread”

sBLOOM’s idea is that a connection grows into an opportunity. The page makes that literal. One luminous line starts in the hero, passes through every section and ends in the form, where it blooms. Scroll becomes the story: a person, a trusted connection, then the right service.

Awwwards scores design at 40%, usability at 30%, creativity at 20% and content at 10%. Juries can spot templated and AI-generated sites quickly, and custom interaction design is the biggest differentiator. So “looks AI-generated” should mean modern and futuristic, not generic. The thread, the typography and the product visuals are what make the page feel custom.

**Why this fits 2026 trends.** Bento grids, scroll storytelling and kinetic typography are among the leading directions. A mid-year reality check found that 3D/WebGL underdelivered because of performance costs, and recommends using kinetic type and heavy effects sparingly. So 3D is used only in the hero, and motion only where it helps the story.

**The thread is an introduction.** In the new copy an affiliate’s job is to introduce someone to the right service. So the thread starts at a person (“You”), passes through someone they know and ends at the service, a visual version of “Help someone find the right service.”

## 3. Visual system

### Palette

Warm and light, with one dark “stage” section.

- **Canvas:** #FAF7F2 (warm paper)
- **Ink:** #12101F
- **Brand violet:** your current purple, pushed richer (#6B3CFF)
- **Bloom gradient:** violet → magenta #FF4FA3 → lime #D6F36B
- **Stage (dark):** #0E0B1E
- **Sector accents:** Healthcare coral, Education lime, Professional Services teal

### Typography

- **Headlines:** a soft variable serif such as Fraunces or Instrument Serif, with one *italic* accent word per headline. Size with clamp(56px, 9vw, 150px).
- **Body:** Geist, Inter Tight or Plus Jakarta Sans at 17–18px.
- **Labels:** a mono face such as Geist Mono at 12–13px, uppercase. Nothing goes below 12px.

**Telugu version.** Pair the display serif with Noto Serif Telugu for headlines and Noto Sans Telugu or Anek Telugu for body text. Use line height 1.6–1.7 and body text about 10% larger than English. Telugu has no italics, so the accent word gets the violet-to-magenta gradient or an underline stroke instead.

### Layout

12-column grid, 8pt spacing, large radii (24–32px) and soft layered shadows. Vary the section rhythm: dark, light, full-bleed, then bento.

## 4. Section-by-section plan

The words come from the affiliate-first copy deck. Each section below says what the visitor sees and how it moves. Layouts are designed for desktop screens first (1440px reference width); mobile layouts come in a later phase.

### Navigation and language

- A floating glass pill with five short links (Why join, How it works, Who can join, Earning, FAQ), each on one line.
- An **English | తె** toggle sits beside the button. It remembers the choice, and switching crossfades the text in 200ms without reloading or losing the scroll position.
- The button reads “Express Your Interest”. It stays pinned inside the pill as the page scrolls.

### 1. Hero (100vh)

- The headline is “Help someone find the right service. Earn when it works out.” Words rise in one by one, and “earn when it works out” carries the gradient.
- The main visual is a warm, looping video of real conversations (two neighbours on a balcony, a shopkeeper talking to a customer) inside an organic blob mask. Two floating bubbles sit over it: “Do you know a good doctor?” and “Yes, let me introduce you.” A thin thread links them.
- A light 3D layer of glowing orbs (You → Healthcare, Education, Professional services) drifts behind the video and follows the cursor.
- Two buttons: a magnetic “Express Your Interest — it’s free” and a quiet “See how it works”.
- A row of four chips sits underneath: Free to join · Open to anyone in India · You see each provider’s terms first · Track every referral.

### 2. “Sound familiar?”

- The headline is “You’re already the person people ask.”
- A phone frame sits in the centre. As the visitor scrolls, the four questions from the copy (coaching centre, doctor for my mother, business papers, course after degree) arrive as chat bubbles one per scroll step, like a real group chat. Use the brand’s own bubble style, not a copy of any messaging app.
- After the last bubble, one calm line fades in: sBLOOM gives those moments a structure, and a reward when your introduction leads somewhere.

### 3. How it works: four steps

- A sticky stepper lists the four steps on the left: Express your interest, Learn the service, Introduce, Track and earn. The thread fills along the list as the visitor scrolls.
- On the right, a phone mockup changes per step: the short form → a service brief in plain language → an introduction screen with an “They said yes” permission toggle → a tracker with status chips.
- The section stays pinned for about one viewport of scroll per step, so each mockup has time to play.

### 4. You introduce. The experts advise.

- A one-line lead: notice a need, ask permission, make the introduction.
- Three tall cards, one per promise: **Ask first**, **Stay in your lane**, **Tell the truth**. Each has a bold line-art icon that draws itself as the card scrolls into view.
- This section is the answer to “Will I have to push people?”, so it sits early and uses large type.

### 5. Who can join

- The headline is “If people listen to you, you belong here.”
- Six persona cards sit in a fanned deck: homemaker, working professional, community leader, shop owner or tutor, retired person, young adult (18+). Each card is a portrait with the one-line description from the copy. Hover or tap lifts a card to the front.
- Cards tilt slightly toward the cursor for a sense of depth.
- Portraits show real places, such as an apartment landing, a school gate, a small shop, a community hall and an office lobby. Mix ages and genders, and avoid stock-model poses.
- Below the deck: “Not sure if it’s for you? Express your interest and we’ll explain.” as a link to the form.

### 6. Three areas people ask about most

- Three tall photo panels: Healthcare, Education, Professional services. Hover or tap expands one panel and plays a short loop, with the sector accent colour (coral, lime, teal).
- Each panel carries one line from the copy. A small note beneath says the services available depend on the providers on the platform.
- The open panel takes about 60% of the width while the other two narrow smoothly.

### 7. What an introduction sounds like

- A phone shows a calm, permission-first conversation typing out message by message. Tabs switch between the Healthcare, Education and Professional services examples from the copy.
- A small tag highlights the line “Only if you’re comfortable” with the label “Ask first”.
- This is the most reassuring moment for a first-timer: in under ten seconds it shows what the job actually feels like.

### 8. How you earn

- The headline is “Every provider sets its own terms, and you see them first.”
- Three cards joined by the thread, left to right: See the terms first → Watch the status → Earn when it qualifies.
- A segmented control with three options (reward on genuine interest, reward when the person goes ahead, both) plays a simple animated flow for each. **No rupee amounts appear anywhere.**
- One honest line, at least 14px, sits under the cards: earnings depend on each provider’s terms and no income is guaranteed. It appears once and is not repeated in boxes.
- Reserve a slot for the approved payout timing. It stays empty in the design file until the business confirms it.

### 9. Everything in one place

- A four-tile bento grid that matches the copy: Service briefs in simple language, Answers to common questions, A referral tracker, Provider terms in one place.
- Each tile holds a small live demo: a brief with “What to say” and “What not to say” columns, question chips that rotate, tracker status chips that tick forward, and terms rows side by side.
- Build the demos in HTML, not screenshots, so their labels switch to Telugu with the toggle. Show no “concept preview” labels, and do not show an AI chat tile until that tool is confirmed for affiliates.

### 10. Built to feel safe

- A strip of five items with simple icons that tick on in sequence: Free to join · Permission first · Terms before action · Status you can see · Your details stay with the programme. The last item links to the privacy notice.
- This replaces testimonials. Do not add logos, counts or earnings screenshots until real ones exist.

### 11. FAQ

- Eleven questions from the copy, grouped under three tabs: **Joining**, **Earning**, **Safety**. Answers stay at three lines or fewer.
- Two columns, with smooth accordions that open one at a time.
- The “Can I use this in Telugu?” answer includes a button that switches the page language on the spot.

### 12. Final call to action and working form (dark stage)

- The headline is “Someone you know is looking for the right help right now.” The thread arrives from above and blooms into a flower shape.
- The form opens inline, not on a new page, in three steps with a progress bar: **About you**, **Your circle**, **Confirm**.
- Step 1 asks for name, mobile number (WhatsApp preferred), city and state, and preferred language as large pill buttons (Telugu, English, Hindi, Other). Step 2 uses chips for the areas people ask about and where they connect with people, plus an optional note. Step 3 has the consent line and the submit button.
- Large 48px fields, labels above each field in the chosen language, and friendly inline errors.
- Under the button: “Free. No payment is asked at this stage.”
- The success screen plays the bloom animation and shows the thank-you message with the person’s name. The response-time line stays blank until the business confirms it.

### Footer

- A “Programme terms” link opens a drawer that holds the legal copy. The footer also carries the privacy notice, the language toggle, contact details and the line “A network of service advisers”.

## 5. Motion rules

- Use Lenis for smooth scroll and GSAP ScrollTrigger for pinned and scrubbed scenes.
- One easing curve for the whole site: cubic-bezier(.22, 1, .36, 1). Entrances take 600–900ms and hovers take 200ms.
- Stagger reveals by 60–80ms, and animate only transform and opacity.
- Honour prefers-reduced-motion with a static fallback for every scene, including the 3D.

## 6. Asset plan

The images and video must show the people the copy speaks to: homemakers, workers, shop owners and community leaders in believable Andhra and Telangana settings.

- **Hero video (6–8s loop, 1080p, under 2MB):** golden-hour handheld shots of two neighbours talking on a balcony, a shopkeeper showing a customer something on a phone, and a phone passed across a table. Keep one warm colour grade.
- **Persona portraits (6):** homemaker, working professional, community leader, shop owner or tutor, retired person, young adult. Natural light, everyday clothes, direct eye contact. Use licensed or commissioned photography. If any are AI-generated, label them illustrative and never pair them with names, quotes or earnings.
- **Sector photography (3):** a family at a clinic reception, students with a counsellor, two professionals reviewing documents.
- **3D layer:** glass-like orbs with soft bloom lighting, built in Spline or React Three Fiber, under 1.5MB. Lazy-load it and show a static poster first.
- **Phone mockups:** hand-built in HTML with real English and Telugu text, not screenshots.
- **Icons:** one line-icon set with a 2px stroke and rounded ends, drawn to animate.

## 7. Copy and language

- The affiliate-first copy deck is the source of truth for every word. The design follows it and does not rewrite copy.
- Every string exists in English and Telugu from day one. Telugu can run longer than English, so test buttons, the nav, cards and chips in both languages.
- Delete every “design preview”, “prototype” and “Phase 4” label.
- Each section gets one headline and at most two short lines before the visual does the work.
- The earnings caution appears once, with no rupee amounts anywhere on the page.
- Bracketed items in the copy deck (payout timing, response time, privacy link) are designed as clearly empty slots, never filled with invented text.

## 8. Performance and accessibility

- Design for desktop screens first. The reference width is 1440px, and the layout should hold from 1280px to 1920px. Mobile layouts are a later phase.
- LCP under 2.5s on broadband, hero video under 3MB with a poster frame, and the 3D layer loaded after the first paint.
- Subset the Telugu and Latin fonts, preload them and test Telugu rendering in Chrome, Edge, Safari and Firefox on Windows and macOS. Mark Telugu text with lang=“te” so screen readers pronounce it correctly.
- Contrast of at least 4.5:1, visible focus states and full keyboard use of the form, tabs and accordions.
- Every scene has a reduced-motion fallback, and the form keeps typed answers if the connection drops.

## 9. Inspiration to study

- **Jeton:** won Awwwards Site of the Day for combining serious flows with scroll-based movement.
- **Lusion and Noomo:** for the 3D hero and cursor interaction.
- **Immersive Garden and Obys:** for pinned storytelling and editorial type.
- **Apple and Google product pages:** for bento grids.

## 10. Paste-ready brief for Antigravity

> Rebuild the sBLOOM Affiliate Programme landing page as a desktop-first, scroll-driven page (1440px reference width; mobile layouts come later) called “The Thread”, in English and Telugu, with a language toggle that switches all text without reloading. The audience is homemakers, employees, shop owners, community leaders and any adult in India whom people trust. Use the affiliate-first copy deck for every word, show no rupee amounts, and include no “design preview” or “Phase 4” text. Style: warm paper background (#FAF7F2), ink #12101F, violet #6B3CFF with a violet→magenta→lime gradient, one dark stage section (#0E0B1E). Fraunces with Noto Serif Telugu for headlines, Geist with Noto Sans Telugu for body, Geist Mono for labels, nothing under 12px. Sections: floating glass nav with an EN | తె toggle and a pinned button; hero with a real-people video in a blob mask, floating chat bubbles and a light 3D orb layer; a “Sound familiar?” scroll scene where four questions arrive as chat bubbles; a sticky four-step stepper with animated phone mockups; three promise cards (Ask first, Stay in your lane, Tell the truth); a fanned six-persona deck; three sector panels; a typed, permission-first introduction conversation with three tabs; earning cards with a three-option segmented flow and one honest caution line; a four-tile bento of tools; a five-item trust strip; an FAQ with Joining, Earning and Safety tabs; and a dark final section where the thread blooms, with a working three-step interest form and a success state. Motion: Lenis and GSAP ScrollTrigger, one easing curve, reduced-motion fallbacks. Performance: LCP under 2.5s on broadband, hero video under 3MB with a poster frame, 3D loaded after first paint, 4.5:1 contrast.

## Sources

- Wavespace, Top 15 Website Design Inspirations for 2026: https://www.wavespace.agency/blog/best-website-design-examples
- Managed Code, Can AI design an award-winning website in 2026: https://managed-code.com/blog-post/can-ai-design-award-winning-website-site-of-the-day-2026
- TheeDigital, 20 Top Web Design Trends for 2026: https://www.theedigital.com/blog/web-design-trend
- StudioMeyer, Web Design Trends 2026 reality check: https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check.md
- Digital Gravity, 15 Award-Winning Landing Page Designs: https://www.digitalgravity.ae/blog/?p=9267
