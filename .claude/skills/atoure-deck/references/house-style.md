# AToure house style for decks

If the website repo is present, read its `CLAUDE.md` first (usually `/home/user/website/CLAUDE.md`).
It is the client's own rulebook and wins over anything here when they differ.

## Contents
1. Copy rules
2. Figures and claims
3. Confidential numbers and commitments
4. Verbiage by audience
5. Saying it plainly to officials
6. French decks

## 1. Copy rules

**No hyphens or dashes anywhere in client copy.** No em dash, no en dash, no hyphenated compounds:
titles, body, captions, speaker notes, table cells, the passes drawn on a slide. The client asked
for this explicitly and checks for it. Restructure with a full stop, a comma or a colon.
`check_deck.py` catches what slips through.

| Instead of | Write |
|---|---|
| multi-year, end-to-end, on-the-ground | multi year, end to end, on the ground |
| world-class, high-profile | among the best, high profile |
| pre-approved, post-event | approved in advance, after the event |
| co-ordinate, e-mail | coordinate, email |
| 15–20 passes, 2027–2028 | 15 to 20 passes, 2027 to 2028 |
| Speed — the biggest creator — arrived | Speed arrived. The biggest creator in the world. |

**AToure is never an agency**, in any language ("agence" is out in French too). It is a management
and consulting company: it builds the project and runs it on the ground as the operator, rather
than selling a campaign and handing delivery to someone else. That distinction is the pitch, so
the copy should show it ("AToure runs", "AToure delivers", "our own team in country"). The only
place the word survives is the contractual fee name "agency fee" in the Mauritius documents.

**The company name is always "AToure Management & Consulting"**: ampersand, never "and", never
translated ("Conseil", "Consultoría" are wrong). Short form "AToure".

**Baba Toure is Director**, never founder.

**House voice**, taken from copy the client wrote:
- Capability lists are short declarative fragments. "Local creator collaborations. Deep access to
  the fitness community." No verbs needed.
- Numbers are stated plainly, then undercut with the human result. The client's own line is
  "But the numbers never tell the full story." Use it in case study and tour copy, sparingly in
  pitch decks.
- Tour captions close with "This is what AToure was built for." (Instagram captions; not needed on
  slides.)
- Titles are statements, not labels: "FIF keeps every control", not "Governance". No full stop at
  the end of a title.

## 2. Figures and claims

- Publish only figures the user supplied or that appear on AToure's published case studies. If a
  number you want is missing, ask; never estimate. Several case study figures were read from
  partial screenshots and are lower than the real totals, so the user may have better ones.
- Reach and impressions are modelled, not reported (Instagram stopped exposing impressions for
  Reels in 2024). Label them "estimated" or cite the reported source on the same slide.
- Separate what AToure did from the event around it. The AFCON 2025 total of 6.1B digital
  impressions is a tournament figure: say "AFCON 2025 digital impressions, a tournament record",
  never that AToure generated it. Federations know these numbers and will notice an overclaim.
