# sBLOOM landing page: fixes for the issues found in the recordings

Based on the code you shared (index.css, HeroSection, SoundFamiliarSection, HowItWorksSection) and the three screen recordings. I have not run this code, so test each change at the viewport heights listed in section 8.

## 1. Root cause behind most layout bugs

The two pinned sections use `lg:h-screen lg:min-h-[680px]` with `overflow-hidden`, and the chat phone is a fixed `lg:h-[560px]`. Their content is taller than a short laptop viewport (roughly 600 to 740 CSS px tall, for example a 1080p laptop at 125% to 150% scaling). With `overflow-hidden` and `justify-center`, the overflow is clipped at both ends. That produces:

- the heading sliding under the nav and the phone covering it
- the "You answer from the heart" callout being cut off
- step 4 and the bottom of the phone being cut off
- Telugu being worse, because its text is longer

**Fix:** pin only when the viewport is tall enough, size the phones from the viewport height, and fall back to normal scrolling on short screens.

## 2. tailwind.config.js

Add two raw screens (Tailwind v3):

```js
theme: {
  extend: {
    screens: {
      // pinned scroll sections only on desktop screens tall enough to fit them
      pin: { raw: '(min-width: 1025px) and (min-height: 780px)' },
      // pinned, but short enough that inactive step descriptions should collapse
      pinshort: { raw: '(min-width: 1025px) and (min-height: 780px) and (max-height: 899px)' },
    },
  },
},
```

## 3. src/index.css

**a) Readable gradient for text.** The current gradient ends in `#D6F36B` (pale lime) on a cream background, so the last words are almost invisible. Keep `--gradient-bloom` for shapes and add a text version:

```css
:root {
  --gradient-bloom-text: linear-gradient(135deg, #6B3CFF 0%, #D6338A 55%, #E8590C 100%);
}

.text-bloom-gradient {
  background: var(--gradient-bloom-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
  /* each wrapped line gets the full gradient, so a lone last word is not washed out */
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
```

**b) Balanced headings** (removes the one-word last lines in English and Telugu):

```css
h1, h2 { text-wrap: balance; }
```

**c) One shared container** so every section has the same left edge (the hero uses `max-w-7xl`, the steps use 1200, so they currently differ):

```css
.site-container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 2rem;
}
@media (max-width: 640px) {
  .site-container { padding-inline: 1.5rem; }
}
```

Use `site-container` in HeroSection, HowItWorksSection, the promise section and the footer. The nav pill should use the same max width.

## 4. SoundFamiliarSection.jsx

**a) Pin only when it fits, otherwise show everything:**

```js
mm.add('(min-width: 1025px) and (min-height: 780px)', () => {
  ScrollTrigger.create({ /* unchanged */ })
})

mm.add('(max-width: 1024px), (max-height: 779px)', () => {
  setVisibleCount(5)
  setShowConclusion(true)
})
```

**b) Section and wrapper classes.** Replace the `<section className=...>` and the pin wrapper's `className`:

```jsx
<section
  id="sound-familiar"
  ref={sectionRef}
  className="relative bg-[#FAF7F2] scroll-mt-24 py-16 pin:py-0"
  aria-label="Sound familiar?"
>
  <div
    ref={pinWrapperRef}
    className="relative w-full flex flex-col items-center px-4 pt-8 pb-10 overflow-visible
               pin:h-screen pin:justify-center pin:pt-[88px] pin:pb-4 pin:overflow-hidden"
  >
```

Also change the inner container to `className="site-container max-w-[1100px] flex flex-col items-center gap-5 w-full"`.

**c) Portrait phone that fits the viewport.** Replace the phone's class string (`w-full max-w-[530px] lg:h-[560px] max-lg:h-auto max-lg:min-h-[380px] ...`) with:

```jsx
className="w-full max-w-[400px] min-h-[440px] pin:h-[clamp(440px,calc(100svh-330px),580px)]
           bg-[#FAF7F2] border-[10px] border-[#1A162B] rounded-[44px] shadow-2xl shadow-[#12101F]/10
           flex flex-col p-3.5 sm:p-4 relative"
```

