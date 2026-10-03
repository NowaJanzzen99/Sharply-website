import type { Details } from "./types";

/*
  The detail pages, English. A translation of details-nl.ts in substance, not
  word for word: the Dutch is the original, and a few lines read better in
  English when they are rebuilt rather than carried across.

  Same rules as the Dutch file: no promised results, no numbers, no client
  names. Everything here is about what I make and how, because that is all
  that is true today.
*/
export const detailsEn: Details = {
  copy: {
    moreServices: "What else I make",
    visit: "Visit the site",
    gallery: "Up close",
    made: "What I made",
    backToServices: "All services",
    backToWork: "All work",
    deliverables: "What you get",
    questions: "Frequently asked questions",
    scope: "What the concept covers",
    otherServices: "Other services",
    otherWork: "Other work",
    readMore: "Read on",
    ctaTitle: "Ready for the first step?",
    ctaBody:
      "Tell me in the form what you have in mind. I reply personally, within two working days.",
    ctaButton: "Start a project",
    notFound: {
      title: "This page does not exist",
      body: "The link is out of date, or the page has moved.",
      home: "Back to the homepage",
    },
  },

  services: {
    websites: {
      slug: "websites-and-webapps",
      tagline: "From a site that makes an impression to the platform your business runs on.",
      intro:
        "More than a brochure: the place where visitors become customers. Fast, entirely yours, and built for the long term.",
      sections: [
        { title: "Bespoke, down to the detail", body: "Everything is designed for you and written in code, so no template decides what is possible." },
        { title: "Fast, because speed sells", body: "Images cut to size, pages prepared in advance and nothing superfluous in the code. Visitors stay longer and Google rewards it." },
        { title: "Manage it with confidence", body: "You change text and images yourself, while the design stays unbreakable." },
        { title: "Login, database, dashboard", body: "Once accounts or records come in, your site grows into a web app on the same foundation." },
      ],
      deliverables: [
        "Design made for you, first on screen, then in code",
        "Fully responsive, from phone to wide display",
        "Manage your own text and images",
        "Optional login, database and dashboard",
        "Hosting set up, domain connected, SSL handled",
        "A handover where I show you how it all works",
      ],
      questions: [
        {
          question: "How long does it take?",
          answer:
            "A brand site is typically a matter of weeks, a platform with login and database a little longer. After the introduction you receive a schedule with fixed milestones.",
        },
        {
          question: "Can I keep my current site?",
          answer:
            "I carry over your text, images and domain. The technology underneath I rebuild, so you get a solid foundation.",
        },
        {
          question: "What if I want to add something later?",
          answer:
            "That is why I build to measure. An extra section, a new language or a shop fits right in, without starting over.",
        },
      ],
    },

    aiChat: {
      slug: "ai-chat-and-agents",
      tagline: "An assistant inside your own site that genuinely helps your customers.",
      intro:
        "More than a chat window: an assistant that knows your business and gets things done for your customers.",
      sections: [
        { title: "Trained on what you know", body: "It answers from your documents and prices, and tells you when it is not sure." },
        { title: "It does more than talk", body: "Connected to calendar, mail or CRM, it books appointments and creates requests." },
        { title: "You stay in control", body: "Every conversation in one place: what people ask and where your answers can be sharper." },
        { title: "Within your boundaries", body: "You decide what it talks about and what passes a person first." },
      ],
      deliverables: [
        "An assistant in your own site, in your own styling",
        "Fed with your content, prices and terms",
        "Connections to calendar, mail or your own systems",
        "Overview of conversations and unanswered questions",
        "Boundaries and handover to a human",
        "Instructions for updating answers yourself",
      ],
      questions: [
        {
          question: "Will it make things up?",
          answer:
            "That deserves the most attention. It answers from your sources and says so when something is not in them. Before launch I test it on the questions where it must not go wrong.",
        },
        {
          question: "What does it cost per month?",
          answer:
            "There are usage costs, depending on the number of conversations. I work them out in advance with your expected volumes.",
        },
        {
          question: "Does it speak Dutch and English?",
          answer:
            "Yes, and it follows the language of whoever is talking to it.",
        },
      ],
    },

    webshop: {
      slug: "webshops",
      tagline: "Selling through a shop that feels like your brand.",
      intro:
        "A shop designed around your products. Payment, stock and shipping work the way you are used to.",
      sections: [
        { title: "Products in the lead", body: "Imagery and product pages get the attention that turns a catalogue into a shop." },
        { title: "Checkout in a heartbeat", body: "iDEAL, credit card and Apple Pay, in as few steps as possible and with no forced account." },
        { title: "Stock and shipping connected", body: "Order in, label ready, stock updated. Nothing is kept twice." },
        { title: "Room to grow", body: "A second language or a trade price list already fits on the foundation." },
      ],
      deliverables: [
        "A store designed around your products",
        "iDEAL, credit card, Apple Pay and Bancontact",
        "Stock, shipping and bookkeeping connected",
        "Manage products, prices and promotions yourself",
        "Discount codes and campaigns",
        "Ready for a second language or market",
      ],
      questions: [
        {
          question: "Can I move over from Shopify or WooCommerce?",
          answer:
            "Yes. I carry over products, customers and orders. The new shop is ready alongside the old one and goes live only when everything checks out.",
        },
        {
          question: "How many products can it handle?",
          answer:
            "From ten handmade pieces to thousands of variants. For large catalogues I set up search and filtering accordingly, and we discuss that up front.",
        },
        {
          question: "Who arranges the payment provider?",
          answer:
            "I set up the technical connection. The contract with the payment provider is in your name, because it is your revenue that flows through it.",
        },
      ],
    },

    integrations: {
      slug: "integrations-and-automation",
      tagline: "Your systems on one line, so the work carries itself.",
      intro:
        "Most time leaks away between two programs. A computer can handle that handover faster and without slips.",
      sections: [
        { title: "Map it first", body: "I start with your working week, not with technology. That way we find the connections with the most impact." },
        { title: "Set up once, then in the background", body: "An invoice lands in the books, an appointment in the calendar, without anyone retyping a thing." },
        { title: "Reporting to steer by", body: "Everything from one source, so numbers you can base decisions on." },
        { title: "Always in view", body: "If something fails you get a notification and see exactly what happened." },
      ],
      deliverables: [
        "A map of your current workflow and where it stalls",
        "Connections between the systems you already use",
        "Automation of the work that repeats",
        "Alerts when something goes wrong",
        "Reporting from a single source",
        "Documentation, so it does not depend on me",
      ],
      questions: [
        {
          question: "Does this work with the software we already use?",
          answer:
            "Almost always. I connect to anything with an open interface, and most packages have one. If in doubt, I check up front.",
        },
        {
          question: "Do we have to switch systems?",
          answer:
            "Usually not. I work with what you have, so your team does not have to move.",
        },
        {
          question: "What if our process changes later?",
          answer:
            "Then I adapt the connections. I document everything, so a change is an afternoon and not a new project.",
        },
      ],
    },

    branding: {
      slug: "branding-and-motion",
      tagline: "A brand that speaks the same language on every channel.",
      intro:
        "A logo is only the beginning. I make the complete set, with guidelines your team can start using straight away.",
      sections: [
        { title: "The story first, the shape after", body: "What you do and for whom comes first, so your identity is an answer and not a matter of taste." },
        { title: "Made to be used", body: "From a shop sign to an email signature to a nine-second story." },
        { title: "Motion is part of it", body: "How your logo arrives and a button responds is as much brand as your colour." },
        { title: "Guidelines that get read", body: "Compact enough to use, clear enough to prevent any debate." },
      ],
      deliverables: [
        "Logo and mark, in every file you need",
        "Colour, typography and image direction",
        "A moving version of the brand",
        "Guidelines your team can use on their own",
        "Templates for the things you make most",
        "All source files, no strings attached",
      ],
      questions: [
        {
          question: "Does my current logo have to go?",
          answer:
            "Not necessarily. Sometimes the logo works and the gain is in everything else. I advise you on what to keep.",
        },
        {
          question: "Do we get the source files?",
          answer:
            "Always. It is your brand, and you can continue with any designer.",
        },
        {
          question: "Can we do it in stages?",
          answer:
            "Certainly. Many companies start with logo and colour and expand later with motion and templates.",
        },
      ],
    },

    aiContent: {
      slug: "ai-content",
      tagline: "Imagery, video and animation for campaigns and social.",
      intro:
        "Imagery that once took a photo shoot and a week of waiting. Generating is the fast part, the finishing makes the difference.",
      sections: [
        { title: "Consistent with your brand", body: "Fixed setups and colour treatment, so twenty images look like each other and like you." },
        { title: "Finished by hand", body: "Hands, text and details need attention. That is where my time goes." },
        { title: "Campaign sets, not loose images", body: "Every format you need, ready to place." },
        { title: "Open about the method", body: "If a real photograph is the better choice, I say so." },
      ],
      deliverables: [
        "An image set in your brand style",
        "Every format for web and social",
        "Video and animation where it fits",
        "Retouched, finished files",
        "The prompts and setups, so you can continue yourself",
        "A note on where each piece may be used",
      ],
      questions: [
        {
          question: "Can I use this commercially?",
          answer:
            "I work with tools whose terms allow commercial use, and I record per set what you may do with it.",
        },
        {
          question: "Can people tell it was generated?",
          answer:
            "With rushed work, yes. That is why most of my time goes into finishing. If your brand calls for transparency, I note the origin.",
        },
        {
          question: "Can you use our own products?",
          answer:
            "Certainly. I use your photos as the base, so the product is right and the surroundings are created around it.",
        },
      ],
    },
  },

  work: {
    renofloww: {
      slug: "renofloww",
      tagline: "A renovation with dozens of loose ends, brought back to a single overview.",
      intro:
        "A complete web app: real accounts, its own database in which every project is stored, and an assistant that reads that data. Budget, planning, quotes, contractors and photos of a renovation, together per room.",
      url: "https://renofloww.vercel.app/",
      urlLabel: "renofloww.nl",
      facts: [
        { label: "Type", value: "Web app with accounts and subscription" },
        { label: "What I did", value: "From design to launch" },
        { label: "Behind the scenes", value: "Own database in the EU, Next.js and AI" },
      ],
      sections: [
        { title: "The week you are in", body: "The opening screen shows the current week: which job is running, what is already done and how much of the budget has gone." },
        { title: "Four things, one app", body: "Budget per room, planning per room, quotes side by side and tasks with a date. Exactly what you need every week." },
        { title: "An assistant that knows the project", body: "The assistant reads the budget, tasks, quotes and contractors, and answers with the figures from your own project." },
        { title: "Accounts, storage and subscription", body: "Users create an account, and everything they enter is stored encrypted in its own database in the EU. Subscription, trial and a free tier live in the same app." },
      ],
      scope: [
        "Design and visual identity",
        "Website that explains the product",
        "Accounts with sign-in, shielded per user",
        "Database storing every project and every expense",
        "Budget, planning, quotes and tasks per room",
        "Assistant that reads the project data",
        "Subscription, trial and free tier",
        "Works on a phone, installable as an app",
      ],
      page: { src: "/images/reno-page.webp", alt: "The full Renofloww homepage, top to bottom", width: 1200, height: 6914 },
      gallery: [
        { src: "/images/reno-phones.webp", alt: "Two phones showing Renofloww: the assistant in conversation and the overview of costs, quotes and planning", width: 1800, height: 1344 },
        { src: "/images/reno-functies.webp", alt: "Renofloww feature cards: the budget with the amount left to spend and the planning per room", width: 1440, height: 900 },
        { src: "/images/reno-ai.webp", alt: "The Renofloww assistant answering questions about spending and quotes from the project itself", width: 1440, height: 900 },
        { src: "/images/reno-prijzen.webp", alt: "The Renofloww pricing page with the Pro subscription beside the free version", width: 1440, height: 900 },
      ],
    },

    daalwerk: {
      slug: "daalwerk",
      tagline: "A house you watch change as you scroll, from shell to floor plan.",
      intro:
        "A studio site for interior and architecture in Limburg, with a maquette that moves with your scroll and an assistant that gives a first direction for material and colour. The name, logo and content are mine.",
      url: "https://daalwerk.vercel.app/nl",
      facts: [
        { label: "Type", value: "Own project, fictional studio" },
        { label: "What I did", value: "Brand, design and build" },
        { label: "Languages", value: "Dutch and English" },
      ],
      sections: [
        { title: "A house you watch change", body: "The site opens with a maquette of a courtyard farm. Scroll, and the roof comes off, the rooms appear and the house gets furnished." },
        { title: "Room by room", body: "Entrance, living room, kitchen: each room gets its own moment with the materials beside it, from bluestone and oak to linen and green stained wood." },
        { title: "From floor plan to result", body: "The furniture sits to scale in the floor plan. Then the picture moves on to the same living room, a year later, in real light." },
        { title: "Describe your space", body: "A visitor picks a room, a kind of house, the light and the feeling, and gets a first direction for colour and material. A request for a conversation follows." },
      ],
      scope: [
        "Name, logo and visual identity",
        "Scrolling maquette as the opening of the site",
        "Project pages, services and a materials library",
        "Assistant for a first direction in material and colour",
        "Request for a first conversation",
        "Dutch and English",
      ],
      page: { src: "/images/daal-page.webp", alt: "The opening of Daalwerk: a maquette furnished step by step, followed by the result, the materials and the assistant", width: 1200, height: 7425 },
      gallery: [
        { src: "/images/daal-woonkamer.webp", alt: "The living room in the Daalwerk maquette, with a sofa, round table and green wardrobe", width: 1440, height: 900 },
        { src: "/images/daal-zowerdhet.webp", alt: "The same living room as a photograph, a year later: loam plaster, linen and oak in afternoon light", width: 1440, height: 900 },
        { src: "/images/daal-materialen.webp", alt: "The Daalwerk materials library: marl, bluestone, loam plaster, lime paint and oak", width: 1440, height: 900 },
        { src: "/images/daal-assistent.webp", alt: "The Daalwerk assistant giving a direction for a living room in a farmhouse: loam plaster and smoked oak", width: 1440, height: 900 },
      ],
    },

    liveweddingpaintings: {
      slug: "live-wedding-paintings",
      tagline: "A site that feels like a gallery, and books weddings.",
      intro:
        "Sara van Heukelom paints live at weddings. I made her website, from the first design to launch.",
      url: "https://liveweddingpaintings.nl",
      facts: [
        { label: "Client", value: "Sara van Heukelom" },
        { label: "What I did", value: "Everything, from design to launch" },
        { label: "Languages", value: "Dutch and English" },
      ],
      sections: [
        { title: "The painting in the lead", body: "Her work hangs in gold frames that move as you scroll. The picture is the product, so the picture comes first." },
        { title: "Pick a format", body: "Three sizes to browse through, with the price beside each. No PDF and no emails back and forth." },
        { title: "Booking in eight steps", body: "A form that asks what Sara needs to know, including when it is a surprise for the couple." },
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


  },
};
