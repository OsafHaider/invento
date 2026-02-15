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

export async function generateLowStockAlert(
  productName: string,
  quantity: number
) {
  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "phi3",
      prompt: `
Generate a short professional stock warning.

Product: ${productName}
Remaining Quantity: ${quantity}

Make it concise and suitable for inventory dashboard.
`,
      stream: false,
    }
  );

  return response.data.response.trim();
}
