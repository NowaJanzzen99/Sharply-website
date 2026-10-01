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

- **Logo: klaar.** Het beeldmerk is een gegenereerde render, geen vector: een letter S uit twee scherpe glazen bladen, cobalt met iridescente facetranden. Materiaal is hier het punt, en dat is wat het aan de bel in de hero bindt. Staat als `public/images/logo-mark.webp` (transparant) en `src/app/icon.png`. Vervangen doe je door die twee bestanden te vervangen, niet door `Wordmark.tsx` aan te passen.
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

## 10c. Detailpagina's (29 september 2026)

Diensten en projecten zijn nu klikbaar en hebben elk een eigen pagina.

- **Eén route voor alles:** `src/app/[lang]/[section]/[slug]/page.tsx`. De padsegmenten zijn vertaald (`/nl/diensten/webshops` tegenover `/en/services/webshops`), en de slug ook. Dat zou normaal vier routemappen kosten; door het segment tegen het woordenboek te valideren blijft het er één. Een derde taal is daarmee een kwestie van tekst schrijven, niet van mappen verplaatsen.
- **Teksten** staan in `src/content/details-nl.ts` en `details-en.ts`, apart van `nl.ts` en `en.ts`. Reden: de overzichtstekst is één regel per dienst en de detailtekst is een pagina. In één bestand is geen van beide meer te bewerken zonder scrollen. Ze horen bij elkaar via dezelfde sleutel.
- **Zes dienstpagina's** met inleiding, vier tekstblokken, een lijst "wat je krijgt" en drie veelgestelde vragen in een openklapper.
- **Drie projectpagina's** met inleiding, drie blokken, een lijst "wat het concept omvat" en op elke pagina de mededeling dat het een eigen concept is en geen klantwerk. Geen verzonnen cijfers of resultaten, ook niet op de detailpagina's.
- **Kaarten zijn klikbaar** via een uitgerekte link over de hele kaart, met de titel als toegankelijke naam. Zo is het hele vlak een doelwit terwijl een schermlezer één link met een zinnige naam voorleest.
- **Taalwisselaar:** `/nl` omzetten naar `/en` landt op een detailpagina op niets, omdat pad én slug vertaald zijn. De server bouwt daarom een kaart van tegenhangers (`getAlternates`) en geeft die aan `LangLink`. De grote tekstbestanden blijven daarmee op de server, de kaart zelf is een paar honderd bytes.
- **Nav en footer** staan nu in `src/app/[lang]/layout.tsx`, dus op elke pagina. De ankerlinks krijgen de homepage ervoor wanneer je niet op de homepage bent.
- **Toegevoegd:** een eigen 404-pagina, `sitemap.xml` en `robots.txt`, beide opgebouwd uit dezelfde woordenboeken.

## 10d. Logo, echte case, KvK en detailpagina's (29 september 2026)

- **Logo:** een geconstrueerd beeldmerk, geen render meer. Eén S als band van gelijke dikte, twee bogen van concentrische cirkels, rechte stukken onder dezelfde hoek, twee mespunten, puntsymmetrisch. Gekozen uit vier gegenereerde richtingen (`reference/logo-v2/`), daarna opnieuw opgebouwd uit geometrie omdat overtrekken kerfjes gaf. De maten staan in `reference/logo-v2/construct.py`; het pad staat in `src/components/Wordmark.tsx` en neemt de tekstkleur over (`currentColor`). Favicon: `src/app/icon.svg` (witte S op kobalt), plus `apple-icon.png`. Noah wilde alleen een beeldmerk; de naam staat er in Sora naast.
- **KvK:** Sharply, eenmanszaak, KvK 76336840, Scheidingsweg 2, 6045 CR Roermond. In de footer en als gestructureerde data (schema.org) in de layout. Btw-nummer staat niet openbaar; toevoegen zodra Noah het geeft.
- **Echte case:** Noordlicht Keramiek is vervangen door Live Wedding Paintings (Sara van Heukelom, liveweddingpaintings.nl). Noah deed alles, van ontwerp tot livegang. Kaartje zegt "Klantproject" in de accentkleur; concepten blijven "Conceptproject".
- **Beelden van de case:** echte screenshots, gemaakt met een eigen headless Chrome-script (`reference/lwp/capture.mjs`) dat echt scrolt zodat de reveals afgaan; de nieuwsbriefpop-up en cookiemelding worden alleen in die wegwerpbrowser verborgen. De apparaatscènes zijn gegenereerd met groene schermen en de echte screenshots zijn er met perspectief in gezet (`reference/lwp/composite.py`), zodat er geen verzonnen tekst op de schermen staat.
- **Detailpagina's:** veel minder tekst (één regel per hoofdstuk) en een gepinde scène (`DetailScrolly`): links wisselen de hoofdstukken, rechts beweegt het beeld mee. Bij diensten en concepten zoomt de camera per hoofdstuk naar een ander deel van het beeld (`focus.ts`); bij de echte case scrolt de echte site mee in een browservenster en stopt bij de sectie waar het hoofdstuk over gaat. Een echte case krijgt ook feiten (klant, rol, talen), een knop naar de live site en een galerij die zijwaarts meeschuift (`DetailGallery`).
- **Controleren van scrollanimaties:** het ingebouwde browserpaneel toont na scrollen vaak alleen zwart. `reference/snap.mjs` maakt screenshots op vaste scrollposities met een eigen headless Chrome; gebruik dat.

