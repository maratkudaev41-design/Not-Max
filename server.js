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

// Отдаем статические файлы из текущей папки
app.use(express.static(__dirname));

// Главная страница - отдаем HTML напрямую
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NotMax Messenger</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        :root {
            --primary: #0088cc;
            --primary-dark: #0077b3;
            --secondary: #6c757d;
            --background: #f8f9fa;
            --surface: #ffffff;
            --text-primary: #212529;
            --text-secondary: #6c757d;
            --border: #e9ecef;
            --hover: #f1f3f5;
            --accent: #00d4aa;
            --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            --radius: 12px;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .messenger-app {
            width: 100%;
            max-width: 1200px;
            height: 90vh;
            background: var(--surface);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            display: flex;
            overflow: hidden;
        }

        /* Auth Screen */
        .auth-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 4000;
        }

        .auth-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: var(--shadow);
            width: 90%;
            max-width: 400px;
            text-align: center;
        }

        .auth-logo {
            font-size: 32px;
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 10px;
        }

        .auth-subtitle {
            color: var(--text-secondary);
            margin-bottom: 30px;
        }

        .auth-input {
            width: 100%;
            padding: 15px;
            margin-bottom: 15px;
            border: 2px solid var(--border);
            border-radius: 12px;
            font-size: 16px;
            transition: border 0.3s ease;
        }

        .auth-input:focus {
            outline: none;
            border-color: var(--primary);
        }

        .auth-btn {
            width: 100%;
            padding: 15px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .auth-btn:hover {
            background: var(--primary-dark);
        }

        .auth-switch {
            margin-top: 20px;
            color: var(--text-secondary);
        }

        .auth-switch a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
        }

        /* Sidebar Styles */
        .sidebar {
            width: 320px;
            background: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
        }

        .sidebar-header {
            padding: 20px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
        }

        .avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--primary), var(--accent));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }

        .user-details h3 {
            font-size: 16px;
            color: var(--text-primary);
            margin-bottom: 2px;
        }

        .user-details p {
            font-size: 13px;
            color: var(--text-secondary);
        }

        .header-actions {
            display: flex;
            gap: 8px;
        }

        .icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: var(--background);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .icon-btn:hover {
            background: var(--hover);
            color: var(--primary);
        }

        .search-container {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
        }

        .search-box {
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            border: none;
            background: var(--background);
            border-radius: 24px;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        .search-input:focus {
            outline: none;
            background: white;
            box-shadow: 0 0 0 2px var(--primary);
        }

        .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
        }

        .chats-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px 0;
        }

        .chat-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            gap: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 1px solid var(--border);
        }

        .chat-item:hover {
            background: var(--hover);
        }

        .chat-item.active {
            background: rgba(0, 136, 204, 0.08);
        }

        .chat-avatar {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            position: relative;
        }

        .online-status {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #4caf50;
            border: 2px solid white;
        }

        .chat-content {
            flex: 1;
        }

        .chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .chat-name {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 15px;
        }

        .chat-time {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .last-message {
            font-size: 13px;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Left Menu Styles */
        .left-menu {
            position: fixed;
            left: -320px;
            top: 0;
            width: 320px;
            height: 100vh;
            background: var(--surface);
            border-right: 1px solid var(--border);
            transition: left 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
        }

        .left-menu.active {
            left: 0;
        }

        .menu-header {
            padding: 20px;
            background: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .menu-back {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
        }

        .menu-title {
            font-size: 18px;
            font-weight: 600;
        }

        .menu-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px 0;
        }

        .menu-section {
            margin-bottom: 24px;
        }

        .menu-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            gap: 12px;
            cursor: pointer;
            transition: background 0.2s ease;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
        }

        .menu-item:hover {
            background: var(--hover);
        }

        .menu-item i {
            width: 20px;
            color: var(--text-secondary);
        }

        .menu-divider {
            height: 1px;
            background: var(--border);
            margin: 8px 0;
        }

        .profile-section {
            text-align: center;
            padding: 20px;
            border-bottom: 1px solid var(--border);
        }

        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--primary), var(--accent));
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .profile-name {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .profile-username {
            color: var(--text-secondary);
            font-size: 14px;
        }

        .edit-profile-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 16px;
            font-size: 13px;
            margin-top: 8px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .edit-profile-btn:hover {
            background: var(--primary-dark);
        }

        /* Edit Profile Modal */
        .edit-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }

        .edit-modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            padding: 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 18px;
            font-weight: 600;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .modal-body {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: var(--text-primary);
        }

        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            transition: border 0.2s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary);
        }

        .modal-actions {
            padding: 16px 20px;
            border-top: 1px solid var(--border);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        .btn-secondary {
            background: var(--background);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background: var(--hover);
        }

        /* Main Chat Area */
        .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--background);
        }

        .chat-header-main {
            padding: 16px 24px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chat-title {
            font-weight: 600;
            font-size: 16px;
            color: var(--text-primary);
        }

        .chat-status {
            font-size: 13px;
            color: var(--text-secondary);
        }

        .chat-actions {
            display: flex;
            gap: 8px;
        }

        .messages-container {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .message {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            position: relative;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.received {
            align-self: flex-start;
            background: white;
            border-bottom-left-radius: 4px;
        }

        .message.sent {
            align-self: flex-end;
            background: var(--primary);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .message-time {
            font-size: 11px;
            margin-top: 4px;
            opacity: 0.7;
            text-align: right;
        }

        .input-container {
            padding: 20px 24px;
            background: var(--surface);
            border-top: 1px solid var(--border);
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }

        .message-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid var(--border);
            border-radius: 24px;
            resize: none;
            font-size: 14px;
            max-height: 120px;
            transition: all 0.2s ease;
        }

        .message-input:focus {
            outline: none;
            border-color: var(--primary);
        }

        .send-button {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .send-button:hover {
            background: var(--primary-dark);
            transform: scale(1.05);
        }

        .action-button {
            background: var(--accent);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 24px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .action-button:hover {
            background: #00c29a;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 212, 170, 0.3);
        }

        /* WebRTC Call Interface */
        .call-interface {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a1a1a;
            z-index: 3000;
        }

        .call-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .call-header {
            padding: 30px;
            text-align: center;
            color: white;
        }

        .caller-name {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .call-status {
            font-size: 16px;
            color: #ccc;
        }

        .video-container {
            flex: 1;
            position: relative;
            background: #000;
        }

        #localVideo {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 200px;
            height: 150px;
            border-radius: 12px;
            border: 2px solid white;
            object-fit: cover;
        }

        #remoteVideo {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .call-controls {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
        }

        .call-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .call-btn.decline {
            background: #ff4757;
            color: white;
        }

        .call-btn.accept {
            background: #2ed573;
            color: white;
        }

        .call-btn.toggle-audio, .call-btn.toggle-video {
            background: rgba(255,255,255,0.2);
            color: white;
        }

        .call-btn:hover {
            transform: scale(1.1);
        }

        /* New Chat Modal */
        .new-chat-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }

        .new-chat-modal.active {
            display: flex;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                width: 100%;
                position: absolute;
                z-index: 10;
                transform: translateX(-100%);
            }
            
            .sidebar.active {
                transform: translateX(0);
            }
            
            .messenger-app {
                height: 100vh;
                border-radius: 0;
            }
            
            body {
                padding: 0;
            }

            #localVideo {
                width: 120px;
                height: 90px;
            }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    </style>
</head>
<body>
    <!-- Auth Screen -->
    <div class="auth-screen" id="authScreen">
        <div class="auth-container">
            <div class="auth-logo">NotMax</div>
            <div class="auth-subtitle">Быстрые сообщения и звонки</div>
            
            <div id="loginForm">
                <input type="text" class="auth-input" id="loginUsername" placeholder="Имя пользователя" required>
                <input type="password" class="auth-input" id="loginPassword" placeholder="Пароль" required>
                <button class="auth-btn" onclick="login()">Войти</button>
                <div class="auth-switch">
                    Нет аккаунта? <a href="#" onclick="showRegister()">Зарегистрироваться</a>
                </div>
            </div>
            
            <div id="registerForm" style="display: none;">
                <input type="text" class="auth-input" id="regName" placeholder="Ваше имя" required>
                <input type="text" class="auth-input" id="regUsername" placeholder="Имя пользователя" required>
                <input type="password" class="auth-input" id="regPassword" placeholder="Пароль" required>
                <button class="auth-btn" onclick="register()">Создать аккаунт</button>
                <div class="auth-switch">
                    Есть аккаунт? <a href="#" onclick="showLogin()">Войти</a>
                </div>
            </div>
        </div>
    </div>

    <div class="messenger-app" id="messengerApp" style="display: none;">
        <!-- Sidebar with chats -->
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="user-info" onclick="openLeftMenu()">
                    <div class="avatar" id="userAvatar">U</div>
                    <div class="user-details">
                        <h3 id="userName">Пользователь</h3>
                        <p id="userStatus">online</p>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" onclick="showNewChatModal()">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn" onclick="openLeftMenu()">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
            
            <div class="search-container">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="ПОИСК" id="searchInput">
                </div>
            </div>
            
            <div class="chats-list" id="chatsList">
                <!-- Chats will be loaded here -->
            </div>
            
            <div style="padding: 16px 20px; border-top: 1px solid var(--border);">
                <button class="action-button" onclick="showNewChatModal()">
                    <i class="fas fa-plus"></i>
                    Создать
                </button>
            </div>
        </div>
        
        <!-- Left Menu -->
        <div class="left-menu" id="leftMenu">
            <div class="menu-header">
                <button class="menu-back" onclick="closeLeftMenu()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="menu-title">Настройки</div>
            </div>
            
            <div class="profile-section">
                <div class="profile-avatar" onclick="openEditModal()" id="profileAvatar">U</div>
                <div class="profile-name" id="profileName">Пользователь</div>
                <div class="profile-username" id="profileUsername">@username</div>
                <button class="edit-profile-btn" onclick="openEditModal()">Изменить профиль</button>
            </div>
            
            <div class="menu-content">
                <div class="menu-section">
                    <button class="menu-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Выйти</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <div class="edit-modal" id="editModal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Изменить профиль</div>
                    <button class="modal-close" onclick="closeEditModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Имя</label>
                        <input type="text" class="form-input" id="editName" placeholder="Ваше имя">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Юзернейм</label>
                        <input type="text" class="form-input" id="editUsername" placeholder="@username">
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeEditModal()">Отмена</button>
                    <button class="btn btn-primary" onclick="saveProfile()">Сохранить</button>
                </div>
            </div>
        </div>

        <!-- New Chat Modal -->
        <div class="edit-modal new-chat-modal" id="newChatModal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Новый чат</div>
                    <button class="modal-close" onclick="closeNewChatModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Имя пользователя друга</label>
                        <input type="text" class="form-input" id="friendUsername" placeholder="@username друга">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Имя друга (как будет отображаться)</label>
                        <input type="text" class="form-input" id="friendDisplayName" placeholder="Имя друга">
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeNewChatModal()">Отмена</button>
                    <button class="btn btn-primary" onclick="createNewChat()">Создать чат</button>
                </div>
            </div>
        </div>
        
        <!-- Main chat area -->
        <div class="chat-area">
            <div class="chat-header-main" id="chatHeader" style="display: none;">
                <div class="chat-info">
                    <div class="avatar" id="currentChatAvatar">F</div>
                    <div>
                        <div class="chat-title" id="currentChatName">Выберите чат</div>
                        <div class="chat-status" id="currentChatStatus">Начните общение</div>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="icon-btn" onclick="startCall(false)">
                        <i class="fas fa-phone-alt"></i>
                    </button>
                    <button class="icon-btn" onclick="startCall(true)">
                        <i class="fas fa-video"></i>
                    </button>
                </div>
            </div>
            
            <div class="messages-container" id="messagesContainer">
                <div style="text-align: center; color: var(--text-secondary); padding: 40px;">
                    <i class="fas fa-comments" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>Выберите чат чтобы начать общение</p>
                </div>
            </div>
            
            <div class="input-container" id="inputContainer" style="display: none;">
                <button class="icon-btn">
                    <i class="fas fa-paperclip"></i>
                </button>
                <textarea class="message-input" placeholder="Введите сообщение..." rows="1" id="messageInput"></textarea>
                <button class="icon-btn">
                    <i class="far fa-smile"></i>
                </button>
                <button class="send-button" onclick="sendMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- WebRTC Call Interface -->
    <div class="call-interface" id="callInterface">
        <div class="call-container">
            <div class="call-header">
                <div class="caller-name" id="callerName">Звонок</div>
                <div class="call-status" id="callStatus">Соединение...</div>
            </div>
            
            <div class="video-container">
                <video id="remoteVideo" autoplay></video>
                <video id="localVideo" autoplay muted></video>
            </div>
            
            <div class="call-controls">
                <button class="call-btn decline" onclick="endCall()">
                    <i class="fas fa-phone-slash"></i>
                </button>
                <button class="call-btn accept" id="acceptBtn" onclick="acceptCall()" style="display: none;">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="call-btn toggle-audio" onclick="toggleAudio()">
                    <i class="fas fa-microphone"></i>
                </button>
                <button class="call-btn toggle-video" onclick="toggleVideo()">
                    <i class="fas fa-video"></i>
                </button>
            </div>
        </div>
    </div>

    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script>
        // ВСТАВЬ СЮДА ВЕСЬ JAVASCRIPT КОД КОТОРЫЙ Я ДАЛ РАНЕЕ
            <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script>
        // User Data Management
        let currentUser = null;
        let currentChat = null;
        let chats = [];
        let users = {};
        let socket = null;

        // WebRTC Variables
        let localStream;
        let remoteStream;
        let peerConnection;
        let isCaller = false;
        let currentCallType = 'audio';

        // Initialize data for current user
        function initializeUserData() {
            if (!currentUser) return;
            
            // Load data only for current user
            const userKey = `notmax_${currentUser.username}`;
            const userData = JSON.parse(localStorage.getItem(userKey)) || { chats: [], settings: {} };
            
            chats = userData.chats || [];
            users = JSON.parse(localStorage.getItem('notmax_users')) || {};
        }

        // Save data for current user
        function saveUserData() {
            if (!currentUser) return;
            
            const userKey = `notmax_${currentUser.username}`;
            const userData = {
                chats: chats,
                settings: {}
            };
            
            localStorage.setItem(userKey, JSON.stringify(userData));
        }

        // Auth Functions
        function showRegister() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
        }

        function showLogin() {
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        }

        function register() {
            const name = document.getElementById('regName').value.trim();
            const username = document.getElementById('regUsername').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;

            if (!name || !username || !password) {
                alert('Заполните все поля');
                return;
            }

            if (username.length < 3) {
                alert('Имя пользователя должно быть至少 3 символа');
                return;
            }

            // Load existing users
            users = JSON.parse(localStorage.getItem('notmax_users')) || {};

            if (users[username]) {
                alert('Пользователь с таким именем уже существует');
                return;
            }

            // Create new user
            users[username] = {
                name: name,
                username: username,
                password: password,
                avatar: name.charAt(0).toUpperCase(),
                createdAt: Date.now()
            };

            localStorage.setItem('notmax_users', JSON.stringify(users));
            
            // Auto login
            loginUser(username, password);
        }

        function login() {
            const username = document.getElementById('loginUsername').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;

            loginUser(username, password);
        }

        function loginUser(username, password) {
            users = JSON.parse(localStorage.getItem('notmax_users')) || {};
            const user = users[username];
            
            if (!user || user.password !== password) {
                alert('Неверное имя пользователя или пароль');
                return;
            }

            currentUser = user;
            
            // Save current user for auto-login
            localStorage.setItem('notmax_current_user', JSON.stringify({
                username: user.username,
                password: user.password
            }));
            
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('messengerApp').style.display = 'flex';
            
            initializeUserData();
            updateUserProfile();
            loadChats();
            initSocket();
        }

        function logout() {
            if (socket) {
                socket.disconnect();
            }
            // Clear current user
            localStorage.removeItem('notmax_current_user');
            currentUser = null;
            document.getElementById('authScreen').style.display = 'flex';
            document.getElementById('messengerApp').style.display = 'none';
            showLogin();
        }

        function updateUserProfile() {
            if (!currentUser) return;
            
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userAvatar').textContent = currentUser.avatar;
            document.getElementById('profileName').textContent = currentUser.name;
            document.getElementById('profileUsername').textContent = '@' + currentUser.username;
            document.getElementById('profileAvatar').textContent = currentUser.avatar;
        }

        // Socket.io initialization
        function initSocket() {
            try {
                socket = io();
                
                socket.on('connect', () => {
                    console.log('Connected to server');
                    // Регистрируем пользователя на сервере
                    socket.emit('register', {
                        username: currentUser.username,
                        name: currentUser.name
                    });
                });

                socket.on('new-message', (message) => {
                    console.log('New message received:', message);
                    
                    // Находим чат с этим пользователем
                    const chat = chats.find(c => c.friendUsername === message.from);
                    if (chat) {
                        // Добавляем сообщение в историю
                        const newMessage = {
                            text: message.text,
                            isSent: false,
                            timestamp: message.timestamp
                        };
                        
                        chat.messages.push(newMessage);
                        saveUserData();
                        
                        // Если этот чат активен - показываем сообщение
                        if (currentChat && currentChat.id === chat.id) {
                            addMessageToUI(message.text, false, message.timestamp, true);
                        }
                        
                        // Обновляем список чатов
                        loadChats();
                    } else {
                        // Если чата нет - создаем его
                        createChatFromMessage(message);
                    }
                });

                // Auto-create chat when receiving message from new user
                function createChatFromMessage(message) {
                    const newChat = {
                        id: Date.now().toString(),
                        friendName: message.from, // В реальном приложении нужно получать имя
                        friendUsername: message.from,
                        friendAvatar: message.from.charAt(0).toUpperCase(),
                        messages: [{
                            text: message.text,
                            isSent: false,
                            timestamp: message.timestamp
                        }],
                        createdAt: Date.now()
                    };
                    
                    chats.push(newChat);
                    saveUserData();
                    loadChats();
                    
                    // Если нет активного чата - выбираем этот
                    if (!currentChat) {
                        selectChat(newChat.id);
                    }
                }

                // WebRTC events
                socket.on('call-made', async (data) => {
                    console.log('Incoming call from:', data.from);
                    document.getElementById('callerName').textContent = `Входящий звонок от ${data.callerName}`;
                    document.getElementById('callStatus').textContent = 'Входящий вызов...';
                    document.getElementById('callInterface').style.display = 'block';
                    document.getElementById('acceptBtn').style.display = 'block';
                    
                    currentCallType = data.type;
                    isCaller = false;
                    
                    await createPeerConnection(false);
                    await peerConnection.setRemoteDescription(new RTCSessionDescription({
                        type: 'offer',
                        sdp: data.offer
                    }));
                    
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    
                    socket.emit('make-answer', {
                        answer: answer,
                        to: data.from
                    });
                });
                
                socket.on('answer-made', async (data) => {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription({
                        type: 'answer',
                        sdp: data.answer
                    }));
                    document.getElementById('callStatus').textContent = 'Разговор...';
                });
                
                socket.on('ice-candidate', async (data) => {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                });

                socket.on('disconnect', () => {
                    console.log('Disconnected from server');
                });

            } catch (error) {
                console.log('Socket.io error:', error);
            }
        }

        // Chat Management
        function loadChats() {
            const chatsList = document.getElementById('chatsList');
            chatsList.innerHTML = '';

            if (chats.length === 0) {
                chatsList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">Нет чатов</div>';
                return;
            }

            // Сортируем чаты по последнему сообщению
            chats.sort((a, b) => {
                const lastA = a.messages[a.messages.length - 1];
                const lastB = b.messages[b.messages.length - 1];
                return (lastB?.timestamp || b.createdAt) - (lastA?.timestamp || a.createdAt);
            });

            chats.forEach(chat => {
                const lastMessage = chat.messages[chat.messages.length - 1];
                const chatItem = document.createElement('div');
                chatItem.className = 'chat-item';
                chatItem.onclick = () => selectChat(chat.id);
                
                // Подсвечиваем активный чат
                if (currentChat && currentChat.id === chat.id) {
                    chatItem.classList.add('active');
                }
                
                chatItem.innerHTML = `
                    <div class="chat-avatar">${chat.friendAvatar}</div>
                    <div class="chat-content">
                        <div class="chat-header">
                            <div class="chat-name">${chat.friendName}</div>
                            <div class="chat-time">${lastMessage ? formatTime(lastMessage.timestamp) : formatTime(chat.createdAt)}</div>
                        </div>
                        <div class="last-message">${lastMessage ? (lastMessage.text.length > 30 ? lastMessage.text.substring(0, 30) + '...' : lastMessage.text) : 'Нет сообщений'}</div>
                    </div>
                `;
                
                chatsList.appendChild(chatItem);
            });
        }

        function showNewChatModal() {
            document.getElementById('friendUsername').value = '';
            document.getElementById('friendDisplayName').value = '';
            document.getElementById('newChatModal').classList.add('active');
        }

        function closeNewChatModal() {
            document.getElementById('newChatModal').classList.remove('active');
        }

        function createNewChat() {
            const friendUsername = document.getElementById('friendUsername').value.trim().toLowerCase();
            const friendDisplayName = document.getElementById('friendDisplayName').value.trim();

            if (!friendUsername || !friendDisplayName) {
                alert('Заполните все поля');
                return;
            }

            if (friendUsername === currentUser.username) {
                alert('Нельзя создать чат с самим собой');
                return;
            }

            // Check if chat already exists
            const existingChat = chats.find(chat => chat.friendUsername === friendUsername);
            if (existingChat) {
                alert('Чат с этим пользователем уже существует');
                selectChat(existingChat.id);
                closeNewChatModal();
                return;
            }

            const newChat = {
                id: Date.now().toString(),
                friendName: friendDisplayName,
                friendUsername: friendUsername,
                friendAvatar: friendDisplayName.charAt(0).toUpperCase(),
                messages: [],
                createdAt: Date.now()
            };

            chats.push(newChat);
            saveUserData();
            
            closeNewChatModal();
            loadChats();
            selectChat(newChat.id);
        }

        function selectChat(chatId) {
            currentChat = chats.find(chat => chat.id === chatId);
            if (!currentChat) return;

            // Update UI
            document.getElementById('chatHeader').style.display = 'flex';
            document.getElementById('inputContainer').style.display = 'flex';
            document.getElementById('currentChatName').textContent = currentChat.friendName;
            document.getElementById('currentChatAvatar').textContent = currentChat.friendAvatar;
            document.getElementById('currentChatStatus').textContent = 'online';

            // Load messages
            loadMessages();
            
            // Reload chats to update active state
            loadChats();
        }

        function loadMessages() {
            const messagesContainer = document.getElementById('messagesContainer');
            messagesContainer.innerHTML = '';

            if (!currentChat || currentChat.messages.length === 0) {
                messagesContainer.innerHTML = `
                    <div style="text-align: center; color: var(--text-secondary); padding: 40px;">
                        <i class="fas fa-comment" style="font-size: 48px; margin-bottom: 16px;"></i>
                        <p>Начните общение с ${currentChat.friendName}</p>
                    </div>
                `;
                return;
            }

            currentChat.messages.forEach(message => {
                addMessageToUI(message.text, message.isSent, message.timestamp, false);
            });
        }

        function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const text = messageInput.value.trim();
            
            if (!text || !currentChat) return;

            const message = {
                text: text,
                isSent: true,
                timestamp: Date.now()
            };

            // Add to current chat
            currentChat.messages.push(message);
            
            // Save to storage
            saveUserData();
            
            // Update UI
            addMessageToUI(text, true, message.timestamp, true);
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Send to server for other user
            if (socket) {
                socket.emit('send-message', {
                    from: currentUser.username,
                    to: currentChat.friendUsername,
                    text: text
                });
            }
            
            // Update chats list
            loadChats();
        }

        function addMessageToUI(text, isSent, timestamp, animate = true) {
            const messagesContainer = document.getElementById('messagesContainer');
            
            // Clear placeholder if exists
            if (messagesContainer.children.length === 1 && 
                messagesContainer.children[0].querySelector('.fa-comment')) {
                messagesContainer.innerHTML = '';
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
            if (animate) {
                messageDiv.style.animation = 'fadeIn 0.3s ease';
            }
            
            messageDiv.innerHTML = `
                ${text}
                <div class="message-time">${formatTime(timestamp)}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            
            // Если сегодня - показываем время
            if (date.toDateString() === now.toDateString()) {
                return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
            // Если вчера - показываем "вчера"
            else if (diff < 48 * 60 * 60 * 1000) {
                return 'вчера';
            }
            // Иначе - дату
            else {
                return date.toLocaleDateString();
            }
        }

        // Profile Editing
        function openEditModal() {
            document.getElementById('editName').value = currentUser.name;
            document.getElementById('editUsername').value = currentUser.username;
            document.getElementById('editModal').classList.add('active');
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('active');
        }

        function saveProfile() {
            const newName = document.getElementById('editName').value.trim();
            const newUsername = document.getElementById('editUsername').value.trim().toLowerCase();

            if (!newName || !newUsername) {
                alert('Заполните все поля');
                return;
            }

            // Update user data
            const oldUsername = currentUser.username;
            currentUser.name = newName;
            currentUser.username = newUsername;
            currentUser.avatar = newName.charAt(0).toUpperCase();
            
            // Update storage
            delete users[oldUsername];
            users[newUsername] = currentUser;
            localStorage.setItem('notmax_users', JSON.stringify(users));
            
            // Update current user reference
            localStorage.setItem('notmax_current_user', JSON.stringify({
                username: newUsername,
                password: currentUser.password
            }));
            
            // Update UI
            updateUserProfile();
            closeEditModal();
        }

        // Left Menu Functions
        function openLeftMenu() {
            document.getElementById('leftMenu').classList.add('active');
        }

        function closeLeftMenu() {
            document.getElementById('leftMenu').classList.remove('active');
        }

        // WebRTC Functions (остаются без изменений)
        async function createPeerConnection(isCaller) {
            const configuration = {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            };
            
            peerConnection = new RTCPeerConnection(configuration);
            
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream);
                });
            }
            
            peerConnection.ontrack = (event) => {
                remoteStream = event.streams[0];
                document.getElementById('remoteVideo').srcObject = remoteStream;
            };
            
            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit('ice-candidate', {
                        candidate: event.candidate,
                        to: currentChat.friendUsername
                    });
                }
            };
        }

        async function startCall(isVideo) {
            if (!currentChat) {
                alert('Выберите чат для звонка');
                return;
            }

            try {
                currentCallType = isVideo ? 'video' : 'audio';
                isCaller = true;
                
                localStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: isVideo
                });
                
                document.getElementById('localVideo').srcObject = localStream;
                document.getElementById('callInterface').style.display = 'block';
                document.getElementById('callStatus').textContent = 'Звонок...';
                document.getElementById('acceptBtn').style.display = 'none';
                document.getElementById('callerName').textContent = `Звонок ${currentChat.friendName}`;
                
                await createPeerConnection(true);
                
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                
                if (socket) {
                    socket.emit('call-user', {
                        sdp: offer,
                        to: currentChat.friendUsername,
                        type: currentCallType,
                        callerName: currentUser.name
                    });
                }
                
            } catch (error) {
                console.error('Error starting call:', error);
                alert('Ошибка доступа к камере/микрофону');
            }
        }

        async function acceptCall() {
            document.getElementById('callStatus').textContent = 'Разговор...';
            document.getElementById('acceptBtn').style.display = 'none';
            
            try {
                localStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: currentCallType === 'video'
                });
                document.getElementById('localVideo').srcObject = localStream;
                
                localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream);
                });
                
            } catch (error) {
                console.error('Error accepting call:', error);
            }
        }

        function endCall() {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnection) {
                peerConnection.close();
            }
            document.getElementById('callInterface').style.display = 'none';
            document.getElementById('acceptBtn').style.display = 'none';
        }

        function toggleAudio() {
            if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = !audioTrack.enabled;
                    const btn = document.querySelector('.toggle-audio');
                    btn.style.background = audioTrack.enabled ? 'rgba(255,255,255,0.2)' : '#ff4757';
                }
            }
        }

        function toggleVideo() {
            if (localStream) {
                const videoTrack = localStream.getVideoTracks()[0];
                if (videoTrack) {
                    videoTrack.enabled = !videoTrack.enabled;
                    const btn = document.querySelector('.toggle-video');
                    btn.style.background = videoTrack.enabled ? 'rgba(255,255,255,0.2)' : '#ff4757';
                    document.getElementById('localVideo').style.display = videoTrack.enabled ? 'block' : 'none';
                }
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            const messageInput = document.getElementById('messageInput');
            
            // Auto-resize textarea
            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
            
            // Send message on Enter
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Check if user is already logged in
            const savedUser = localStorage.getItem('notmax_current_user');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    loginUser(userData.username, userData.password);
                } catch (error) {
                    console.log('Auto-login failed:', error);
                    localStorage.removeItem('notmax_current_user');
                }
            }
        });
    </script>
        // (полную версию с исправленными функциями)
    </script>
</body>
</html>
    `);
});

// Остальной код сервера (Socket.io логика)
const users = {};
const messages = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userData) => {
        users[userData.username] = {
            socketId: socket.id,
            ...userData
        };
        console.log(`User ${userData.username} registered`);
        
        if (messages[userData.username]) {
            socket.emit('message-history', messages[userData.username]);
        }
    });

    socket.on('send-message', (data) => {
        const { from, to, text } = data;
        
        if (!messages[from]) messages[from] = [];
        if (!messages[to]) messages[to] = [];
        
        const message = {
            from, to, text,
            timestamp: Date.now(),
            id: Date.now().toString()
        };
        
        messages[from].push(message);
        messages[to].push(message);
        
        const targetUser = users[to];
        if (targetUser) {
            io.to(targetUser.socketId).emit('new-message', message);
        }
        
        socket.emit('new-message', message);
    });

    // WebRTC handlers
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
        for (const [username, user] of Object.entries(users)) {
            if (user.socketId === socket.id) {
                delete users[username];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`🚀 NotMax Server running on port ${PORT}`);
    console.log(`📱 Open: https://not-max.onrender.com`);
});
