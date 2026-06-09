import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

type TranslateRequest = {
  texts: Record<string, string>; // { name: "Брускетта с томатами", desc: "..." }
};

type TranslateResponse = {
  it: Record<string, string>;
  en: Record<string, string>;
  fr: Record<string, string>;
  zh: Record<string, string>;
};

router.post("/translate", async (req, res) => {
  const { texts } = req.body as TranslateRequest;

  if (!texts || typeof texts !== "object" || Object.keys(texts).length === 0) {
    return res.status(400).json({ error: "texts object required" });
  }

  const fields = Object.entries(texts)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  if (!fields) {
    return res.status(400).json({ error: "No non-empty text fields provided" });
  }

  const prompt = `Translate the following fields from Russian into Italian (it), English (en), French (fr), and Chinese Simplified (zh).
Return ONLY valid JSON with this exact structure, no explanation:
{
  "it": { <same keys as input> },
  "en": { <same keys as input> },
  "fr": { <same keys as input> },
  "zh": { <same keys as input> }
}

Input fields:
${fields}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    // Extract JSON even if wrapped in markdown code block
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Invalid AI response" });
    }
    const result: TranslateResponse = JSON.parse(jsonMatch[0]);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Translation failed" });
  }
});

export default router;
