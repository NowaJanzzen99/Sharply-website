import type { Details } from "./types";

/*
  De detailpagina's, Nederlands.

  Toon: dezelfde "wij" als de rest van de site, korte zinnen, geen vaktaal waar
  gewone taal het ook doet. Geen beloftes over resultaat, geen cijfers, geen
  klantnamen: die zijn er nog niet, en verzonnen bewijs is erger dan geen bewijs.
  Wat hier staat gaat over wat wij maken en hoe, niet over wat het oplevert.

  Alles hieronder is invulbaar door Noah zodra het aanbod definitief is.
*/
export const detailsNl: Details = {
  copy: {
    visit: "Bekijk de site",
    gallery: "Van dichtbij",
    made: "Wat we maakten",
    backToServices: "Alle diensten",
    backToWork: "Al het werk",
    deliverables: "Wat je krijgt",
    questions: "Vragen die we vaker horen",
    scope: "Wat het concept omvat",
    otherServices: "Andere diensten",
    otherWork: "Ander werk",
    readMore: "Lees verder",
    ctaTitle: "Zin om te beginnen?",
    ctaBody:
      "Vertel in het formulier wat je wilt bouwen. Hoe meer je invult, hoe scherper ons eerste antwoord.",
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
        "Geen folder, maar het ding waar mensen iets doen. Snel, van jou, en gebouwd om jaren mee te gaan.",
      sections: [
        { title: "Geen thema, geen bouwer", body: "Alles is voor jou ontworpen en in code gezet, dus je loopt nooit tegen de grens van een sjabloon aan." },
        { title: "Snel, omdat traag geld kost", body: "Beelden op maat, pagina's vooraf klaargezet, geen script dat niets doet. Google rekent het mee." },
        { title: "Zelf beheren, zonder angst", body: "Teksten en beelden pas je zelf aan, en wat vast moet staan kun je niet breken." },
        { title: "Inlog, database, dashboard", body: "Komen er accounts of gegevens bij, dan wordt het een webapp op dezelfde fundering." },
      ],
      deliverables: [
        "Ontwerp op maat, eerst in beeld, daarna in code",
        "Volledig responsive, van telefoon tot breed scherm",
        "Zelf teksten en beelden beheren",
        "Optioneel inlog, database en dashboard",
        "Hosting ingericht, domein gekoppeld, SSL geregeld",
        "Overdracht waarin we laten zien hoe alles werkt",
      ],
      questions: [
        {
          question: "Hoe lang duurt het?",
          answer:
            "Een stevige merksite is meestal een kwestie van weken, een platform met inlog en database langer. Na het eerste gesprek geven we een planning die klopt in plaats van een die mooi klinkt.",
        },
        {
          question: "Kan ik mijn huidige site behouden?",
          answer:
            "Teksten, beelden en je domein nemen we mee. De techniek eronder vervangen we, want daar zit meestal precies het probleem dat je wilt oplossen.",
        },
        {
          question: "Wat als ik later iets wil toevoegen?",
          answer:
            "Dat is het punt van zelf bouwen. Een extra sectie, een nieuwe taal, een webshop erbij: het kan er allemaal op, zonder dat de site opnieuw moet.",
        },
      ],
    },

    aiChat: {
      slug: "ai-chat-en-agents",
      tagline: "Een assistent in je eigen site die je klanten echt verder helpt.",
      intro:
        "Geen chatbot die vier vragen kent. Een assistent die jouw informatie kent en dingen kan doen.",
      sections: [
        { title: "Getraind op wat jij weet", body: "Hij antwoordt uit jouw documenten en prijzen, en zegt eerlijk wanneer hij iets niet weet." },
        { title: "Hij kan meer dan praten", body: "Gekoppeld aan agenda, mail of CRM plant hij echt afspraken in en maakt hij echt aanvragen aan." },
        { title: "Jij ziet wat er gebeurt", body: "Alle gesprekken op een rij: wat mensen vragen, en welke antwoorden nog ontbreken." },
        { title: "Binnen de lijnen", body: "Jij bepaalt waar hij over praat, en wat eerst langs een mens moet." },
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
          question: "Gaat hij dingen verzinnen?",
          answer:
            "Daar zit het meeste werk. Hij antwoordt uit jouw bronnen en zegt het als iets er niet in staat. Voor het live gaat testen we hem op de vragen waarvan je niet wilt dat hij ernaast zit.",
        },
        {
          question: "Wat kost het per maand?",
          answer:
            "Er zitten gebruikskosten aan, afhankelijk van hoeveel gesprekken je hebt. We rekenen dat vooraf door met jouw verwachte aantallen, zodat er geen verrassing komt.",
        },
        {
          question: "Kan hij Nederlands en Engels?",
          answer:
            "Ja, en hij schakelt mee met de taal van de bezoeker.",
        },
      ],
    },

    webshop: {
      slug: "webshops",
      tagline: "Verkopen met een winkel die aanvoelt als een merk.",
      intro:
        "Een winkel ontworpen om jouw producten heen. Betalen, voorraad en verzending werken zoals je gewend bent.",
      sections: [
        { title: "Producten als objecten", body: "Beeld en productpagina's krijgen de aandacht die het verschil maakt tussen catalogus en winkel." },
        { title: "Afrekenen zonder gedoe", body: "iDEAL, creditcard en Apple Pay, zo min mogelijk stappen en geen verplicht account." },
        { title: "Voorraad en verzending gekoppeld", body: "Bestelling binnen, label eruit, voorraad bij. Niets dubbel bijhouden." },
        { title: "Groeien zonder verbouwen", body: "Een tweede taal of een zakelijke prijslijst zit al in de fundering." },
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
            "Ja. Producten, klanten en bestellingen nemen we mee. We zetten de nieuwe winkel klaar naast de oude en zetten hem pas om als alles klopt.",
        },
        {
          question: "Hoeveel producten kan hij aan?",
          answer:
            "Van tien handgemaakte stuks tot duizenden varianten. Bij grote aantallen richten we zoeken en filteren anders in, dat bespreken we vooraf.",
        },
        {
          question: "Wie regelt de betaalaansluiting?",
          answer:
            "Wij zetten het technisch klaar. Het contract met de betaalpartij staat op jouw naam, want het is jouw geld dat erdoorheen gaat.",
        },
      ],
    },

    integrations: {
      slug: "koppelingen-en-automatisering",
      tagline: "Je systemen aan elkaar, zodat het werk vanzelf doorloopt.",
      intro:
        "De meeste tijd lekt weg tussen twee programma's. Dat werk doet een computer beter dan jij.",
      sections: [
        { title: "Eerst kijken waar het vastloopt", body: "We beginnen bij je week, niet bij de techniek. Dat wijst de eerste koppelingen aan." },
        { title: "Eén keer goed, daarna stil", body: "Factuur in de boekhouding, afspraak in de agenda, zonder dat iemand iets overtypt." },
        { title: "Rapportage die klopt", body: "Alles uit één bron, dus cijfers waar je op kunt beslissen." },
        { title: "Als het misgaat, weet je het", body: "Mislukt er iets, dan krijg je bericht en zie je precies wat er gebeurde." },
      ],
      deliverables: [
        "Overzicht van je huidige werkstroom en waar die hapert",
        "Koppelingen tussen de systemen die je al gebruikt",
        "Automatisering van het werk dat zich herhaalt",
        "Meldingen als er iets misgaat",
        "Rapportage uit één bron",
        "Documentatie, zodat het niet van ons afhangt",
      ],
      questions: [
        {
          question: "Werkt dit met het pakket dat wij al gebruiken?",
          answer:
            "Bijna altijd. Wij koppelen aan alles met een open verbinding, en dat hebben de meeste pakketten. Bij twijfel zoeken we het vooraf uit, niet achteraf.",
        },
        {
          question: "Moeten we van pakket wisselen?",
          answer:
            "Liever niet. Overstappen kost je team meer dan het oplost. We werken met wat er staat, tenzij iets echt niet te koppelen is.",
        },
        {
          question: "Wat als ons proces later verandert?",
          answer:
            "Dan passen we het aan. Daarom leggen we vast hoe het in elkaar zit, zodat een wijziging een middag is en geen nieuw project.",
        },
      ],
    },

    branding: {
      slug: "branding-en-motion",
      tagline: "Een merk dat op elk kanaal hetzelfde klinkt.",
      intro:
        "Een logo is het kleinste deel van een merk. Wij maken de hele set, met richtlijnen die je team zelf gebruikt.",
      sections: [
        { title: "Eerst het verhaal, dan de vorm", body: "Wat je doet en voor wie komt eerst, anders wordt een huisstijl een smaakgesprek." },
        { title: "Gemaakt om te gebruiken", body: "Van gevelbord tot mailhandtekening tot een verhaal van negen seconden." },
        { title: "Beweging hoort erbij", body: "Hoe je logo verschijnt en een knop reageert is net zo goed merk als je kleur." },
        { title: "Richtlijnen die iemand leest", body: "Kort genoeg om te gebruiken, duidelijk genoeg om niet over te discussiëren." },
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
            "Niet per se. Soms is het logo prima en klopt de rest niet. We zeggen eerlijk wat we zouden houden.",
        },
        {
          question: "Krijgen we de bronbestanden?",
          answer:
            "Altijd, en zonder discussie. Het is jouw merk. Je moet er bij een andere ontwerper mee verder kunnen.",
        },
        {
          question: "Kunnen we het in delen doen?",
          answer:
            "Ja. Veel bedrijven beginnen met logo en kleur en breiden later uit met motion en sjablonen.",
        },
      ],
    },

    aiContent: {
      slug: "ai-content",
      tagline: "Beeld, video en animatie voor campagnes en socials.",
      intro:
        "Beeld dat vroeger een fotoshoot en een week wachten kostte. Het genereren is het snelle deel, niet het moeilijke.",
      sections: [
        { title: "Consistent met je merk", body: "Vaste opzetten en kleurbewerking, zodat twintig beelden op elkaar en op jou lijken." },
        { title: "Met de hand bijgewerkt", body: "Handen, tekst en details gaan altijd mis. Daar zit onze tijd in." },
        { title: "Campagnesets, geen losse stukken", body: "Elk formaat dat je nodig hebt, klaar om te plaatsen." },
        { title: "Eerlijk over wat het is", body: "We zeggen het als een echte foto de betere keuze is." },
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
            "Wij werken met tools waarvan de voorwaarden commercieel gebruik toestaan, en leggen per set vast wat je ermee mag. Bij twijfel kiezen we de veilige route.",
        },
        {
          question: "Ziet iemand dat het gegenereerd is?",
          answer:
            "Bij slecht werk meteen. Daarom zit het meeste van onze tijd in de nabewerking. En waar het merk eerlijkheid vraagt, zeggen we erbij dat het gemaakt is.",
        },
        {
          question: "Kunnen jullie onze eigen producten gebruiken?",
          answer:
            "Ja. We kunnen jouw eigen foto's als basis nemen, zodat het product klopt en de omgeving eromheen gemaakt wordt.",
        },
      ],
    },
  },

  work: {
    liveweddingpaintings: {
      slug: "live-wedding-paintings",
      tagline: "Een site die voelt als een galerie, en die bruiloften boekt.",
      intro:
        "Sara van Heukelom schildert live op bruiloften. Wij maakten haar site, van het eerste ontwerp tot hij live stond.",
      url: "https://liveweddingpaintings.nl",
      facts: [
        { label: "Klant", value: "Sara van Heukelom" },
        { label: "Wat we deden", value: "Alles, van ontwerp tot livegang" },
        { label: "Talen", value: "Nederlands en Engels" },
      ],
      sections: [
        { title: "Het schilderij als held", body: "Haar werk hangt in gouden lijsten die bewegen als je scrolt. Het product is het beeld, dus het beeld gaat voorop." },
        { title: "Kies je formaat", body: "Drie formaten om doorheen te bladeren, met de prijs erbij. Geen PDF, geen mailtje heen en weer." },
        { title: "Boeken in acht stappen", body: "Een formulier dat vraagt wat Sara moet weten, ook als het een cadeau voor het bruidspaar is." },
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

    halm: {
      slug: "halm",
      tagline: "Een donkere webshop voor huidverzorging, gebouwd om producten als objecten te tonen.",
      intro:
        "Huidverzorging wordt bijna altijd licht en pastel getoond. Dit concept doet het omgekeerde.",
      sections: [
        { title: "Het idee", body: "Vier producten die belangrijk moeten voelen, zonder te schreeuwen." },
        { title: "Wat we ontwierpen", body: "Een donkere winkel waarin de flessen oplichten, met ingrediënten als leesbare laag." },
        { title: "Hoe het gebouwd zou worden", body: "Een volwaardige webshop, met ruimte voor herhaalbestellingen." },
      ],
      scope: [
        "Winkelontwerp, donker, om het product heen",
        "Productpagina met ingrediënten en routine",
        "Afrekenen in zo min mogelijk stappen",
        "Opzet voor herhaalbestellingen",
        "Voorraad en verzending gekoppeld",
      ],
      note: "Dit is een conceptproject dat wij zelf maakten om onze werkwijze te laten zien. Halm is een bedacht merk, geen klant, en er zijn geen resultaten aan verbonden.",
    },

    routewerk: {
      slug: "routewerk",
      tagline: "Een dashboard dat zendingen volgt, vertragingen signaleert en werk vanzelf verdeelt.",
      intro:
        "Wat wij bedoelen met een AI-systeem: de slimme delen zitten waar nu iemand handmatig klikt.",
      sections: [
        { title: "Het idee", body: "Een planning die in twee hoofden zit, en vastloopt zodra er één op vakantie is." },
        { title: "Wat we ontwierpen", body: "Eén overzicht dat vertraging ziet voordat de klant belt, en werk voorstelt dat een mens goedkeurt." },
        { title: "Hoe het gebouwd zou worden", body: "Een webapp met rollen en koppelingen, en meldingen als er iets misgaat." },
      ],
      scope: [
        "Dashboard met live overzicht",
        "Signalering van vertraging en uitzonderingen",
        "Voorgestelde werkverdeling, goedgekeurd door een mens",
        "Assistent die vragen over de data beantwoordt",
        "Inlog, rollen en koppelingen naar bestaande systemen",
      ],
      note: "Dit is een conceptproject dat wij zelf maakten om onze werkwijze te laten zien. Routewerk is een bedacht merk, geen klant, en er zijn geen resultaten aan verbonden.",
    },
  },
};
