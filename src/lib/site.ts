/**
 * Jurassic Sea Farms, Portland Harbour, Dorset.
 *
 * Every fact on the site lives here. Sources, all read 7 November 2026:
 *   jurassicseafarms.co.uk            home: who we are, why aquaculture, fruits of the sea, UN goals
 *   jurassicseafarms.co.uk/projects-1 Our Story: Lydia and Andy, took over in 2022, IMTA explained
 *   /copy-of-our-seaweed              (despite the slug) Our Oysters: Crassostrea gigas
 *   /copy-of-our-oysters              (despite the slug) Our Seaweed: Sugar Kelp
 *   /coming-soon-03                   older page: IMTA in fuller words, "our voyage has just begun"
 *   /contact-1                        Say hello, registered address, email
 *
 * Their own copy is kept as written, with typing slips corrected
 * (umani to umami, lattissima to latissima, versality to versatility,
 * ITMA to IMTA). Nothing here is invented: no prices, no volumes, no
 * stockists, no harvest dates. The Work with us page is new; its words
 * are built from what their own pages say the oysters and kelp are for.
 */

export const site = {
  name: "Jurassic Sea Farms",
  strapline: "Regenerative aquaculture on the South Coast",
  headline: "Harvesting the future",
  farm: "Portland Harbour, Dorset",
  email: "hello@jurassicseafarms.co.uk",
  registered: ["Lyndum House", "12 High Street", "Petersfield", "GU32 3JG"],
  founders: "Lydia and Andy",
  since: 2022,
  url: "https://www.jurassicseafarms.co.uk",
};

/** Builds a mailto with a subject line, the way their own buttons do. */
export function mailto(subject?: string, body?: string) {
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const s = q.toString().replace(/\+/g, "%20");
  return `mailto:${site.email}${s ? `?${s}` : ""}`;
}

export const nav = [
  { label: "Oysters", href: "/oysters/" },
  { label: "Seaweed", href: "/seaweed/" },
  { label: "Our story", href: "/our-story/" },
  { label: "Work with us", href: "/work-with-us/" },
  { label: "Contact", href: "/contact/" },
];

/** The band under the hero: what they do, in their own nouns. */
export const marquee = [
  "Pacific Oysters",
  "Sugar Kelp",
  "Portland Harbour",
  "No chemicals",
  "No fertilisers",
  "No fresh water",
  "Integrated Multi Trophic Aquaculture",
  "Dorset",
];

export const intro = {
  title: "Who are we?",
  body: "We are an independent Integrated Multi Trophic Aqua Farm (IMTA) located in the sheltered waters of Portland Harbour in Dorset. Using sustainably farmed seaweed and oysters, our aim is to support ocean health and create a safer, cleaner habitat to support marine species.",
};

export const fruits = {
  title: "Fruits of the Sea",
  body: "Grown naturally in the gin-clear waters of Portland Harbour, our Pacific Oysters and Sugar Kelp thrive beneath the surface, where they purify the water and support biodiversity. Once they've worked their magic, they're carefully harvested and made ready for your plate, and other applications.",
};

export type Product = {
  slug: "oysters" | "seaweed";
  name: string;
  latin: string;
  aka?: string;
  lede: string;
  card: string;
  image: string;
  art: string;
  enquiry: string;
  cta: string;
  body: string[];
  uses?: { title: string; body: string }[];
  describe?: string;
  photos: { src: string; alt: string }[];
};

export const oysters: Product = {
  slug: "oysters",
  name: "Pacific Oysters",
  latin: "Crassostrea gigas",
  lede: "Cultivated in the sheltered waters of Portland Harbour using our own system, developed specifically to make the most of our location.",
  card: "Bivalves with super powers.",
  image: "/img/oysters-pile.jpg",
  art: "/img/wc-oysters.webp",
  enquiry: "Oyster Enquiry",
  cta: "Buy our oysters",
  body: [
    "Pacific Oysters are bivalves with super powers! An exceptionally sustainable form of food production, tackling climate change and improving water quality, whilst providing an incredible source of nutrition. Oysters and other shellfish farming have a low carbon footprint and can even be a carbon sink, locking carbon away in their shells.",
    "By filtering all their food from the surrounding seawater, oysters actually clean up excess algae and other particles that result from high nutrient agriculture inputs. This cleaner water enhances the growth of seagrass and larger seaweeds, in turn sheltering and feeding wide ecological communities.",
  ],
  photos: [
    { src: "/img/oyster-bags.jpg", alt: "Oyster bags floating in a line on clear blue water in Portland Harbour" },
    { src: "/img/oysters-crate.jpg", alt: "Gloved hands sorting oysters in a crate" },
    { src: "/img/oysters-pile.jpg", alt: "A heap of freshly lifted Pacific Oysters" },
  ],
};

