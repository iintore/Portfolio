import fs from "node:fs/promises";
import path from "node:path";
import { commitToGithub } from "./_github.js";

const dataPath = path.join(process.cwd(), "content", "case-studies.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const raw = await fs.readFile(dataPath, "utf8");
      res.status(200).json(JSON.parse(raw));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    if (!Array.isArray(req.body)) {
      res.status(400).json({ error: "Expected an array of case studies." });
      return;
    }

    try {
      const formattedJson = `${JSON.stringify(req.body, null, 2)}\n`;
      
      // Commit the updated JSON back to GitHub
      await commitToGithub("content/case-studies.json", formattedJson);
      
      res.status(200).json({ ok: true, caseStudies: req.body });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
