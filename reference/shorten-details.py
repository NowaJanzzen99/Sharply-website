"""
One-off edit of src/content/details-*.ts: every intro down to two sentences,
every chapter down to one line, and the Noordlicht concept replaced by the real
Live Wedding Paintings case. Kept in reference/ so the change can be read back.
"""

import json
import re

SHORT = {
    "nl": {
        "websites": (
            "Geen folder, maar het ding waar mensen iets doen. Snel, van jou, en gebouwd om jaren mee te gaan.",
            [
                ("Geen thema, geen bouwer", "Alles is voor jou ontworpen en in code gezet, dus je loopt nooit tegen de grens van een sjabloon aan."),
                ("Snel, omdat traag geld kost", "Beelden op maat, pagina's vooraf klaargezet, geen script dat niets doet. Google rekent het mee."),
                ("Zelf beheren, zonder angst", "Teksten en beelden pas je zelf aan, en wat vast moet staan kun je niet breken."),
                ("Inlog, database, dashboard", "Komen er accounts of gegevens bij, dan wordt het een webapp op dezelfde fundering."),
            ],
        ),
        "aiChat": (
            "Geen chatbot die vier vragen kent. Een assistent die jouw informatie kent en dingen kan doen.",
            [
                ("Getraind op wat jij weet", "Hij antwoordt uit jouw documenten en prijzen, en zegt eerlijk wanneer hij iets niet weet."),
                ("Hij kan meer dan praten", "Gekoppeld aan agenda, mail of CRM plant hij echt afspraken in en maakt hij echt aanvragen aan."),
                ("Jij ziet wat er gebeurt", "Alle gesprekken op een rij: wat mensen vragen, en welke antwoorden nog ontbreken."),
                ("Binnen de lijnen", "Jij bepaalt waar hij over praat, en wat eerst langs een mens moet."),
            ],
        ),
        "webshop": (
            "Een winkel ontworpen om jouw producten heen. Betalen, voorraad en verzending werken zoals je gewend bent.",
            [
                ("Producten als objecten", "Beeld en productpagina's krijgen de aandacht die het verschil maakt tussen catalogus en winkel."),
                ("Afrekenen zonder gedoe", "iDEAL, creditcard en Apple Pay, zo min mogelijk stappen en geen verplicht account."),
                ("Voorraad en verzending gekoppeld", "Bestelling binnen, label eruit, voorraad bij. Niets dubbel bijhouden."),
                ("Groeien zonder verbouwen", "Een tweede taal of een zakelijke prijslijst zit al in de fundering."),
            ],
        ),
        "integrations": (
            "De meeste tijd lekt weg tussen twee programma's. Dat werk doet een computer beter dan jij.",
            [
                ("Eerst kijken waar het vastloopt", "We beginnen bij je week, niet bij de techniek. Dat wijst de eerste koppelingen aan."),
                ("Eén keer goed, daarna stil", "Factuur in de boekhouding, afspraak in de agenda, zonder dat iemand iets overtypt."),
                ("Rapportage die klopt", "Alles uit één bron, dus cijfers waar je op kunt beslissen."),
                ("Als het misgaat, weet je het", "Mislukt er iets, dan krijg je bericht en zie je precies wat er gebeurde."),
            ],
        ),
        "branding": (
            "Een logo is het kleinste deel van een merk. Wij maken de hele set, met richtlijnen die je team zelf gebruikt.",
            [
                ("Eerst het verhaal, dan de vorm", "Wat je doet en voor wie komt eerst, anders wordt een huisstijl een smaakgesprek."),
                ("Gemaakt om te gebruiken", "Van gevelbord tot mailhandtekening tot een verhaal van negen seconden."),
                ("Beweging hoort erbij", "Hoe je logo verschijnt en een knop reageert is net zo goed merk als je kleur."),
                ("Richtlijnen die iemand leest", "Kort genoeg om te gebruiken, duidelijk genoeg om niet over te discussiëren."),
            ],
        ),
        "aiContent": (
            "Beeld dat vroeger een fotoshoot en een week wachten kostte. Het genereren is het snelle deel, niet het moeilijke.",
            [
                ("Consistent met je merk", "Vaste opzetten en kleurbewerking, zodat twintig beelden op elkaar en op jou lijken."),
                ("Met de hand bijgewerkt", "Handen, tekst en details gaan altijd mis. Daar zit onze tijd in."),
                ("Campagnesets, geen losse stukken", "Elk formaat dat je nodig hebt, klaar om te plaatsen."),
                ("Eerlijk over wat het is", "We zeggen het als een echte foto de betere keuze is."),
            ],
        ),
        "halm": (
            "Huidverzorging wordt bijna altijd licht en pastel getoond. Dit concept doet het omgekeerde.",
            [
                ("Het idee", "Vier producten die belangrijk moeten voelen, zonder te schreeuwen."),
                ("Wat we ontwierpen", "Een donkere winkel waarin de flessen oplichten, met ingrediënten als leesbare laag."),
                ("Hoe het gebouwd zou worden", "Een volwaardige webshop, met ruimte voor herhaalbestellingen."),
            ],
        ),
        "routewerk": (
            "Wat wij bedoelen met een AI-systeem: de slimme delen zitten waar nu iemand handmatig klikt.",
            [
                ("Het idee", "Een planning die in twee hoofden zit, en vastloopt zodra er één op vakantie is."),
                ("Wat we ontwierpen", "Eén overzicht dat vertraging ziet voordat de klant belt, en werk voorstelt dat een mens goedkeurt."),
                ("Hoe het gebouwd zou worden", "Een webapp met rollen en koppelingen, en meldingen als er iets misgaat."),
            ],
        ),
    },
    "en": {
        "websites": (
            "Not a brochure, but the thing people actually do something in. Fast, yours alone, and built to last for years.",
            [
                ("No theme, no page builder", "Everything is designed for you and written in code, so you never hit the ceiling of a template."),
                ("Fast, because slow costs money", "Images cut to size, pages prepared in advance, no script that does nothing. Google counts it."),
                ("Manage it without fear", "You change text and images yourself, and what has to stay fixed cannot break."),
                ("Login, database, dashboard", "Once accounts or records come in, it becomes a webapp on the same foundation."),
            ],
        ),
        "aiChat": (
            "Not a chatbot that knows four questions. An assistant that knows your information and can do things.",
            [
                ("Trained on what you know", "It answers from your documents and prices, and says honestly when it does not know."),
                ("It does more than talk", "Connected to calendar, mail or CRM, it books the appointment and creates the request for real."),
                ("You see what happens", "Every conversation in one place: what people ask, and which answers are still missing."),
                ("Inside the lines", "You decide what it talks about, and what has to pass a person first."),
            ],
        ),
        "webshop": (
            "A store designed around your products. Payment, stock and shipping work the way you already work.",
            [
                ("Products as objects", "Imagery and product pages get the attention that separates a catalogue from a shop."),
                ("Checkout without friction", "iDEAL, credit card and Apple Pay, as few steps as possible and no forced account."),
                ("Stock and shipping connected", "Order in, label out, stock updated. Nothing kept twice."),
                ("Room to grow", "A second language or a trade price list is already in the foundation."),
            ],
        ),
        "integrations": (
            "Most time leaks away between two programs. A computer does that work better than you.",
            [
                ("First find where it jams", "We start with your week, not with technology. That points at the first connections."),
                ("Set up once, then silent", "Invoice in the books, appointment in the calendar, without anyone retyping a thing."),
                ("Reporting that adds up", "Everything from one source, so numbers you can decide on."),
                ("When it fails, you hear about it", "If something fails you get a message, and you see exactly what happened."),
            ],
        ),
        "branding": (
            "A logo is the smallest part of a brand. We make the whole set, with guidelines your team uses on its own.",
            [
                ("The story first, the shape after", "What you do and for whom comes first, or a brand becomes a debate about taste."),
                ("Made to be used", "From a shop sign to an email signature to a nine second story."),
                ("Motion is part of it", "How your logo arrives and a button answers is as much brand as your colour."),
                ("Guidelines somebody reads", "Short enough to use, clear enough that nobody argues about it."),
            ],
        ),
        "aiContent": (
            "Imagery that used to take a shoot and a week of waiting. Generating is the fast part, not the hard part.",
            [
                ("Consistent with your brand", "Fixed setups and colour treatment, so twenty images look like each other and like you."),
                ("Finished by hand", "Hands, text and details always go wrong. That is where our time goes."),
                ("Campaign sets, not loose pieces", "Every format you need, ready to place."),
                ("Honest about what it is", "We say so when a real photograph is the better choice."),
            ],
        ),
        "halm": (
            "Skincare is almost always shown light and pastel. This concept does the opposite.",
            [
                ("The idea", "Four products that have to feel important, without shouting."),
                ("What we designed", "A dark store where the bottles glow, with ingredients as a readable layer."),
                ("How it would be built", "A full shop, with room for repeat orders."),
            ],
        ),
        "routewerk": (
            "What we mean by an AI system: the clever parts sit where somebody now clicks by hand.",
            [
                ("The idea", "A schedule that lives in two heads, and stalls the moment one of them is on holiday."),
                ("What we designed", "One overview that sees a delay before the customer calls, and proposes work a person approves."),
                ("How it would be built", "A webapp with roles and connections, and alerts when something fails."),
            ],
        ),
    },
}

