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
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
