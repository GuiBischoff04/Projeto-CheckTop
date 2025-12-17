
import { GoogleGenAI } from "@google/genai";

/**
 * Obtém a chave de API de forma segura.
 * Em ambientes de frontend puros ou previews, 'process' pode não estar definido.
 * Esta abordagem evita o erro 'ReferenceError: process is not defined' que causa a tela branca.
 */
const getApiKey = (): string => {
  try {
    // Tenta obter do process.env (injetado pelo Vercel ou shims de ambiente)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Silenciosamente ignora se o process não existir
  }
  
  // Tenta obter do import.meta.env (Padrão Vite/Vercel moderno)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Silenciosamente ignora se import.meta não for suportado
  }

  return "";
};

/**
 * Sugere ações corretivas com base no item não conforme.
 * @param checklistTitle Título do checklist
 * @param itemText Texto do item que apresentou falha
 */
export const getCorrectiveActionSuggestion = async (checklistTitle: string, itemText: string): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("VITE_API_KEY ou API_KEY não encontrada nas variáveis de ambiente.");
    return "Erro de configuração: Chave de API não encontrada. Certifique-se de adicioná-la no painel do Vercel como VITE_API_KEY.";
  }

  // Inicializa a instância da API dentro da função ou sob demanda para garantir que a chave esteja carregada
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um especialista em controle de qualidade. Para o checklist "${checklistTitle}", o item "${itemText}" foi marcado como não conforme. Forneça 3 sugestões de ações corretivas curtas e diretas. Use apenas texto com marcadores.`,
    });

    return response.text || "Nenhuma sugestão gerada.";
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return "Não foi possível obter sugestões no momento. Verifique sua conexão e a validade da chave API.";
  }
};
