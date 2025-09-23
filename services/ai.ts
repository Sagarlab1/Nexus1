import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types.ts';

// La instancia de IA se crea una sola vez utilizando la variable de entorno.
// Según las instrucciones, se asume que process.env.API_KEY está disponible y es válido.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatSessions = new Map<string, Chat>();

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
 * Genera una respuesta del agente especificado para un mensaje dado.
 * @param agent El agente a utilizar para generar la respuesta.
 * @param message El mensaje del usuario.
 * @returns La respuesta de texto del agente.
 */
export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
  const chat = getChat(agent);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error al generar respuesta desde Gemini:", error);
    // El error será capturado en App.tsx y mostrado al usuario.
    // El mensaje del SDK debería ser lo suficientemente informativo.
    throw error;
  }
}
