import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  // REMOVE this line: Vite will serve static assets from your client's public directory
  // const staticAssetsPath = path.resolve(__dirname, "..", "..", "dist", "public");
  // app.use(express.static(staticAssetsPath));

  const vite = await createViteServer({
    ...viteConfig, // This should point to your main vite.config.ts
    configFile: false, // Assuming viteConfig is already loaded
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares); // Vite's middleware should handle static assets and HMR

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Point to your SOURCE index.html.
      // Assuming your client source is in 'WaitlistWizard/WaitlistWizard/client/index.html'
      // And your main vite.config.ts has `root: 'client'` or similar.
      const clientTemplate = path.resolve(
        __dirname, // current: backend/server
        "..",      // up to: backend
        "..",      // up to: WaitlistWizard/WaitlistWizard (project root)
        "client",  // into: client
        "index.html" // the source index.html
      );

      // always reload the source index.html file from disk
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // This replacement makes sense if your source index.html contains src="/src/main.tsx"
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// serveStatic function remains unchanged as it's for production builds
export function serveStatic(app: Express) {
  const distPath = path.resolve(
    __dirname,
    "..", // Go up one level from 'server' to 'backend'
    "..", // Go up one level from 'backend' to 'WaitlistWizard/WaitlistWizard' (project root)
    "dist",
    "public",
  );

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
