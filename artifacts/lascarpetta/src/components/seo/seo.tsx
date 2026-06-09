import { useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const { lang } = useI18n();

  useEffect(() => {
    // Update title
    document.title = `${title} | La Scarpetta`;

    // Update meta tags
    const metaTags = {
      description,
      "og:title": title,
      "og:description": description,
      "og:type": "website",
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
    };

    if (image) {
      Object.assign(metaTags, {
        "og:image": image,
        "twitter:image": image,
      });
    }

    if (url) {
      Object.assign(metaTags, {
        "og:url": url,
      });
    }

    // Apply tags
    Object.entries(metaTags).forEach(([name, content]) => {
      // Find by name or property
      let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        if (name.startsWith("og:")) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    });

    // Structured Data (JSON-LD) for LocalBusiness/Restaurant
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "La Scarpetta",
      "image": image || "https://lascarpetta.ru/logo.jpg", // Placeholder
      "@id": "https://lascarpetta.ru",
      "url": "https://lascarpetta.ru",
      "telephone": "+74992466228",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Obolensky per., 9",
        "addressLocality": "Moscow",
        "addressRegion": "Moscow",
        "postalCode": "119021",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 55.7291,
        "longitude": 37.5899
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
          ],
          "opens": "12:00",
          "closes": "23:00"
        }
      ],
      "servesCuisine": "Italian",
      "priceRange": "₽₽₽",
      "sameAs": [
        "https://instagram.com/la_scarpetta_msc"
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Cleanup could go here if needed, but often not necessary for single page apps 
      // unless we want to remove specific tags on unmount
    };
  }, [title, description, image, url, lang]);

  return null;
}
