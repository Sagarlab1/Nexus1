
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// This is a Vercel serverless function, which acts as our secure backend.
// To deploy, you must set the API_KEY as an environment variable in your Vercel project settings.

// Vercel Edge Functions have a standard request/response format.
// We disable the default body parser to handle the raw stream if needed, though here we use JSON.
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  // 1. Check for the API key on the server-side.
  if (!process.env.API_KEY) {
    return new Response(JSON.stringify({ error: 'API key no configurada en el servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Initialize the AI SDK securely on the backend.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // 3. Get the user's message and the agent's prompt from the frontend request.
    const { message, prompt } = await req.json();

    if (!message || !prompt) {
        return new Response(JSON.stringify({ error: 'Falta el mensaje o el prompt en la solicitud.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    // 4. Make the actual call to the Gemini API.
    // Using generateContent is stateless and efficient for serverless functions.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
            systemInstruction: prompt,
        },
    });

    // 5. Send the generated text back to the frontend.
    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error en la función del servidor al llamar a Gemini:", error);
    const errorMessage = error.message || "Un error desconocido ocurrió en el servidor.";
    return new Response(JSON.stringify({ error: `Error del servidor: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
