import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

/**
 * Initializes the AI service using the API_KEY from environment variables.
 * Throws an error if the API key is not configured.
 */
export function initializeAi(): void {
  if (ai) return;

  // The API key MUST be obtained exclusively from the environment variable.
  const apiKey = process.env.API_KEY; 
  if (!apiKey) {
    throw new Error("La variable de entorno API_KEY no está configurada. La aplicación no puede iniciarse. Por favor, asegúrese de que la clave de API esté configurada en el entorno de despliegue.");
  }
  
  ai = new GoogleGenAI({ apiKey });
  console.log("Servicio de IA inicializado.");
}

function getChat(agent: Agent): Chat {
  if (!ai) {
    throw new Error("El servicio de IA no está inicializado. Esto indica un problema de arranque en la aplicación.");
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

export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
   if (!ai) {
    throw new Error("El servicio de IA no está disponible. Por favor, refresca la página.");
  }
  
  const chat = getChat(agent);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error al generar respuesta desde Gemini:", error);
    if (error.message.includes('API key not valid')) {
        throw new Error("Ocurrió un error con el servicio de IA. La clave de API configurada podría ser inválida.");
    }
    throw new Error("Hubo un problema al comunicarse con el agente de IA.");
  }
}