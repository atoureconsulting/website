---
name: AToure Management & Consulting
description: Access to African markets, handled on the ground.
colors:
  paper: "#F3F1EC"
  paper-deep: "#E9E6DF"
  ink: "#121212"
  ink-soft: "#3A3A38"
  mute: "#68655E"
  mute-on-dark: "#A29F97"
  rule: "#CFCBC2"
  night: "#141413"
  gold: "#C9971F"
  gold-ink: "#8A6510"
  network-green: "#3F8F5A"
  network-green-deep: "#2C6B42"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 6.2vw, 6.4rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  none: "0"
spacing:
  gutter-mobile: "20px"
  gutter: "40px"
  section-mobile: "64px"
  section: "96px"
  container: "1360px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.4rem"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.9rem"
  chip-selected:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  nav:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "72px"
---

# Design System: AToure Management & Consulting

## Overview

**Creative North Star: "The Field Ledger"** (proposed name; the direction itself was agreed as Swiss and industrial with a gold accent)

The site reads like a working record kept by an operator: warm paper, black ink, hard 1px rules, one gold accent. Type does the work. There are no shadows, no rounded corners and no decorative gradients. Real photography from real projects carries the emotion, and real figures carry the proof.

Density is editorial rather than busy: generous section spacing (96px), a 12 column grid inside a 1360px container, and content grouped by ruled lines rather than boxes. Dark "night" sections interrupt the paper rhythm for selected work, calls to action and case study highlights.

**Key Characteristics:**
- Archivo throughout, heavy for headlines (700 to 800), tight tracking.
- Paper `#F3F1EC` background, ink `#121212` text, 1px ink rules between sections.
- One gold, `#C9971F`, for actions and a small number of underlined headline phrases.
- Square corners everywhere.
- Photography and video from AToure's own projects only.

## Colors

A warm monochrome built on paper and ink, with a single gold accent and a green that only marks network countries on the map.

### Primary
- **Field Gold** (#C9971F): primary buttons, the nav Contact button, selected chips, the underline under key headline phrases, worked countries on the map. Decoration and large text only on light backgrounds: it reaches 2.3:1 on paper.
- **Gold Ink** (#8A6510): gold as small text on light backgrounds (figures, "Read the case" links, labels). 4.7:1 on paper.

### Secondary
- **Network Green** (#3F8F5A, deep #2C6B42): only for countries where AToure has access through its network, on the map and its buttons.

### Neutral
- **Paper** (#F3F1EC): page background.
- **Paper Deep** (#E9E6DF): alternate light surface, unselected map countries.
- **Ink** (#121212): text, rules, borders, focus outline on light surfaces.
- **Ink Soft** (#3A3A38): body copy and supporting text.
- **Mute** (#68655E): labels, captions, footer. 5.2:1 on paper.
- **Mute on Dark** (#A29F97): the same role on night sections. 7:1 on night.
- **Rule** (#CFCBC2): light dividers between items inside a section.
- **Night** (#141413): dark sections, video backgrounds.

### Named Rules
**The One Gold Rule.** Gold underlines at most three headline phrases per page. Its rarity is the point.

**The Readable Gold Rule.** On light surfaces, gold text smaller than 24px uses Gold Ink, never Field Gold. Gold text on night uses Field Gold.

## Typography

**Display Font:** Archivo (with system-ui, sans-serif)
**Body Font:** Archivo (with system-ui, sans-serif)

**Character:** One grotesque family in several weights. Headlines are heavy and tightly tracked; labels are small, uppercase and spaced.

### Hierarchy
- **Display** (800, clamp(2.8rem, 6.2vw, 6.4rem), 1.02): the homepage hero headline only.
- **Headline** (700, clamp(2rem, 3.8vw, 3.4rem), 1.02): section headlines.
- **Title** (700, 1.45rem): card and column titles.
- **Body** (400, 17px, 1.55): paragraphs, 34 to 52ch wide.
- **Label** (600, 0.75rem, 0.08em, uppercase): section names, form labels, meta lines. Never below 12px.
- **Figures** (700 to 800, tabular numerals, Gold Ink on light, Field Gold on night): view counts and other proof numbers.

### Named Rules
**The Twelve Pixel Floor.** No text that a visitor needs to read or tap sits below 12px.

## Layout

Container 1360px with 40px side padding (20px under 820px). Sections are separated by a 1px ink rule and padded 96px top and bottom (64px on phones). Section heads use a 4 to 8 column split: label left, headline and intro right. Lists of peers (audiences, figures, services) sit in ruled columns divided by 1px Rule lines. The hero is a 7 to 5 split between text and a photo slideshow and fills the first screen. Breakpoints in use: 1000px (map stacks), 900px (case grids stack), 820px (mobile navigation, sticky contact bar).

## Elevation & Depth

Flat. Depth comes from tonal contrast between paper and night sections and from 1px rules, never from shadows. The only shadow on the site is the cookie banner's.

### Named Rules
**The Rule Line Rule.** Separate with a 1px line, not a card or a shadow.

## Shapes

Square corners on every element: buttons, chips, inputs, images, video, cards. Inputs are a single bottom rule. Photographs are cropped to fixed ratios (4:3 for case cards, 16:10 for map photos, 9:16 for portrait video).

## Components

### Buttons
- **Shape:** square (0).
- **Primary:** Field Gold background, ink text, 700 weight, 1rem by 1.4rem padding.
- **Line:** transparent with a 1px ink border; on night sections the border and text are paper.
- **Hover / Focus:** fill swaps to ink with paper text. Keyboard focus is a 2px ink outline offset 3px on light surfaces, Field Gold on night.

### Chips
- **Style:** 1px ink border, transparent, 0.85rem text.
- **State:** selected fills with Field Gold. Used for the "What do you need?" choice and map countries (green border for network countries).

### Cards / Containers
- **Case cards:** a 4:3 photo, a ruled meta line (label left, "Read the case" right), a gold KPI line, a title and two lines of text. On hover with a mouse, or when held on screen on a phone, a three second silent clip plays over the photo.
- **Corner Style:** square. **Shadow Strategy:** none. **Border:** ruled lines only.

### Inputs / Fields
- **Style:** no box, 1px ink bottom rule, uppercase Mute label above.
- **Focus:** 2px ink outline, offset 4px.
- **Error:** red `#B3261E` bottom rule and message under the field.

### Navigation
- 72px sticky bar on paper with a 1px ink bottom rule. Monogram and two line wordmark left, text links and the gold Contact button right, EN/FR switch in ink. Under 820px the links collapse into a burger; the wordmark and EN/FR switch stay visible.

### Signature Component: the Africa map
An SVG map in Paper Deep with worked countries in Field Gold and network countries in Network Green. Choosing a country shows its city, a 16:10 photo, one published figure, a line of context, "Read the case" and "Talk to us about this market", which fills the contact form. Choosing an Africa Tour country zooms the map and draws the tour route through Accra, Douala, Lagos, Cotonou and Kigali.

## Do's and Don'ts

### Do:
- **Do** use only photography and video from AToure's own projects.
- **Do** keep every corner square and every divider a 1px rule.
- **Do** state figures plainly in Gold Ink, with their context underneath.
- **Do** keep video light: 720p web encodes, a still poster, and loading only when the visitor reaches it.

### Don't:
- **Don't** add shadows, glows, gradient text or rounded corners.
- **Don't** bring back Cormorant Garamond or Jost on the website; the site is Archivo only.
- **Don't** use Field Gold for small text on light backgrounds.
- **Don't** use AI generated images to stand in for real events.
