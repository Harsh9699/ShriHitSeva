import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Health Check
  app.get("/api/health", (req, res) => {
    const key = process.env.MY_GEMINI_KEY || process.env.GEMINI_API_KEY || "";
    res.json({ 
      status: "ok", 
      hasKey: !!key,
      keyPrefix: key ? `${key.substring(0, 4)}...` : "none"
    });
  });

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

  // Global Error Handler to ensure JSON responses
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[Global Error]:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message || "An unexpected error occurred" 
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
