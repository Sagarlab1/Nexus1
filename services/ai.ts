import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();
const LOCAL_STORAGE_KEY = 'gemini_api_key';

/**
 * Validates a given API key by making a simple, low-cost call.
 * @param apiKey The API key to validate.
 * @returns A GoogleGenAI instance if the key is valid.
 * @throws An error if the key is invalid.
 */
async function validateAndCreateAi(apiKey: string): Promise<GoogleGenAI> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("La clave de API no puede estar vacía.");
  }
  const tempAi = new GoogleGenAI({ apiKey });
  try {
    // A simple, fast validation call to ensure the key is valid.
    await tempAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: 'validation_ping' }] },
        config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return tempAi;
  } catch (error: any) {
    console.error("API Key validation failed:", error);
    if (error.message.includes('API key not valid')) {
      throw new Error("La clave de API proporcionada no es válida.");
    }
    throw new Error(`Falló la validación de la clave: ${error.message}`);
  }
}

/**
 * Tries to initialize the AI service from localStorage or environment variables.
 * @returns {Promise<boolean>} True if initialization was successful, false otherwise.
 */
export async function initializeAi(): Promise<boolean> {
  if (ai) return true;

  // 1. Try localStorage first
  const storedApiKey = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedApiKey) {
    try {
      ai = await validateAndCreateAi(storedApiKey);
      console.log("AI service initialized from localStorage.");
      return true;
    } catch (error) {
      console.warn("Stored API key is invalid, clearing it.", error);
      clearApiKey(); // Clear invalid key
    }
  }

  // 2. Fallback to environment variable
  const envApiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (envApiKey) {
    try {
      ai = await validateAndCreateAi(envApiKey);
      localStorage.setItem(LOCAL_STORAGE_KEY, envApiKey); // Cache the valid key
      console.log("AI service initialized from environment variable and cached.");
      return true;
    } catch (error) {
       console.error("Environment variable API key is invalid.", error);
    }
  }

  return false; // No valid key found
}

/**
 * Sets and initializes the AI with a user-provided API key.
 * @param apiKey The user-provided API key.
 */
export async function setAndInitializeAi(apiKey: string): Promise<void> {
    ai = await validateAndCreateAi(apiKey);
    localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
    chatSessions.clear();
    console.log("AI service initialized with user-provided key.");
}

/**
 * Clears the stored API key and resets the AI service.
 */
export function clearApiKey(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  ai = null;
  chatSessions.clear();
  console.log("API key cleared and AI service reset.");
}


function getChat(agent: Agent): Chat {
  if (!ai) {
    throw new Error("El cliente de IA no ha sido inicializado. Esto no debería ocurrir si la app se cargó correctamente.");
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
    throw new Error("El cliente de IA no está disponible. Por favor, refresca la página.");
  }
  
  const chat = getChat(agent);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error: any) {
    console.error("Error generating response from Gemini:", error);
    if (error.message.includes('API key not valid')) {
        clearApiKey();
        throw new Error("La clave de API ha dejado de ser válida. Por favor, configúrala de nuevo.");
    }
    throw new Error("Hubo un problema al comunicarse con el agente de IA.");
  }
}