## 10e. Positionering, prijsindicatie en fixes (29 september 2026)

- **Positionering.** De studio-sectie zegt nu waar het om gaat: bureaukwaliteit zonder het bureau. Belangrijk: de reden dat het goedkoper is wordt genoemd (geen accountmanagers, geen pand, AI doet het werk dat zich herhaalt) in plaats van alleen de lagere prijs. Zie de toelichting hieronder bij "prijs noemen".
- **AI-agent als belofte.** De demo-sectie heet nu "Je site blijft van jou. Ook na oplevering." en legt uit dat bij elke site een assistent hoort waarmee de klant zelf wijzigingen doet: geen ingewikkeld beheersysteem, geen tussenpersoon, geen factuur voor een openingstijd.
- **Prijsindicatie in het formulier.** Op stap 8 staat een kaart met een bedrag van-tot, opgebouwd uit de antwoorden. De logica staat in `src/lib/estimate.ts`, de bedragen staan daar in twee tabellen bovenaan en zijn het enige wat Noah moet nalopen. De getallen tellen op bij het verschijnen. Het is expliciet een richting, geen offerte, en er staat bij dat er bijna altijd een kleinere eerste stap is.
- **Prijs noemen, waarom zo.** "Hetzelfde als een bureau maar goedkoper" nodigt uit tot vergelijken op prijs en maakt het werk de goedkope variant. De reden noemen maakt van de prijs een gevolg van hoe de studio werkt, niet een korting. Daarom staat er geen enkel percentage of "vanaf"-bedrag in de lopende tekst: het concrete getal komt pas na het formulier, als het ergens op gebaseerd is.
- **Fixes.** Telefoonmockups: elk scherm wordt nu gemaskeerd op zijn eigen vorm in plaats van op zijn rechthoek (anders liep het ene scherm over het andere heen), en een scherm dat half achter een ander staat wordt eerst volledig teruggerekend zodat de pagina er niet in geperst wordt. Bel-pop: twee drempels in plaats van een (anders flikkert hij tijdens het uitrollen van de scroll), het beeld blijft heel tot de scherven al uit elkaar staan (anders zag je naden), en de scherven wachten nu ook op het laden van hun eigen afbeelding. Logo in de nav: de link was een tekstregel en dus hoger dan zijn inhoud, nu een flexbox met `leading-none`, gemeten op de pixel.

## 10f. Prijzen (30 september 2026)

Onderzoek gedaan op de Nederlandse markt (bronnen onderaan deze sectie), en de uitkomst staat nu op de site.

**Wat de markt vraagt** (alles exclusief btw; vooral blogs van bureaus, dus een bandbreedte en geen waarheid):
- Zakelijke website: freelancer 800 tot 3.000 (een goede 2.500 tot 5.000), klein bureau 3.000 tot 12.000. Boutique-studio's op Framer of Webflow: 3.000 tot 8.000 voor een kleine merksite met animatie, 5.000 tot 15.000 middenklasse.
- Uurtarief: freelancer 60 tot 120, senior developer 90 tot 120, klein bureau 85 tot 140, groot bureau 120 tot 200+.
- Webshop: 8.000 tot 18.000 (MKB via bureau), 18.000 tot 45.000+ maatwerk.
- Huisstijl: freelancer 500 tot 3.000, klein bureau 2.000 tot 5.000, groter 5.000 tot 15.000+.
- Onderhoud per maand: mediaan 45. Sjabloon-abonnementen "alles erbij" 45 tot 99. Beheerde AI-chatbot bij Nederlandse aanbieders 800 tot 2.000 per maand.
- Niet gevonden: wat Nederlandse MKB'ers gemiddeld aan een site besteden, en wat de echte toptudio's vragen (die zetten het niet online).

**De redenering achter de bedragen**
1. Prijs volgt positie. Een premium tarief moet verdedigbaar zijn tegenover mensen die jou nooit ontmoeten, en dat vraagt vergelijkbaar bewijs. Met een echte klant en twee concepten is het plafond de bovenkant van de kleine-studio-band, niet een bureautarief.
2. De vergelijking is de boutique-studio op Framer of Webflow, niet het grote marketingbureau. Dat maakt "bureaukwaliteit voor een studioprijs" verdedigbaar.
3. Ronde bedragen: bij maatwerk lezen 99-eindes als korting.
4. Drie pakketten met een aanbevolen middelste en een duurste ernaast als anker.
5. De maandprijs is de echte vloer. Onder 99 concurreer je met sjablonen en onderschat je de assistent, boven ongeveer 250 heeft een kleine ondernemer een verhaal nodig.

