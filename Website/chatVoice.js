const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const isClicked = document.getElementById("startSpeech");
const API_KEY = "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";


function appendMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
}

async function sendMessage() {
    const userMessage = userInput.value;
    appendMessage(userMessage, "user");
    userInput.value = "";

    // NOTE: Speech synthesis
    const response = await getChatbotResponseDialoGPT(userMessage);
    const trim = response.trim();
    const msg = new SpeechSynthesisUtterance();
    msg.text = trim;
    window.speechSynthesis.speak(msg);

    appendMessage(trim, "chatbot");
}

let prev_user_inputs = [];
let prev_generated_responses = []

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