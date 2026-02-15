import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testConnection() {
  try {
    console.log("🚀 Initializing JobPortal AI Engine...");
    
    // We use gemini-3-flash-preview for 2026 Free Tier
    const modelName = "gemini-3-flash-preview"; 
    const model = genAI.getGenerativeModel({ model: modelName });
    
    console.log(`📡 Sending test ping to ${modelName}...`);
    
    const result = await model.generateContent("Say 'JobPortal Backend: API Online' in a professional tone.");
    const response = await result.response;
    
    console.log("------------------------------------------");
    console.log("✅ SUCCESS:", response.text());
    console.log("------------------------------------------");

  } catch (error) {
    console.error("❌ CONNECTION FAILED");
    console.error("Error Code:", error.status || "N/A");
    console.error("Message:", error.message);

    if (error.message.includes("404")) {
      console.log("\n💡 TIP: Your API key might be locked to a different version. Try 'gemini-2.5-flash' instead.");
    }
  }
}

testConnection();