**d) Avatars centred on their bubbles** (they currently bottom-align, which looks low on two-line Telugu bubbles). In the question rows and in the reply row, change `items-end` to `items-center`.

**e) Make the counter and dots agree.** The label says "x of 4" but there are 5 dots. Show 4 question dots, a divider, and a separate reply dot. Replace the dots block:

```jsx
<div className="flex justify-center items-center gap-1.5 pt-1.5" aria-hidden="true">
  {[0, 1, 2, 3].map((dotIdx) => (
    <span
      key={dotIdx}
      className={`h-1.5 rounded-[3px] transition-all duration-200 ${
        dotIdx < Math.min(visibleCount, 4) ? 'w-4 bg-[#6B3CFF]' : 'w-1.5 bg-[#12101F]/15'
      }`}
    />
  ))}
  <span className="mx-1 h-3 w-px bg-[#12101F]/15" />
  <span
    className={`h-1.5 rounded-[3px] transition-all duration-200 ${
      visibleCount >= 5 ? 'w-4 bg-gradient-to-r from-[#6B3CFF] to-[#FF4FA3]' : 'w-1.5 bg-[#12101F]/15'
    }`}
  />
</div>
```

`w-4.5` is not in Tailwind's default spacing scale, so it may not have been applying; `w-4` is safe.

## 5. HowItWorksSection.jsx

**a) Pin only when it fits:**

```js
mm.add('(min-width: 1025px) and (min-height: 780px)', () => {
  ScrollTrigger.create({ /* unchanged */ })
})
mm.add('(max-width: 1024px), (max-height: 779px)', () => {})
```

**b) Section and wrapper classes** (same pattern as section 4b):

```jsx
<section id="how-it-works" ref={sectionRef}
  className="relative bg-[#FAF7F2] scroll-mt-24 py-16 pin:py-0" aria-label="How it works">
  <div ref={pinWrapperRef}
    className="relative w-full flex flex-col items-center px-4 pt-8 pb-10 overflow-visible
               pin:h-screen pin:justify-center pin:pt-[88px] pin:pb-4 pin:overflow-hidden">
    <div className="site-container flex flex-col gap-5 pin:gap-6 w-full">
```

**c) Collapse inactive descriptions on shorter pinned screens.** Telugu step text is 3 to 4 lines, so four full cards do not fit under about 900 px. In the step card, change the description:

