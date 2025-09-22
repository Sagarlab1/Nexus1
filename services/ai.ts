import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();
const API_KEY_STORAGE_KEY = 'nexus_sapiens_api_key';

/**
 * Validates an API key by attempting to create a GoogleGenAI instance.
 * @param apiKey The API key to validate.
 * @returns True if the key is structurally valid, false otherwise.
 */
async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === '') return false;
  try {
    // This is a lightweight check. The real validation happens on the first API call.
    new GoogleGenAI({ apiKey });
    return true;
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
}

/**
 * Attempts to initialize the AI service from localStorage or environment variables.
 * @returns {Promise<boolean>} True if initialization was successful, false otherwise.
 */
export async function initializeAi(): Promise<boolean> {
  if (ai) return true;

  let apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);

  if (!apiKey) {
    apiKey = process.env.NEXT_PUBLIC_API_KEY || null;
  }

  if (apiKey) {
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      ai = new GoogleGenAI({ apiKey });
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      console.log("AI service initialized successfully.");
      return true;
    }
  }
  
  clearApiKey(); // Ensure clean state if initialization fails
  return false;
}

/**
 * Sets a new API key, initializes the AI service with it, and stores it.
 * @param apiKey The user-provided API key.
 * @throws {Error} If the API key is invalid.
 */
export async function setAndInitializeAi(apiKey: string): Promise<void> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("La clave de API no puede estar vacía.");
  }
  
  const isValid = await validateApiKey(apiKey);
  if (!isValid) {
      throw new Error("La clave de API proporcionada no es válida.");
  }

  ai = new GoogleGenAI({ apiKey });
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  chatSessions.clear(); // Reset chat sessions with the new key
  console.log("AI service set and initialized with new key.");
}

/**
 * Clears the stored API key and resets the AI service.
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  ai = null;
  chatSessions.clear();
  console.log("API Key and AI service cleared.");
}

/**
 * Retrieves the currently stored API key.
 * @returns The API key or null if not set.
 */
export function getApiKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
}


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

export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
   if (!ai) {
    return "Error: El servicio de IA no está inicializado. Por favor, configura tu clave de API.";
  }
  
  const chat = getChat(agent);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error generating response from Gemini:", error);
     if (error.message.includes('API key not valid')) {
        clearApiKey();
        // Reloading the page will force the user to re-enter the key.
        setTimeout(() => window.location.reload(), 1000); 
        return "Error: Tu clave de API no es válida o ha expirado. La página se recargará para que puedas introducir una nueva.";
    }
    return `Lo siento, ocurrió un error al contactar al agente: ${error.message}`;
  }
}