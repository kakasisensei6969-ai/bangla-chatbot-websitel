const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);
  const API_KEY = process.env.GROQ_API_KEY; // এটি নেটলিফাই থেকে আসবে

  try {
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
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
