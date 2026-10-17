# AToure deck design system

Everything here is implemented in `scripts/deck_kit.js`. Two worked examples:
`references/examples/fif-build.js` builds a 13 slide deck on the toolkit (runnable), and
`references/examples/fif-final/` is the 14 slide FIF deck as the client approved it, in English and
French, with the newer patterns (colour coded columns, full bleed photo slides, project cards).
Copy from them rather than starting from a blank file.

## Contents
1. Grid and type
2. Colour roles
3. Layouts and rhythm
4. Slide archetypes
5. Diagrams
6. Photos
7. Client themes
8. Defects to look for in the render
9. Full bleed photo slides
10. Generated images

## 1. Grid and type
- Canvas 13.333 x 7.5 in (`LAYOUT_WIDE`). Side margins 0.6 in: content runs x 0.6 to 12.733.
- Kicker at y 0.45 (11 pt bold, letter spaced, caps). Title at y 0.74, 38 pt heading font, one
  line where possible. Optional lede at y 1.68 (15 pt, muted). Content from y 1.95 to about 6.8.
  Footer and slide number at y 7.04 (10 pt), set on the layout.
- Heading font: Cormorant Garamond SemiBold (titles, card headings, diagram nodes, quotes). Body
  font: Jost (paragraphs, labels, and every big figure). Cormorant's numerals are old style, so
  "0 FCFA" reads as "o FCFA" and "97.3M" looks uneven: set figures in the body font at 26 to 30 pt.
- Sizes: cover title 54; slide title 38; card headings 19 to 24; body 14 (do not go lower for
  paragraphs); labels and captions 10 to 12.
- Width rules of thumb: Jost 14 pt fits about 10 characters per inch; Cormorant fits about
  `72 / (0.42 x size)` characters per inch. A 2.2 in card heading at 24 pt holds about 15
  characters before it wraps into the text below.

## 2. Colour roles
Use roles, never raw hex, so a client theme recolours the whole deck. `deck.C.<role>` for shapes,
`color: "<role>"` in `deck.T`.

| Role | AToure theme | Use |
|---|---|---|
| ink | AToure Black | dark slide backgrounds, titles and main text on light slides |
| canvas | Cream | light slide background |
| paper | Warm White | cards, text on dark slides |
| muted | Mid Brown | supporting text |
| gold | AToure Gold | anything that is AToure's: its node in diagrams, kickers on dark |
| client | set per deck | anything that is the client's: its node, its passes, review gates |
| label | Gold Dark | kickers and figures on light slides |
| highlight | Gold Light | figures and footer on dark slides |
| tint | Gold Pale | icon backgrounds, rule bands, muted text on dark |
| panel | Black Soft | tiles on dark slides |

The meaning is consistent across the deck: the client's colour always marks the client, gold
always marks AToure, neutral outlined nodes are third parties (creators, brands). Readers learn the
code on the first diagram and read the rest faster.

## 3. Layouts and rhythm
`deck.layouts()` defines COVER, CONTENT_LIGHT, CONTENT_DARK, SPLIT_DARK (title on the right of a
full height photo) and CLOSING. Rhythm that works: dark cover, light content, dark slides for the
proof (track record) and the return, dark closing. Never more than two dark slides in a row.

## 4. Slide archetypes
Pick per message; do not repeat the same layout twice in a row. The first table numbers the
toolkit example (`fif-build.js`); the second is the approved FIF deck (`fif-final/`), which
supersedes it where they differ.

| Message | Archetype | FIF slide |
|---|---|---|
| The idea in one line | Cover: dark text panel, portrait photo full height, faded edge | 1 |
| The whole proposal | Four icon cards (gives, delivers, costs, receives) plus a dark proof band of three figures | 2 |
| The problem exists | Landscape photo at native ratio, four icon rows naming the gaps | 3 |
| What changes | Today vs with the programme: two node diagrams side by side | 4 |
| Proof at the top level | Dark: photos side by side, 2x2 figure tiles, partner logos on white chips | 5 |
| More proof | Two cases on one page: portrait photo plus stacked figures for each | 6 |
| The ask | Drawn object (accreditation passes) plus category cards with FOR / REQUESTED rows | 7 |
| How it runs | Swimlane: phases across, the client and AToure as lanes, a rule band below | 8 |
| Who decides what | Statement column plus a responsibility table | 9 |
| How the money works | Numbered flow diagram, matching numbered explanations, a cost callout | 10 |
| What they get | Split dark: full height photo, six icon items | 11 |
| How it starts | Timeline with review gates, phase cards, a commitment band | 12 |
| The decision | Three numbered steps, a photo, one line of copy, the contact block | 13 |

Approved FIF deck (`fif-final/build.js`), in order:

