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
        "De meeste sites zijn een folder. Wij bouwen het ding waar mensen iets doen: lezen, aanvragen, inloggen, bestellen, beheren. Hoe ver dat gaat bepaal jij, maar de basis is altijd hetzelfde: snel, eigen, en gebouwd om jaren mee te gaan.",
      sections: [
        {
          title: "Geen thema, geen bouwer",
          body: "Wij werken niet met templates of paginabouwers. Alles wat je ziet is voor jou ontworpen en in code gezet. Dat kost aan het begin meer denkwerk en levert daarna een site op die niemand anders heeft, die niet vastloopt op de grenzen van een thema, en die je over drie jaar nog kunt uitbreiden.",
        },
        {
          title: "Snel, omdat traag geld kost",
          body: "Beelden worden automatisch verkleind naar wat een telefoon nodig heeft, pagina's worden vooraf klaargezet in plaats van per bezoeker berekend, en er draait geen enkel script mee dat niets doet. Dat is niet alleen prettig voor bezoekers: Google meet het en rekent het mee.",
        },
        {
          title: "Zelf beheren, zonder bang te zijn",
          body: "Je krijgt een plek waar je teksten en beelden aanpast zonder dat je iets kunt breken. Wat vast moet staan, staat vast. En als je liever gewoon zegt wat je wilt, kan dat ook: zie de demo op de homepage.",
        },
        {
          title: "Inlog, database, dashboard",
          body: "Zodra er accounts, gegevens of rollen bij komen kijken wordt het een webapp. Wij bouwen die op dezelfde fundering: dezelfde snelheid, hetzelfde ontwerp, met een database eronder en een beheerscherm waar jij en je team mee werken.",
        },
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
        "Niet een chatbot die vier vragen kent en daarna doorverwijst naar een formulier. Een assistent die jouw informatie kent, antwoord geeft in jouw toon, en dingen kan doen: een afspraak inplannen, een offerte starten, iets opzoeken in je systeem.",
      sections: [
        {
          title: "Getraind op wat jij weet",
          body: "Wij voeren hem met jouw documenten, prijzen, voorwaarden en veelgestelde vragen. Hij antwoordt daaruit, en zegt eerlijk dat hij het niet weet in plaats van iets te verzinnen. Dat laatste is waar de meeste chatbots de mist in gaan.",
        },
        {
          title: "Hij kan meer dan praten",
          body: "Een assistent die alleen tekst uitspuugt is een zoekbalk met manieren. Wij koppelen hem aan je agenda, je mail, je voorraad of je CRM, zodat hij een afspraak echt inplant en een aanvraag echt aanmaakt.",
        },
        {
          title: "Jij ziet wat er gebeurt",
          body: "Je krijgt een overzicht van de gesprekken: wat mensen vragen, waar hij vastliep, welke antwoorden ontbreken. Dat is meteen de beste klantenonderzoekslijst die je kunt hebben, want het zijn letterlijk de vragen van je klanten.",
        },
        {
          title: "Binnen de lijnen",
          body: "Je bepaalt waar hij over praat en waar niet, wat hij mag doen en wat langs een mens moet. Gevoelige gegevens houden we uit het gesprek, en we leggen vast wat er met de rest gebeurt.",
        },
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
        "Een webshop uit een standaardpakket ziet eruit als elke andere webshop uit dat pakket. Wij ontwerpen de winkel om jouw producten heen, en zorgen dat betalen, voorraad en verzending precies werken zoals je gewend bent.",
      sections: [
        {
          title: "Producten als objecten",
          body: "Hoe een product op het scherm staat bepaalt hoe het voelt. Wij besteden tijd aan beeld, detailpagina's en de weg ernaartoe, want dat is waar het verschil zit tussen een catalogus en een winkel waar je iets uit wilt hebben.",
        },
        {
          title: "Afrekenen zonder gedoe",
          body: "iDEAL, creditcard, Apple Pay en Bancontact. Zo min mogelijk stappen, geen verplicht account, duidelijke verzendkosten voor het laatste scherm. Elke extra klik kost bestellingen.",
        },
        {
          title: "Voorraad en verzending gekoppeld",
          body: "We koppelen aan je boekhouding, je voorraadsysteem of je verzendpartij, zodat je niet twee plekken bijhoudt. Bestelling binnen, label eruit, voorraad bij.",
        },
        {
          title: "Groeien zonder verbouwen",
          body: "Nieuwe productgroepen, een tweede taal, een B2B-prijslijst: dat zit al in de fundering. Je hoeft niet opnieuw te beginnen zodra het loopt.",
        },
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
        "De meeste tijdverspilling in een bedrijf zit tussen twee programma's in: iets overtypen, een bestand doorsturen, een lijstje bijhouden dat ergens anders al bestaat. Dat is precies het werk dat een computer beter doet dan jij.",
      sections: [
        {
          title: "Eerst kijken waar het vastloopt",
          body: "We beginnen niet bij de techniek maar bij je week. Wat doe je elke maandag opnieuw? Waar gaat het mis als iemand ziek is? Dat wijst bijna altijd de eerste drie koppelingen aan.",
        },
        {
          title: "Eén keer goed, daarna stil",
          body: "Een goede koppeling merk je niet. De factuur staat in de boekhouding, de afspraak in de agenda, de klant in je CRM, zonder dat iemand iets heeft overgetypt. Wat wij bouwen draait door als jij er niet bent.",
        },
        {
          title: "Rapportage die klopt",
          body: "Als de gegevens uit één bron komen, kloppen de cijfers ook. Je krijgt een overzicht dat je echt kunt gebruiken om te beslissen, in plaats van drie exports die elkaar tegenspreken.",
        },
        {
          title: "Als het misgaat, weet je het",
          body: "Automatisering zonder toezicht is een tijdbom. Wij bouwen er meldingen omheen: mislukt er iets, dan krijg je bericht, en zien we in het logboek precies wat er gebeurde.",
        },
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
        "Een logo is het kleinste deel van een merk. Het gaat om de hele set: kleur, typografie, beeld, beweging en toon, en om richtlijnen die duidelijk genoeg zijn dat je team ze zonder ons kan gebruiken.",
      sections: [
        {
          title: "Eerst het verhaal, dan de vorm",
          body: "Wij beginnen met wat je doet, voor wie, en waarom iemand voor jou zou kiezen. Zonder dat wordt een huisstijl een smaakgesprek, en smaakgesprekken duren eeuwig en leveren niets op.",
        },
        {
          title: "Gemaakt om te gebruiken",
          body: "Een merk moet werken op een gevelbord, in een mailhandtekening, op een verpakking en in een verhaal van negen seconden. Wij ontwerpen de set daarop, niet op hoe het staat op één mooie presentatieplaat.",
        },
        {
          title: "Beweging hoort erbij",
          body: "Hoe je logo verschijnt, hoe een knop reageert, hoe een titel binnenkomt: dat is net zo goed merk als je kleur. Wij leveren die beweging mee, als bestanden en als richtlijn.",
        },
        {
          title: "Richtlijnen die iemand leest",
          body: "Geen boekwerk van zestig pagina's dat in een map verdwijnt. Een set die kort genoeg is om te gebruiken en duidelijk genoeg om niet over te hoeven discussiëren.",
        },
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
        "Met de juiste aanpak maak je beeld dat voorheen een fotoshoot, een studio en een week wachten kostte. Dat is geen knop indrukken: het is prompts, selectie, bijwerken en smaak. Het gegenereerde deel is het snelste deel, niet het moeilijkste.",
      sections: [
        {
          title: "Consistent met je merk",
          body: "Losse mooie plaatjes heb je niets aan. Wij werken met vaste opzetten, referenties en kleurbewerking, zodat twintig beelden op elkaar lijken en op jouw merk, en niet op twintig verschillende experimenten.",
        },
        {
          title: "Met de hand bijgewerkt",
          body: "Handen, tekst, logo's en details gaan mis, altijd. Daar gaat onze tijd in zitten: bijwerken, samenstellen, opnieuw genereren tot het klopt. Wat je krijgt is af, niet bijna af.",
        },
        {
          title: "Campagnesets, geen losse stukken",
          body: "Je krijgt de hele reeks in de formaten die je nodig hebt: liggend, staand, vierkant, met en zonder ruimte voor tekst. Klaar om te plaatsen zonder dat iemand nog iets moet bijsnijden.",
        },
        {
          title: "Eerlijk over wat het is",
          body: "Wij vertellen je waar generatie de betere keuze is en waar een echte foto of een echte opname het wint. Voor mensen, producten in de hand en alles wat vertrouwen moet wekken, is echt vaak beter.",
        },
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
    noordlicht: {
      slug: "noordlicht-keramiek",
      tagline: "Een merksite voor een keramiekstudio, waar het atelier net zo zichtbaar is als de collectie.",
      intro:
        "Bij handgemaakt werk koop je de maker net zo hard als het object. Dit concept is gebouwd rond dat idee: verhalen uit het atelier staan naast de collectie in plaats van weggestopt in een blog die niemand vindt.",
      sections: [
        {
          title: "Het idee",
          body: "Een kleine keramiekstudio die in series werkt, met stukken die per stooksel verschillen. Een gewone webshoplayout zou dat platslaan tot voorraad. Wij gaven de collectie de rust van een tentoonstelling, met ruimte voor het proces ertussen.",
        },
        {
          title: "Wat we ontwierpen",
          body: "Een lichte, stille opzet met veel wit, grote beelden en een typografie die niet om aandacht vraagt. De collectie is een raster dat ademt, elk stuk heeft een eigen pagina met het verhaal van de serie, en het atelier komt terug als een doorlopende laag door de site.",
        },
        {
          title: "Hoe het gebouwd zou worden",
          body: "Als een merksite met een lichte webshop eronder: zelf series toevoegen, beelden slepen, verhalen schrijven zonder een ontwerper nodig te hebben. Betaling via iDEAL, verzending gekoppeld, en beeld dat op een telefoon net zo goed laadt als op een scherm in de studio.",
        },
      ],
      scope: [
        "Merkrichting, kleur en typografie",
        "Ontwerp voor homepage, collectie en productpagina",
        "Verhalen uit het atelier als vaste laag",
        "Lichte webshop met iDEAL",
        "Zelf series en beelden beheren",
      ],
      note: "Dit is een conceptproject dat wij zelf maakten om onze werkwijze te laten zien. Noordlicht Keramiek is een bedacht merk, geen klant, en er zijn geen resultaten aan verbonden.",
    },

    halm: {
      slug: "halm",
      tagline: "Een donkere webshop voor huidverzorging, gebouwd om producten als objecten te tonen.",
      intro:
        "Huidverzorging wordt bijna altijd licht, zacht en pastel gepresenteerd. Dit concept doet het omgekeerde: een donkere winkel waarin de flessen als objecten in het licht staan, zoals je een horloge of een parfum zou tonen.",
      sections: [
        {
          title: "Het idee",
          body: "Een merk dat weinig producten heeft en daar veel over te vertellen heeft. Dan is een winkel vol kaartjes en sterren het verkeerde gereedschap. De vraag was: hoe laat je vier producten belangrijk voelen zonder te schreeuwen?",
        },
        {
          title: "Wat we ontwierpen",
          body: "Een donkere achtergrond die het product laat oplichten, ingrediënten als een leesbare laag onder de fles in plaats van een lijst in kleine letters, en een routine-opbouw waarin je ziet welk product wanneer aan de beurt is. Beweging is traag en zwaar gehouden, passend bij de prijs van het merk.",
        },
        {
          title: "Hoe het gebouwd zou worden",
          body: "Als een volwaardige webshop: voorraad, varianten, kortingscodes en een afrekenproces van zo min mogelijk stappen. Abonnementen zijn meegenomen in de opzet, omdat verzorging zich daarvoor leent.",
        },
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
        "Dit concept laat zien wat wij bedoelen met een AI-systeem: niet een chatvenster dat erbij geplakt is, maar software waarin de slimme delen op de plek zitten waar iemand anders handmatig zou zitten klikken.",
      sections: [
        {
          title: "Het idee",
          body: "Een vervoerder met een paar honderd zendingen per week, waar de planning in de hoofden van twee mensen zit. Dat werkt tot er iemand op vakantie is. De vraag was hoe je die kennis in een systeem legt zonder die mensen buitenspel te zetten.",
        },
        {
          title: "Wat we ontwierpen",
          body: "Een overzicht waarin je in één blik ziet wat loopt, wat vastzit en wat aandacht nodig heeft. Vertragingen worden gesignaleerd voordat de klant belt. Werk wordt voorgesteld en verdeeld, maar een mens keurt het goed. En er zit een assistent in die vragen over de data beantwoordt, zodat niemand een rapport hoeft te bouwen om iets simpels te weten.",
        },
        {
          title: "Hoe het gebouwd zou worden",
          body: "Als webapp met inlog en rollen, een database eronder en koppelingen naar de systemen die er al zijn. De automatisering draait op de achtergrond met meldingen als er iets misgaat, want een planning die stilletjes faalt is erger dan geen planning.",
        },
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