**Wat er nu staat**
- Websites: Start 3.500, Studio 6.500 (aanbevolen), Signature vanaf 11.500.
- Maandelijks, met hosting, updates en de assistent: Basis 99, Groei 199 (aanbevolen), Volledig 399.
- Overig: huisstijl 2.500 tot 6.000, webshop vanaf 9.000, AI-assistent in een bestaande site vanaf 3.500, koppelingen vanaf 2.000, motion vanaf 1.200, AI-content vanaf 900.
- De prijskaart in het formulier (`src/lib/estimate.ts`) is gekalibreerd op deze pakketten: een site die precies bij Studio past komt op 6.500 aan de onderkant uit, Signature begint op 11.400. Een tegenspraak tussen de sectie en het formulier is het eerste wat een kritische klant opmerkt, dus houd die twee samen. Testscript-scenario's staan in de git-geschiedenis van deze commit.

**Nog te bevestigen door Noah**
- Uren van Live Wedding Paintings: prijs gedeeld door uren moet minstens 90 tot 120 per uur zijn (senior freelancer) of hoger. Klopt dat niet, dan moeten de pakketten omhoog.
- De maandplannen gaan uit van een beperkt aantal uren en een beperkt AI-verbruik per klant. Meet het echte verbruik na de eerste klanten en pas zo nodig aan.
- Van Westendorp-onderzoek (vier vragen aan 15 tot 20 mensen uit de doelgroep) om te toetsen of het bereik klopt. Werkt pas echt bij 50 tot 100 antwoorden.

**Bronnen**: SearchLab, ZA Creatives, Appfront (websites); Codeloods, Knab, ZZP Centrum (uurtarieven); Opklopper, DigiSwift (webshops); SearchLab, Aanloop AI, OpenKlauw (AI); SearchLab, DesignDash (huisstijl); Zazou Totaal, Webtify, Sorora Studio, DigiDan (onderhoud en abonnementen); Branded Agency, Amply (boutique-studio's); Inkbot Design, Shopify Partners, Simon-Kucher (positionering en prijspsychologie); Quantilope, Conjointly (Van Westendorp).

## 10g. Herstart: één klant, "ik"-stem, FAQ en privacy (1 oktober 2026)

- **Stem**: de hele site is nu "ik" (Noah), met portret in de Over-mij-sectie (`public/images/noah.webp`). De "wij"/"maker zelf"-tegenstrijdigheid is weg. "Wij/onze" komt alleen nog voor als vraag aan de klant.
- **Werk**: alleen Live Wedding Paintings (echt). Halm en Routewerk (AI-mockups, niet bezoekbaar) zijn verwijderd, inclusief afbeeldingen. De detailpagina valt terug op diensten als gerelateerde kaarten. Kopregel: "Er komen binnenkort meer projecten bij."
- **Hero**: "Een website van bureauniveau." + concrete "ik"-tekst. Tweede knop gaat naar de prijzen.
- **Diensten**: per klantprobleem in plaats van jargon.
- **Filter op te goedkope klanten**: zichtbare prijzen vanaf 3.500, FAQ-antwoord "ben ik niet de juiste keuze" onder dat bedrag, manifest-regel over ondernemers die willen investeren.
- **FAQ** (`faq` in nl/en.ts, onder Prijzen, `#vragen`, met FAQPage JSON-LD) en **privacyverklaring** (`/[lang]/privacy`, in footer, formulier-laatste stap en sitemap).
- **Door Noah te bevestigen** (ik heb dit zelf ingevuld): doorlooptijd 4-6 weken (Start) en 6-10 (Studio); code en hosting zijn van de klant; betaling deels bij start, rest bij oplevering (verdeling in de offerte); "beperkt aantal opdrachten tegelijk"; bewaartermijn 12 maanden voor aanvragen zonder opdracht en 7 jaar administratie; Resend en Vercel als verwerkers (verwerkersovereenkomsten nakijken); cookie `sharply-lang` en sessionStorage-vlag voor het laadscherm.
- **Nog nodig van Noah**: echte quote van Sara, echte LWP-resultaten, Resend-key in Vercel, en de 2-3 eigen conceptsites (zie het gesprek: interieurstudio, specialty coffee/wijn-webshop, dienstverlener met afspraken en AI-assistent). Voeg ze toe als `work.items` met `concept: true` zodra ze live zijn.

## 11. Open punten

- De bedragen op de site en in `src/lib/estimate.ts` zijn een onderbouwd voorstel (zie 10f), nog niet getoetst bij echte prospects. Noah controleert ze aan de hand van zijn uren.
- Kleur- en stijlrichting is afgeleid van het Pinterest-bord (donker/kobalt). Als het te veel op "elke AI-site" gaat lijken, is een lichtere hoofdrichting een terugvaloptie.
- Resend en DNS moeten Noah nog inrichten (Mijndomein). Zonder `RESEND_API_KEY` geeft het formulier netjes een foutmelding met een mailadres als terugval.
- Nog niet gedaan: een deelafbeelding voor social media (og:image), en het btw-nummer in de footer.
- De sitemap gebruikt `NEXT_PUBLIC_SITE_URL` als die bestaat, anders het vercel.app-adres. Zet die variabele zodra sharply.nl gekoppeld is.
