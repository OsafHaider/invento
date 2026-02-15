import axios from "axios";

export async function generateProductDescription(
  productName: string,
  category?: string
) {
  const response = await axios.post(
    "http://localhost:11434/api/generate",
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
