// @google/genai API client
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

/**
 * Initializes the GoogleGenAI client.
 * It uses the process.env.API_KEY environment variable, which is assumed to be available.
 * This must be called before any other function in this service.
 */
// FIX: Updated to align with @google/genai guidelines.
export function initializeAi(): void {
  // Per guidelines, the API key is provided via process.env.API_KEY and assumed to be valid.
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  // Clear any previous chat sessions if re-initializing
  chatSessions.clear();
}

/**
 * Retrieves an existing chat session for a given agent or creates a new one.
 * Throws an error if the AI client has not been initialized.
 * @param agent The AI agent for which to get the chat session.
 * @returns A Chat instance.
 */
function getChat(agent: Agent): Chat {
  if (!ai) {
    throw new Error("AI client has not been initialized. Please call initializeAi first.");
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
 * @param agent The agent to interact with.
 * @param message The user's message.
 * @returns A promise that resolves to the agent's text response.
 */
export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
   if (!ai) {
    throw new Error("AI client has not been initialized. Please call initializeAi first.");
  }
  const chat = getChat(agent);
  const response: GenerateContentResponse = await chat.sendMessage({ message });
  return response.text;
}
