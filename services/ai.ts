import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types.ts';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

/**
 * Gets the singleton instance of the GoogleGenAI client, initializing it on first use.
 * This "lazy initialization" prevents the app from crashing if the API key is not
 * available at startup.
 * @returns The initialized GoogleGenAI instance.
 * @throws {Error} if the API_KEY environment variable is not set.
 */
function getAiInstance(): GoogleGenAI {
  if (!ai) {
    if (!process.env.API_KEY) {
      // This error will be caught by the App component, which shows a friendly screen.
      throw new Error("La variable de entorno API_KEY no está configurada.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

/**
 * Obtiene o crea una sesión de chat para un agente específico.
 * Esto preserva el historial de conversación con el modelo de IA.
 * @param agent El agente para el que se obtendrá la sesión de chat.
 * @returns Una instancia de Chat.
 */
function getChat(agent: Agent): Chat {
  if (chatSessions.has(agent.id)) {
    return chatSessions.get(agent.id)!;
  }
  
  const aiInstance = getAiInstance(); // Ensure AI is initialized

  const chat = aiInstance.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: agent.prompt,
    },
  });

  chatSessions.set(agent.id, chat);
  return chat;
}

/**
 * Genera una respuesta del agente especificado para un mensaje dado.
 * @param agent El agente a utilizar para generar la respuesta.
 * @param message El mensaje del usuario.
 * @returns La respuesta de texto del agente.
 */
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
    // El error será capturado en App.tsx y mostrado al usuario.
    // El mensaje del SDK debería ser lo suficientemente informativo.
    throw error;
  }
}