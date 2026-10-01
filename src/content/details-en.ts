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
    questions: "Questions I get a lot",
    scope: "What the concept covers",
    otherServices: "Other services",
    otherWork: "Other work",
    readMore: "Read on",
    ctaTitle: "Ready to start?",
    ctaBody:
      "Tell me in the form what you want to build. The more you fill in, the sharper my first answer.",
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
        "Not a brochure, but the thing people actually do something in. Fast, yours alone, and built to last for years.",
      sections: [
        { title: "No theme, no page builder", body: "Everything is designed for you and written in code, so you never hit the ceiling of a template." },
        { title: "Fast, because slow costs money", body: "Images cut to size, pages prepared in advance, no script that does nothing. Google counts it." },
        { title: "Manage it without fear", body: "You change text and images yourself, and what has to stay fixed cannot break." },
        { title: "Login, database, dashboard", body: "Once accounts or records come in, it becomes a webapp on the same foundation." },
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
            "A solid brand site is usually a matter of weeks, a platform with login and database longer. After the first conversation you get a schedule that is true rather than one that sounds good.",
        },
        {
          question: "Can I keep my current site?",
          answer:
            "Text, images and your domain come along. I replace the technology underneath, because that is usually exactly the problem you want solved.",
        },
        {
          question: "What if I want to add something later?",
          answer:
            "That is the point of building it properly. An extra section, a second language, a shop on top: it can all go on without rebuilding the site.",
        },
      ],
    },

    aiChat: {
      slug: "ai-chat-and-agents",
      tagline: "An assistant inside your own site that genuinely helps your customers.",
      intro:
        "Not a chatbot that knows four questions. An assistant that knows your information and can do things.",
      sections: [
        { title: "Trained on what you know", body: "It answers from your documents and prices, and says honestly when it does not know." },
        { title: "It does more than talk", body: "Connected to calendar, mail or CRM, it books the appointment and creates the request for real." },
        { title: "You see what happens", body: "Every conversation in one place: what people ask, and which answers are still missing." },
        { title: "Inside the lines", body: "You decide what it talks about, and what has to pass a person first." },
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
            "That is where most of the work goes. It answers from your sources and says so when something is not in them. Before it goes live I test it on the questions you cannot afford it to get wrong.",
        },
        {
          question: "What does it cost per month?",
          answer:
            "There are usage costs, depending on how many conversations you have. I work that out up front with your expected numbers, so there is no surprise.",
        },
        {
          question: "Does it speak Dutch and English?",
          answer: "Yes, and it follows the language of whoever is talking to it.",
        },
      ],
    },

    webshop: {
      slug: "webshops",
      tagline: "Selling through a shop that feels like a brand.",
      intro:
        "A store designed around your products. Payment, stock and shipping work the way you already work.",
      sections: [
        { title: "Products as objects", body: "Imagery and product pages get the attention that separates a catalogue from a shop." },
        { title: "Checkout without friction", body: "iDEAL, credit card and Apple Pay, as few steps as possible and no forced account." },
        { title: "Stock and shipping connected", body: "Order in, label out, stock updated. Nothing kept twice." },
        { title: "Room to grow", body: "A second language or a trade price list is already in the foundation." },
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
            "Yes. Products, customers and orders come along. I build the new store next to the old one and only switch when everything checks out.",
        },
        {
          question: "How many products can it handle?",
          answer:
            "From ten handmade pieces to thousands of variants. At large numbers I set up search and filtering differently, and I discuss that up front.",
        },
        {
          question: "Who arranges the payment provider?",
          answer:
            "I set it up technically. The contract with the payment provider is in your name, because it is your money going through it.",
        },
      ],
    },

    integrations: {
      slug: "integrations-and-automation",
      tagline: "Your systems joined up, so the work carries itself.",
      intro:
        "Most time leaks away between two programs. A computer does that work better than you.",
      sections: [
        { title: "First find where it jams", body: "I start with your week, not with technology. That points at the first connections." },
        { title: "Set up once, then silent", body: "Invoice in the books, appointment in the calendar, without anyone retyping a thing." },
        { title: "Reporting that adds up", body: "Everything from one source, so numbers you can decide on." },
        { title: "When it fails, you hear about it", body: "If something fails you get a message, and you see exactly what happened." },
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
          question: "Does this work with the software we already have?",
          answer:
            "Almost always. I connect to anything with an open interface, and most packages have one. When in doubt I check before I start, not after.",
        },
        {
          question: "Do we have to switch systems?",
          answer:
            "Preferably not. Migrating costs your team more than it solves. I work with what is there, unless something genuinely cannot be connected.",
        },
        {
          question: "What if our process changes later?",
          answer:
            "Then I change it with you. That is why I document how it fits together, so a change is an afternoon and not a new project.",
        },
      ],
    },

    branding: {
      slug: "branding-and-motion",
      tagline: "A brand that sounds the same on every channel.",
      intro:
        "A logo is the smallest part of a brand. I make the whole set, with guidelines your team uses on its own.",
      sections: [
        { title: "The story first, the shape after", body: "What you do and for whom comes first, or a brand becomes a debate about taste." },
        { title: "Made to be used", body: "From a shop sign to an email signature to a nine second story." },
        { title: "Motion is part of it", body: "How your logo arrives and a button answers is as much brand as your colour." },
        { title: "Guidelines somebody reads", body: "Short enough to use, clear enough that nobody argues about it." },
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
            "Not necessarily. Sometimes the logo is fine and everything around it is the problem. I tell you honestly what I would keep.",
        },
        {
          question: "Do we get the source files?",
          answer:
            "Always, and without discussion. It is your brand. You have to be able to take it to another designer.",
        },
        {
          question: "Can we do it in stages?",
          answer:
            "Yes. Plenty of companies start with logo and colour and add motion and templates later.",
        },
      ],
    },

    aiContent: {
      slug: "ai-content",
      tagline: "Imagery, video and animation for campaigns and social.",
      intro:
        "Imagery that used to take a shoot and a week of waiting. Generating is the fast part, not the hard part.",
      sections: [
        { title: "Consistent with your brand", body: "Fixed setups and colour treatment, so twenty images look like each other and like you." },
        { title: "Finished by hand", body: "Hands, text and details always go wrong. That is where my time goes." },
        { title: "Campaign sets, not loose pieces", body: "Every format you need, ready to place." },
        { title: "Honest about what it is", body: "I say so when a real photograph is the better choice." },
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
            "I work with tools whose terms allow commercial use, and I record per set what you may do with it. When in doubt I take the safe route.",
        },
        {
          question: "Can people tell it was generated?",
          answer:
            "With bad work, instantly. That is why most of my time goes into finishing. And where the brand calls for it, I say that it was made.",
        },
        {
          question: "Can you use our own products?",
          answer:
            "Yes. I can take your own photographs as the base, so the product is right and the world around it is made.",
        },
      ],
    },
  },

  work: {
    liveweddingpaintings: {
      slug: "live-wedding-paintings",
      tagline: "A site that feels like a gallery, and books weddings.",
      intro:
        "Sara van Heukelom paints weddings live. I made her site, from the first design to the day it went live.",
      url: "https://liveweddingpaintings.nl",
      facts: [
        { label: "Client", value: "Sara van Heukelom" },
        { label: "What I did", value: "Everything, from design to launch" },
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


  },
};