- Put a short sources line under figure blocks ("Sources: CAF report, YouTube Analytics,
  broadcast data.").
- Where two AToure pages disagree (the Côte d'Ivoire tour lists two national sponsors on the
  homepage and three on the case study), use the conservative version and tell the user.
- Douala was the only Cameroonian market on the Ashton Hall tour. Yaounde never appears in a
  market list.

## 3. Confidential numbers and commitments

- Internal targets, floors, margins and fees never appear in a client file: not on slides, not in
  speaker notes, not in file properties, not in a file name. Ask the user for them at the start and
  pass each as `--forbid` to `check_deck.py`. Example: when the deck asks for a range of passes,
  the lowest number AToure would accept is never written anywhere, here or in the deck. This
  skill lives in a public repo, so keep such numbers out of its files too.
- Governance promises are commitments AToure will be held to: codes of conduct, sponsor clearance,
  reporting after every fixture, withdrawal rights, phase gates. They make a deck persuasive, so
  use them, but list every one in your delivery message for the user to confirm.
- Revenue offers (a share of AToure's own sponsorship to the client, fee levels, guarantees) are
  the user's decision. Suggest them in the message; do not put them in the deck unasked.

## 4. Verbiage by audience

Write in the audience's own vocabulary, not marketing jargon. Avoid "UGC", "viral", "engagement
rate", "Gen Z" and "influencer" unless the audience uses them; say "creators and media
personalities", "audience", "attention".

- **Federations and confederations** (FIF, CAF, FRMF): accreditation categories, access zones,
  matchday protocol, official fixtures, commercial partners, category protection for existing
  sponsors, image rights, content approval, memorandum of understanding, pilot fixture, reporting.
  Use the team's name (les Éléphants). The decision makers worry about control, their partners and
  their image: show who decides what, and that it costs them nothing.
- **Governments, ministries, tourism and development boards**: country image, visitor attention,
  investment, institutional partnership, state facilitation, endorsement, programme, outcomes,
  reporting. Show public value first and AToure's operating record second.
- **Brands**: audience, activation, sponsorship tiers, deliverables, rights, category exclusivity,
  reporting. Never show a prospect its direct competitor as a proud credential (MTN to Orange):
  name the category ("a national telecom sponsor") or pick another proof, and tell the user.
- **Local detail**: "Côte d'Ivoire" in formal copy, FCFA for money in francophone West Africa.

## 5. Saying it plainly to officials

Federation officials, ministers and their advisers want to be spoken to directly. Every one of
these came back as a correction on the FIF deck, so get them right first time:

- **Say who gives what, and who pays whom.** Not "informal access" but "FIF gives creators tickets
  or accreditation". Not "value captured by others" but "brands pay the creators directly; FIF
  earns nothing". Diagram labels follow the same rule.
- **Spell out the money in their terms.** Not "new sponsorship inventory" but "creators under the
  FIF banner give FIF more to sell, so FIF can ask its sponsors for more money". Put it in a
  title ("FIF pays nothing. FIF earns more") and repeat it where they will look for it.
- **Lead with the figure they care about.** For a federation that is visibility in their sport:
  views, audiences, impressions around football. Logistics (security personnel, visas) are proof
  of capability, not the headline: put them in a "What AToure did" line, not in the big numbers.
  A creator's own channel growth (subscribers) means nothing to them.
- **Make the ask concrete and complete.** Name each request ("accreditation", "official partner
  status") and why it matters to them ("brands deal with an official partner of the Federation,
  not an intermediary").
- **Build to the goal they already have.** FIF thinks in tournaments, so the roadmap builds to
  AFCON, starting with a meeting on it, rather than a small pilot.
- **Show who you have worked with, big.** When a partnership is the proof (CAF and the FRMF),
  show the logos large with the label the user chooses ("Official partners").
- **Colour code who does what.** The client's colour for what the client gives and receives,
  gold for what AToure delivers and pays for (design-system.md, section 4).

## 6. French decks

- Translate everything except the company name, which stays "AToure Management & Consulting".
- "Agence" is banned like "agency". Use "société de management et de conseil" or "opérateur".
- French is full of hyphens; restructure around them: "c'est-à-dire" (soit), "peut-être" (sans
  doute), "après-midi" (en fin de journée), "week-end" (les
  deux jours), "rendez-vous" (rencontre, réunion), "vous-même", "porte-parole", "grand-public",
  "après-match" (après le match), "avant-première". Re-run `check_deck.py` on every French deck.
- More hyphenated forms that came up: "au-dessus" (devant, face à), "elle-même", "lui-même"
  (drop it or name the subject), "c'est-à-dire". `check_deck.py` flags any that slip in.
- Number ranges: "15 à 20 accréditations VIP". Email in French copy: "courriel" or the address alone.
- AFCON is "la CAN" (CAN 2025, CAN 2027). Figures in French form with a non breaking space:
  "6,1 Md", "97,3 M", "285 M". A non breaking space before ":" and ";". `translate.py` adds them.
- Vocabulary that worked for FIF: partenaire officiel, statut de partenaire officiel,
  accréditations VIP, accréditations terrain et médias, jour de match, gouvernance, sponsors,
  marques, créateurs (de contenu), lives, révélation de la mascotte, Directeur (Baba Toure).
  The client's line "But the numbers never tell the full story" becomes "Mais les chiffres ne
  racontent jamais toute l'histoire".
- Make the French deck from the finished English build with `scripts/translate.py` (SKILL.md,
  step 8). French runs 15 to 25 percent longer: shorten in the translation, not in the layout.
- Cormorant Garamond draws its accents tall and narrow by design (the bundled file is identical
  to Google Fonts' current one). "Côte", "Contrôle" are correct as rendered; do not rewrite copy
  to avoid accents.
