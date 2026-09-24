# Assets log (Higgsfield, gpt_image_2_5, quality high, 2k, 3 credits per beeld)

Budget: maximaal 100 credits. Verbruikt: 33 (11 beelden). Rest: 67.

Bestanden staan als webp in `public/images/`. De originele PNG's (4 tot 6 MB per stuk) staan bewust niet in git.
Alle beelden zijn zonder tekst gegenereerd. Typografie komt altijd uit code.

| Bestand | Ratio | Variant | Doel | Prompt (samengevat) |
|---|---|---|---|---|
| hero-orb.webp | 16:9 | flare | Hero-poster desktop, fallback en referentie voor de 3D-scène | Grote glazen iridescente orb rechts, cobalt horizon-boog onder, lege ruimte links |
| hero-orb-portrait.webp | 9:16 | sunburst | Hero-poster mobiel | Zelfde orb, onder-midden, ruimte boven voor kop |
| service-websites.webp | 4:3 | flare | Dienst: websites en webapps | Gelaagde matglazen panelen, cobalt randlicht |
| service-ai-chat.webp | 4:3 | flare | Dienst: AI-chat en agents | Glazen bol in matglazen kaart, lichtlint als golfvorm |
| service-webshop.webp | 4:3 | sunburst | Dienst: webshops | Doorschijnende glazen kubussen als pakketten, een gloeit |
| service-integrations.webp | 4:3 | sunburst | Dienst: koppelingen en automatisering | Glazen bollen verbonden met lichtdraden |
| service-branding-motion.webp | 4:3 | sunburst | Dienst: branding en motion | Gedraaid lint van vloeibaar glas en chroom met motion blur |
| service-ai-content.webp | 4:3 | sunburst | Dienst: AI-content | Prisma dat licht breekt in zwevende glazen frames |
| handcraft-ai.webp | 4:3 | flare | Handcraft x AI-sectie | Glazen bol op handgescheurd papier en collage |
| bg-iridescent.webp | 16:9 | sunburst | Sectieachtergrond | Zijdeachtige iridescente vloeistofgolven, donkere randen |
| bg-horizon.webp | 21:9 | sunburst | Sectieachtergrond | Cobalt horizon-boog onderaan, verder leeg |
| logo-mark.webp (+ .png, src/app/icon.png) | 1:1 | sunburst | Logo | Monogram S uit twee scherpe glazen bladen, cobalt, iridescente facetranden, op zwart |

## Logo

Twee concepten gegenereerd (6 credits), Noah koos A (de kristallen S). De tweede (lint van vloeibaar glas) staat in `reference/logo/logo-b.png`.

De uitsnede is met de hand gemaakt, niet met remove_background: de render staat op zwart en glas is licht op donker, dus de helderheid van een pixel is zijn dekking. Terugrekenen (kleur delen door helderheid) geeft een additieve uitsnede die op elk donker vlak klopt en de gloed aan de randen houdt. Het script staat in de git-geschiedenis bij deze commit. De ruwe PNG's staan bewust niet in git.

## Nog te maken (optioneel)
- Deelafbeelding voor social media (kan met Next `opengraph-image` op basis van hero-orb plus tekst in code).
- Varianten of nieuwe versies na feedback op de eerste vier.
