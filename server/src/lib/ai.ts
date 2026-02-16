import axios from "axios";
import { env } from "../config/evn.js";

export async function generateProductDescription(
  productName: string,
  category?: string
) {
  const response = await axios.post(
    `http://localhost:11434/api/generate`,
    {
      model: "phi3",
      prompt: `
Write a professional 3 sentence product description.

Product: ${productName}
Category: ${category ?? "General"}
`,
      stream: false,
    }
  );

  return response.data.response.trim();
}
export async function generateInventorySummary(data: any) {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi3",
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
