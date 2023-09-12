async function requestServer(msg) {
    const csrftoken = getCookie('csrftoken');
    const response = await fetch("http://127.0.0.1:8000/api/chat_stream", {
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
    const response_text = response.text();
    console.log(response_text);
    return response_text;
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
            displayUserMessage('You', message);
            messageInput.value = '';
        }
    });

    async function handleServerResponse(message) {
        let response = await requestServer(message);
        displayGPTMessage('LocalGPT', response);
    }

    function displayGPTMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('gpt-chat-messages');
        messageDiv.innerHTML = `<strong>${sender}: </strong> ${' ' + text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayUserMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('user-messages');
        messageDiv.innerHTML = `<strong>${sender}: </strong> ${' ' + text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    

    // Simulate receiving a message (for demonstration purposes)
    setTimeout(function () {
        displayGPTMessage('LocalGPT', 'Hello! How are you?');
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




