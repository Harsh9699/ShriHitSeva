import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        { role: 'model', parts: [{ text: 'Radhe Radhe! I am your Harivanshi Guru AI.' }] },
        { role: 'user', parts: [{ text: 'shei harivansh' }] }
      ],
      config: {
        systemInstruction: 'You are an Indian male spiritual guru...',
        tools: [{
          functionDeclarations: [{
            name: 'search_scriptures',
            description: 'Search',
            parameters: {
              type: 'OBJECT',
              properties: {
                search_query: {
                  type: 'STRING',
                  description: 'desc'
                }
              },
              required: ['search_query']
            }
          }]
        }]
      }
    });
    console.log('SUCCESS:', response.functionCalls);
  } catch (e: any) {
    console.error('ERROR:', e.message);
  }
}

test();
