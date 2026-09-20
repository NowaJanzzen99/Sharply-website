# Sharply: website brief

Dit bestand is de enige bron van waarheid voor de nieuwe Sharply-website. Lees het volledig voordat je begint. Alles hieronder is besloten door Noah, tenzij het onder "Open punten" staat.

## 1. Wie en wat

- **Bedrijf:** Sharply (sharply.nl, domein is van Noah en er staat nu niets op). Ontwerpstudio van Noah Janssen.
- **Wat ze doen:** design en branding, AI-content (beeld, video, animatie) en het combineren van AI met handcraft. De kern: **high-end, complexe, mooi geanimeerde websites en volledige AI-flows voor klanten**: alles aan elkaar koppelen, een AI-chat in de site van de klant, webshops, databases, webapps, en websites die de klant zelf kan bedienen door te praten en die direct live gaan. Techniek erachter: Claude Code, Vercel, GitHub, databases.
- **Doel van de site:** (1) in een paar seconden laten zien dat dit topniveau is, (2) het aanbod duidelijk maken, (3) aanvragen binnenhalen via een goed formulier. De site is zelf het bewijs.
- **Stem:** "wij" (studio), niet "ik".
- **Talen:** Nederlands en Engels met een taalwisselaar.

## 2. Stijl

Noah wil het niveau van By-Kin, Mat Voyce, Iventions, Minh Pham en Lusion, maar dan veel meer AI en futuristisch, clean, glossy, glasachtig, bubbelachtig (zoals Gemini-visuals). **Niet flat:** echte diepte, licht en materiaal.

### Inspiratiebord (Pinterest "Sharply webdesign", 14 pins, privé)
Noah heeft screenshots meegegeven. Wat daarop terugkomt:

- Diepe **midnight-navy/bijna-zwarte** achtergronden met **kobaltblauwe gloed**.
- **Glazen bollen/orbs** met glans en reflecties (SWAP crypto, "Talk to Sandra AI", glass morphism mockup), soms met iridescente wervels binnenin.
- **Horizon-boog** als randlicht van een planeet onderaan hero's (voice assistant, Aurion blog).
- **Gematteerd glas** (frosted panels) met een dunne lichte rand en highlight, over glanzende vormen (editable glassmorphism layouts, 89%-statkaart, voice-UI met golfvorm).
- **Gebogen glazen vormen** en **gloeiende afgeronde tegels** (Master Industrial Design, blauwe glazen toetsen).
- **Vloeiende, vage blauwe massa's** (Halo AI studio) en een **regenboog-iridescent** verloop op zwart (oranje, groen, blauw), spaarzaam als accent.
- Typografie: dun tot regulier geometrisch sans, gecentreerde koppen, veel lucht, kleine navigatie, pill-knoppen.
- Enkele lichtere varianten (lila-grijs met blauwe boog, pastel 3D-bloemen "Where Money Grows") en een organisch-groene glasvariant: goed voor een lichte contrastsectie, niet als hoofdrichting.

Sla de echte beelden op in `reference/`.

### Uitgangspunt
- Basis: **donker midnight-navy**, kobalt als hoofdaccent, iridescent spectrum alleen op 3D-objecten en kleine details. Eventueel één lichte sectie voor ritme.
- Sharply = scherp. Optionele spanning: zachte glasvormen tegenover een paar scherpe, bewuste lijnen of diagonale snedes. Noah zei dat de naamgrap genegeerd mag worden, dus niet forceren.
- Lusion-invloed: objecten die met **physics** op cursor en scroll reageren, speels maar verfijnd. Geen kopie (Lusion gebruikt een eigen renderer): React Three Fiber + Rapier is de haalbare route.

### Let op: de categorie-valkuil
Donker + blauwe gloed + glazen orb is inmiddels de standaardreflex voor AI-sites. Het moet er dus niet uitzien als elke AI-startup. Onderscheid komt uit: echte materiaalkwaliteit (belichting/HDRI), eigen typografie, een sterk eigen wordmark, choreografie, en de physics. Vermijd: gradient-tekst, generieke glassmorphism-kaarten overal, neon-gloed op UI, drie gelijke feature-kaarten.

## 3. Techniek