| # | Message | Pattern |
|---|---|---|
| 1 | The idea, both names | Full bleed photo, long soft left fade, client crest beside the AToure lockup with a thin gold divider |
| 2 | The whole proposal | Two colour coded columns: client colour header "What FIF provides and receives", gold header "What AToure delivers and funds", tinted cards; dark band of audience figures below |
| 3 | Proof at confederation level | Three photo collage, eight numbered "what AToure did" items in two columns, big partner logos |
| 4 | The result | Two photos, 2x2 figure tiles, the client's undercut line, big partner logos under the photos |
| 5 | More proof | Two bordered project cards: round headshot, name, trip photo with chip, three visibility figures, a "What AToure did" line |
| 6 | The problem exists | Portrait photo, four icon rows |
| 7 | What changes | Today vs with the programme diagrams with plain labels ("tickets or accreditation", "direct deals") |
| 8 | The ask | Full bleed photo with a left fade, title left, two request cards right |
| 9 | How it runs | Four stage swimlane (calendar, confirmation, matchday, report), client and AToure lanes, rule band |
| 10 | Who decides | Photo, statement, responsibility table |
| 11 | The money | Flow diagram, numbered explanations, cost callout; title says it: "FIF pays nothing. FIF earns more" |
| 12 | What they gain | Photo, client colour message box with the money point, six icon rows led by the money |
| 13 | How it builds | Timeline over a darkened full bleed photo; the goal phase filled in the client colour |
| 14 | The decision | Full bleed photo, three steps, contact block, the closing line |

**Who does what, in colour.** When a slide splits responsibilities, give each side its own column:
a header bar in the role colour (client or gold) with dark text, cards tinted from that colour, icon
circles in it with dark icons, and kicker labels in a dark version of it (FIF used `A85400` on
`FDEEDC` and `806319` on `F7F1E0`; check 4.5:1). Readers see at a glance what is theirs.

**Partner logos as proof.** `deck.partnerLogos(s, [{ path, w, h, alt }], x, y, 1.0)` puts logos on
white chips about an inch tall with a label to their left. Small logos read as decoration; large
ones say "these institutions trusted us".

**Project cards.** Two cards side by side with a border make it obvious that they are two projects.
Each: a 0.95 inch round headshot (`headshots.py`), the project name as it appears on the website
("IShowSpeed in Abidjan", "Ashton Hall Africa Tour"), a short place and year line, a divider, a trip
photo at native ratio with a place chip, three figures beside it, then "WHAT ATOURE DID" and a
`deck.inlineList([...])` line so items never break in the middle.

A partnership pitch usually runs: cover, at a glance, the problem, the shift, proof, the ask,
how it runs, governance, money, gains, roadmap, next steps. A sponsorship deck swaps governance
for audience and deliverables and adds tiers. A credentials deck is cover, who we are, three to
five proofs, how we work, contact.

## 5. Diagrams
Draw a diagram whenever the message is a relationship, a flow of money or rights, a split of
responsibility, a process or a sequence. Built from `deck.node`, `deck.arrow`, `deck.numCircle`,
`deck.card`, `deck.table`, native shapes only, so they stay editable.
- Keep arrows horizontal or vertical; one diagonal at most. Label beside the arrow at 10 to 11 pt.
- Dashed arrows for conditional flows (a commission that only exists if revenue grows).
- Number the flows on the diagram (gold or client coloured circles) and repeat the numbers on the
  explanation rows beside it, so the eye can move between them.
- A dashed perimeter in the client colour with a pill label ("GOVERNED BY FIF") shows control.
- Responsibility table: first column the area, then one column per party, header cells in the
  party's role colour. Use it for governance; it is the format institutions already use.
- Timeline: a gold line, numbered circles, small client coloured diamonds labelled "review"
  between phases, cards below, and a dark band stating the commitment.

## 6. Photos
- Real AToure photos only, from the website repo `Media/` (credentials.md lists the strong ones).
  Make a contact sheet with `contact_sheet.py` to choose, then `prep_images.js` to prepare.
- Never crop to fill a frame. Size each photo from its own ratio (`deck.photo` with only w or h,
  or `deck.photoFit` inside a box) and build the layout around it: portrait photos for side
  panels, landscape for wide slots. The client checks that no element of a photo is cut off.
- Trims are allowed only to remove a watermark or a frame bar, set explicitly in the prep spec,
  and must not touch the subject. Leave photographer credits in place.
- Low resolution stills (under about 900 px on the long side) stay small: aim for at least about
  120 pixels per inch on the slide.
- Choose for the audience: a federation deck shows people in that federation's kit, not another
  nation's. Caption every documentary photo with a chip ("IShowSpeed in the Éléphants shirt,
  Abidjan") and give it alt text.
