import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST() {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json({ error: "Missing Google API Key in .env.local" }, { status: 500 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a game designer for a coding escape room.
      Generate a JSON object for a single game level.
      
      The JSON must follow this exact schema:
      {
        "id": "ai_generated",
        "name": "Creative Tech Title",
        "author": "AI Architect",
        "bgImage": "https://placehold.co/1920x1080/000000/FFF?text=AI+Generated+Room",
        "puzzles": [
          {
            "id": 1,
            "title": "Short Title",
            "desc": "Description of a coding problem",
            "initialCode": "// buggy code here",
            "requiredString": "string_that_must_exist_in_solution",
            "successMsg": "System Restored",
            "top": 30,
            "left": 40
          },
          {
            "id": 2,
            "title": "Short Title 2",
            "desc": "Another coding problem",
            "initialCode": "// code here",
            "requiredString": "fix",
            "successMsg": "Access Granted",
            "top": 60,
            "left": 70
          }
        ]
      }
  
      Return ONLY the raw JSON string. Do not include markdown formatting like \`\`\`json.
      Make the theme related to cybersecurity or space exploration.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let data;
    try {
        data = JSON.parse(cleanText);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        const match = cleanText.match(/\{[\s\S]*\}/);
        if (match) {
            data = JSON.parse(match[0]);
        } else {
            throw new Error("Invalid JSON format from AI");
        }
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate level" }, { status: 500 });
  }
}