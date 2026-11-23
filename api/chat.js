
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido."
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "A chave da inteligência artificial ainda não foi configurada."
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Digite uma mensagem válida."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Sua mensagem é muito longa."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-6.2-astra",
          instructions:
            "Você é o NEXUS AI, um assistente inteligente, educado e prestativo. Responda em português brasileiro.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da OpenAI:", data);
      return res.status(502).json({
        error: "Não foi possível obter uma resposta da IA."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Não consegui gerar uma resposta."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno do servidor."
    });
  }
}
