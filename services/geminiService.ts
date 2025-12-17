import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Obtém a chave de API das variáveis de ambiente do Vite.
 * O prefixo VITE_ é obrigatório para que a Vercel exponha a chave ao navegador.
 */
const getApiKey = (): string => {
  return (import.meta.env.VITE_API_KEY as string) || "";
};

/**
 * Gera sugestões de ações corretivas usando o modelo Gemini.
 */
export const getCorrectiveActionSuggestion = async (
  checklistTitle: string, 
  itemText: string
): Promise<string> => {
  
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("ERRO: VITE_API_KEY não encontrada no ambiente.");
    return "Erro de configuração: Chave de API não encontrada na Vercel.";
  }

  // Inicializa o SDK oficial da Google
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Utilizamos o modelo 1.5-flash por ser rápido e eficiente para sugestões curtas
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `Você é um especialista em controle de qualidade. Para o checklist "${checklistTitle}", o item "${itemText}" foi marcado como não conforme. Forneça exatamente 3 sugestões de ações corretivas curtas e diretas. Use apenas texto com marcadores simples.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || "Nenhuma sugestão gerada pelo modelo.";
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return "Não foi possível obter sugestões no momento. Verifique se a chave na Vercel é válida.";
  }
};
