import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types.ts';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();
const API_KEY_STORAGE_KEY = 'nexus-sapiens-api-key';

/**
 * Checks if the AI service is configured and ready.
 */
export const isAiReady = (): boolean => !!ai;

/**
 * Tries to initialize the AI service from localStorage.
 * Returns true if successful, false otherwise.
 */
export function initializeAi(): boolean {
  if (ai) return true;

  try {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      ai = new GoogleGenAI({ apiKey: storedKey });
      console.log("Servicio de IA inicializado desde localStorage.");
      return true;
    }
  } catch (error) {
    console.warn("No se pudo acceder a localStorage. La API Key no se persistirá.", error);
  }
  
  return false;
}

/**
 * Sets and validates a new API key by making a test request.
 * Throws an error if the key is invalid.
 */
export async function setAndValidateApiKey(apiKey: string): Promise<void> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("La clave de API no puede estar vacía.");
  }
  const tempAi = new GoogleGenAI({ apiKey });
  try {
    // A simple, low-cost request to validate the key
    await tempAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hello',
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    
    // If validation succeeds, set the global instance and save to localStorage
    ai = tempAi;
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } catch (error) {
      console.warn("No se pudo guardar la API Key en localStorage. Funcionará solo para esta sesión.", error);
    }
    chatSessions.clear(); // Clear old chat sessions with the previous key
    console.log("Nueva clave de API validada y guardada.");
  } catch (error: any) {
    console.error("Error de validación de API key:", error);
    // Provide a more user-friendly error message
    if (error.message && (error.message.includes('API key not valid') || error.message.includes('permission'))) {
        throw new Error("La clave de API proporcionada no es válida o no tiene los permisos necesarios.");
    }
    throw new Error("No se pudo verificar la clave de API. Verifica tu conexión a internet y que la clave sea correcta.");
  }
}

/**
 * Clears the stored API key and resets the AI service.
 */
export function clearApiKey(): void {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
       console.warn("No se pudo eliminar la API Key de localStorage.", error);
    }
    ai = null;
    chatSessions.clear();
    console.log("Clave de API eliminada.");
}

function getChat(agent: Agent): Chat {
  if (!ai) {
    throw new Error("El servicio de IA no está inicializado. Por favor, configura tu clave de API.");
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
   if (!isAiReady()) {
    return Promise.resolve(
      "Modo de demostración: La funcionalidad de chat está desactivada.\n\nPor favor, configura tu API Key desde el **Centro de Mando** para hablar con los agentes."
    );
  }
  
  const chat = getChat(agent);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error al generar respuesta desde Gemini:", error);
    if (error.message.includes('API key not valid')) {
        clearApiKey();
        // Force a reload to show the API key prompt again
        window.location.reload();
        throw new Error("La clave de API ha dejado de ser válida. Se requiere reconfiguración.");
    }
    throw new Error("Hubo un problema al comunicarse con el agente de IA.");
  }
}