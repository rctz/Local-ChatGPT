const gpt_name = "LocalGPT";
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

async function gptResponse(msg) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('gpt-chat-messages');

    const csrftoken = getCookie('csrftoken');
    try {
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

        const reader = response.body.getReader();
        let text = gpt_name + ": ";

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            // Append the new chunk of text to the existing text
            text += new TextDecoder().decode(value);

            // Display the text in the chat window
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.log(error);
    }
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

document.addEventListener('DOMContentLoaded', function () {
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
        await gptResponse(message);
        //displayGPTMessage('LocalGPT', response);
    }

    

    // Simulate receiving a message (for demonstration purposes)
    setTimeout(function () {
        displayGPTMessage('LocalGPT', ' Hello! How are you?');
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




