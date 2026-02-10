const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyCUDf9hN5pMJD6r34xwJaMND6LKRQeeZhU";

async function testGemini() {
    try {
        console.log("Testing Gemini API key...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Merhaba, bu bir test mesajıdır. Sadece 'Test başarılı' diye yanıt ver.");
        const response = await result.response;
        const text = response.text();

        console.log("✅ Gemini API Key ÇALIŞIYOR!");
        console.log("Yanıt:", text);
    } catch (error) {
        console.error("❌ Gemini API Key HATALI!");
        console.error("Hata Mesajı:", error.message);
        console.error("Hata Detayları:", JSON.stringify(error, null, 2));
        if (error.response) {
            console.error("API Response:", error.response);
        }
        if (error.status) {
            console.error("HTTP Status:", error.status);
        }
    }
}

testGemini();
