async function fetchMessages() {
    try {
        const response = await fetch('/api/message');
        const data = await response.json();

        // Display the list of messages
        const adminMessageList = document.getElementById('adminMessageList');
        adminMessageList.innerHTML = '';
        data.messages.forEach((message, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${message.text}</span>
                <span class="timestamp">${message.timestamp}</span>
                <button onclick="editMessage(${index})">Edit</button>
                <button onclick="deleteMessage(${index})">Delete</button>
            `;
            adminMessageList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

async function deleteMessage(index) {
    try {
        const response = await fetch(`/api/message/${index}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        console.log(data);

        // Fetch and display messages again after deletion
        fetchMessages();
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}

// Fetch messages when the page loads
fetchMessages();

async function login() {
    const username = prompt('Enter your username:');
    const password = prompt('Enter your password:');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${username}&password=${password}`,
        });

        const data = await response.json();
        if (data.success) {
            console.log(data.message);
            fetchMessages();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

// Prompt the user to log in when the page loads
login();

async function editMessage(index) {
    const newText = prompt('Edit message:', messages[index].text);

    try {
        const response = await fetch(`/api/message/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newText }),
        });

        const data = await response.json();
        console.log(data);

        // Fetch and display messages again after editing
        fetchMessages();
    } catch (error) {
        console.error('Error editing message:', error);
    }
}

