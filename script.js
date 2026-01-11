document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // --- এখানে আপনার API KEY বসান ---
    const GROQ_API_KEY = "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"; 

    // মেসেজ পাঠানোর ফাংশন
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // ইউজারের মেসেজ স্ক্রিনে দেখানো
        appendMessage(text, 'user');
        userInput.value = '';

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [{ role: "user", content: text }]
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const botResponse = data.choices[0].message.content;
                appendMessage(botResponse, 'bot');
            } else {
                appendMessage("দুঃখিত, গ্রক থেকে কোনো উত্তর পাওয়া যায়নি। এপিআই কি চেক করুন।", 'bot');
            }
        } catch (error) {
            console.error("Error:", error);
            appendMessage("Error: ইন্টারনেট কানেকশন বা এপিআই কি সমস্যা।", 'bot');
        }
    }

    // বাটন ক্লিক করলে কাজ করবে
    sendBtn.addEventListener('click', sendMessage);

    // কিবোর্ডের Enter চাপলে মেসেজ যাবে
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.innerText = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
