# sBLOOM Affiliate Landing Page — Open Items & Hidden Elements

This document tracks all elements that are currently kept empty or hidden pending final administrative details, and instructions on how to configure them.

---

### 1. External Signup URL (`SIGNUP_URL`)
- **Config File:** [`src/config/links.js`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/config/links.js)
- **Current State:** `export const SIGNUP_URL = ''` (empty)
- **Current Behavior:** Clicking any "Become an affiliate" button (in the Nav, Hero, or Final CTA) smoothly scrolls to the `#contact` section on the landing page.
- **How to Update:** Set the actual signup portal URL:
  ```javascript
  export const SIGNUP_URL = 'https://app.sbloom.in/signup'
  ```

---

### 2. Header Navigation Login Link (`LOGIN_URL`)
- **Config File:** [`src/config/links.js`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/config/links.js)
- **Current State:** `export const LOGIN_URL = ''` (empty)
- **Current Behavior:** The "Login" link (Telugu: "లాగిన్") before the primary navigation CTA button is completely hidden while `LOGIN_URL` is empty.
- **How to Update:** Set the affiliate dashboard login URL:
  ```javascript
  export const LOGIN_URL = 'https://app.sbloom.in/login'
  ```
  Once set, the link will immediately display in the desktop navigation and mobile drawer menu, styled inline and strictly fitting on one line in both English and Telugu.

---

### 3. Footer Contact Information Row
- **File:** [`src/components/FooterSection.jsx`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/components/FooterSection.jsx)
- **Current State:** Hidden.
- **Current Behavior:** The contact box row in the footer is hidden until real contact details (e.g. official support email or WhatsApp contact) are provided.
- **How to Update:** Set `contactDetails` in `copy.footer` (in [`src/i18n/copyDeck.js`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/i18n/copyDeck.js) / [`src/i18n/teDraft.js`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/i18n/teDraft.js)).

---

### 4. Earning Worked Example Breakdown (`rows` and `total`)
- **File:** [`src/components/EarningSection.jsx`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/components/EarningSection.jsx)
- **Current State:** The example breakdown rows and total amount (e.g. `₹[commission]` and `₹[total]`) are hidden.
- **Current Behavior:** The card displays the title, introductory narrative ("In one month, 3 introductions to a clinic and 2 to a coaching centre were confirmed..."), and regulatory footnote without showing any bracketed placeholders.
- **How to Update:** Once approved commission figures exist, add real numeric amounts to `earning.example.rows` and `earning.example.total` in [`src/i18n/landingCopyAdditions.js`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/i18n/landingCopyAdditions.js) and enable their rendering in `EarningSection.jsx`.

---

### 5. Programme Terms & Privacy Notice Full Documentation
- **File:** [`src/components/FooterSection.jsx`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/components/FooterSection.jsx)
- **Current State:** Clean interim explanatory text in English and Telugu is shown in the footer modal with no placeholder markers.
- **How to Update:** Update the modal content or replace with direct links to published legal terms and privacy documents once approved by legal counsel.

---

### 6. FAQ Approval Timeline and Payment Date
- **File:** [`src/i18n/landingCopyAdditions.js`](file:///c:/Users/Sree%20sisters/Desktop/sbloom/src/i18n/landingCopyAdditions.js) (FAQ 4 & FAQ 9)
- **Current State:** Cleaned of all brackets (`[X working days]` and `[date]`):
  - **FAQ 4 (Approval):**
    - English: *"When we get in touch, we will explain the next steps and get you started."*
    - Telugu: *"మేము మిమ్మల్ని సంప్రదించినప్పుడు, తదుపరి దశలను వివరించి ప్రారంభించడానికి సహాయం చేస్తాము."*
  - **FAQ 9 (Payment):**
    - English: *"Once a month. At month end you get an invoice, and we pay it to your bank account."*
    - Telugu: *"నెలకు ఒకసారి. నెల చివరలో ఇన్వాయిస్ వస్తుంది, మరియు మీ బ్యాంక్ ఖాతాకు చెల్లిస్తాం."*
- **How to Update:** If exact turnaround times (e.g. "within 2 business days") or cutoff dates (e.g. "by the 5th") are formalized, add them to `faq.items` in `landingCopyAdditions.js`. Note: Operational review claims ("Our team reviews every sign-up") are omitted pending formal verification.
