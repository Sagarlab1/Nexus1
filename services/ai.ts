// @google/genai API client
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

// FIX: Per coding guidelines, the API key must be obtained from process.env.API_KEY. This also resolves the TypeScript error.
const API_KEY = process.env.API_KEY;

/**
 * Initializes the GoogleGenAI client.
 * Throws an error if the API key is not found or invalid.
 */
export function initializeAi(): void {
  if (!API_KEY) {
    // FIX: Updated error message to reference the correct environment variable name.
    throw new Error("La variable de entorno API_KEY no está configurada.");
  }
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
    // Clear any previous chat sessions if re-initializing
    chatSessions.clear();
  } catch (e: any) {
    console.error("Failed to initialize GoogleGenAI:", e);
    throw new Error(`La API Key proporcionada es inválida. Verifica que sea correcta y que la API esté habilitada en tu proyecto de Google Cloud.`);
  }
}

/**
 * Retrieves an existing chat session for a given agent or creates a new one.
 * Throws an error if the AI client has not been initialized.
 * @param agent The AI agent for which to get the chat session.
 * @returns A Chat instance.
 */
function getChat(agent: Agent): Chat {
  if (!ai) {
    throw new Error("AI client has not been initialized. Please call initializeAi first.");
  }

  if (chatSessions.has(agent.id)) {
    return chatSessions.get(agent.id)!;
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: agent.prompt,
    },
  });

  chatSessions.set(agent.id, chat);
  return chat;
}

/**
 * Sends a message to the specified agent and returns the generated text response.
 * @param agent The agent to interact with.
 * @param message The user's message.
 * @returns A promise that resolves to the agent's text response.
 */
export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
   if (!ai) {
    throw new Error("AI client has not been initialized. Please call initializeAi first.");
  }
  const chat = getChat(agent);
  const response: GenerateContentResponse = await chat.sendMessage({ message });
  return response.text;
}
