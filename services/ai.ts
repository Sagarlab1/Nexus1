// @google/genai API client
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

let ai: GoogleGenAI | null = null;
const chatSessions = new Map<string, Chat>();

/**
 * Initializes the GoogleGenAI client with the provided API key.
 * This must be called before any other function in this service.
 * @param apiKey The API key for the Google Gemini API.
 */
export function initializeAi(apiKey: string): void {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }
  ai = new GoogleGenAI({ apiKey });
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