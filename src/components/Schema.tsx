import { site } from "@/lib/site";

export default function Schema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.strapline,
    url: site.url,
    email: site.email,
    foundingLocation: site.farm,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.registered[0]}, ${site.registered[1]}`,
      addressLocality: site.registered[2],
      postalCode: site.registered[3],
      addressCountry: "GB",
    },
    makesOffer: ["Pacific Oysters", "Sugar Kelp"].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
