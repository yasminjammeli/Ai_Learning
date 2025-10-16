const OpenAI = require("openai");
const Document = require("../models/Document");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // ta clé OpenRouter
  baseURL: "https://openrouter.ai/api/v1", // endpoint OpenRouter
});

// 🧠 Poser une question à partir d’un document
const askQuestion = async (req, res) => {
  try {
    const { docId, question } = req.body;

    if (!docId || !question) {
      return res.status(400).json({ message: "docId et question sont requis." });
    }

    const doc = await Document.findById(docId);
    if (!doc) {
      return res.status(404).json({ message: "Document introuvable." });
    }

    const prompt = `Réponds à la question suivante en te basant uniquement sur ce texte :
${doc.contenu}

Question : ${question}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // modèle OpenRouter (rapide et puissant)
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    res.status(200).json({
      answer: response.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("Erreur IA :", error);

    if (error.code === "insufficient_quota" || error.status === 429) {
      return res
        .status(429)
        .json({ message: "Quota OpenAI dépassé. Merci de réessayer plus tard." });
    }

    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// 📝 Génération automatique de quiz à partir d'un document
const generateQuiz = async (req, res) => {
  try {
    const { docId, nbQuestions } = req.body;

    if (!docId || !nbQuestions) {
      return res.status(400).json({ message: "docId et nbQuestions sont requis." });
    }

    const doc = await Document.findById(docId);
    if (!doc) {
      return res.status(404).json({ message: "Document introuvable." });
    }

    const prompt = `
Tu es un générateur de quiz. Génère exactement ${nbQuestions} questions à choix multiples (QCM) basées UNIQUEMENT sur le texte fourni ci-dessous.

RÈGLES IMPORTANTES :
1. Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après
2. Chaque question doit avoir exactement 4 options
3. Une seule option doit être correcte
4. Les questions doivent être pertinentes et basées sur le contenu du document
5. Varie la position de la réponse correcte (ne mets pas toujours la réponse correcte en premier)

FORMAT JSON STRICT (exemple) :
[
  {
    "question": "Quelle est la capitale de la France ?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correctAnswer": "Paris"
  }
]

Texte du document :
${doc.contenu}

Génère maintenant ${nbQuestions} questions au format JSON uniquement :`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Tu es un assistant qui répond uniquement en JSON valide. Ne génère jamais de texte en dehors du JSON." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    let quizData;
    const content = response.choices[0].message.content.trim();

    try {
      // Essai de parsing direct
      quizData = JSON.parse(content);
    } catch (parseError) {
      console.log("Tentative d'extraction du JSON depuis la réponse...");
      
      // Cherche le JSON entre les balises de code markdown si présentes
      const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        quizData = JSON.parse(codeBlockMatch[1]);
      } else {
        // Cherche un tableau JSON dans le texte
        const jsonMatch = content.match(/\[\s*{[\s\S]*}\s*\]/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Impossible d'extraire le JSON de la réponse");
        }
      }
    }

    // Validation du format
    if (!Array.isArray(quizData)) {
      throw new Error("Le quiz doit être un tableau");
    }

    // Validation de chaque question
    quizData = quizData.map((q, index) => {
      if (!q.question || !q.options || !q.correctAnswer) {
        throw new Error(`Question ${index + 1} invalide : champs manquants`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1} invalide : doit avoir exactement 4 options`);
      }
      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(`Question ${index + 1} invalide : la réponse correcte n'est pas dans les options`);
      }
      return {
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctAnswer: q.correctAnswer.trim()
      };
    });

    console.log(`✅ Quiz généré avec succès : ${quizData.length} questions`);
    res.status(200).json({ quiz: quizData });

  } catch (error) {
    console.error("❌ Erreur génération quiz :", error);
    
    // Si c'est une erreur de quota
    if (error.code === "insufficient_quota" || error.status === 429) {
      return res
        .status(429)
        .json({ message: "Quota API dépassé. Merci de réessayer plus tard." });
    }

    res.status(500).json({
      message: "Erreur lors de la génération du quiz",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  askQuestion,
  generateQuiz,
};
