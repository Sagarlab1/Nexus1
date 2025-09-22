import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

/**
 * Initializes the GoogleGenAI client using the API_KEY from environment variables.
 * Throws an error if the API key is not found or invalid.
 */
export async function initializeAi(): Promise<void> {
  console.log("Intentando inicializar el servicio de IA desde variables de entorno...");

  const apiKey = process.env.API_KEY;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    console.error("Error: La variable de entorno API_KEY no está configurada o está vacía.");
    throw new Error("La variable de entorno API_KEY no está configurada. Por favor, configúrala en tu entorno de despliegue.");
  }
  
  console.log("Clave de API encontrada en variables de entorno. Inicializando GoogleGenAI...");

  try {
    ai = new GoogleGenAI({ apiKey });
    // A test call could be made here to validate the key, but for now we assume it's valid if it initializes
    chatSessions.clear(); // Clear any previous chat sessions if re-initializing
    console.log("GoogleGenAI inicializado exitosamente.");
  } catch (e: any) {
    console.error("Fallo al inicializar GoogleGenAI:", e.message);
    throw new Error(`La API_KEY proporcionada parece ser inválida. Error: ${e.message}`);
  }
}

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
  return response.text;
}