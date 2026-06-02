import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const requestCounts = new Map<string, { count: number; resetAt: number }>();

const MAX_REQUESTS_PER_HOUR = 5;

function checkRateLimit(userId: string): void {
  const now = Date.now();
  const entry = requestCounts.get(userId);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + 3600000 });
    return;
  }

  if (entry.count >= MAX_REQUESTS_PER_HOUR) {
    const waitMinutes = Math.ceil((entry.resetAt - now) / 60000);
    throw new Error(
      `Rate limit terlampaui. Silakan tunggu ${waitMinutes} menit.`
    );
  }

  entry.count++;
}

export async function askGemini(
  prompt: string,
  userId: string
): Promise<{ text: string; finishReason: string }> {
  checkRateLimit(userId);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
    },
  });

  const response = result.response;
  const candidate = response.candidates?.[0];
  const finishReason = candidate?.finishReason ?? "UNKNOWN";
  const blockReason = response.promptFeedback?.blockReason;

  const text = response.text();

  if (!text || text.trim().length === 0) {
    throw new Error(
      `Gemini mengembalikan respons kosong${
        blockReason ? ` (diblokir: ${blockReason})` : ""
      }`
    );
  }

  if (finishReason && finishReason !== "STOP") {
    console.warn(
      `Gemini finishReason: ${finishReason}, text length: ${text.length}`
    );
  }

  return { text, finishReason };
}

export async function askGeminiJSON<T>(
  systemPrompt: string,
  userMessage: string,
  userId: string
): Promise<T> {
  const fullPrompt = `${systemPrompt}\n\n${userMessage}\n\nJAWAB HANYA DENGAN JSON VALID TANPA MARKDOWN FORMATTING. JANGAN GUNAKAN \`\`\`json ATAU \`\`\` SAMA SEKALI.`;
  const { text, finishReason } = await askGemini(fullPrompt, userId);

  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const extracted = extractJSON(cleaned);
    try {
      return JSON.parse(extracted) as T;
    } catch {
      throw new Error(
        `Gagal parse JSON (finishReason: ${finishReason}, ${text.length} chars): ${text.slice(0, 600)}`
      );
    }
  }
}

function extractJSON(text: string): string {
  const trimmed = text.trim();

  const jsonBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    return jsonBlockMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const obj = trimmed.slice(firstBrace, lastBrace + 1);
    if (isValidJSON(obj)) return obj;
  }

  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const arr = trimmed.slice(firstBracket, lastBracket + 1);
    if (isValidJSON(arr)) return arr;
  }

  return trimmed;
}

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
