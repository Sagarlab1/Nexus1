import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
let isInitialized = false;
const chatSessions = new Map<string, Chat>();
const API_KEY_STORAGE_KEY = 'nexus_sapiens_api_key';

/**
 * Initializes the AI service by checking localStorage and then environment variables.
 * @returns {Promise<boolean>} True if initialization is successful, false if a key is needed.
 */
export async function initializeAi(): Promise<boolean> {
  if (isInitialized && ai) return true;

  let apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);

  if (!apiKey) {
    apiKey = process.env.NEXT_PUBLIC_API_KEY || null;
  }

  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
      isInitialized = true;
      // Cache the key in localStorage if it came from env var
      if (!localStorage.getItem(API_KEY_STORAGE_KEY)) {
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      }
      chatSessions.clear();
      console.log("AI service initialized from stored/env key.");
      return true;
    } catch (error) {
        console.error("Failed to initialize with stored/env key", error);
        // Clear bad key
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        ai = null;
        isInitialized = false;
        return false;
    }
  }

  return false; // No key found, prompt user.
}

/**
 * Sets and validates a user-provided API key.
 * @param {string} apiKey The API key provided by the user.
 * @throws {Error} If the API key is invalid.
 */
export async function setAndInitializeAi(apiKey: string): Promise<void> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("La clave de API no puede estar vacía.");
  }

  try {
    // Validate the key by making a lightweight test call.
    const tempAi = new GoogleGenAI({ apiKey });
    const tempChat = tempAi.chats.create({ model: 'gemini-2.5-flash' });
    await tempChat.sendMessage({ message: "hello" }); // Validation call
    
    // If validation succeeds, set the main AI instance
    ai = tempAi;
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    isInitialized = true;
    chatSessions.clear();
    console.log("AI service initialized with user-provided key.");
  } catch (error: any) {
    console.error("Failed to initialize with provided API key:", error);
    ai = null;
    isInitialized = false;
    throw new Error("La clave de API proporcionada no es válida. Por favor, verifícala e intenta de nuevo.");
  }
}

/**
 * Clears the stored API key and resets the AI service.
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  ai = null;
  isInitialized = false;
  chatSessions.clear();
  console.log("API Key cleared.");
}

function getChat(agent: Agent): Chat {
  if (!ai || !isInitialized) {
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
   if (!ai || !isInitialized) {
    return "Error: El servicio de IA no está inicializado. Por favor, configura tu API Key.";
  }
  
  const chat = getChat(agent);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error generating response from Gemini:", error);
     if (error.message.includes('API key not valid')) {
        return "Error: La clave de API configurada no es válida. Por favor, cámbiala usando el botón en el panel izquierdo.";
    }
    return `Lo siento, ocurrió un error al contactar al agente: ${error.message}`;
  }
}