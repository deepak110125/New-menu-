import { GoogleGenAI, Chat } from "@google/genai";
import { MENU_ITEMS } from "../constants";

let chatSession: Chat | null = null;

// Initialize the chat session with context about the menu
export const initChatSession = async () => {
  if (chatSession) return chatSession;

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found for Gemini.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Construct a context string from the menu data
    const menuContext = MENU_ITEMS.map(item => 
      `- ${item.name} (${item.category}): ${item.description}. Price: $${item.basePrice}. Attributes: ${[
        item.isSpicy ? 'Spicy' : '',
        item.isVegetarian ? 'Vegetarian' : '',
        item.isGlutenFree ? 'Gluten-Free' : '',
        item.isChefsChoice ? "Chef's Choice" : '',
        item.isBestseller ? 'Bestseller' : ''
      ].filter(Boolean).join(', ')}. Pairing: ${item.pairingNote || 'Standard pairing'}`
    ).join('\n');

    const systemInstruction = `
      You are 'Sommelier AI', a sophisticated, friendly, and knowledgeable dining assistant for 'Lumière Dining'.
      
      Your goal is to help guests select dishes based on their preferences, dietary restrictions, or mood.
      You can also suggest wine or drink pairings.
      
      Here is the current menu:
      ${menuContext}
      
      Rules:
      1. Keep answers concise (under 3 sentences) unless asked for a detailed explanation.
      2. Be enthusiastic about the food.
      3. If asked about items not on the menu, politely steer them back to our offerings.
      4. Highlight "Chef's Choice" or "Bestseller" items when relevant.
    `;

    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview', // Fast model for chat
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat session", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const session = await initChatSession();
    if (!session) {
      return "I'm having trouble connecting to the kitchen right now. Please try again later.";
    }

    const result = await session.sendMessage({ message });
    return result.text || "I didn't quite catch that.";
  } catch (error) {
    console.error("Error sending message to Gemini", error);
    return "I apologize, but I'm momentarily distracted. Please ask again.";
  }
};