import { GoogleGenAI, Type } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        { role: 'model', parts: [{ text: 'Radhe Radhe!' }] },
        { role: 'user', parts: [{ text: 'shri harivansh' }] }
      ],
      config: {
        tools: [{
          functionDeclarations: [{
            name: 'search_scriptures',
            description: 'Search',
            parameters: {
              type: 'OBJECT',
              properties: {
                search_query: {
                  type: 'STRING',
                  description: 'Keywords'
                }
              },
              required: ['search_query']
            }
          }]
        }]
      }
    });
    console.log('SUCCESS:', response.text || response.functionCalls);
  } catch(e) {
    console.error('ERROR:', e);
  }
}

test();
