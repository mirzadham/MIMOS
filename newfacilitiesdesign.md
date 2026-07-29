# MIMOS Academy - Facilities & Applied R&D Environments Page Design Specification

## 1. Overview & Vision

* **Page Title:** [MIMOS Academy - Applied R&D Environments](https://mimos-academy.my/facilities)
* **Target Audience:** Semiconductor engineers, corporate R&D partners, high-tech industry trainees, and academic researchers.
* **Core Goal:** Translate MIMOS Academy's national semiconductor and testing capabilities into a modern, high-tech visual narrative—leveraging dark-mode aesthetics, industrial typography, interactive laboratory showcases, and structured numerical callouts (`// 01 //`).

---

## 2. Visual & Aesthetic System

### 2.1 Color Palette

| Token Role | Hex / Value | Description |
| :--- | :--- | :--- |
| **Background Dark** | `#0B0C10` / `#12131A` | Slate-black base surface giving a futuristic, cleanroom laboratory feel. |
| **Surface Dark** | `#1A1C24` | Slightly elevated dark container cards for lab feature blocks. |
| **Primary Text** | `#FFFFFF` | Stark white display typography for high-contrast headlines. |
| **Secondary Text** | `#94A3B8` | Cool neutral gray for body copy and technical lab specifications. |
| **Accent Brand Pink** | `#D81B60` / `#E91E63` | MIMOS signature magenta accent for category indicators, active states, and numerical badges. |
| **Accent Tech Cyan** | `#00E5FF` | High-tech indicator glow for hotspot nodes and interactive lab status tags. |
| **Border / Divider** | `#2A2D3A` | Dark subtle borders separating section grids. |

### 2.2 Typography Hierarchy

* **Primary Font Family:** Clean, technical sans-serif (*Inter*, *Space Grotesk*, or *SF Pro Display*).
* **Monospace Accent Font:** *JetBrains Mono* or *Fira Code* for indexing (`// 01 //`, `// 02 //`).
* **Display Headlines:** Extra-bold uppercase (`3.2rem` - `4.5rem`), tight line height (`1.05`).
* **Section Headers (`H2` / `H3`):** Bold uppercase (`1.75rem` - `2.5rem`) with magenta/cyan accent underlines.
* **Numbered Markers (`// 01 //`, `// 02 //`):** Bright magenta monospaced indicators.
* **Body Copy:** Regular weight (`1rem` - `1.125rem`), relaxed line height (`1.6`) for high technical legibility.

---

## 3. Information Architecture & Layout Structure

+-------------------------------------------------------------------+
|  [Header / Floating Navigation Bar]                               |
|  - MIMOS Logo | Navigation Links | Mobile Menu Toggle             |
+-------------------------------------------------------------------+
|  [Marquee / Ticker Bar 01]                                         |
|  - Infinite Ticker: "APPLIED R&D // CLEANROOMS // COMPUTE CORES //"|
+-------------------------------------------------------------------+
|  [Hero Blueprint / Lab Viewport Section]                          |
|  - Headline: "APPLIED R&D ENVIRONMENTS"                           |
|  - Value Statement & Direct Access Subtext                         |
|  - Interactive Lab Viewport with [ SCROLL TO EXPLORE ] Prompt     |
+-------------------------------------------------------------------+
|  [Grid Layout - Key Capabilities Pillars]                         |
|  - 01. Certified Wafer Fab Cleanrooms                            |
|  - 02. Advanced Material Nanocharacterisation                      |
|  - 03. Failure Analysis & IC Testing                              |
|  - 04. Industrial Threat Ranges & Compute Cores                   |
|  - 05. Industry-Standard Equipment Access                         |
|  - 06. Applied R&D Talent Development                             |
+-------------------------------------------------------------------+
|  [Detailed Lab Showcase - Numbered List Blocks]                  |
|  - // 01 // WAFER & IC TESTING LAB                                |
|  - // 02 // FAILURE ANALYSIS & NANOCHARACTERISATION LAB            |
|  - // 03 // WAFER FABRICATION & PROTOTYPING LAB                   |
+-------------------------------------------------------------------+
|  [Call To Action (CTA)]                                           |
|  - Headline: "Gain direct learning access to our industry labs"   |
|  - Primary Action Button: [ GET IN TOUCH ]                        |
+-------------------------------------------------------------------+
|  [Marquee / Ticker Bar 02]                                         |
|  - Infinite Ticker: "DRIVING MALAYSIA'S HIGH-TECH EXCELLENCE //"   |
+-------------------------------------------------------------------+
|  [Footer]                                                         |
|  - Locations (TPM KL & Kulim) | Sitemap | Socials | Contact | Legal|
+-------------------------------------------------------------------+

---

## 4. UI Components Specification

### 4.1 Floating Header & Navigation

* **Layout:** Centered or pill-style floating top bar (`backdrop-filter: blur(12px)`), `justify-content: space-between`.
* **Brand Asset:** MIMOS Academy Logo with magenta arc accent.
* **Navigation Links:**
  * [Home](https://mimos-academy.my/)
  * [About Us](https://mimos-academy.my/facilities)
  * [Programmes](https://mimos-academy.my/facilities)
  * [Facilities](https://mimos-academy.my/facilities) *(Active State)*

### 4.2 Ticker / Marquee Section Dividers

* **Behavior:** Seamless horizontal autoscroll text animation.
* **Styling:** Dark background with uppercase monospaced text separated by magenta slashes (`//`).
* **Text 1:** `APPLIED R&D ENVIRONMENTS // CERTIFIED CLEANROOMS // WAFER FABRICATION // COMPUTE CORES //`
* **Text 2:** `DRIVING MALAYSIA'S HIGH-TECH EXCELLENCE // MIMOS ACADEMY //`

### 4.3 Hero Viewport & Lab Overview

* **H1 Display Title:** `APPLIED R&D ENVIRONMENTS`
* **Lead Copy:** "MIMOS Academy is situated inside the national MIMOS Berhad headquarters, featuring direct shared access to Malaysia's leading applied research laboratories and testing environments."
* **Section Tagline:** `TECHNICAL CAPABILITIES`
* **Interactive Element:** Large rounded container (`border-radius: 16px`) showing high-res imagery of the lab cleanrooms with subtle cyan overlay nodes. Includes an interactive `[ SCROLL TO EXPLORE ]` directional badge.

### 4.4 Technical Pillar Cards (2x3 Grid)

Grid highlighting the 6 core pillars of MIMOS Academy's facilities:

1. **Certified Wafer Fab Cleanrooms:** Class-certified cleanroom access for semiconductor fabrication processes.
2. **Failure & Material Analysis:** Advanced spectroscopy, electron microscopy, and nanocharacterisation capabilities.
3. **Wafer & IC Testing:** Comprehensive integrated circuit testing and physical device qualification.
4. **Compute Cores & Threat Ranges:** High-performance computing clusters and cybersecurity testing environments.
5. **Industry-Standard Equipment:** Real-world hands-on experience using commercial-grade machinery.
6. **Talent Development:** Bridging theoretical engineering knowledge with industry-ready practical experience.

### 4.5 Numbered Laboratory Showcase (`// 01 //` to `// 03 //`)

Large, high-impact section featuring full-width visual cards for each primary facility:

* **Card 1:**
  * **Tag:** `// 01 // WAFER & IC TESTING LAB`
  * **Heading:** `WAFER & IC TESTING LAB`
  * **Summary:** Specialized testing floor for microelectronic validation, wafer probing, and IC diagnostic evaluation.
* **Card 2:**
  * **Tag:** `// 02 // FAILURE ANALYSIS, MATERIAL ANALYSIS & NANOCHARACTERISATION LAB`
  * **Heading:** `FAILURE ANALYSIS, MATERIAL ANALYSIS & NANOCHARACTERISATION LAB`
  * **Summary:** Deep structural, elemental, and nanoscale inspection tools for semiconductor materials and failure diagnostics.
* **Card 3:**
  * **Tag:** `// 03 // WAFER FABRICATION & WAFER PROTOTYPING LAB`
  * **Heading:** `WAFER FABRICATION & WAFER PROTOTYPING LAB`
  * **Summary:** End-to-end prototyping capabilities supporting silicon substrate preparation, photolithography, and device fabrication.

### 4.6 Conversion / CTA Banner

* **Headline:** `Gain direct learning access to our industry-standard labs and premium training environments.`
* **Action:** [GET IN TOUCH](https://mimos-academy.my/facilities) solid magenta high-contrast button (`bg: #D81B60`, `hover: shadow-magenta-glow`).

### 4.7 Footer & Regional Hub Directory

* **Brand Tagline:** `Driving Malaysia's High-Tech Excellence`
* **Locations Column:**
  * [Technology Park Malaysia, Kuala Lumpur](https://mimos-academy.my/facilities)
  * [Kulim Hi-Tech Park, Kedah](https://mimos-academy.my/facilities)
* **Contact Details:**
  * Tel: `+604-405 2540`
  * Email: [academy@mimos.my](mailto:academy@mimos.my)
* **Social Connections:**
  * [LinkedIn](https://mimos-academy.my/facilities) | [Facebook](https://mimos-academy.my/facilities) | [Instagram](https://mimos-academy.my/facilities) | [X](https://mimos-academy.my/facilities) | [TikTok](https://mimos-academy.my/facilities)
* **Copyright Bar:** `© 2026 MIMOS Berhad. All Rights Reserved.`

---

## 5. Motion & Interaction Rules

* **Scroll FX:** As the user scrolls through labs `01` to `03`, images utilize subtle parallax scrolling with text fading up (`opacity: 0 -> 1`, `transform: translateY(20px)`).
* **Hotspot Hovering:** Interactive tech hotspots on lab photos illuminate with cyan glow rings on hover.