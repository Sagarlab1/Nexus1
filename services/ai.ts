
import type { Agent } from '../types.ts';

// No longer need to import GoogleGenAI or manage chat sessions on the client.

export async function generateResponse(
  agent: Agent,
  message: string
): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Send the system prompt and the user message to the backend
        prompt: agent.prompt,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error del servidor: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
    
  } catch (error: any) {
    console.error("Error al contactar el backend:", error);
    // Provide a user-friendly error message
    throw new Error("No se pudo obtener una respuesta del agente. Por favor, inténtalo de nuevo más tarde.");
  }
}

// The validateApiKey and setApiKey functions are no longer needed on the client.