LWP = {
    "nl": '''    liveweddingpaintings: {
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
''',
    "en": '''    liveweddingpaintings: {
      slug: "live-wedding-paintings",
      tagline: "A site that feels like a gallery, and books weddings.",
      intro:
        "Sara van Heukelom paints weddings live. We made her site, from the first design to the day it went live.",
      url: "https://liveweddingpaintings.nl",
      facts: [
        { label: "Client", value: "Sara van Heukelom" },
        { label: "What we did", value: "Everything, from design to launch" },
        { label: "Languages", value: "Dutch and English" },
      ],
      sections: [
        { title: "The painting leads", body: "Her work hangs in gold frames that move as you scroll. The product is the picture, so the picture goes first." },
        { title: "Pick a format", body: "Three sizes to browse through, with the price beside each. No PDF, no emails back and forth." },
        { title: "Booking in eight steps", body: "A form that asks what Sara needs to know, including when it is a gift for the couple." },
      ],
      scope: [
        "Design and look",
        "Website in Dutch and English",
        "Eight step booking form",
        "Format picker with prices",
        "Reviews and frequently asked questions",
        "Hosting, launch and upkeep",
      ],
      page: { src: "/images/lwp-page.webp", alt: "The full homepage of liveweddingpaintings.nl, top to bottom", width: 1200, height: 8835 },
      gallery: [
        { src: "/images/lwp-phones.webp", alt: "Two phones showing the booking form and the format picker of Live Wedding Paintings", width: 1800, height: 1344 },
        { src: "/images/lwp-formaten.webp", alt: "The format picker: three paintings in gold frames with size and price", width: 1440, height: 900 },
        { src: "/images/lwp-over.webp", alt: "The section about Sara, with a photo of her painting at a wedding", width: 1440, height: 900 },
        { src: "/images/lwp-reviews.webp", alt: "Reviews from couples beside one of the paintings", width: 1440, height: 900 },
      ],
    },
''',
}

