import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ImpactoMedia",
    short_name: "ImpactoMedia",
    description: "Marketing video, publicitate PPC și dezvoltare web.",
    lang: "ro",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f2f0eb",
    theme_color: "#f2f0eb",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
