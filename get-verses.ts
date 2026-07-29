import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function main() {
  const prompt = `
Search the web and provide the exact verses from Dhruvdas's "Bhakta Namavali" (भक्त नामावली जी कृत ध्रुवदास), specifically from verse 29 to verse 42.

Here is the context:
- Verse 29 is:
"बृंदाबन रस माधुरी, गाई अधिक लड़ाइ ॥29॥"
or similar.

- Verse 41 is:
"रसिक व्यास के हीय में..." or similar.

We need ALL the verses from 29 to 42 in Hindi exactly as written in the original scripture. Please provide them in Hindi Devnagari script with verse numbers.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt
    });
    console.log("=== GEMINI RESPONSE ===");
    console.log(response.text);
    console.log("=======================");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

main();