COPY = {
    "nl": ('    backToServices: "Alle diensten",', '    visit: "Bekijk de site",\n    gallery: "Van dichtbij",\n    backToServices: "Alle diensten",'),
    "en": ('    backToServices: "All services",', '    visit: "Visit the site",\n    gallery: "Up close",\n    backToServices: "All services",'),
}


def ts(text):
    return json.dumps(text, ensure_ascii=False)


for lang in ("nl", "en"):
    path = f"src/content/details-{lang}.ts"
    s = open(path).read()
    old, new = COPY[lang]
    assert s.count(old) == 1
    s = s.replace(old, new)

    for key, (intro, sections) in SHORT[lang].items():
        start = s.index(f"\n    {key}: {{")
        end = s.index("\n    },", start)
        block = s[start:end]
        block = re.sub(r'intro:\s*\n?\s*"(?:[^"\\]|\\.)*",', f"intro:\n        {ts(intro)},", block, count=1)
        body = ",\n".join(
            f"        {{ title: {ts(t)}, body: {ts(b)} }}" for t, b in sections
        )
        block = re.sub(r"sections: \[.*?\n      \],", f"sections: [\n{body},\n      ],", block, count=1, flags=re.S)
        s = s[:start] + block + s[end:]

    # Swap the Noordlicht concept for the real case.
    start = s.index("\n    noordlicht: {")
    end = s.index("\n    },", start) + len("\n    },") + 1
    s = s[:start] + "\n" + LWP[lang] + s[end:]
    open(path, "w").write(s)
    print(lang, "ok")
