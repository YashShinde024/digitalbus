import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://digitalbus.me/#website",
      "url": "https://digitalbus.me/",
      "name": "Digital Bus",
      "alternateName": "डिजिटल बस",
      "description":
        "A cozy web-based music experience inspired by Indian bus journeys, travel, nature, nostalgia, lo-fi and indie music.",
      "publisher": {
        "@id": "https://digitalbus.me/#person"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://digitalbus.me/#webapp",
      "url": "https://digitalbus.me/",
      "name": "Digital Bus Radio",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript and HTML5 Audio"
    },
    {
      "@type": "Person",
      "@id": "https://digitalbus.me/#person",
      "name": "Yash Shinde",
      "url": "https://yashshinde.is-a.dev",
      "sameAs": [
        "https://nyxen.in",
        "https://www.thankyouverymuch.co/yash"
      ]
    }
  ]
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Digital Bus — Lo-Fi, Indie & Indian Music for the Journey" },
        {
          name: "description",
          content:
            "A cozy web-based music experience inspired by Indian bus journeys, travel, nature, nostalgia, lo-fi and indie music. Created by Yash Shinde.",
        },
        {
          name: "keywords",
          content:
            "Digital Bus, Lo-Fi music, Indian music, indie music, travel radio, bus journey radio, cozy music, nostalgic Indian travel, relaxing music, Yash Shinde",
        },
        { name: "author", content: "Yash Shinde" },
        { name: "publisher", content: "Yash Shinde" },
        { name: "theme-color", content: "#191512" },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: "Digital Bus — Lo-Fi, Indie & Indian Music for the Journey" },
        {
          property: "og:description",
          content:
            "A cozy web-based music experience inspired by Indian bus journeys, travel, nature, nostalgia, lo-fi and indie music.",
        },
        { property: "og:url", content: "https://digitalbus.me/" },
        { property: "og:image", content: "https://digitalbus.me/og-image.png" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Digital Bus" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Digital Bus — Lo-Fi, Indie & Indian Music for the Journey" },
        {
          name: "twitter:description",
          content:
            "A cozy web-based music experience inspired by Indian bus journeys, travel, nature, nostalgia, lo-fi and indie music.",
        },
        { name: "twitter:image", content: "https://digitalbus.me/og-image.png" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLdData),
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "canonical", href: "https://digitalbus.me/" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Yatra+One&display=swap",
        },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/favicon.svg" },
        { rel: "manifest", href: "/manifest.json" },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
