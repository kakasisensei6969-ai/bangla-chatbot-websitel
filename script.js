document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // ইউজারের মেসেজ স্ক্রিনে দেখানো
        appendMessage(text, 'user');
        userInput.value = '';

        try {
            // নেটলিফাই ফাংশনকে কল করা
            const response = await fetch("/.netlify/functions/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // ডাটা থেকে বটের উত্তর বের করা
            if (data && data.choices && data.choices[0]) {
                const botResponse = data.choices[0].message.content;
                appendMessage(botResponse, 'bot');
            } else {
                appendMessage("দুঃখিত, গ্রক থেকে সঠিক ফরম্যাটে উত্তর আসেনি।", 'bot');
            }

        } catch (error) {
            console.error("Error:", error);
            appendMessage("দুঃখিত, কানেকশনে সমস্যা হয়েছে। কনসোল চেক করুন।", 'bot');
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.innerText = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
