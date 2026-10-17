---
name: atoure-deck
description: Build AToure Management & Consulting client decks (partnership proposals, pitch decks, sponsorship decks, credentials decks, decks for federations, ministries, tourism boards, brands and talent) as an editable PowerPoint plus a ready to send PDF, in English, French or both, in the AToure brand or a client theme. Bundles the brand fonts and logos, a pptxgenjs toolkit with diagrams and photo placement that never crops, headshot and photo choice sheets, a translation step, AToure's verified figures and photo locations, the house writing rules (no dashes, never "agency", "AToure Management & Consulting") and a render and check loop. Use it whenever the user asks for a deck, slides, a presentation, a pitch, a proposal deck or a PowerPoint for AToure or one of its clients (FIF, CAF, Orange, a tourism board, an artist), or asks to redo, translate, retheme, shorten or add a slide or case study to one, even if they never say "skill", "pptx" or "PowerPoint".
---

# AToure deck builder

Builds client facing decks for AToure Management & Consulting. The output is a PowerPoint the team
can edit and a PDF with the brand fonts embedded, which is the file that goes to the client. Most
of what makes these decks work was learned on the FIF partnership deck, through seven rounds of
client feedback; the worked examples and the toolkit carry those lessons.

Read these when the step calls for them:
- `references/house-style.md`: writing rules, figures policy, confidential numbers, vocabulary per
  audience, saying it plainly to officials, French. Read it before writing any copy.
- `references/credentials.md`: verified AToure figures, CAF and AFCON context, the creator
  network, contacts, and where the best photos and headshots are.
- `references/design-system.md`: grid, type, colour roles, slide archetypes, diagrams, photo rules,
  full bleed photo slides, generated images, client themes, and defects to look for in renders.
- `references/examples/fif-final/`: the approved 14 slide FIF deck in English, its French map, and
  notes on what each slide demonstrates. `references/examples/fif-build.js` is an earlier version
  written entirely on the toolkit; it runs as is.

## 1. Set up
```bash
SKILL=<this skill's directory>; WORK=<a work folder for this deck>
bash $SKILL/scripts/setup.sh $WORK        # node modules, Python tools, OpenCV, brand fonts
export NODE_PATH=$WORK/node_modules
```
The brand fonts must be installed before rendering, or the PDF falls back to other fonts.
If the website repo is cloned (usually `/home/user/website`), read its `CLAUDE.md`: it is the
client's own rulebook and wins over this skill where they differ. The photos and case study pages
live there too; in a session without it, ask the user to add `atoureconsulting/website`.

## 2. Pin down the brief
Before designing, know:
- **Audience and decision**: who reads it, what they must agree to, whether it is presented live
  or read as a PDF. Write in their vocabulary (house-style.md, sections 4 and 5).
- **What they value**: for a federation, visibility of their football and money from their own
  sponsors; for a ministry, the country's image; for a brand, audience and deliverables. That
  decides which figures go in the big numbers.
- **The ask**, named item by item (for FIF: accreditation, and official partner status), and what
  it costs the client.
- **Confidential numbers**: internal targets, floors, fees. Ask for them, keep them out of every
  slide, note and file property, and pass each to the checker with `--forbid`.
- **Proof**: which case studies fit. Take figures from credentials.md and re-check the live page.
  Never estimate a figure; ask for it. Separate AToure's results from event wide totals.
- **Languages**: English, French or both. Build the English first, then translate (step 8).
- **Look**: AToure theme by default. If the deck is for one client, offer a custom theme from the
  client's colours (step 4).

If the user is vague, make sensible calls from this list and state them in your delivery message
rather than stalling.

## 3. Plan the story
One message per slide, written as a statement title ("FIF keeps every control"). Use the arcs and
archetypes in design-system.md section 4: the whole proposal on one page, then the proof, the
problem in the client's terms, the shift, the ask, how it runs, who controls what, how the money
works, what they gain, how it builds to the client's own goal, and an easy first step. Say who gives
what and who pays whom in plain words (house-style.md, section 5). Show relationships, money and
processes as diagrams rather than paragraphs. Ten to fourteen slides for a pitch; six to eight for
credentials.

## 4. Theme
For a client theme: copy `assets/themes/atoure.json`, fill the ten roles (design-system.md
section 7), check contrast, render `python3 $SKILL/scripts/theme_card.py theme.json card.png`, show
the card and wait for approval before building with it. Keep Cormorant Garamond and Jost unless
asked otherwise.

