document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        userInput.value = '';

        try {
            // নেটলিফাই ফাংশনকে কল করা হচ্ছে
            const response = await fetch("/.netlify/functions/chat", {
                method: "POST",
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            appendMessage(botResponse, 'bot');
        } catch (error) {
            appendMessage("দুঃখিত, কোনো সমস্যা হয়েছে। নেটলিফাই সেটিংস চেক করুন।", 'bot');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.innerText = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
