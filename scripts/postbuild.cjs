const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Digital Bus — Lo-Fi, Indie & Indian Music for the Journey</title>
    <meta
      name="description"
      content="A cozy web-based music experience inspired by Indian bus journeys, travel, nature, nostalgia, lo-fi and indie music."
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Yatra+One&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-black text-white antialiased">
    <div id="root"></div>
  </body>
</html>`;

const targetDirs = [
  path.join(rootDir, "dist"),
  path.join(rootDir, "dist", "client"),
  path.join(rootDir, ".output", "public"),
];

targetDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    const filePath = path.join(dir, "index.html");
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, indexHtmlContent);
      console.log(`[postbuild] Created fallback index.html at ${filePath}`);
    }
  }
});
