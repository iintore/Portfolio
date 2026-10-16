import { ContactError, sendContactMessage } from "./_contact.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    res.status(200).json(await sendContactMessage(req.body));
  } catch (error) {
    const status = error instanceof ContactError ? error.status : 500;
    res.status(status).json({ error: status === 500 ? "Something went wrong. Please try again." : error.message });
  }
}
