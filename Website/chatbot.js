prevMessage = "";
//document.addEventListener("DOMContentLoaded", function () {
    const inputForm = document.getElementById("input-form");
    const inputField = document.getElementById("input-field");
    const conversation = document.getElementById("conversation");
    let prev_user_inputs = [];
    let prev_generated_responses = []
    const API_KEY = "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";


    inputForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the form from submitting and refreshing the page

        const userMessage = inputField.value;

        // Display the user's message in the chat
        addMessage("user", userMessage);

        // Here, you can process the user's message and provide a response from the chatbot
        // For simplicity, we'll add a basic response.
        // NOTE: Speech synthesis
        const response = getChatbotResponseDialoGPT(userMessage);
        response.then(res=>{
            const trim = res.trim();
            const msg = new SpeechSynthesisUtterance();
            msg.text = trim;
            window.speechSynthesis.speak(msg);
    
            addMessage("chatbot", msg.text);
        })
        //chatbotResponse.classList.add("user");

        // Clear the input field
        inputField.value = "";

        scrollToBottom(); // Scroll to the bottom when a new message is added
    });

    function scrollToBottom() {
        const lastMessage = conversation.lastElementChild;
        lastMessage.scrollIntoView({ behavior: "smooth" });
    }

    function addMessage(sender, message) {
        if (message === '' || message === prevMessage) {
            return;
        }
        const messageContainer = document.createElement("div");
        const messageText = document.createElement("p");
        messageText.classList.add(sender === "user" ? "user-text" : "chatbot-text");
        messageText.textContent = message;

        messageContainer.appendChild(messageText);
        conversation.appendChild(messageContainer);
        prevMessage = message;

        scrollToBottom(); // Scroll to the bottom when a new message is added
    }
    async function getChatbotResponseDialoGPT(userMessage) {
        const input = {
            "inputs": {
                "past_user_inputs": prev_user_inputs,
                "generated_responses": prev_generated_responses,
                "text": userMessage
            }
        };
    
        const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify(input)
        });
    
        const data = await response.json();
        prev_user_inputs.push(userMessage);
        prev_generated_responses.push(data.generated_text);
        return data.generated_text;
    }
    function declareRecog(){
        let recognition = new webkitSpeechRecognition();
        recognition.interimResults = true;
        recognition.onresult=(event)=>{
            if(event.results[0].isFinal){
                userInput.value +=" "+ event.results[0][0].transcript;
            }
        }
        recognition.addEventListener('end', ()=>{
            declareRecog()
        });
        recognition.start();
    
    }
    declareRecog()
//});
