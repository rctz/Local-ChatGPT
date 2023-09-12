document.addEventListener('DOMContentLoaded', function () {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    sendButton.addEventListener('click', function () {
        console.log('send button clicked');
        const message = messageInput.value.trim();
        if (message !== '') {
            displayMessage('You', message);
            messageInput.value = '';
        }
    });

    function displayMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simulate receiving a message (for demonstration purposes)
    setTimeout(function () {
        displayMessage('Friend', 'Hello! How are you?');
    }, 1000);
});
