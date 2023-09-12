async function requestServer(msg) {
    const csrftoken = getCookie('csrftoken');
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json, text/plain, */*',
            'X-CSRFToken': csrftoken 
        },
        body: JSON.stringify({
             message: msg 
            }),
    });
    const response_json = await response.json();
    console.log(response_json);
    return response_json;
  }

document.addEventListener('DOMContentLoaded', function () {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    sendButton.addEventListener('click', async function () {
        console.log('send button clicked');
        const message = messageInput.value.trim();
        if (message !== '') {
            handleServerResponse(message)
            displayMessage('You', message);
            messageInput.value = '';
        }
    });

    async function handleServerResponse(message) {
        let response = await requestServer(message);
        response = JSON.parse(response);
        displayMessage('LocalGPT', response.message);
    }

    function displayMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simulate receiving a message (for demonstration purposes)
    setTimeout(function () {
        displayMessage('LocalGPT', 'Hello! How are you?');
    }, 1000);
});

// Function to retrieve the CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




