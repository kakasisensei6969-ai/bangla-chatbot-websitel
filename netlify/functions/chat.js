exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY; // নেটলিফাইতে এই নামে কি সেট করবেন

    // এখানে আপনার কাস্টম প্রশ্নোত্তর বা নির্দেশ দিন
    const systemInstruction = "তুমি একজন স্মার্ট চ্যাটবট। তুমি বাংলা এবং ইংলিশে কথা বলো। তোমার মালিকের নাম [আপনার নাম]। তোমার কাজ হলো মানুষকে সাহায্য করা।";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\n\nইউজারের প্রশ্ন: ${message}` }]
        }]
      })
    });

    const data = await response.json();
    
    // Gemini এর রেসপন্স ফরম্যাট অনুযায়ী ডাটা বের করা
    const botReply = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: botReply })
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "API call failed", details: error.message }) 
    };
  }
};
