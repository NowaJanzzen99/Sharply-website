import type { Details } from "./types";

/*
  De detailpagina's, Nederlands.

  Toon: dezelfde "ik" als de rest van de site, korte zinnen, geen vaktaal waar
  gewone taal het ook doet. Geen beloftes over resultaat, geen cijfers, geen
  klantnamen: die zijn er nog niet, en verzonnen bewijs is erger dan geen bewijs.
  Wat hier staat gaat over wat ik maak en hoe, niet over wat het oplevert.

  Alles hieronder is invulbaar door Noah zodra het aanbod definitief is.
*/
export const detailsNl: Details = {
  copy: {
    moreServices: "Wat ik nog meer maak",
    visit: "Bekijk de site",
    gallery: "Van dichtbij",
    made: "Wat ik maakte",
    backToServices: "Alle diensten",
    backToWork: "Al het werk",
    deliverables: "Wat je krijgt",
    questions: "Veelgestelde vragen",
    scope: "Wat het concept omvat",
    otherServices: "Andere diensten",
    otherWork: "Ander werk",
    readMore: "Lees verder",
    ctaTitle: "Klaar voor de eerste stap?",
    ctaBody:
      "Vertel in het formulier wat je voor ogen hebt. Ik reageer persoonlijk, binnen twee werkdagen.",
    ctaButton: "Start een project",
    notFound: {
      title: "Deze pagina bestaat niet",
      body: "De link klopt niet meer, of de pagina is verplaatst.",
      home: "Terug naar de homepage",
    },
  },

  services: {
    websites: {
      slug: "websites-en-webapps",
      tagline: "Van een site die indruk maakt tot een platform waar je bedrijf op draait.",
      intro:
        "Meer dan een folder: de plek waar bezoekers klant worden. Snel, helemaal van jou en gebouwd voor de lange termijn.",
      sections: [
        { title: "Op maat, in elk detail", body: "Alles is voor jou ontworpen en in code gezet, dus geen sjabloon bepaalt wat mogelijk is." },
        { title: "Snel, want snelheid verkoopt", body: "Beelden op maat, pagina's vooraf klaargezet en niets overbodigs in de code. Bezoekers blijven langer en Google beloont het." },
        { title: "Zelf beheren, zonder zorgen", body: "Teksten en beelden pas je zelf aan, terwijl het ontwerp onbreekbaar blijft." },
        { title: "Inlog, database, dashboard", body: "Komen er accounts of gegevens bij, dan groeit je site op dezelfde fundering door tot webapp." },
      ],
      deliverables: [
        "Ontwerp op maat, eerst in beeld, daarna in code",
        "Volledig responsive, van telefoon tot breed scherm",
        "Zelf teksten en beelden beheren",
        "Optioneel inlog, database en dashboard",
        "Hosting ingericht, domein gekoppeld, SSL geregeld",
        "Overdracht waarin ik laat zien hoe alles werkt",
      ],
      questions: [
        {
          question: "Hoe lang duurt het?",
          answer:
            "Een merksite is doorgaans een kwestie van weken, een platform met inlog en database iets langer. Na de kennismaking ontvang je een planning met vaste momenten.",
        },
        {
          question: "Kan ik mijn huidige site behouden?",
          answer:
            "Teksten, beelden en je domein neem ik mee. De techniek eronder bouw ik opnieuw, zodat je een solide basis krijgt.",
        },
        {
          question: "Wat als ik later iets wil toevoegen?",
          answer:
            "Daarom bouw ik op maat. Een extra sectie, een nieuwe taal of een webshop past erbij, zonder dat de site opnieuw hoeft.",
        },
      ],
    },

    aiChat: {
      slug: "ai-chat-en-agents",
      tagline: "Een assistent in je eigen site die je klanten echt verder helpt.",
      intro:
        "Meer dan een chatvenster: een assistent die jouw bedrijf kent en dingen voor je klanten regelt.",
      sections: [
        { title: "Getraind op jouw kennis", body: "Hij antwoordt vanuit jouw documenten en prijzen, en laat het weten wanneer hij iets niet zeker weet." },
        { title: "Hij doet meer dan praten", body: "Gekoppeld aan agenda, mail of CRM plant hij afspraken in en maakt hij aanvragen aan." },
        { title: "Jij houdt overzicht", body: "Alle gesprekken op een rij: wat mensen vragen en waar je antwoorden nog kunt aanscherpen." },
        { title: "Binnen jouw grenzen", body: "Jij bepaalt waar hij over praat en wat eerst langs een mens gaat." },
      ],
      deliverables: [
        "Assistent in je eigen site, in jouw huisstijl",
        "Gevoed met jouw content, prijzen en voorwaarden",
        "Koppelingen naar agenda, mail of je eigen systemen",
        "Overzicht van gesprekken en onbeantwoorde vragen",
        "Grenzen en doorschakeling naar een mens",
        "Uitleg hoe je zelf antwoorden bijwerkt",
      ],
      questions: [
        {
          question: "Verzint hij dingen?",
          answer:
            "Dat verdient de meeste aandacht. Hij antwoordt uit jouw bronnen en meldt het wanneer iets er niet in staat. Voor livegang test ik hem op de vragen waar het niet mis mag gaan.",
        },
        {
          question: "Wat kost het per maand?",
          answer:
            "Er zijn gebruikskosten, afhankelijk van het aantal gesprekken. Ik reken ze vooraf voor je door op basis van jouw verwachte aantallen.",
        },
        {
          question: "Spreekt hij Nederlands en Engels?",
          answer:
            "Ja, en hij schakelt mee met de taal van de bezoeker.",
        },
      ],
    },

    webshop: {
      slug: "webshops",
      tagline: "Verkopen met een winkel die aanvoelt als je merk.",
      intro:
        "Een winkel ontworpen rond jouw producten. Betalen, voorraad en verzending werken zoals je gewend bent.",
      sections: [
        { title: "Producten in de hoofdrol", body: "Beeld en productpagina's krijgen de aandacht die van een catalogus een winkel maakt." },
        { title: "Afrekenen in een handomdraai", body: "iDEAL, creditcard en Apple Pay, in zo min mogelijk stappen en zonder verplicht account." },
        { title: "Voorraad en verzending verbonden", body: "Bestelling binnen, label klaar, voorraad bijgewerkt. Je houdt niets dubbel bij." },
        { title: "Groeien zonder verbouwen", body: "Een tweede taal of een zakelijke prijslijst past al op de fundering." },
      ],
      deliverables: [
        "Winkel op maat, ontworpen om jouw producten heen",
        "iDEAL, creditcard, Apple Pay en Bancontact",
        "Voorraad, verzending en boekhouding gekoppeld",
        "Zelf producten, prijzen en acties beheren",
        "Kortingscodes en acties",
        "Klaar voor een tweede taal of markt",
      ],
      questions: [
        {
          question: "Kan ik overstappen vanaf Shopify of WooCommerce?",
          answer:
            "Ja. Producten, klanten en bestellingen neem ik mee. De nieuwe winkel staat klaar naast de oude en gaat pas live als alles klopt.",
        },
        {
          question: "Hoeveel producten kan hij aan?",
          answer:
            "Van tien handgemaakte stuks tot duizenden varianten. Bij grote aantallen richt ik zoeken en filteren daarop in, dat bespreken we vooraf.",
        },
        {
          question: "Wie regelt de betaalaansluiting?",
          answer:
            "Ik zet de technische aansluiting klaar. Het contract met de betaalpartij komt op jouw naam, omdat het jouw omzet is die erdoorheen gaat.",
        },
      ],
    },

    integrations: {
      slug: "koppelingen-en-automatisering",
      tagline: "Je systemen op één lijn, zodat het werk vanzelf doorloopt.",
      intro:
        "De meeste tijd lekt weg tussen twee programma's. Die overdracht kan een computer sneller en foutlozer.",
      sections: [
        { title: "Eerst in kaart brengen", body: "Ik begin bij je werkweek, niet bij de techniek. Zo vinden we de koppelingen met het meeste effect." },
        { title: "Eén keer goed, daarna op de achtergrond", body: "Een factuur belandt in de boekhouding, een afspraak in de agenda, zonder dat iemand iets overtypt." },
        { title: "Rapportage om op te sturen", body: "Alles uit één bron, dus cijfers waarop je beslissingen kunt baseren." },
        { title: "Altijd in beeld", body: "Mislukt er iets, dan krijg je een melding en zie je precies wat er gebeurde." },
      ],
      deliverables: [
        "Overzicht van je huidige werkstroom en waar die hapert",
        "Koppelingen tussen de systemen die je al gebruikt",
        "Automatisering van het werk dat zich herhaalt",
        "Meldingen als er iets misgaat",
        "Rapportage uit één bron",
        "Documentatie, zodat het niet van mij afhangt",
      ],
      questions: [
        {
          question: "Werkt dit met het pakket dat wij al gebruiken?",
          answer:
            "Vrijwel altijd. Ik koppel aan alles met een open verbinding, en dat hebben de meeste pakketten. Bij twijfel zoek ik het vooraf voor je uit.",
        },
        {
          question: "Moeten we van pakket wisselen?",
          answer:
            "Meestal niet. Ik werk met wat je al hebt, zodat je team niet hoeft te verhuizen.",
        },
        {
          question: "Wat als ons proces later verandert?",
          answer:
            "Dan pas ik de koppelingen aan. Ik leg alles vast, zodat een wijziging een kwestie van een middag is en geen nieuw project.",
        },
      ],
    },

    branding: {
      slug: "branding-en-motion",
      tagline: "Een merk dat op elk kanaal dezelfde taal spreekt.",
      intro:
        "Een logo is slechts het begin. Ik maak de volledige set, met richtlijnen waar je team direct mee aan de slag kan.",
      sections: [
        { title: "Eerst het verhaal, dan de vorm", body: "Wat je doet en voor wie komt eerst, zodat je huisstijl een antwoord is en geen smaakkwestie." },
        { title: "Gemaakt om te gebruiken", body: "Van gevelbord tot mailhandtekening tot een verhaal van negen seconden." },
        { title: "Beweging hoort erbij", body: "Hoe je logo verschijnt en een knop reageert is net zo goed merk als je kleur." },
        { title: "Richtlijnen die gelezen worden", body: "Compact genoeg om te gebruiken, helder genoeg om elke discussie te voorkomen." },
      ],
      deliverables: [
        "Logo en beeldmerk, in alle benodigde bestanden",
        "Kleur, typografie en beeldrichting",
        "Bewegende versie van het merk",
        "Richtlijnen die je team zelf kan gebruiken",
        "Sjablonen voor je meest gebruikte uitingen",
        "Alle bronbestanden, zonder voorbehoud",
      ],
      questions: [
        {
          question: "Moet mijn huidige logo weg?",
          answer:
            "Niet per se. Soms werkt het logo en zit de winst in de rest. Ik adviseer je wat je kunt behouden.",
        },
        {
          question: "Krijgen we de bronbestanden?",
          answer:
            "Altijd. Het is jouw merk, en je kunt er met elke ontwerper mee verder.",
        },
        {
          question: "Kunnen we het in delen doen?",
          answer:
            "Zeker. Veel bedrijven starten met logo en kleur en breiden later uit met motion en sjablonen.",
        },
      ],
    },

    aiContent: {
      slug: "ai-content",
      tagline: "Beeld, video en animatie voor campagnes en socials.",
      intro:
        "Beeld waarvoor je vroeger een fotoshoot en een week wachttijd nodig had. Het genereren is het snelle deel, de afwerking maakt het verschil.",
      sections: [
        { title: "Consistent met je merk", body: "Vaste opzetten en kleurbewerking, zodat twintig beelden op elkaar en op jou lijken." },
        { title: "Met de hand afgewerkt", body: "Handen, tekst en details vragen aandacht. Daar besteed ik mijn tijd aan." },
        { title: "Campagnesets, geen losse beelden", body: "Elk formaat dat je nodig hebt, klaar om te plaatsen." },
        { title: "Open over de methode", body: "Is een echte foto de betere keuze, dan zeg ik dat." },
      ],
      deliverables: [
        "Beeldreeks in jouw merkstijl",
        "Alle formaten voor web en socials",
        "Video en animatie waar dat past",
        "Bijgewerkte, afgewerkte bestanden",
        "De prompts en opzetten, zodat je zelf verder kunt",
        "Overzicht van wat waar gebruikt mag worden",
      ],
      questions: [
        {
          question: "Mag ik dit commercieel gebruiken?",
          answer:
            "Ik werk met tools waarvan de voorwaarden commercieel gebruik toestaan en leg per set vast wat je ermee mag.",
        },
        {
          question: "Ziet iemand dat het gegenereerd is?",
          answer:
            "Bij haastwerk wel. Daarom gaat het grootste deel van mijn tijd naar de nabewerking. Vraagt je merk om transparantie, dan vermeld ik de herkomst.",
        },
        {
          question: "Kun je onze eigen producten gebruiken?",
          answer:
            "Zeker. Ik gebruik jouw foto's als basis, zodat het product klopt en de omgeving eromheen wordt gemaakt.",
        },
      ],
    },
  },

  work: {
    renofloww: {
      slug: "renofloww",
      tagline: "Een verbouwing met tientallen losse eindjes, teruggebracht tot één overzicht.",
      intro:
        "Een complete webapp: echte accounts, een eigen database waarin elk project wordt opgeslagen, en een assistent die die gegevens leest. Budget, planning, offertes, aannemers en foto's van een verbouwing, per ruimte bij elkaar.",
      url: "https://renofloww.vercel.app/",
      urlLabel: "renofloww.nl",
      facts: [
        { label: "Soort", value: "Webapp met accounts en abonnement" },
        { label: "Wat ik deed", value: "Van ontwerp tot livegang" },
        { label: "Achter de schermen", value: "Eigen database in de EU, Next.js en AI" },
      ],
      sections: [
        { title: "De week waar je in zit", body: "Het startscherm toont de lopende week: welke klus draait, wat er al af is en hoeveel van het budget er op is." },
        { title: "Vier dingen, één app", body: "Budget per ruimte, planning per ruimte, offertes naast elkaar en taken met een datum. Precies wat je elke week nodig hebt." },
        { title: "Een assistent die het project kent", body: "De assistent leest mee met budget, taken, offertes en aannemers, en antwoordt met de bedragen uit het eigen project." },
        { title: "Accounts, opslag en abonnement", body: "Gebruikers maken een account, en alles wat ze invoeren staat versleuteld in een eigen database in de EU. Abonnement, proefperiode en een gratis laag zitten in dezelfde app." },
      ],
      scope: [
        "Ontwerp en huisstijl",
        "Website die het product uitlegt",
        "Accounts met inloggen, per gebruiker afgeschermd",
        "Database waarin elk project en elke uitgave wordt opgeslagen",
        "Budget, planning, offertes en taken per ruimte",
        "Assistent die de projectgegevens leest",
        "Abonnement, proefperiode en gratis laag",
        "Werkt op de telefoon, te installeren als app",
      ],
      page: { src: "/images/reno-page.webp", alt: "De volledige homepage van Renofloww, van boven naar beneden", width: 1200, height: 6914 },
      gallery: [
        { src: "/images/reno-phones.webp", alt: "Twee telefoons met Renofloww: de assistent in gesprek en het overzicht van kosten, offertes en planning", width: 1800, height: 1344 },
        { src: "/images/reno-functies.webp", alt: "De functiekaarten van Renofloww: het budget met nog te besteden bedrag en de planning per ruimte", width: 1440, height: 900 },
        { src: "/images/reno-ai.webp", alt: "De assistent van Renofloww beantwoordt vragen over uitgaven en offertes van het eigen project", width: 1440, height: 900 },
        { src: "/images/reno-prijzen.webp", alt: "De prijzenpagina van Renofloww met het Pro-abonnement naast de gratis versie", width: 1440, height: 900 },
      ],
    },

    daalwerk: {
      slug: "daalwerk",
      tagline: "Een huis dat je scrollend ziet veranderen, van schil tot plattegrond.",
      intro:
        "Een studiosite voor interieur en architectuur in Limburg, met een maquette die meebeweegt met je scroll en een assistent die een eerste richting voor materiaal en kleur geeft. Naam, logo en inhoud zijn van mij.",
      url: "https://daalwerk.vercel.app/nl",
      facts: [
        { label: "Soort", value: "Eigen project, fictieve studio" },
        { label: "Wat ik deed", value: "Merk, ontwerp en bouw" },
        { label: "Talen", value: "Nederlands en Engels" },
      ],
      sections: [
        { title: "Een huis dat je ziet veranderen", body: "De site opent met een maquette van een carréboerderij. Scroll, en het dak gaat eraf, de kamers worden zichtbaar en het huis wordt ingericht." },
        { title: "Kamer voor kamer", body: "Entree, woonkamer, keuken: elke kamer krijgt een eigen moment met de materialen erbij, van hardsteen en eiken tot linnen en groen gebeitst hout." },
        { title: "Van plattegrond tot resultaat", body: "Het meubilair staat op schaal in de plattegrond. Daarna schuift het beeld door naar dezelfde woonkamer, een jaar later, in echt licht." },
        { title: "Beschrijf je ruimte", body: "Een bezoeker kiest een ruimte, een soort huis, het licht en het gevoel, en krijgt een eerste richting voor kleur en materiaal. Daarna volgt een aanvraag voor een gesprek." },
      ],
      scope: [
        "Naam, logo en huisstijl",
        "Scrollende maquette als opening van de site",
        "Projectpagina's, diensten en materiaalbibliotheek",
        "Assistent voor een eerste richting in materiaal en kleur",
        "Aanvraag voor een eerste gesprek",
        "Nederlands en Engels",
      ],
      page: { src: "/images/daal-page.webp", alt: "De opening van Daalwerk: een maquette die stap voor stap wordt ingericht, gevolgd door het resultaat, de materialen en de assistent", width: 1200, height: 7425 },
      gallery: [
        { src: "/images/daal-woonkamer.webp", alt: "De woonkamer in de maquette van Daalwerk, met bank, ronde tafel en groene kast", width: 1440, height: 900 },
        { src: "/images/daal-zowerdhet.webp", alt: "Dezelfde woonkamer als foto, een jaar later: leemstuc, linnen en eiken in het middaglicht", width: 1440, height: 900 },
        { src: "/images/daal-materialen.webp", alt: "De materiaalbibliotheek van Daalwerk: mergel, hardsteen, leemstuc, kalkverf en eiken", width: 1440, height: 900 },
        { src: "/images/daal-assistent.webp", alt: "De assistent van Daalwerk geeft een richting voor een woonkamer in een boerderij: leemstuc en gerookt eiken", width: 1440, height: 900 },
      ],
    },

    flowdezk: {
      slug: "flowdezk",
      tagline: "Eén vertaalproject, van offerte tot factuur, dat je volgt terwijl je scrolt.",
      intro:
        "Een nieuwe site voor FlowDezk, software waarmee vertaalbureaus hun projecten van offerte tot factuur beheren. De oorspronkelijke site maakte ik eerder; deze heb ik van de grond af opnieuw ontworpen en gebouwd.",
      url: "https://flowdezk.vercel.app/",
      facts: [
        { label: "Soort", value: "Herontwerp van een productsite" },
        { label: "Wat ik deed", value: "Ontwerp, bouw en formulier" },
        { label: "Talen", value: "Engels en Nederlands" },
      ],
      sections: [
        { title: "Een kop in elke taal", body: "De kop vertaalt zich voor je ogen, van Engels naar Duits, Arabisch, Japans en verder. Wie op de site komt, weet in een seconde voor welke branche dit is." },
        { title: "Eén project, zes stappen", body: "Een echt voorbeeldproject reist mee terwijl je scrolt: dashboard, offerte, vertalers inplannen, levering, vendorportaal en rapportage. De schermen zijn in code gebouwd, niet als plaatje." },
        { title: "Een prijs die je zelf uitrekent", body: "Schuif met gebruikers en opslag en de maandprijs rekent mee op de echte tarieven. Zo is de prijs uit te leggen aan de boekhouder." },
        { title: "Een aanvraag op maat", body: "Het formulier vraagt wat een vertaalbureau bezighoudt: volume, talenparen, het systeem dat ze nu gebruiken en waar het knelt. Aan het eind staat een samenvatting en een prijsindicatie." },
      ],
      scope: [
        "Nieuw ontwerp en beeldtaal",
        "Kop die zich vertaalt in meerdere schriften",
        "Gepinde scrollreis door zes productschermen, in code gebouwd",
        "Integratiepagina voor Phrase, Trados en XTM",
        "Prijscalculator op de echte tarieven",
        "Aanvraagformulier in vijf stappen met prijsindicatie",
        "Engels en Nederlands",
      ],
      page: { src: "/images/flow-page-en.webp", alt: "De homepage van FlowDezk van boven naar beneden: de kop, het dashboard, de offerte, de planning, de levering, het vendorportaal, de rapportage, de prijs en het formulier", width: 1200, height: 8250 },
      gallery: [
        { src: "/images/flow-dashboard.webp", alt: "Het projectdashboard van FlowDezk met statusbalken per project", width: 1440, height: 900 },
        { src: "/images/flow-resourcing.webp", alt: "Vertalers per taal ingepland op een weekrooster", width: 1440, height: 900 },
        { src: "/images/flow-vendor.webp", alt: "Het vendorportaal: een vertaler met beschikbaarheid en een tariefvoorstel", width: 1440, height: 900 },
        { src: "/images/flow-reporting.webp", alt: "Rapportage met omzet per maand en marge per klantsector", width: 1440, height: 900 },
      ],
    },

    liveweddingpaintings: {
      slug: "live-wedding-paintings",
      tagline: "Een site die voelt als een galerie, en die bruiloften boekt.",
      intro:
        "Sara van Heukelom schildert live op bruiloften. Ik maakte haar website, van eerste ontwerp tot livegang.",
      url: "https://liveweddingpaintings.nl",
      facts: [
        { label: "Klant", value: "Sara van Heukelom" },
        { label: "Wat ik deed", value: "Alles, van ontwerp tot livegang" },
        { label: "Talen", value: "Nederlands en Engels" },
      ],
      sections: [
        { title: "Het schilderij in de hoofdrol", body: "Haar werk hangt in gouden lijsten die meebewegen met je scroll. Het beeld is het product, dus het beeld staat voorop." },
        { title: "Kies je formaat", body: "Drie formaten om doorheen te bladeren, met de prijs erbij. Zonder pdf en zonder heen-en-weer mailen." },
        { title: "Boeken in acht stappen", body: "Een formulier dat vraagt wat Sara moet weten, ook als het een verrassing voor het bruidspaar is." },
      ],
      scope: [
        "Ontwerp en uitstraling",
        "Website in het Nederlands en Engels",
        "Boekingsformulier in acht stappen",
        "Formatenkiezer met prijzen",
        "Reviews en veelgestelde vragen",
        "Hosting, livegang en beheer",
      ],
      page: { src: "/images/lwp-page.webp", alt: "De volledige homepage van liveweddingpaintings.nl, van boven naar beneden", width: 1200, height: 8835 },
      gallery: [
        { src: "/images/lwp-phones.webp", alt: "Twee telefoons met het boekingsformulier en de formatenkiezer van Live Wedding Paintings", width: 1800, height: 1344 },
        { src: "/images/lwp-formaten.webp", alt: "De formatenkiezer: drie schilderijen in gouden lijsten met formaat en prijs", width: 1440, height: 900 },
        { src: "/images/lwp-over.webp", alt: "De sectie over Sara, met een foto van haar aan het werk op een bruiloft", width: 1440, height: 900 },
        { src: "/images/lwp-reviews.webp", alt: "Reviews van bruidsparen naast een van de schilderijen", width: 1440, height: 900 },
      ],
    },


  },
};
