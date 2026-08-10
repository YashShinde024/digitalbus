import { createFileRoute } from "@tanstack/react-router";
import { DigitalBus } from "@/components/digital-bus/DigitalBus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Bus — डिजिटल बस" },
      {
        name: "description",
        content: "A cozy little bus driver's radio on the internet.",
      },
      { property: "og:title", content: "Digital Bus — डिजिटल बस" },
      {
        property: "og:description",
        content: "A cozy little bus driver's radio on the internet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DigitalBus,
});