```jsx
<p className={`text-sm leading-relaxed text-[#575266] m-0 ${isSelected ? '' : 'pinshort:hidden'}`}>
  {step.description}
</p>
```

**d) Timeline connector aligned to the circle centres.** The old line is at `left-[23px]` but the circle centres are at about 43 px (6 px padding + 1 px border + 20 px padding + 16 px radius), so it was about 18 px off. It also ran the full height, so the progress fill did not match the circles.

1. Delete the old absolute line block (`<div className="absolute top-7 bottom-8 left-[23px] ...">`).
2. In each step card, remove `z-10` from the card's class string, and add this as the last child of the card (it must be a sibling of the circle and text blocks, inside the card):

```jsx
{idx < stepsData.length - 1 && (
  <span
    aria-hidden="true"
    className={`hidden sm:block absolute z-[1] left-[34.5px] top-[56px] -bottom-[34px] w-[3px] rounded-full transition-colors duration-300 ${
      idx < activeStep ? 'bg-gradient-to-b from-[#6B3CFF] to-[#FF4FA3]' : 'bg-[#12101F]/10'
    }`}
  />
)}
```

Then give the number circle `relative z-[2]`. Each segment now starts under its own circle, ends just above the next one, and fills when that step is completed.

**e) Stop the hovered card jumping sideways.** In the inactive card class, replace `hover:translate-x-1` with `hover:shadow-md`.

**f) Phone height from the viewport:**

```jsx
className="w-full max-w-[340px] h-[460px] pin:h-[clamp(400px,calc(100svh-300px),480px)] bg-white
           border-[9px] border-[#1A162B] rounded-[40px] shadow-2xl shadow-[#12101F]/10
           flex flex-col p-3 sm:p-3.5 box-border overflow-hidden"
```

**g) Step 1 badge.** `'1 of 3'` collides with the 4 step dots. Use a name like the other screens do: English `badge: 'Sign up'`, Telugu `badge: 'నమోదు'`.

**h) "Service Brief" screen (step 2).** The large gap comes from `justify-between`, and the tags overflow because they sit in a non-wrapping row. Change the step 2 wrapper from `justify-between gap-2.5` to `justify-start gap-3`, make the tag row `flex flex-wrap items-center gap-1.5 mb-1`, add `whitespace-nowrap` to both tag chips, and give the bottom "The provider explains full details" row `mt-auto`.

## 6. HeroSection.jsx

**a) Trust row.** The row is `lg:flex-nowrap` with `shrink-0` chips, so it overflows past the divider line (`border-t` on a 660 px column). Make it wrap:

```jsx
<div className="flex flex-wrap items-center gap-2 pt-3.5 mt-1 border-t border-ink/10 w-full" ...>
  ...
  <div className="inline-flex items-center gap-1.5 ... "> {/* remove shrink-0 */}
```

**b) Telugu chat cards.** Both cards have English-sized widths, so the Telugu text stacks into a tall narrow card that overlaps the first one. Make widths language-aware:

```jsx
// bubble 1
className={`absolute ... ${lang === 'te' ? 'w-[210px] sm:w-[230px]' : 'max-w-[180px] sm:max-w-[210px]'} ...`}

// bubble 2
className={`absolute ... ${lang === 'te' ? 'w-[250px] sm:w-[270px]' : 'max-w-[200px] sm:max-w-[230px]'} ...`}
```

and on both `<p>` tags use `text-xs sm:text-[14px]` for English and `text-xs sm:text-[13px]` for Telugu.

**c) Container.** Change `w-full max-w-7xl mx-auto px-6 sm:px-8 ...` to `site-container ...` (keep `relative grid ...`).

## 7. Other changes

**Copy: email, not mobile number.** The sign-up mock still asks for a mobile number, which conflicts with the email-first decision. In `mockupText.en.step1`: `field2: 'Email'`, `val2: 'ananya@example.com'`. In `mockupText.te.step1`: `field2: 'ఇమెయిల్'`, `val2: 'ananya@example.com'`. In the copy file, also update step 1's description ("your mobile number") to say email, and keep mobile only as the fallback.

**Nav background.** `Navbar.jsx` was not in the files you shared. The nav lets page text show through. Give it a mostly opaque background, for example `bg-[#FAF7F2]/95 backdrop-blur-xl` with the same border and shadow, instead of the current low-opacity white.

## 8. Test checklist

Test in English and Telugu at these viewport heights (browser DevTools, desktop width 1280 or more):

| Height | Expected |
|---|---|
| 604 and 725 | No pinning. Chat shows all bubbles, steps scroll normally, nothing clipped |
| 800 | Pinned. Chat phone about 470 px tall, heading fully visible, callout visible. Steps show collapsed inactive descriptions |
| 900 and above | Pinned. Steps show all descriptions, in Telugu too |

Also check: the timeline line passes through the circle centres, hovering a step does not shift it, the hero headline's last word is readable, and the Telugu hero cards no longer overlap.

## 9. Still needed from you

- `FloatingOrbsCanvas.jsx`, to fix the clipped "Education" label. Its label layer sits under the blob (`z-[1]` versus `z-[2]`), so the label needs to render above it or move outside the blob's radius.
- `Navbar.jsx`, for the nav background and the language-toggle label.
- The copy file with the English and Telugu strings.
- The sections that are still missing from the page: Who can join, Earning, FAQ, a final call to action and the contact form.
