
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();
const API_KEY_STORAGE_KEY = 'nexus_sapiens_api_key';

/**
 * Attempts to initialize the GoogleGenAI client using a key from localStorage or environment variables.
 * @returns {Promise<boolean>} - True if initialization is successful, false if no key is found.
 * @throws {Error} - If the key is present but invalid.
 */
export async function initializeAi(): Promise<boolean> {
  if (ai) return true; // Already initialized

  let apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);

  if (!apiKey) {
    // Fallback to environment variable if no key in localStorage
    // This supports deployments where the key is pre-configured
    apiKey = process.env.NEXT_PUBLIC_API_KEY || null;
  }
  
  if (!apiKey) {
    return false; // No key found anywhere
  }

  try {
    const newAi = new GoogleGenAI({ apiKey });
    ai = newAi;
    chatSessions.clear();
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey); // Cache the key if it came from env var
    console.log("GoogleGenAI initialized successfully.");
    return true;
  } catch (e: any) {
    console.error("Failed to initialize GoogleGenAI:", e.message);
    // Clear invalid key from storage
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    throw new Error(`The provided API Key is invalid. Please check it. Error: ${e.message}`);
  }
}

/**
 * Sets and validates a new API key, then initializes the AI client.
 * @param {string} apiKey - The Google Gemini API key.
 * @throws {Error} - If the key is invalid.
 */
export async function setAndInitializeAi(apiKey: string): Promise<void> {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error("API Key cannot be empty.");
  }

  try {
    const newAi = new GoogleGenAI({ apiKey });
    ai = newAi;
    chatSessions.clear();
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    console.log("GoogleGenAI initialized successfully with provided key.");
  } catch (e: any) {
    console.error("Failed to initialize GoogleGenAI with provided key:", e.message);
    ai = null;
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    throw new Error(`The provided API Key is invalid. Error: ${e.message}`);
  }
}

/**
 * Clears the stored API key and resets the AI client.
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  ai = null;
  chatSessions.clear();
  console.log("API Key cleared.");
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