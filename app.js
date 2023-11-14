const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON bodies

const adminCredentials = {
    username: 'admin',
    password: 'password123',
};

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

let messages = [];

function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = authenticateUser(username, password);

    if (user) {
        res.json({ success: true, message: 'Login successful', user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/message', (req, res) => {
    const isAdmin = req.query.admin === 'true';

    if (isAdmin) {
        res.sendFile(__dirname + '/public/admin.html');
    } else {
        res.json({ message: 'Hello, Hackers on the rise!', messages });
    }
});

app.post('/api/message', (req, res) => {
    const { username, password, message } = req.body;
    const user = authenticateUser(username, password);

    if (user) {
        const newMessage = {
            text: message,
            timestamp: new Date().toLocaleString(),
            author: user.username,
        };
        messages.push(newMessage);
        res.json({ success: true, message: 'Message added successfully!', newMessage });
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
});

app.put('/api/message/:index', (req, res) => {
    const index = req.params.index;
    const { username, password, message } = req.body;
    const user = authenticateUser(username, password);

    if (user && index >= 0 && index < messages.length && messages[index].author === user.username) {
        messages[index].text = message;
        res.json({ success: true, message: 'Message updated successfully!', updatedMessage: messages[index] });
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed or invalid index' });
    }
});

app.delete('/api/message/:index', (req, res) => {
    const index = req.params.index;
    const { username, password } = req.body;
    const user = authenticateUser(username, password);

    if (user && index >= 0 && index < messages.length && messages[index].author === user.username) {
        const deletedMessage = messages.splice(index, 1);
        res.json({ success: true, message: 'Message deleted successfully!', deletedMessage });
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed or invalid index' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