## 5. Choose and prepare photos
Find candidates in `/home/user/website/Media/` (credentials.md names the strongest ones) and look
at them on a contact sheet:
```bash
python3 $SKILL/scripts/contact_sheet.py --cols 4 --cell 450 sheet.jpg photo1.jpg photo2.jpg ...
```
When a person or a hero photo matters to the client, let them choose. Build with your best pick,
and send numbered sheets alongside the deck:
```bash
python3 $SKILL/scripts/headshots.py find --prefix S --title "IShowSpeed headshot: pick one" heads.jpg <photos>
python3 $SKILL/scripts/headshots.py export heads.json S6 assets/head_speed.png
python3 $SKILL/scripts/choice_sheet.py --prefix T --title "Tour photo: pick one" tour.jpg <photos>
```
`find` detects faces, including other people's; run it once, then `--keep` the indexes that show
the creator. Write a prep spec (see `references/examples/fif-images.json`) and run
`node $SKILL/scripts/prep_images.js spec.json`. It keeps every photo's ratio, applies only the trims
you list (watermarks, generator marks, frame bars), and writes `assets/manifest.json`. The client
checks that no photo is cropped so far that its subject is lost, so lay slides out around each
photo's real proportions. Generated images are for concept slides only (design-system.md, section
10).

## 6. Build
Write one build script for the deck, starting from the examples:
```js
const kit = require(SKILL + "/scripts/deck_kit.js");
const deck = kit.createDeck({ theme: "atoure", title, subject, footer, assetsDir, lang: "en-GB" });
await deck.icons({ check: ["LuBadgeCheck", "label"] });   // Lucide icon names, colour role
deck.layouts();
deck.section("Introduction");
const s = deck.cover("Title on two lines", "Subtitle", "Speaker notes", (s) => {
  const p = deck.photo(s, "cover", { x: 0, y: 0, w: deck.W });       // give w or h, never both
  deck.fadeImage(s, "ltr", 0, 0, 9.6, p.h, { power: 0.6 });          // behind the title
});
const c = deck.content("CONTENT_LIGHT", "KICKER", "Statement title", "Speaker notes");
deck.T(c, "Body text", { x: deck.M, y: 1.95, w: 6, h: 1, color: "muted" });
await deck.save(WORK + "/Client Deck.pptx");
```
The toolkit exposes `T`, `kicker`, `photo`, `photoFit`, `chip`, `card`, `icon`, `iconCircle`,
`numCircle`, `node`, `arrow`, `line`, `stat`, `table`, `fadeImage` (any edge, with hold, power and
max), `overlay`, `photoFooter`, `partnerLogos`, `inlineList`, `logo`, and the colour roles in
`deck.C`. Use `deck.C.<role>` for shape fills and `"<role>"` strings for text colours. The last
argument of `cover` and `content` draws behind the title, for full bleed photos (design-system.md,
section 9). Speaker notes go through the content and cover calls; they are part of the file the
client receives, so they follow the same rules as the slides. Write every visible string out in
full in the build (no text assembled from pieces), so the translation step can reach it.

## 7. Render, look, check, fix
```bash
bash $SKILL/scripts/render.sh "$WORK/Client Deck.pptx" $WORK/render
python3 $SKILL/scripts/check_deck.py "$WORK/Client Deck.pptx" --forbid '<internal number pattern>'
```
`render.sh` writes the PDF, one image per slide and an overview sheet, validates the file and
warns about fallback fonts. Open every slide image and look for the defects in design-system.md
section 8; the first render always has a few. `check_deck.py` reports dashes, "agency", the
company name, "founder", placeholders, forbidden numbers, stretched or cropped photos and
unsourced reach or impressions, and exits non zero on errors. Fix, rebuild, re-render, and
re-inspect the slides you changed. Do not deliver with errors outstanding.

## 8. Second language
Translate the finished build, not the PowerPoint:
```bash
python3 $SKILL/scripts/translate.py extract build.js strings.json   # every visible string
# write fr.json: the same keys, French values (house-style.md, section 6)
python3 $SKILL/scripts/translate.py apply build.js fr.json build-fr.js --lang fr-FR
```
`apply` swaps the strings, sets the spellcheck language, adds French spacing before colons and in
figures (6,1 Md), and lists any copy left untranslated. Translate the speaker notes and alt text
too. Render the French build and look at every slide: French runs longer, so shorten lines in
`fr.json` until nothing wraps into the next element. Run `check_deck.py` on it as well. When the
English changes later, update `fr.json` for the changed strings only and apply again.

## 9. Deliver
- Send the PDF (for the client) and the PowerPoint (the editable master) for each language, with
  clean file names such as `AToure <Client> Partnership Deck.pdf` and `AToure <Client> Proposition
  de partenariat.pdf`. Send choice sheets alongside if you made them.
- Say that the PowerPoint needs Cormorant Garamond and Jost installed to edit (they are in this
  skill's `assets/fonts` and in the website repo `brand-kit/02-fonts`); otherwise text reflows.
- In the message, list what the user must confirm: every commitment the deck makes on AToure's
  behalf, contact details, any figure you were unsure of or left out, wording they own ("official
  partners"), and offers you left out on purpose.
- Session folders can be wiped between conversations. Offer to commit the build script, prep
  spec, translation map and theme file to the website repo (for example `decks/<client>/`) so the
  deck can be rebuilt and edited later.
