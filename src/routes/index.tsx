import { createFileRoute } from "@tanstack/react-router";
import { DigitalBus } from "@/components/digital-bus/DigitalBus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Bus — Old Hindi & Bollywood Songs for the Long Way Home" },
      {
        name: "description",
        content: "Step inside the cozy cabin of Digital Bus. Stream nostalgic 90s & 2000s Bollywood songs, old Hindi romantic classics, and retro love melodies to make your drive beautiful.",
      },
      { property: "og:title", content: "Digital Bus — Old Hindi & Bollywood Songs for the Long Way Home" },
      {
        property: "og:description",
        content: "Step inside the cozy cabin of Digital Bus. Stream nostalgic 90s & 2000s Bollywood songs, old Hindi romantic classics, and retro love melodies to make your drive beautiful.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DigitalBus,
});
