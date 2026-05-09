import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({ storage: multer.memoryStorage() });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
  const { message, imageBase64, language } = req.body;

  const langInstruction = language && language !== "en-US"
    ? `IMPORTANT: Respond ENTIRELY in the language with code "${language}". This includes the Chapter headings (e.g., instead of "Chapter 1", write the translated equivalent), the Title, and every single word of the content. DO NOT use any English words.`
    : "";

  console.log(`Received chat request: "${message}" | Image: ${imageBase64 ? "YES" : "NO"} | Lang: ${language}`);

  const prompt = `STRICT TOPIC: You are a master heritage historian. 
Your ONLY task is to write about: "${message}". 
DO NOT write about anything else. If you are asked about Taj Mahal, you MUST write about Taj Mahal only.

Write an EXHAUSTIVE, MASSIVE 10-CHAPTER BOOK about STRIClTY "${message}". 
You MUST write at least 3000 words. 
IMPORTANT: The entire response MUST be in ${language}. 
Translate everything including the chapter headers (e.g., "అధ్యాయం 1").

You MUST use these EXACT tags for the structure (do not translate the tags inside brackets):

[TITLE]
(Cinematic Title in ${language})

✦ [Chapter 1 Title in ${language}] ✦
(Extensive content in ${language}...)

✦ [Chapter 2 Title in ${language}] ✦
(Extensive content in ${language}...)
...and so on for 10 chapters.`;

  try {
    const messages = [
      {
        role: "user",
        content: imageBase64 
          ? [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageBase64 } }
            ]
          : prompt
      }
    ];

    const completion = await groq.chat.completions.create({
      model: imageBase64 ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.1-8b-instant",
      messages,
      max_tokens: 4000,
    });

    const reply = completion.choices[0]?.message?.content || "No response";
    res.json({ reply });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Step 5 & Fix: New Analyze Route (Using Local Ollama - llava)
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });
    const base64Image = req.file.buffer.toString("base64");
    const monumentName = req.body.monument || "";

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llava",
        prompt: `
You are a heritage expert.

Analyze this monument image step-by-step:

1. Identify monument (if unsure say "unknown")
2. Describe damage
3. Explain causes
4. Severity (Low/Medium/High)
5. Prevention

Monument hint (if given): ${monumentName}

Return ONLY JSON:

{
  "monument": "",
  "damage_type": "",
  "description": "",
  "likely_causes": "",
  "severity": "",
  "prevention": "",
  "boxes": [{"x":0,"y":0,"width":0,"height":0}]
}
        `,
        images: [base64Image],
        stream: false,
      }),
    });

    const data = await response.json();
    const text = data.response;

    let result;
    try {
      // Robust JSON extraction in case of extra text/markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (e) {
      console.warn("JSON parse failed, falling back to raw response");
      result = {
        monument: "unknown",
        description: text,
        damage_type: "See description",
        likely_causes: "See description",
        severity: "Low",
        prevention: "Consult an expert",
        boxes: []
      };
    }

    res.json(result);
  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: "Analysis failed: " + err.message });
  }
});


app.listen(5000, () =>
  console.log("✅ Heritage AI server running on http://localhost:5000")
);
