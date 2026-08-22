import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "7x7 Journal",
    short_name: "7x7",
    description: "A minimalist approach to self-reflection. 10 days of disciplined, identical questions.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFBFA",
    theme_color: "#A7321C",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