Al geïnstalleerd (`package.json`): Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` (ScrollTrigger), `lenis`, `motion`, `@phosphor-icons/react`, `resend`.

Nog toe te voegen door degene die het nodig heeft: `@react-three/rapier` (physics), `@react-three/postprocessing`, `zod`.

- **3D:** `MeshTransmissionMaterial` (drei) voor glas, iridescentie via `MeshPhysicalMaterial.iridescence` of een eigen shader, goede HDRI/Environment. Camera en objecten gekoppeld aan scroll.
- **Smooth scroll:** Lenis + GSAP ScrollTrigger (`lenis` en ScrollTrigger synchroniseren).
- **Reveals:** Motion `whileInView` voor lichte reveals, GSAP alleen voor pin/scrub.
- **Fonts:** `next/font`, geen `<link>` naar Google Fonts. Geen Inter.
- **Icons:** alleen Phosphor, één strokewidth.
- **Performance:** 3D laadt ná de eerste tekst (LCP eerst), DPR-cap, `frameloop` pauzeren buiten beeld, poster-afbeelding als fallback. Op mobiel/zwakke GPU een lichtere of statische variant. `prefers-reduced-motion` volledig respecteren.
- **Regels:** gebruik de skill `design-taste` (en de Emil Kowalski-skills in `~/.claude/skills/emil-kowalski`). Kort: geen em-dashes (ook niet in NL teksten), geen scroll-cues, geen labels/pills over afbeeldingen, alleen `transform`/`opacity` animeren, ease-out, alle interactie-staten ontwerpen, contrast controleren.

## 4. Sitestructuur (voorstel)

1. **Hero:** 3D-glasscène, korte kop (max 2 regels), 1 zin, 2 knoppen (aanvraag, bekijk aanbod).
2. **Handcraft x AI:** korte manifest-sectie, woorden lichten op met scroll.
3. **Aanbod** (placeholders): websites en webapps, AI-chat en agents in de site, webshops, koppelingen en automatisering, branding en motion, AI-content. Geen drie gelijke kaarten: afwisselende compositie of gepinde stapel.
4. **Praat met je website:** scripted demo (zie 6).
5. **Werk** (placeholders): gegenereerde visuals per dienst, duidelijk gemarkeerd als placeholder in de code.
6. **Hoe we werken:** de flow van idee tot live (echte reeks, werkwoorden, geen "Stap 1").
7. **Aanvraag:** het stapsgewijze formulier (zie 5).
8. **Footer:** groot wordmark, taalwisselaar, bedrijfsgegevens en socials als lege plekken.

Teksten in `src/content/nl.ts` en `src/content/en.ts` (getypeerd, zelfde structuur). Routing met `[lang]` of vergelijkbaar, detecteer voorkeur via `Accept-Language`, onthoud keuze, `hreflang` en metadata per taal.

## 5. Aanvraagformulier (volledig uitwerken)

Stapsgewijs, met voortgang, toetsenbordvriendelijk, elke stap valideert bij blur, foutmeldingen onder het veld.

1. Wat heb je nodig (meerdere keuzes): website, webshop, AI-chat, koppelingen/automatisering, branding, motion/video, AI-content, anders.
2. Doel en omschrijving (vrije tekst).
3. Budgetrange en gewenste oplevering.
4. Referenties (links, wat vind je mooi).
5. Contact: naam, e-mail, bedrijf (optioneel), telefoon (optioneel).

Verzenden via een Route Handler (`/api/contact`) met `resend`. Validatie server-side (zod), honeypot en simpele rate limit, geen gegevens in URL's. Succes- en foutstatus. Optioneel een bevestigingsmail aan de klant in hun taal. Mail naar `CONTACT_TO_EMAIL`.

**Env:** zie `.env.local.example`. Noah zet `RESEND_API_KEY` zelf in `.env.local` en in Vercel. Vraag nooit om de key in de chat en commit hem nooit. Ontvanger nu `noahdays99@gmail.com`, later `noah.janssen@sharply.nl` (één variabele). Zolang sharply.nl niet is geverifieerd in Resend geldt `onboarding@resend.dev` als afzender, en die mailt alleen naar het adres van het Resend-account van Noah. Domeinverificatie: DNS staat bij **Mijndomein**.

## 6. Demo "praat met je website" (scripted)

Geen echte API-calls. Een gescripte demo: bezoeker kiest of typt een opdracht (bijvoorbeeld "maak de kop groter", "zet hem in donker", "voeg een webshopsectie toe", "publiceer"), de preview past zich **echt** aan met animatie, daarna een korte deploy-animatie ("live op je-domein.nl"). Het moet kloppen en niet neplive aanvoelen. Bouw het als echte werkende componenten, niet als plaatje van divs.

## 7. Beelden en logo

- **Logo:** nieuw wordmark ontwerpen dat bij de glazen stijl past (eventueel met klein beeldmerk). Lever het als SVG en houd het scherp op elke maat. Geen handgetekende schetsmatige SVG's voor illustraties.
- **Beelden:** genereren met de Higgsfield-tool (`generate_image`, eventueel `generate_video`). **Budget: maximaal 100 credits.** Controleer vóór elke batch het saldo en de kosten (`balance`, `show_plans_and_credits`), stop bij 100 en houd `reference/assets-log.md` bij (wat, prompt, kosten). Exporteer als geoptimaliseerd `avif/webp` in `public/`.
- **Al gemaakt en goedgekeurd door Noah (11 beelden, 33 credits, 67 over):** staan als webp in `public/images/`, volledige lijst met doel en prompt in `reference/assets-log.md`. Gebruik ze met `next/image`. `hero-orb` en `hero-orb-portrait` zijn de fallback en de visuele referentie voor de 3D-hero (de echte scène is code). Vijf `service-*` beelden zijn per dienst, `handcraft-ai` voor de handcraft-sectie, `bg-*` als sectieachtergrond. Modelkeuze: `gpt_image_2_5`, variant `sunburst` voor nieuwe beelden (Noah's voorkeur), kwaliteit `high`, 2k, 3 credits per beeld. Er staat geen tekst in de beelden.

## 8. Placeholders (later door Noah in te vullen)

Alles hieronder moet zichtbaar te vervangen zijn, met `placeholder: true` in de contentbestanden en niets dat als echt bewijs oogt:
- Exacte diensten, pakketten en prijzen.
- Klantcases, klantnamen, quotes en cijfers. **Verzin geen echte klantnamen of resultaten.**
- Bedrijfsgegevens (KVK, btw, adres) en privacystatement.
- Socials.
- Over ons/bio.

Analytics: cookieloos (bijvoorbeeld Vercel Analytics), zodat er geen cookiebanner nodig is.

## 9. Repo en deploy

- Lokaal: `~/Downloads/sharply`, eigen git-repo (niet nesten in een ander project).
- GitHub: `NowaJanzzen99/sharply-website` (aangemaakt; moet **Private** zijn, Noah zet dat zelf, controleer het).
- Vercel: project `sharply-website` in team "Noah Janssen's projects", live op sharply-website.vercel.app, deployt vanaf `main`. Framework Preset staat op Next.js. De Vercel-koppeling van Claude kan dit project niet zien, dus instellingen wijzigt Noah zelf in het dashboard. Pushen doet Noah zelf (`git push`), Claude wordt daarin geblokkeerd. sharply.nl koppelen als laatste stap (DNS bij Mijndomein, het domein is leeg).

## 10. Werkverdeling en volgorde

Noah heeft €45 Fable-tegoed voor vandaag. Fable doet de moeilijke creatieve kern, Sonnet (Claude Code) het voorspelbare werk:

**Fable (smalle opdracht, geen rest):**
1. Hero-scène: glas, iridescentie, belichting, physics, cursor en scroll.
2. Scroll-choreografie tussen secties en het uiteindelijke uiterlijk.
3. Overige signatuur-interacties.

**Sonnet:**
- GitHub/Vercel opzetten, i18n, content en placeholders, formulier + Resend, scripted demo, wordmark, beeldgeneratie, mobiel/fallbacks, testen, oplevering.

Tip om tegoed te sparen: itereer op 3D in korte, concrete rondes, en test niet steeds hele pagina's opnieuw.

## 10b. Wat er nu staat (gebouwd door Sonnet, 20 september 2026)

De hele site staat en draait, in het Nederlands en het Engels. Alleen de 3D-hero ontbreekt nog.

- **Routing en talen:** `src/app/[lang]/`, `src/proxy.ts` stuurt `/` naar `/nl` of `/en` via `Accept-Language`. Teksten in `src/content/nl.ts` en `en.ts`, getypeerd in `types.ts`.
- **Secties:** Hero, Manifesto (studio), Services, TalkDemo, Work, Process, ContactForm, Footer, plus Nav met taalwisselaar en mobiel menu.
- **Design tokens:** `src/app/globals.css`. Midnight navy, één kobalt accent, radius tot 16px, sterke easing-curves. Alle contrast is gemeten en haalt WCAG AA (body 9.35:1, kleinste tekst 5.2:1, knoptekst 5.68:1, randen 4.4:1).
- **Motion:** scroll-reveals en de hero-kop lopen op **CSS transitions** met `data-reveal` en `data-line`, niet op Motion. Reden: identiek op server en client, geen hydration-mismatch, en ze blijven soepel terwijl de pagina nog laadt. `prefers-reduced-motion` wordt in de stylesheet afgehandeld. Motion gebruiken we alleen voor AnimatePresence en scroll-gekoppelde waarden. Let op: zet `initial`/`animate` van Motion niet terug voor iets dat zichtbaar moet zijn, dat was precies de bug.
- **Formulier:** vier stappen, validatie bij blur, alle acht staten, honeypot, rate limit, zod, `/api/contact` via Resend. Getest: 400 bij ongeldige invoer, 429 bij te veel verzoeken, 500 als de env ontbreekt, en de foutstaat verschijnt in de UI. De succesroute kan pas als de Resend-key erin staat.
- **Demo:** volledig werkend en gescript. Kop groter, licht thema, webshopsectie, publiceren met deploy-animatie, transcript, reset, en losse tekstinvoer met trefwoordherkenning.
- **Beelden:** via `next/image`, dus mobiel laadt een kleine versie in plaats van 2336px. De hero gebruikt `<picture>` voor kunstrichting (liggend op desktop, staand op mobiel).

### Bewegingslaag (20 september 2026, commit e7ccc80 en later)

De site had polish maar geen choreografie: 32 elementen deelden één reveal en niets was gepind. Dat is vervangen.

- **Hero-bel is een afbeelding, geen WebGL** (`src/components/hero/FloatingOrb.tsx`). WebGL is geprobeerd en weer weggehaald: de shader-bel haalde het niveau van de gegenereerde render niet, en het inwisselen halverwege het laden liet de hero zichtbaar afvlakken. Nu staat er één bel, altijd dezelfde: `public/images/orb.webp`, gegenereerd op een transparante achtergrond, plus twee kleintjes. Eén rAF-lus schrijft de transforms rechtstreeks: eigen drift per laag, leunen naar de cursor, wegdrijven op scroll. Reduced motion zet hem stil. Wil je ooit een andere bel, vervang de afbeelding, niet de code.
- **Bewegingswoordenschat** in `globals.css`: koppen klappen omhoog achter een masker (`data-line`), bodytekst rijst (`data-reveal`), beelden openen als een gordijn uit een lichte zoom (`data-img-reveal`), groepen cascaderen (`data-stagger`).
- **Diensten zijn een reel**: het podium plakt terwijl zes diensten erdoorheen schuiven, met een index die meeloopt. Mobiel houdt een gewone stapel.
- **Werkwijze** tekent een rail en brengt de huidige fase naar voren.
- **Footer-wordmark** wijkt letter voor letter voor de cursor. **Knoppen** leunen naar de cursor toe.
- **Intro-gordijn** van 1,1 seconde, één keer per sessie.

**Twee valkuilen, beide gekost aan een uur, staan als commentaar in de code:**
1. `useScroll` van Motion levert hier geen voortgang, omdat de body `overflow-x` zet. Stapvolgorde loopt daarom via een IntersectionObserver in `src/lib/use-track-progress.ts`.
2. Een `rootMargin` van `-50%` aan boven- en onderkant maakt de root nul pixels hoog, en die kruist nooit iets. Onderkant staat daarom op `-49.9%`.

### Voor Fable
De enige openstaande creatieve taak is de hero-scène. In `src/components/Hero.tsx` staat bovenaan een blok met `FABLE:` dat aangeeft waar de canvas komt. Vervang alleen het `<picture>`-blok, houd de layout, de kop en de `parallax`-gate intact. `hero-orb.webp` blijft de poster en de fallback bij reduced motion.

### Conceptprojecten en formulier (20 september 2026)

- **Werk-sectie toont drie conceptprojecten** (Noordlicht Keramiek, Halm, Routewerk) met gegenereerde mockups in `public/images/project-*.webp`. Noah vroeg om placeholders die echt lijken. Het zijn verzonnen merken, dus elke kaart draagt een klein label "Conceptproject" onder de afbeelding, en de tekst zegt dat het eigen ontwerpen zijn. Haal het label pas weg als er een echt klantproject voor in de plaats komt. Verzin geen klantnamen, cijfers of quotes erbij. De namen zijn niet gecontroleerd op bestaande bedrijven.
- **Contactformulier is acht stappen**: wat je nodig hebt, over jullie, doel, details, stijl en materiaal, budget en planning, contact, overzicht. De detailstap bouwt zijn vragen op uit de diensten die je koos (`detailGroups` in `nl.ts` en `en.ts`). Velden staan als data in de content en worden door een generieke renderer getoond (`src/components/contact/`). Bijlagen: maximaal 3, samen 4 MB, alleen pdf, afbeeldingen en Office. Het overzicht en de mail gebruiken dezelfde `buildSections`. De API is `multipart/form-data`, geen JSON meer.
- **Telefoon**: de bel reageert op kantelen (`deviceorientation`). Android werkt direct, iOS vraagt bij de eerste tik om toestemming, wat het platform verplicht stelt.

## 11. Open punten

- Noah heeft nog geen definitieve diensten, prijzen of bewijs.
- Kleur- en stijlrichting is afgeleid van het Pinterest-bord (donker/kobalt). Als het te veel op "elke AI-site" gaat lijken, is een lichtere hoofdrichting een terugvaloptie.
- Resend en DNS moeten Noah nog inrichten (Mijndomein). Zonder `RESEND_API_KEY` geeft het formulier netjes een foutmelding met een mailadres als terugval.
- De 3D-hero moet nog gebouwd worden (Fable).
- Nog niet gedaan: een skip-link naar de hoofdinhoud, en een deelafbeelding voor social media.