- Blend a full height photo into a dark panel with `deck.fadeImage` on the photo edge.
- **Let the user choose people and key photos.** For headshots run `headshots.py find` on the
  folder, curate to the creator's own face, and show the numbered sheet (S1 to S8). For trip or hero
  photos show a `choice_sheet.py` sheet (T1 to T9). The user answers with codes; `headshots.py
  export` then cuts the pick from the full resolution original. Build with your best guess first
  and say which code is in the deck, so the user is never blocked.
- Avoid photos that work against the audience: a meme (Ashton Hall's mouth tape) in a deck for a
  federation, another nation's shirt on the cover of a federation's deck.

## 7. Client themes
Default to the AToure theme. When the deck is for one specific client, offer a custom theme built
from the client's colours (Éléphants d'Or for FIF is the worked example in
`assets/themes/elephants-dor.json`).
1. Copy `assets/themes/atoure.json`, name the theme, and fill the roles. `client` takes the
   client's primary colour. `gold` stays AToure gold. You may move `ink` and `panel` to the client's
   dark colour (FIF: deep pitch green) and `label` to a secondary client colour if it is dark
   enough.
2. Check contrast: `label` and `muted` text on `canvas` at least 4.5:1; `paper` and `tint` on
   `ink` at least 4.5:1; `client` is used as a fill under `ink` text, so check that pair too.
   Bright flag colours often fail as text: darken them for `label` (FIF green 009E60 became
   007A4D).
3. Render `python3 scripts/theme_card.py theme.json card.png`, show the user, and apply only after
   they approve. Keep the brand fonts unless asked.
4. Pass the theme file path to `createDeck({ theme: "/path/theme.json" })`; nothing else changes.
   Hex only options (table borders, shadows) take `deck.HEX.<role>`.

## 8. Defects to look for in the render
These were the real problems in the FIF build; check each slide image for them.
- A card heading wrapping onto two lines and sitting on the body text below it.
- Letter spaced labels ("IN PARTNERSHIP WITH") wrapping earlier than their character count suggests:
  give them 20 percent more width.
- Rows in a list touching once a sub line wraps: keep 0.88 in between rows of heading plus line.
- Large empty areas at the bottom of cards: shrink the cards and add a rule or commitment band.
- Two line category names inside a drawn object colliding with the label beneath.
- Chevron shapes eating the start of their text: indent the text 0.4 in.
- Diagram labels landing on an arrow or another label.
- Fallback fonts in the PDF (render.sh warns): run setup.sh and render again.
- A list joined with " · " breaking inside an item ("Restricted zone / access") or a wrapped line
  starting with a space: build it with `deck.inlineList`.
- A heading that fits in English wrapping in French and landing on the body text. Shorten it in
  the translation map.
- A three line label inside a fixed band being cut off at the bottom: shorten the label.
- Text over a bright part of a photo (a floodlit pitch): narrow the text box or strengthen the
  fade; do not shrink the type.

## 9. Full bleed photo slides
Use a full bleed photo when the image carries the slide (the ask, the roadmap, the close).
- Pass a `pre` callback to `deck.content` or `deck.cover`: it draws before the title placeholders,
  so the photo and its fades sit behind the title. Anything added in `pre` is in the background.
- Place the photo at native ratio with `w: deck.W`; centre it vertically if it is taller than the
  slide (`y: (deck.H - h) / 2`). A photo wider than 16:9 leaves a band at the bottom: fade the
  photo into it with `deck.fadeImage(s, "btt", ...)`.
- Text needs a dark area: `deck.fadeImage(s, "ltr", 0, 0, 9.6, h, { power: 0.6 })` for a long soft
  fade under a left text column; `deck.overlay(s, 32)` to darken a bright photo under cards;
  `"ttb"` with `max: 0.55` behind a title on a busy top edge.
- Use the `PHOTO_DARK` layout (or `PHOTO_LEFT` for a title in the left column) and call
  `deck.photoFooter(s)`, because the photo covers the layout footer.
- Cards over a photo can be translucent (`fill: { color: deck.C.ink, transparency: 30 }`) so the
  picture shows through; keep text contrast by keeping the transparency at or below about 35.

## 10. Generated images
Users may supply AI generated images (stadiums, passes, lounges). They are fine for concept
slides and never for proof.
- Use them only where no real photo is implied: the cover, the ask, the roadmap, the close. Proof
  slides use real AToure photos.
- No place captions; alt text starts with "Illustration:".
- Look closely before using one: generator marks (trim them in the prep spec and mention the
  generator's terms to the user), garbled text (a company name misspelled, which also breaks the
  naming rule: paint it out or ask for a new image), and invented crests or logos that the client
  will recognise as fake (tell the user and suggest regenerating with the real one or none).
