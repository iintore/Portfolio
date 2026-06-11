import { Buffer } from "node:buffer";
import { commitToGithub } from "./_github.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { filename, fileData } = req.body || {};
  if (!filename || !fileData) {
    res.status(400).json({ error: "Missing filename or fileData." });
    return;
  }

  try {
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    // Commit the binary image directly to the GitHub repository
    const repoPath = `public/assets/${filename}`;
    await commitToGithub(repoPath, buffer, true);
    
    res.status(200).json({ ok: true, url: `/assets/${filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
