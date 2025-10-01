const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Раздаем статические файлы
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const users = {};
const messages = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Регистрация пользователя
    socket.on('register', (userData) => {
        users[userData.username] = {
            socketId: socket.id,
            ...userData
        };
        console.log(`User ${userData.username} registered`);
        
        // Отправляем историю сообщений
        if (messages[userData.username]) {
            socket.emit('message-history', messages[userData.username]);
        }
    });

    // Отправка сообщения
    socket.on('send-message', (data) => {
        const { from, to, text } = data;
        
        // Сохраняем сообщение
        if (!messages[from]) messages[from] = [];
        if (!messages[to]) messages[to] = [];
        
        const message = {
            from, to, text,
            timestamp: Date.now(),
            id: Date.now().toString()
        };
        
        messages[from].push(message);
        messages[to].push(message);
        
        // Отправляем получателю
        const targetUser = users[to];
        if (targetUser) {
            io.to(targetUser.socketId).emit('new-message', message);
        }
        
        // Отправляем обратно отправителю
        socket.emit('new-message', message);
    });

    // Звонки WebRTC
    socket.on('call-user', (data) => {
        const targetUser = users[data.to];
        if (targetUser) {
            io.to(targetUser.socketId).emit('call-made', {
                offer: data.sdp,
                from: data.from,
                type: data.type,
                callerName: data.callerName
            });
        }
    });
    
    socket.on('make-answer', (data) => {
        const targetUser = users[data.to];
        if (targetUser) {
            io.to(targetUser.socketId).emit('answer-made', {
                answer: data.sdp,
                from: data.from
            });
        }
    });
    
    socket.on('ice-candidate', (data) => {
        const targetUser = users[data.to];
        if (targetUser) {
            io.to(targetUser.socketId).emit('ice-candidate', {
                candidate: data.candidate,
                from: data.from
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Удаляем пользователя из онлайн списка
        for (const [username, user] of Object.entries(users)) {
            if (user.socketId === socket.id) {
                delete users[username];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 NotMax Server running on port ${PORT}`);
});