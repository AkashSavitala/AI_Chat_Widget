prevMessage = "";
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
        const chatbotResponse = "Thanks for your message! How can I assist you?";
        //chatbotResponse.classList.add("user");
        addMessage("chatbot", chatbotResponse);

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
});
