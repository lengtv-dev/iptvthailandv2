import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // CORS headers for all API requests
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range, Authorization");
    res.header("Access-Control-Expose-Headers", "Content-Length, Content-Range, Content-Type");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Channels endpoint
  app.get("/api/channels", (req, res) => {
    try {
      const channelPath = path.join(process.cwd(), "public", "channel.json");
      if (fs.existsSync(channelPath)) {
        const raw = fs.readFileSync(channelPath, "utf-8");
        res.setHeader("Content-Type", "application/json");
        return res.send(raw);
      }
      res.status(404).json({ error: "channel.json not found" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Direct channel stream proxy by CID
  app.get("/api/stream/:cid/playlist.m3u8", async (req, res) => {
    const { cid } = req.params;
    const targetUrl = `https://s.okwin321.ai/ngz168/${cid}/playlist.m3u8`;
    req.query.url = targetUrl;
    return handleProxy(req, res);
  });

  // Universal Stream Proxy for HLS / TS / MP4 (solves CORS)
  app.all("/api/proxy", async (req, res) => {
    return handleProxy(req, res);
  });

  async function handleProxy(req: express.Request, res: express.Response) {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send("Missing url parameter");
    }

    try {
      const parsedTarget = new URL(targetUrl);
      const headers: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9,th;q=0.8",
        "Referer": `${parsedTarget.protocol}//${parsedTarget.host}/`,
        "Origin": `${parsedTarget.protocol}//${parsedTarget.host}`,
      };

      if (req.headers.range) {
        headers["Range"] = req.headers.range;
      }

      const response = await fetch(targetUrl, {
        method: req.method === "HEAD" ? "HEAD" : "GET",
        headers,
        redirect: "follow",
      });

      if (!response.ok && response.status !== 206) {
        return res.status(response.status).send(`Upstream returned ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "";
      const isM3U8 = targetUrl.toLowerCase().includes(".m3u8") || 
                     contentType.includes("mpegurl") || 
                     contentType.includes("application/x-mpegURL");

      // Forward caching & content headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "*");

      if (isM3U8) {
        const text = await response.text();
        // Rewrite m3u8 URLs to proxy through this server
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
        const lines = text.split("\n");
        const rewrittenLines = lines.map(line => {
          const trimmed = line.trim();
          if (!trimmed) return line;

          // Rewrite URI inside tags like #EXT-X-KEY or #EXT-X-MAP
          if (trimmed.startsWith("#")) {
            return line.replace(/URI="([^"]+)"/g, (match, uri) => {
              let resolvedUri = uri;
              try {
                resolvedUri = new URL(uri, baseUrl).href;
              } catch {
                resolvedUri = baseUrl + uri;
              }
              return `URI="/api/proxy?url=${encodeURIComponent(resolvedUri)}"`;
            });
          }

          // Line is a media or sub-playlist URL
          let resolved = trimmed;
          try {
            resolved = new URL(trimmed, baseUrl).href;
          } catch {
            resolved = baseUrl + trimmed;
          }
          return `/api/proxy?url=${encodeURIComponent(resolved)}`;
        });

        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        return res.send(rewrittenLines.join("\n"));
      }

      // If segment or other media (TS, AAC, MP4, etc.)
      const streamContentType = contentType || (targetUrl.endsWith(".ts") ? "video/mp2t" : "application/octet-stream");
      res.setHeader("Content-Type", streamContentType);

      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      const contentRange = response.headers.get("content-range");
      if (contentRange) {
        res.setHeader("Content-Range", contentRange);
        res.status(206);
      }

      // Stream arrayBuffer or body
      if (response.body) {
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      } else {
        return res.end();
      }
    } catch (err: any) {
      console.error("Proxy error for URL:", targetUrl, err);
      return res.status(502).send(`Proxy failed: ${err.message}`);
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Live TV Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
