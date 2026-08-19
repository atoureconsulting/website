# Photography still needed for the Taraji proposal page

The page renders correctly without any of these. Every missing file shows a
labelled placeholder block rather than a broken image, so the proposal can be
sent as it stands. Dropping files in at these exact names is all that is needed.

## Ivorian cinema section

Five of six are in place, pulled from the Drive folder and cropped to 3:4.
Still missing: `cinema-michel-gohou.jpg`.

## The Drive transfer, and its one limit

Worth recording, because it is not obvious. Files pulled through the Drive
connector come back as base64. When a result is large the harness writes it to
a file on disk, and it can then be decoded byte exact with no loss. When a
result is small it is returned inline instead, and inline data cannot be moved
to disk without corrupting, which was verified three times on the same file.

The practical threshold sits somewhere between 22KB and 65KB of original file
size. So the rule is simply: **anything above about 65KB transfers perfectly,
anything under about 25KB cannot be transferred at all.**

Both outstanding files are under it. `gohou michel.jpg` is 19KB and
`Taraji TPH.jpg` is 22KB. Re-saving either as a PNG, or at higher resolution,
pushes it over the line and it will then transfer cleanly.

## Taraji, two slots

| File | Where | Notes |
|---|---|---|
| `taraji-portrait.jpg` | Hero, present | Oscars red carpet frame lifted from the Rolling Stone Africa deck. A cleaner portrait would improve it. |
| `taraji-concept.jpg` | Concept section, missing | The haircare campaign frame: Taraji applying product to cornrowed hair, gold hoops, smiling. Portrait 3:4. It carries all three themes in one image, which is exactly what the slot needs. |

**One note on that frame.** The product bottle is prominent and its branding is
legible. That is the single image on the page most likely to make Rolling Stone
Africa read the project as a brand film, which is the risk we deliberately wrote
the editorial guarantee to close. Recommend cropping so her face and the hair
carry the frame and the bottle sits at the edge or out of it. The meaning
survives the crop. The brand reading does not.

## Rights

Portraits of named public figures are rights managed. Two routes, both better
than sourcing images independently:

1. **Rolling Stone Africa.** They sit inside Penske Media and have a picture
   desk that can clear portraits properly for their own project.
2. **The people themselves.** If AToure approaches any of these figures about
   participating, an approved photograph usually comes with the conversation,
   and that is the cleaner route since none of them has been approached yet.

## Not yet represented at all

No photography exists in this repository for Korhogo, Senufo country, Waraniéné
weaving, Grand Bassam, a karité cooperative or the Abidjan natural cosmetics
scene. These chapters carry the concept and currently have no imagery at all.
Commissioning or licensing a small set would strengthen the proposal more than
anything else listed here.
