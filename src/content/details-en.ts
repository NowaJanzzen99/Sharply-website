import type { Details } from "./types";

/*
  The detail pages, English. A translation of details-nl.ts in substance, not
  word for word: the Dutch is the original, and a few lines read better in
  English when they are rebuilt rather than carried across.

  Same rules as the Dutch file: no promised results, no numbers, no client
  names. Everything here is about what we make and how, because that is all
  that is true today.
*/
export const detailsEn: Details = {
  copy: {
    backToServices: "All services",
    backToWork: "All work",
    deliverables: "What you get",
    questions: "Questions we get a lot",
    scope: "What the concept covers",
    otherServices: "Other services",
    otherWork: "Other work",
    readMore: "Read on",
    ctaTitle: "Ready to start?",
    ctaBody:
      "Tell us in the form what you want to build. The more you fill in, the sharper our first answer.",
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
        "Most websites are a brochure. We build the thing people actually do something in: read, request, log in, order, manage. How far that goes is up to you, but the base is always the same: fast, yours alone, and built to last for years.",
      sections: [
        {
          title: "No theme, no page builder",
          body: "We do not work with templates or drag and drop builders. Everything you see is designed for you and written in code. That takes more thinking up front and gives you a site nobody else has, one that never hits the ceiling of a theme, and one you can still extend in three years.",
        },
        {
          title: "Fast, because slow costs money",
          body: "Images are cut down to what a phone actually needs, pages are prepared in advance instead of assembled per visitor, and nothing loads that does nothing. That is not only pleasant for visitors: Google measures it and counts it.",
        },
        {
          title: "Manage it yourself, without fear",
          body: "You get a place to change text and images where you cannot break anything. What has to stay fixed, stays fixed. And if you would rather just say what you want, that works too: see the demo on the homepage.",
        },
        {
          title: "Login, database, dashboard",
          body: "The moment accounts, records and roles come into it, it is a webapp. We build those on the same foundation: same speed, same design, with a database underneath and an admin screen you and your team actually work in.",
        },
      ],
      deliverables: [
        "Design made for you, first on screen, then in code",
        "Fully responsive, from phone to wide display",
        "Manage your own text and images",
        "Optional login, database and dashboard",
        "Hosting set up, domain connected, SSL handled",
        "A handover where we show you how it all works",
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
            "Text, images and your domain come along. We replace the technology underneath, because that is usually exactly the problem you want solved.",
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
        "Not a chatbot that knows four questions and then points at a contact form. An assistant that knows your information, answers in your tone, and can do things: book an appointment, start a quote, look something up in your system.",
      sections: [
        {
          title: "Trained on what you know",
          body: "We feed it your documents, prices, terms and the questions you answer every week. It answers from those, and says honestly when it does not know instead of inventing something. That last part is where most chatbots fall apart.",
        },
        {
          title: "It does more than talk",
          body: "An assistant that only produces text is a search box with manners. We connect it to your calendar, your mail, your stock or your CRM, so it books the appointment and creates the request for real.",
        },
        {
          title: "You see what happens",
          body: "You get an overview of the conversations: what people ask, where it got stuck, which answers are missing. That is the best customer research list you can have, because it is literally your customers' questions.",
        },
        {
          title: "Inside the lines",
          body: "You decide what it talks about and what it does not, what it may do and what has to pass a human. Sensitive data stays out of the conversation, and we write down what happens to the rest.",
        },
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
            "That is where most of the work goes. It answers from your sources and says so when something is not in them. Before it goes live we test it on the questions you cannot afford it to get wrong.",
        },
        {
          question: "What does it cost per month?",
          answer:
            "There are usage costs, depending on how many conversations you have. We work that out up front with your expected numbers, so there is no surprise.",
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
        "A shop from a standard package looks like every other shop from that package. We design the store around your products, and make sure payment, stock and shipping work exactly the way you already work.",
      sections: [
        {
          title: "Products as objects",
          body: "How a product sits on the screen decides how it feels. We spend time on imagery, detail pages and the route towards them, because that is the difference between a catalogue and a shop you want something out of.",
        },
        {
          title: "Checkout without friction",
          body: "iDEAL, credit card, Apple Pay and Bancontact. As few steps as possible, no forced account, shipping costs visible before the final screen. Every extra click costs orders.",
        },
        {
          title: "Stock and shipping connected",
          body: "We connect to your bookkeeping, your stock system or your carrier so you are not maintaining two places. Order in, label out, stock updated.",
        },
        {
          title: "Room to grow",
          body: "New product groups, a second language, a trade price list: that is already in the foundation. You do not start over the moment it starts working.",
        },
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
            "Yes. Products, customers and orders come along. We build the new store next to the old one and only switch when everything checks out.",
        },
        {
          question: "How many products can it handle?",
          answer:
            "From ten handmade pieces to thousands of variants. At large numbers we set up search and filtering differently, and we discuss that up front.",
        },
        {
          question: "Who arranges the payment provider?",
          answer:
            "We set it up technically. The contract with the payment provider is in your name, because it is your money going through it.",
        },
      ],
    },

    integrations: {
      slug: "integrations-and-automation",
      tagline: "Your systems joined up, so the work carries itself.",
      intro:
        "Most of the wasted time in a business sits between two programs: retyping something, forwarding a file, keeping a list that already exists somewhere else. That is exactly the work a computer does better than you.",
      sections: [
        {
          title: "First find where it jams",
          body: "We start with your week rather than with technology. What do you redo every Monday? What breaks when someone is ill? That almost always points straight at the first three connections worth building.",
        },
        {
          title: "Set up once, then silent",
          body: "You do not notice a good integration. The invoice is in the bookkeeping, the appointment in the calendar, the customer in the CRM, without anyone retyping a thing. What we build keeps running when you are not there.",
        },
        {
          title: "Reporting that adds up",
          body: "When the data comes from one source, the numbers agree. You get an overview you can actually decide on, instead of three exports that contradict each other.",
        },
        {
          title: "When it fails, you hear about it",
          body: "Automation without supervision is a time bomb. We build alerts around it: if something fails you get a message, and the log shows exactly what happened.",
        },
      ],
      deliverables: [
        "A map of your current workflow and where it stalls",
        "Connections between the systems you already use",
        "Automation of the work that repeats",
        "Alerts when something goes wrong",
        "Reporting from a single source",
        "Documentation, so it does not depend on us",
      ],
      questions: [
        {
          question: "Does this work with the software we already have?",
          answer:
            "Almost always. We connect to anything with an open interface, and most packages have one. When in doubt we check before we start, not after.",
        },
        {
          question: "Do we have to switch systems?",
          answer:
            "Preferably not. Migrating costs your team more than it solves. We work with what is there, unless something genuinely cannot be connected.",
        },
        {
          question: "What if our process changes later?",
          answer:
            "Then we change it with you. That is why we document how it fits together, so a change is an afternoon and not a new project.",
        },
      ],
    },

    branding: {
      slug: "branding-and-motion",
      tagline: "A brand that sounds the same on every channel.",
      intro:
        "A logo is the smallest part of a brand. It is about the whole set: colour, typography, imagery, motion and tone, and about guidelines clear enough for your team to use without us.",
      sections: [
        {
          title: "The story first, the shape after",
          body: "We start with what you do, who for, and why anyone would pick you. Without that a brand becomes a conversation about taste, and conversations about taste last forever and settle nothing.",
        },
        {
          title: "Made to be used",
          body: "A brand has to work on a sign, in an email signature, on packaging and in a nine second story. We design the set for that, not for how it looks on one beautiful presentation slide.",
        },
        {
          title: "Motion is part of it",
          body: "How your logo arrives, how a button answers, how a headline enters: that is as much brand as your colour. We deliver that motion with the rest, as files and as a rule.",
        },
        {
          title: "Guidelines somebody reads",
          body: "Not a sixty page book that disappears into a folder. A set short enough to use and clear enough that nobody has to argue about it.",
        },
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
            "Not necessarily. Sometimes the logo is fine and everything around it is the problem. We tell you honestly what we would keep.",
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
        "With the right approach you can make imagery that used to take a shoot, a studio and a week of waiting. That is not pressing a button: it is prompting, selecting, retouching and taste. The generated part is the fastest part, not the hard part.",
      sections: [
        {
          title: "Consistent with your brand",
          body: "Individually pretty pictures are worth nothing. We work with fixed setups, references and colour treatment, so twenty images look like each other and like your brand, rather than like twenty separate experiments.",
        },
        {
          title: "Finished by hand",
          body: "Hands, text, logos and details go wrong, every time. That is where our time goes: retouching, compositing, regenerating until it is right. What you get is finished, not nearly finished.",
        },
        {
          title: "Campaign sets, not loose pieces",
          body: "You get the whole run in the formats you need: landscape, portrait, square, with and without room for text. Ready to place without anyone having to crop anything.",
        },
        {
          title: "Honest about what it is",
          body: "We tell you where generating is the better choice and where a real photo or a real recording wins. For people, for products in the hand and for anything that has to earn trust, real is often better.",
        },
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
            "We work with tools whose terms allow commercial use, and we record per set what you may do with it. When in doubt we take the safe route.",
        },
        {
          question: "Can people tell it was generated?",
          answer:
            "With bad work, instantly. That is why most of our time goes into finishing. And where the brand calls for it, we say that it was made.",
        },
        {
          question: "Can you use our own products?",
          answer:
            "Yes. We can take your own photographs as the base, so the product is right and the world around it is made.",
        },
      ],
    },
  },

  work: {
    noordlicht: {
      slug: "noordlicht-keramiek",
      tagline: "A brand site for a ceramics studio, where the workshop is as visible as the collection.",
      intro:
        "With handmade work you buy the maker as much as the object. This concept is built around that: stories from the workshop sit beside the collection instead of being hidden in a blog nobody finds.",
      sections: [
        {
          title: "The idea",
          body: "A small ceramics studio working in series, with pieces that differ from firing to firing. A standard shop layout would flatten that into stock. We gave the collection the calm of an exhibition, with room for the process in between.",
        },
        {
          title: "What we designed",
          body: "A light, quiet layout with plenty of white, large imagery and typography that does not ask for attention. The collection is a grid that breathes, each piece has its own page with the story of its series, and the workshop returns as a layer running through the site.",
        },
        {
          title: "How it would be built",
          body: "As a brand site with a light shop underneath: add series yourself, drag in images, write stories without needing a designer. Payment through iDEAL, shipping connected, and imagery that loads as well on a phone as on a screen in the studio.",
        },
      ],
      scope: [
        "Brand direction, colour and typography",
        "Design for home, collection and product pages",
        "Workshop stories as a permanent layer",
        "Light shop with iDEAL",
        "Manage series and imagery yourself",
      ],
      note: "This is a concept project we made ourselves to show how we work. Noordlicht Keramiek is an invented brand, not a client, and no results are attached to it.",
    },

    halm: {
      slug: "halm",
      tagline: "A dark shop for skincare, built to show products as objects.",
      intro:
        "Skincare is almost always presented light, soft and pastel. This concept does the opposite: a dark store where the bottles stand in the light like objects, the way you would show a watch or a perfume.",
      sections: [
        {
          title: "The idea",
          body: "A brand with few products and a lot to say about them. A store full of cards and star ratings is the wrong tool for that. The question was how to make four products feel important without shouting.",
        },
        {
          title: "What we designed",
          body: "A dark background that lets the product glow, ingredients as a readable layer under the bottle instead of a list in small print, and a routine builder showing which product comes when. Motion is kept slow and heavy, in keeping with what the brand charges.",
        },
        {
          title: "How it would be built",
          body: "As a full shop: stock, variants, discount codes and a checkout of as few steps as possible. Subscriptions are allowed for in the setup, because skincare lends itself to them.",
        },
      ],
      scope: [
        "Store design, dark, built around the product",
        "Product page with ingredients and routine",
        "Checkout in as few steps as possible",
        "Structure for repeat orders",
        "Stock and shipping connected",
      ],
      note: "This is a concept project we made ourselves to show how we work. Halm is an invented brand, not a client, and no results are attached to it.",
    },

    routewerk: {
      slug: "routewerk",
      tagline: "A dashboard that tracks shipments, flags delays and shares out the work.",
      intro:
        "This concept shows what we mean by an AI system: not a chat window bolted on the side, but software where the clever parts sit exactly where somebody would otherwise be clicking by hand.",
      sections: [
        {
          title: "The idea",
          body: "A carrier with a few hundred shipments a week, where the planning lives in the heads of two people. That works until one of them is on holiday. The question was how to put that knowledge into a system without sidelining the people who hold it.",
        },
        {
          title: "What we designed",
          body: "An overview that shows in one glance what is running, what is stuck and what needs attention. Delays are flagged before the customer calls. Work is proposed and divided, but a person approves it. And there is an assistant that answers questions about the data, so nobody has to build a report to learn something simple.",
        },
        {
          title: "How it would be built",
          body: "As a webapp with login and roles, a database underneath and connections to the systems already in place. The automation runs in the background with alerts when something fails, because a planning system that fails quietly is worse than none.",
        },
      ],
      scope: [
        "Dashboard with a live overview",
        "Flagging of delays and exceptions",
        "Proposed work distribution, approved by a person",
        "An assistant that answers questions about the data",
        "Login, roles and connections to existing systems",
      ],
      note: "This is a concept project we made ourselves to show how we work. Routewerk is an invented brand, not a client, and no results are attached to it.",
    },
  },
};
