# FIF partnership deck, as approved (October 2026)

The 14 slide proposal to the Fédération Ivoirienne de Football, in the Éléphants d'Or theme, as the
AToure team signed it off after seven rounds of feedback. English build in `build.js`; the French
version is generated from it with `fr.json`:

    python3 <skill>/scripts/translate.py apply build.js fr.json build-fr.js --lang fr-FR

`build.js` predates two toolkit features, so it carries its own small helpers (T, photo, card,
node, arrow, gradient, photoFooter, partnerLogos). They behave like the `deck_kit.js` ones; when
you copy a slide, swap them for `deck.*` calls. It reads `./assets/manifest.json` and the
pptx skill's `apply_theme.js`, so it is a pattern reference rather than something to run as is.
Two French details were handled by hand in the original: the headshot alt text was assembled in
code (write such strings out in full so the translation map can reach them), and the text runs
were tagged `lang: "fr-FR"` (with `deck_kit.js`, pass `lang` to `createDeck` instead).

## What each slide shows
| # | Title | Look at it for |
|---|---|---|
| 1 | Global creators, governed by FIF | Full bleed generated stadium, soft left fade (power 0.6), client crest beside the AToure lockup |
| 2 | Two requests of FIF. AToure delivers the rest | Colour coded columns (client orange, AToure gold); audience figures band with a sources line |
| 3 | IShowSpeed at the AFCON Final, delivered by AToure | Photo collage at native ratios; eight numbered deliverables in two columns; big partner logos |
| 4 | 16 million watched the reveal live | Figure tiles; the client's undercut line; logos under the photos |
| 5 | Full operations, in Abidjan and across Africa | Two project cards with round headshots and visibility figures; inline lists with non breaking spaces |
| 6 | Creators already come to Ivorian football | Portrait photo with a list of gaps |
| 7 | From direct deals to a programme FIF governs | Before and after diagrams in plain words |
| 8 | Two requests of the Federation | Full bleed generated pass, title in the left column, request cards |
| 9 | How the programme runs | Four stage swimlane with icons above the text |
| 10 | FIF keeps every control | Responsibility table |
| 11 | FIF pays nothing. FIF earns more | Money flow diagram with numbered flows and matching explanations |
| 12 | FIF can ask its sponsors for more | The money message in a client colour box |
| 13 | Everything builds to AFCON 2027 | Timeline over a darkened tunnel photo; goal phase in the client colour |
| 14 | Three steps to AFCON 2027 | Full bleed lounge, long fade, contact block |

## Where the assets came from
- Real photos: website repo `Media/` (see `credentials.md`). Cover, request, roadmap, closing and
  gains slides use generated images from the user's Drive (`FIF/Photos`), trimmed of generator
  marks; the generated pass had its garbled credit painted out.
- Headshots were cut with `headshots.py` after the user chose S6 (Speed, ceremonial crown) and A4
  (Ashton, smiling outdoors); the tour photo was T2 (Benin street crowd).
- The FIF crest is the user's file from Drive; CAF and FRMF logos from `Media/logos/`.

## Feedback that shaped it (worth reading before any federation deck)
- Track record second, straight after the summary, and about what AToure did, with that
  confederation's own photos.
- Visibility figures, not logistics, in the big numbers; no creator channel metrics.
- Plain words for who gives what and who pays whom; the money benefit said outright.
- Two requests, named: accreditation and official partner status.
- The roadmap builds to the tournament the client cares about, starting with a meeting on it.
- The client chose its own headshots and photos from numbered sheets.
