# MIMOS Academy - Facilities Page Refactoring Design (`design.md`)

## 1. Executive Summary & Vision

This document outlines the complete visual and structural refactoring of the MIMOS Academy Facilities page (`/facilities`). The new design strictly mirrors the layout, interactive mechanics, dark visual hierarchy, and technical aesthetic of the [Coffee-Tech Technology Page](https://www.coffee-tech.com/technology).

By transitioning from the current dual light-dark hybrid layout to an immersive, dark-mode high-tech showcase, MIMOS Academy will present its national semiconductor cleanrooms, 5G/AI compute hubs, and cyber ranges with state-of-the-art visual impact suitable for semiconductor engineers, corporate R&D partners, and government stakeholders.

---

## 2. Benchmark Analysis: Coffee-Tech Technology Page vs MIMOS Facilities

| Feature Section | Coffee-Tech Technology Page Design | MIMOS Academy Refactored Facilities Page |
| :--- | :--- | :--- |
| **Page Base Theme** | Deep slate-black background (`#0D0E13`) across the entire page | Pure dark mode base (`#0B0C10` / `#0D0E13`) with MIMOS signature magenta (`#D81B60`) & cyan (`#00E5FF`) accents |
| **Hero Section Header** | Giant infinitely scrolling Marquee text reading `"TECHNOLOGY"` | Giant animated Marquee text reading `"FACILITIES"` / `"APPLIED R&D ENVIRONMENTS"` |
| **Hero Feature Showcase** | Central machine visual with intro copy | Static Hero Showcase with high-impact hero image, marquee banner, intro text, and scroll indicator |
| **Feature List Layout** | Full-width alternating rows (`features-rows`) with large visual blocks, `01` indicator badges, bold `H2` headers, and deep technical paragraphs | Full-width high-contrast alternating rows powered dynamically by `getSafeFacilities()` with monospaced numerical badges (`01`, `02`, `03`, `04`), crisp titles, and technical specifications |
| **Call to Action (CTA)** | Dark theme section with *"Interested in learning more?"* headline, hollow product button, and filled contact button | Dark theme section *"Access Our R&D Infrastructure"*, with filled `"Get in Touch"` button and hollow `"Explore Programmes"` button |

---

## 3. Detailed Component Architecture & Layout Plan

### 3.1 Hero Section (Static Hero Showcase)
- **Infinite Marquee Header**: Top banner featuring a smooth, CSS/Framer Motion infinite scrolling text banner displaying `FACILITIES /// APPLIED R&D ENVIRONMENTS`.
- **Hero Banner Visual**: A high-impact, full-width dark laboratory visual featuring MIMOS Berhad's national semiconductor cleanrooms and high-tech testing infrastructure.
- **Hero Header & Intro Block**:
  - Headline: `"BUILT FOR HIGH-TECH EXCELLENCE"`
  - Subtitle: Highlighting MIMOS Academy's direct access to Malaysia's premier applied research laboratories and testing environments.
  - CTA scroll indicator to direct users toward the facility rows below.

### 3.2 Facility Lightbox Modal Overlay (`FacilityOverlay.tsx`)
- Triggered by clicking facility card "View Details" buttons.
- Features:
  - Dark backdrop with glassmorphism container.
  - Large facility image viewer.
  - Lab numerical badge (e.g. `// 01 //`).
  - Lab title and comprehensive capability breakdown.
  - Interactive Previous/Next lab navigation arrows.
  - Key specifications table (Cleanroom Class, Equipment, Compute Specs, Certifications).

### 3.3 Feature Showcase Rows (`FeatureRowItem.tsx`)
- Full-bleed, high-contrast alternating row feature cards modeled directly after Coffee-Tech's `.features-rows`.
- Row Structure:
  - **Visual Block**: High-resolution facility photograph with sleek dark borders and subtle gradient overlay.
  - **Content Block**:
    - Large Monospaced Indicator Badge (`01`, `02`, `03`, `04`).
    - Lab Title Header (`H2`): e.g., **Semiconductor Technology Centre (STC)**.
    - Deep technical description paragraph detailing industrial capabilities, thermodynamics/cleanroom standards, and training outcomes.
    - Clean Technical Specifications Table (Cleanroom ratings, equipment models, GPU node counts).

### 3.4 Bottom CTA Section
- Full dark background with subtle ambient light gradient.
- Heading: *"Interested in leveraging MIMOS R&D Facilities?"*
- Dual Action Buttons:
  - **Primary (Filled Magenta/Cyan)**: `"Contact Us"` -> `/contact`
  - **Secondary (Hollow Border)**: `"Explore Programmes"` -> `/programs`

---

## 4. Visual Design Tokens & Styling

```css
:root {
  --bg-dark-base: #0B0C10;
  --bg-dark-surface: #12131A;
  --bg-dark-card: #1A1C24;
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;
  --accent-magenta: #D81B60;
  --accent-cyan: #00E5FF;
  --border-subtle: #2A2D3A;
}
```

---

## 5. Technical Implementation Steps

1. **Scaffold Sub-components**:
   - `src/components/facilities/FacilitiesMarquee.tsx`
   - `src/components/facilities/FacilityHotspots.tsx`
   - `src/components/facilities/FacilityOverlayModal.tsx`
   - `src/components/facilities/FacilityFeatureRow.tsx`
2. **Refactor `FacilitiesClientPage.tsx`**:
   - Convert root page container to `bg-[#0B0C10] text-white min-h-screen`.
   - Assembly of Hero Marquee, Hotspot Showcase, Alternating Feature Rows, and Bottom CTA.
3. **Data Hydration**:
   - Enhance `mockFacilities` in `src/lib/db.ts` to include hotspot coordinates (`x`, `y` percentages), detail images, equipment lists, and deep description content.
4. **Verification & Polish**:
   - Test responsive layout across mobile, tablet, desktop.
   - Verify modal keyboard navigation (`Esc` to close, arrow keys for prev/next).
   - Ensure fast image loading via `next/image` with `priority` on hero elements.
