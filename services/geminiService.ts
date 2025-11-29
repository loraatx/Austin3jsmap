import { GoogleGenAI } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const sendMessageToGemini = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    // We construct the content manually for the single-turn generation or simplified chat
    // For a persistent chat, we would use ai.chats.create, but here we just want a quick response
    // based on the current context. To keep it simple and stateless for this demo, we'll just send the prompt.
    // However, if we want history, we should use the chat feature.
    
    // Let's use generateContent for simplicity with system instructions, as it's often cleaner for "Info queries"
    // But to support follow-up questions, we'll treat the prompt as the latest message.
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable search for real-time info
      }
    });

    // Check for grounding (search results)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let text = response.text || "I couldn't generate a response.";

    // Append sources if available
    if (chunks && chunks.length > 0) {
       const sources = chunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => `[${c.web.title}](${c.web.uri})`)
        .join(', ');
       if (sources) {
         text += `\n\nSources: ${sources}`;
       }
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while trying to reach the Austin knowledge base. Please try again.";
  }
};
