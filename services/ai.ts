import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

/**
 * Initializes the GoogleGenAI client.
 * The API key must be provided via the process.env.API_KEY environment variable.
 */
export async function initializeAi(): Promise<void> {
  // FIX: Per guidelines, API key must come exclusively from process.env.API_KEY.
  // Removed logic for localStorage, environment fallbacks, and user-provided keys.
  const apiKey = process.env.API_KEY;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    console.error("API_KEY environment variable not set or empty.");
    // App.tsx will handle this error to show a message.
    throw new Error("NO_API_KEY");
  }

  try {
    // FIX: Per guidelines, apiKey must be a named parameter.
    ai = new GoogleGenAI({ apiKey });
    chatSessions.clear();
    console.log("GoogleGenAI inicializado exitosamente.");
  } catch (e: any) {
    console.error("Fallo al inicializar GoogleGenAI con la clave proporcionada:", e.message);
    throw new Error(`La API Key proporcionada no es válida. Por favor, revísala. Error: ${e.message}`);
  }
}

// FIX: Removed setApiKey and clearApiKey functions as per guidelines disallowing user-managed keys.


/**
 * Retrieves an existing chat session for a given agent or creates a new one.
 * Throws an error if the AI client has not been initialized.
 */
function getChat(agent: Agent): Chat {
  if (!ai) {
    throw new Error("El cliente de IA no ha sido inicializado.");
  }

  if (chatSessions.has(agent.id)) {
    return chatSessions.get(agent.id)!;
  }

  const chat = ai.chats.create({
    // FIX: Per guidelines, use a supported model. 'gemini-2.5-flash' is correct.
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
 */
export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
   if (!ai) {
    throw new Error("El cliente de IA no ha sido inicializado.");
  }
  const chat = getChat(agent);
  const response: GenerateContentResponse = await chat.sendMessage({ message });
  // FIX: Per guidelines, response.text is the correct way to get the text.
  return response.text;
}
