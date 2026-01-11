export const handler = async (event) => {
  // শুধুমাত্র POST মেথড এলাউ করা
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);
    const API_KEY = process.env.GROQ_API_KEY;

    // Groq API কল করা
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Error inside function:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "API call failed", details: error.message }) 
    };
  }
};
