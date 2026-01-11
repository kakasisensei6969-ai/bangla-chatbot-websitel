exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    // ১. আপনার কাস্টম তথ্য এখানে দিন
    const systemInstruction = "তুমি একজন বিশেষজ্ঞ চ্যাটবট। তুমি বাংলা এবং ইংলিশে কথা বলো।";

    // ২. Gemini API কল
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\nUser Question: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    // ৩. রেসপন্স চেক করা (নিরাপদভাবে ডাটা বের করা)
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const botReply = data.candidates[0].content.parts[0].text;
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: botReply })
      };
    } else {
      // যদি এপিআই থেকে কোনো ভুল মেসেজ আসে
      console.error("API Error Response:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "এপিআই থেকে সঠিক ডাটা আসেনি।", error: data })
      };
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ reply: "সার্ভারে সমস্যা হয়েছে।", details: error.message }) 
    };
  }
};
