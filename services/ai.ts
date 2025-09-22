
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

/**
 * Initializes the GoogleGenAI client using the API_KEY from environment variables.
 * Throws an error if the API key is not found or invalid.
 */
export function initializeAi(): void {
  console.log("Iniciando el servicio de IA...");
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Error: La variable de entorno API_KEY no está definida.");
    throw new Error("API Key no encontrada. Asegúrate de que la variable de entorno `API_KEY` esté configurada y que el proyecto se haya redesplegado.");
  }
  
  console.log("API Key encontrada. Inicializando GoogleGenAI...");

  try {
    ai = new GoogleGenAI({ apiKey });
    // Clear any previous chat sessions if re-initializing
    chatSessions.clear();
    console.log("GoogleGenAI inicializado exitosamente.");
  } catch (e: any) {
    console.error("Fallo al inicializar GoogleGenAI:", e.message);
    throw new Error(`La API Key parece ser inválida o ha ocurrido un error de red. Por favor, verifica la clave y tu conexión.`);
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
