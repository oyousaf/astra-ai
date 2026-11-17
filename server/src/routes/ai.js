const { Router } = require("express");
const { GoogleGenAI } = require("@google/genai");
const requireAuth = require("../middleware/auth");

const router = Router();
router.use(requireAuth);

const MAX_INPUT_LENGTH = 6000;
const AI_TIMEOUT_MS = 25_000;
// Swappable from .env so a retired or misbehaving model doesn't need a code change.
const AI_MODEL = process.env.GEMINI_MODEL || "gemini-3.7-flash";
const STATUS_VALUES = ["Applied", "Interviewing", "Offer", "Rejected"];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const JOB_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "The job title/role being applied for" },
    company: { type: "string", description: "The hiring company's name" },
    status: {
      type: "string",
      enum: STATUS_VALUES,
      description: "Always \"Applied\" unless the posting text itself states otherwise",
    },
    appliedDate: {
      type: "string",
      description: "ISO date (YYYY-MM-DD) only if an application/posting date is explicitly present, otherwise omit",
    },
    notes: {
      type: "string",
      description: "A short, factual 1-3 sentence summary of the role (not marketing language)",
    },
  },
  required: ["title", "company", "status"],
  additionalProperties: false,
};

router.post("/extract-job", async (req, res) => {
  const { text } = req.body ?? {};

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Missing job posting text" });
  }

  if (text.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({ error: "Job posting text is too long" });
  }

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: `Extract the job application details from this job posting text:\n\n${text}`,
      config: {
        systemInstruction:
          "You extract structured job application data from pasted job postings. Only report information actually present in the text - never invent a company, title, or date. Keep notes factual and brief.",
        responseMimeType: "application/json",
        responseJsonSchema: JOB_SCHEMA,
        // Fail fast instead of hanging until nginx returns a 504 (60s) or
        // undici gives up waiting for headers (5 min).
        httpOptions: { timeout: AI_TIMEOUT_MS },
      },
    });

    const job = JSON.parse(response.text);
    return res.status(200).json({ job });
  } catch (err) {
    console.error("[ai/extract-job]", err?.name, err?.message, err?.cause?.code ?? "");
    return res.status(502).json({ error: "AI extraction failed, try filling in the form manually" });
  }
});

module.exports = router;
