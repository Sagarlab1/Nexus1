import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types.ts';

let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;
const chatSessions = new Map<string, Chat>();

export function setApiKey(apiKey: string): void {
  if (apiKey && apiKey !== currentApiKey) {
    ai = new GoogleGenAI({ apiKey });
    currentApiKey = apiKey;
    chatSessions.clear();
  }
}

function getAiInstance(): GoogleGenAI {
  if (!ai) {
    throw new Error("La clave API no ha sido configurada. Llama a setApiKey() primero.");
  }
  return ai;
}

function getChat(agent: Agent): Chat {
  if (chatSessions.has(agent.id)) {
    return chatSessions.get(agent.id)!;
  }
  
  const aiInstance = getAiInstance();

  const chat = aiInstance.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: agent.prompt,
    },
  });

  chatSessions.set(agent.id, chat);
  return chat;
}

export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
  try {
    const chat = getChat(agent);
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error al generar respuesta desde Gemini:", error);
    if (error.message && error.message.includes('API key not valid')) {
        throw new Error("La clave API proporcionada no es válida. Por favor, verifica e inténtalo de nuevo.");
    }
    throw error;
  }
}

/**
 * Validates an API key by making a simple test call.
 * @param apiKey The API key to validate.
 * @returns True if the key is valid, false otherwise.
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey) return false;
    try {
        const testAi = new GoogleGenAI({ apiKey });
        // Using generateContent directly for a simple, stateless check
        await testAi.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'test',
        });
        return true;
    } catch (error) {
        console.error("API Key validation failed:", error);
        return false;
    }
}
