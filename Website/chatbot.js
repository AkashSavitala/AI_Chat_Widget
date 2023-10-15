document.addEventListener("DOMContentLoaded", function () {
    const inputForm = document.getElementById("input-form");
    const inputField = document.getElementById("input-field");
    const conversation = document.getElementById("conversation");

    inputForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the form from submitting and refreshing the page

        const userMessage = inputField.value;
        

        // Display the user's message in the chat
        addMessage("user", userMessage);

        // Here, you can process the user's message and provide a response from the chatbot
        // For simplicity, we'll add a basic response.
        setTimeout(function () {
            const chatbotResponse = "Thanks for your message! How can I assist you?";
            addMessage("chatbot", chatbotResponse);

        }, 100);

        // Clear the input field
        inputField.value = "";

        scrollToBottom();
    });
    function openChatbox() {
        // Redirect to a blank page when the circle is clicked
        window.location.href = "https://www.google.com/?client=safari";
    }
    
    
    
    function scrollToBottom() {
        messages.scrollTop = messages.scrollHeight;
      }
      

    function addMessage(sender, message) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("chatbot-message");

        const messageText = document.createElement("p");
        messageText.classList.add(sender === "user" ? "user-text" : "chatbot-text");
        messageText.textContent = message;

        messageContainer.appendChild(messageText);
        conversation.appendChild(messageContainer);
    }
});
