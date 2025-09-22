import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

const API_KEY_STORAGE_KEY = 'nexus_sapiens_api_key';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

async function isApiKeyValid(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  try {
    const testAi = new GoogleGenAI({ apiKey });
    const chat = testAi.chats.create({ model: 'gemini-2.5-flash' });
    await chat.sendMessage({ message: 'test' });
    return true;
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
}

/**
 * Tries to initialize the AI service.
 * It checks localStorage first, then environment variables.
 * @returns {Promise<boolean>} - True if already initialized or successfully initialized. False if a key is needed.
 */
export async function initializeAi(): Promise<boolean> {
  if (ai) return true;

  const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedApiKey) {
    if (await isApiKeyValid(storedApiKey)) {
      ai = new GoogleGenAI({ apiKey: storedApiKey });
      chatSessions.clear();
      console.log("AI initialized from localStorage.");
      return true;
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }

  const envApiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (envApiKey) {
    if (await isApiKeyValid(envApiKey)) {
      ai = new GoogleGenAI({ apiKey: envApiKey });
      localStorage.setItem(API_KEY_STORAGE_KEY, envApiKey);
      chatSessions.clear();
      console.log("AI initialized from environment variable and cached.");
      return true;
    }
  }

  return false;
}

/**
 * Sets a new API key, validates it, initializes the AI service, and stores the key.
 * @throws {Error} - If the provided key is invalid.
 */
export async function setAndInitializeAi(apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("La clave de API no puede estar vacía.");
  }

  if (await isApiKeyValid(apiKey)) {
    ai = new GoogleGenAI({ apiKey });
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    chatSessions.clear();
    console.log("AI successfully initialized with provided key.");
    return true;
  }
  
  throw new Error("La clave de API proporcionada no es válida.");
}

/**
 * Clears the stored API key and resets the AI service.
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  ai = null;
  chatSessions.clear();
  console.log("API key cleared.");
}

function getChat(agent: Agent): Chat {
  if (!ai) {
    throw new Error("El cliente de IA no ha sido inicializado. This should not happen if the app flow is correct.");
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
    return "Error crítico: El servicio de IA no está inicializado. Por favor, configura tu clave de API.";
  }
  const chat = getChat(agent);
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error generating response from Gemini:", error);
     if (error.message.includes('API key not valid')) {
        clearApiKey();
        window.location.reload();
        return "Error: La clave de API ha dejado de ser válida. La página se recargará para que puedas introducir una nueva.";
    }
    return `Lo siento, ocurrió un error al contactar al agente: ${error.message}`;
  }
}