import axios from "axios";
import Groq from "groq-sdk";
import { env } from "../config/evn.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export async function generateProductDescription(productName: string, category?: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are a professional e-commerce copywriter.",
      },
      {
        role: "user",
        content: `Write exactly 3 short sentences describing a product.

Product: ${productName}
Category: ${category ?? "General"}
Keep it under 80 words.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 100,
  });


const content = completion.choices?.[0]?.message?.content;

    if (content) {
      return content.trim();
    }

}

export async function generateInventorySummary(data: any) {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.1:latest",
        prompt: `
You are an inventory management assistant.

Here is inventory data:
${JSON.stringify(data, null, 2)}

Generate a concise executive summary.
Include:
- Total products
- Low stock warning
- General health
- Restock recommendations

Keep it professional and clear.
`,
        stream: false,
      }
    );

    return response.data.response.trim();
  } catch (error) {
    console.error("AI Summary error:", error);
    return "Unable to generate summary at the moment.";
  }
}
