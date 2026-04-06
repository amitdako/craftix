const { GoogleGenerativeAI } = require("@google/generative-ai");

// וודא שהמפתח ב-.env תקין
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY.trim());

exports.translateProject = async (req, res) => {
  console.log("📥 קיבלתי בקשה לתרגום הפוסט:", req.body.title);

  try {
    const { title, content, tools, materials, targetLanguage } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // פלייסינג הנתונים בתוך הפרומפט
    const prompt = `
      You are a DIY expert. Translate this craft project to ${targetLanguage}.
      Return ONLY a JSON object:
      {
        "title": "translated title",
        "content": "translated content",
        "tools": ["tool1", "tool2"],
        "materials": ["material1", "material2"]
      }

      Data:
      Title: ${title}
      Content: ${content}
      Tools: ${tools.join(", ")}
      Materials: ${materials.join(", ")}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // ניקוי JSON בטוח
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return JSON");

    res.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("❌ Google API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
