import { Buffer } from "node:buffer";

const OWNER = process.env.GITHUB_OWNER || "iintore";
const REPO = process.env.GITHUB_REPO || "Portfolio";
const TOKEN = process.env.GITHUB_TOKEN;

/**
 * Commits a file (either text or binary) directly to the GitHub repository.
 * Handles getting the latest SHA for existing files to prevent conflicts.
 *
 * @param {string} filePath - Path in the repository (e.g. 'content/case-studies.json')
 * @param {string|Buffer} content - File content (string for text, Buffer for binary)
 * @param {boolean} isBinary - True if content is a Buffer
 */
export async function commitToGithub(filePath, content, isBinary = false) {
  if (!TOKEN) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
  
  // 1. Try to get the existing file to retrieve its SHA (required for updating files)
  let sha;
  try {
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }
  } catch (err) {
    console.error(`[GitHub API] Error fetching SHA for ${filePath}:`, err);
  }

  // 2. Base64 encode the content
  const base64Content = isBinary 
    ? content.toString("base64")
    : Buffer.from(content, "utf8").toString("base64");

  // 3. Push the commit to update/create the file
  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `CMS Update: ${filePath}`,
      content: base64Content,
      sha,
    }),
  });

  if (!putRes.ok) {
    const errorData = await putRes.json();
    throw new Error(`GitHub API returned ${putRes.status}: ${errorData.message}`);
  }

  return await putRes.json();
}
