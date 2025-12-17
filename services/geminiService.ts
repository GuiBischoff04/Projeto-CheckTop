
import { GoogleGenAI } from "@google/genai";

// Função para obter a chave de API de forma segura em diferentes ambientes (Vite, Next.js, etc)
const getApiKey = () => {
    let key = '';
    
    // 1. Tenta process.env (Node.js / Webpack / Vercel System Env) com try/catch para evitar crash no browser
    try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env) {
            // @ts-ignore
            key = process.env.API_KEY || process.env.VITE_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
        }
    } catch (e) {
        // Ignora erro se process não estiver definido (comum em navegadores puros)
    }

    // 2. Tenta import.meta.env (Padrão do Vite)
    if (!key) {
        try {
            // @ts-ignore
            if (typeof import.meta !== 'undefined' && import.meta.env) {
                // @ts-ignore
                key = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
            }
        } catch (e) {
             // Ignora erro se import.meta não for suportado
        }
    }

    if (!key) {
      console.warn("API_KEY não encontrada nas variáveis de ambiente. Configure VITE_API_KEY no seu provedor de hospedagem.");
      return "CHAVE_NAO_CONFIGURADA";
    }
    return key;
};

// Inicializa a IA com a chave obtida (ou string de erro, que será tratada na chamada)
const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getCorrectiveActionSuggestion = async (checklistTitle: string, itemText: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (apiKey === "CHAVE_NAO_CONFIGURADA") {
        return "Erro de Configuração: Chave de API não encontrada. Adicione a variável 'VITE_API_KEY' nas configurações do seu projeto na Vercel.";
    }

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
    if (error instanceof Error) {
        // Mensagens amigáveis para erros comuns
        if (error.message.includes('API key not valid')) {
             return "Erro: A chave da API é inválida.";
        }
        if (error.message.includes('403')) {
            return "Erro: Acesso negado (403). Verifique se a chave tem permissões ou cota.";
        }
    }
    return "Ocorreu um erro ao buscar sugestões. Tente novamente mais tarde.";
  }
};