export const seaweed: Product = {
  slug: "seaweed",
  name: "Sugar Kelp",
  latin: "Saccharina latissima",
  aka: "sweet kelp",
  lede: "Grown on ropes beneath our oyster bags, our Sugar Kelp benefits from the nutrients dropped by our shellfish and provides a habitat for small marine and juvenile species.",
  card: "A little seaweed goes a long way.",
  image: "/img/kelp-close.jpg",
  art: "/img/wc-kelp.webp",
  enquiry: "Seaweed Enquiry",
  cta: "Buy our seaweed",
  describe:
    "A yellowish-brown colour with a long narrow, individual blade. The central stem is dimpled while the edges are smoother with a wavy finish.",
  body: [
    "By harnessing the versatility of seaweeds, it is possible to develop eco-friendly biomaterial solutions that contribute to a more sustainable future.",
  ],
  uses: [
    {
      title: "In the kitchen",
      body: "Popular in Eastern cuisine, Sugar Kelp has a subtly salty umami flavour, a little seaweed goes a long way! Ideal for Asian style soups and salads and jam-packed with natural compounds, trace elements and minerals, including a richness in iodine. It has long been used as a gelling agent in both food and cosmetic industries and can even be found in ice cream!",
    },
    {
      title: "On the land",
      body: "When used in agriculture, seaweed enhances plant growth, boosts crop yields and improves stress tolerance in flora. The plant growth regulators found in seaweeds stimulate root development and nutrient absorption, while antioxidants enhance defence mechanisms against frost, pest and diseases.",
    },
    {
      title: "In the lab",
      body: "Seaweeds can be used in a huge variety of applications, including bioplastics, wound dressings, drug delivery systems and tissue engineering, possessing inherent biocompatibility and antimicrobial properties which provide amazing medical and pharmaceutical solutions.",
    },
  ],
  photos: [
    { src: "/img/kelp-rope.jpg", alt: "A length of Sugar Kelp lifted onto the deck on its growing rope" },
    { src: "/img/kelp-harvest.jpg", alt: "A tub of harvested kelp in the boat beside the farm lines" },
    { src: "/img/kelp-pontoon.jpg", alt: "The farm boat at the pontoon, loaded with kelp" },
  ],
};

export const products = [oysters, seaweed];

/**
 * The water column, top to bottom. Their own sentences, placed at the
 * depth they describe: the oyster bags float, the kelp hangs beneath on
 * ropes, and what drifts down from one feeds the other.
 */
export const column = [
  {
    depth: "The surface",
    title: "Gin-clear water",
    body: "Our aquaculture system requires few resources and uses no chemicals, fertilisers or fresh water.",
  },
  {
    depth: "The oyster bags",
    title: "Filtering",
    body: "Oysters filter their food from the water, removing excess algae and other particles, improving water quality.",
  },
  {
    depth: "The ropes beneath",
    title: "Growing",
    body: "Sugar Kelp benefits from the nutrients dropped by our shellfish. Seaweed sequesters carbon whilst providing a habitat for other species.",
  },
  {
    depth: "All around it",
    title: "Sheltering",
    body: "Cleaner water enhances the growth of seagrass and larger seaweeds, in turn sheltering and feeding wide ecological communities.",
  },
];

