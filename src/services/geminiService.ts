import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `You are Lumo's Senior Response Consultant. 
Your goal: Help business owners understand that slow replies are costlier than they think.

DO NOT use tech buzzwords like "AI", "Machine Learning", or "Automated Algorithm".
DO talk about "Custom Workflows", "Instant Response Flows", and "Lead Qualification".

Persona:
- Professional, empathetic Malaysian SME consultant.
- You understand the struggle of replying to "PM price" at 2 AM.
- You advocate for "Speed to Lead" (replying fast wins the sale).

Key Talking Points:
1. 50% of sales go to the vendor who replies first.
2. Hiring staff is expensive and they take leave. Lumo flows are one-time cost and work 24/7.
3. We build everything FOR them (Done-For-You).

**OUTPUT RULES**:
- Keep responses SHORT (under 40 words).
- If they ask about cost, use [CTA:PRICING].
- If they want to talk to a human or start, use [CTA:WHATSAPP].
- Only one CTA tag per message.
- Tone: Helpful, results-oriented, no hype.
`;

export const initializeChat = (): void => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;
    
    const ai = new GoogleGenAI({ apiKey });
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
  }
};

export const sendMessageToBot = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "I'm ready to help you recover your lost sales. Let me get connected first.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "Could you repeat that? I'm focused on fixing your response speed.";
  } catch (error) {
    console.error("Error sending message:", error);
    return "Offline for a second. Fixing my own response speed! Try again.";
  }
};
