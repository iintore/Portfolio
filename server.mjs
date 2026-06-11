import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === "production";
const dataPath = path.join(__dirname, "content", "case-studies.json");
const experienceDataPath = path.join(__dirname, "content", "experience.json");

app.use(express.json({ limit: "5mb" }));

async function readCaseStudies() {
  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw);
}

async function writeCaseStudies(caseStudies) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, `${JSON.stringify(caseStudies, null, 2)}\n`, "utf8");
}

async function readExperiences() {
  const raw = await fs.readFile(experienceDataPath, "utf8");
  return JSON.parse(raw);
}

async function writeExperiences(experiences) {
  await fs.mkdir(path.dirname(experienceDataPath), { recursive: true });
  await fs.writeFile(experienceDataPath, `${JSON.stringify(experiences, null, 2)}\n`, "utf8");
}

app.get("/api/case-studies", async (_req, res) => {
  try {
    res.json(await readCaseStudies());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/case-studies", async (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({ error: "Expected an array of case studies." });
    return;
  }

  try {
    await writeCaseStudies(req.body);
    res.json({ ok: true, caseStudies: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/experiences", async (_req, res) => {
  try {
    res.json(await readExperiences());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/experiences", async (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({ error: "Expected an array of experiences." });
    return;
  }

  try {
    await writeExperiences(req.body);
    res.json({ ok: true, experiences: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/upload", async (req, res) => {
  const { filename, fileData } = req.body;
  if (!filename || !fileData) {
    res.status(400).json({ error: "Missing filename or fileData." });
    return;
  }

  try {
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const assetPath = path.join(__dirname, "public", "assets", filename);
    await fs.mkdir(path.dirname(assetPath), { recursive: true });
    await fs.writeFile(assetPath, buffer);
    res.json({ ok: true, url: `/assets/${filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (isProd) {
  app.use(express.static(path.join(__dirname, "dist")));
  app.use((_req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Portfolio running at http://${host}:${port}`);
});