export const story = {
  title: "Our Story",
  lede: "We are Lydia and Andy, two people committed to finding another way to produce food, whilst helping to mitigate climate change.",
  turn: "Our backgrounds are not in aquaculture, but we took the brave step of taking over Jurassic Sea Farms in 2022 because we wanted to be part of the change, not the problem.",
  imta: "Our Integrated Multi Trophic Aqua Farm (IMTA) is situated in Portland Harbour on the Dorset coast and uses the proximity of species from different trophic levels with complementary ecosystem functions to allow the waste, nutrients, and by-products of one species to be recaptured and converted into food and energy for another crop. This takes advantage of the synergistic interactions among species while bio-mitigation takes place.",
  aside: "Think of it as a natural recycling system!",
  why: [
    "Climate change and the consumption of natural resources by humans faster than our planet can renew them mean we need to rethink how we are going to ensure food security into the future.",
    "We believe that part of this solution is regenerative agriculture, supported by low carbon, sustainably grown food in our oceans.",
  ],
  products:
    "Carefully cultivated and harvested using regenerative aquaculture, our sustainable approach not only produces exceptional, nutrient-rich seafood but also helps restore marine ecosystems.",
  voyage:
    "Our voyage has just begun. If you would like us to stay in touch as we plot a course for the future, drop us a line.",
};

export const goals = {
  title: "We work with the United Nations Sustainable Development Goals in mind",
  body: [
    "In 2015, the United Nations member states adopted 17 goals to drive the world towards a sustainable future.",
    "These goals are an urgent call to action for all countries to create a global partnership and a blueprint for peace and prosperity, for both people and the planet.",
  ],
  drop: "As a small business, we are but a drop in the ocean. But many drops make up an ocean and we all have a part to play in bringing the Sustainable Development Goals into reality.",
};

/**
 * Work with us. New page. Each way in is something their own pages say
 * the farm produces or stands for; none of it claims an existing
 * customer, stockist or partnership.
 */
export const work = {
  title: "Work with us",
  lede: "Two crops, one harbour, and a farm that is still plotting its course. If what we grow could be part of what you do, we would love to hear from you.",
  ways: [
    {
      key: "kitchens",
      title: "Kitchens, fishmongers and seafood lovers",
      body: "Pacific Oysters grown in the gin-clear water of Portland Harbour, carefully harvested and made ready for the plate.",
      grows: "Pacific Oysters",
      subject: "Oyster Enquiry",
      image: "/img/oysters-crate.jpg",
    },
    {
      key: "makers",
      title: "Food, cosmetic and ingredient makers",
      body: "Sugar Kelp with a subtly salty umami flavour, a richness in iodine, and a long history as a gelling agent in food and cosmetics.",
      grows: "Sugar Kelp",
      subject: "Seaweed Enquiry",
      image: "/img/kelp-rope.jpg",
    },
    {
      key: "growers",
      title: "Growers and the land",
      body: "Seaweed enhances plant growth, boosts crop yields and improves stress tolerance, stimulating root development and helping plants defend against frost, pest and disease.",
      grows: "Sugar Kelp",
      subject: "Seaweed for agriculture",
      image: "/img/kelp-harvest.jpg",
    },
    {
      key: "research",
      title: "Researchers and biomaterials",
      body: "Bioplastics, wound dressings, drug delivery and tissue engineering: seaweed's biocompatibility and antimicrobial properties make it a material worth exploring together.",
      grows: "Sugar Kelp",
      subject: "Research and biomaterials",
      image: "/img/kelp-close.jpg",
    },
    {
      key: "ocean",
      title: "Ocean health and the bigger picture",
      body: "We work with the UN Sustainable Development Goals in mind. Many drops make up an ocean, and conversations about cleaner water and safer habitats are always welcome.",
      grows: "Both",
      subject: "Ocean health",
      image: "/img/oyster-bags.jpg",
    },
  ],
  closing: "Not sure where you fit? Neither were we in 2022. Send us a message in a bottle and we will find out together.",
};

export const contact = {
  title: "Say hello!",
  lede: "Want to say hello? Drop us a line, or send us a message in a bottle.",
  thanks: "Thanks for saying hello! We'll be in touch soon.",
  topics: ["Just saying hello", "Oyster Enquiry", "Seaweed Enquiry", "Working together"],
};
