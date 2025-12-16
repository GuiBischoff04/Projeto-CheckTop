
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
    // In a real application, this would be handled by a secure environment variable process.
    // For this example, we assume `process.env.API_KEY` is available.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set.");
      // Fallback for environments where process.env is not available
      return "YOUR_API_KEY_HERE";
    }
    return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getCorrectiveActionSuggestion = async (checklistTitle: string, itemText: string): Promise<string> => {
  try {
    const prompt = `Você é um especialista em controle de qualidade e melhoria de processos. Para um checklist intitulado "${checklistTitle}", uma não conformidade foi encontrada para o item: "${itemText}". Por favor, forneça 3 sugestões concisas e acionáveis para ações corretivas. Formate a resposta como uma lista simples com marcadores. Retorne apenas a lista.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (response.text) {
        return response.text;
    }
    return "Não foi possível gerar sugestões no momento.";

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "Erro: A chave da API não é válida. Verifique suas credenciais.";
    }
    return "Ocorreu um erro ao buscar sugestões. Tente novamente mais tarde.";
  }
};
