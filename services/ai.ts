// @google/genai API client
// FIX: Implement the AI service to resolve module errors and provide chat functionality.
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Agent } from '../types';

/**
 * According to the guidelines, the API key must be obtained exclusively from 
 * the environment variable `process.env.API_KEY`.
 */
// Correct: Initialization with a named `apiKey` parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Use a Map to store and retrieve ongoing chat sessions for different agents.
const chatSessions = new Map<string, Chat>();

/**
 * Retrieves an existing chat session for a given agent or creates a new one.
 * This ensures that conversation history is maintained separately for each agent.
 * @param agent The AI agent for which to get the chat session.
 * @returns A Chat instance.
 */
function getChat(agent: Agent): Chat {
  if (chatSessions.has(agent.id)) {
    return chatSessions.get(agent.id)!;
  }

  // Correct: Use the recommended 'gemini-2.5-flash' model for text tasks.
  // The agent's specific prompt is passed as a system instruction.
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
  const chat = getChat(agent);

  // Correct: Use chat.sendMessage for conversation history.
  const response: GenerateContentResponse = await chat.sendMessage({ message });
  
  // Correct: Extract the text response directly from the `text` property.
  return response.text;
}
