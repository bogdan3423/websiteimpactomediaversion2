import { site } from "@/content/site";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl("/"),
    // Square, padded version of the wordmark: Google requires logos of at least 112x112 px.
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-impactomedia-square.png"), width: 600, height: 600 },
    image: absoluteUrl("/og-image.jpg"),
    description: site.description,
    email: site.email,
    telephone: site.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    areaServed: { "@type": "Country", name: site.country },
    // Public company identifiers, as shown on the contact page and in the legal pages.
    taxID: site.registry.cui,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phone.e164,
      email: site.email,
      areaServed: "RO",
      availableLanguage: "ro",
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: site.name,
    inLanguage: "ro-RO",
    publisher: { "@id": organizationId },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Acasă", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageSchema({ path, name, description }: { path: string; name: string; description: string }) {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "ro-RO",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
