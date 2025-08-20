document.addEventListener('DOMContentLoaded', () => {
    // --- --- --- --- --- --- --- --- ---
    // 1. INITIALIZATION & CONFIG
    // --- --- --- --- --- --- --- --- ---

    // Firebase configuration (replace with your own)
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);
    // const auth = firebase.auth();
    // const googleProvider = new firebase.auth.GoogleAuthProvider();

    // --- --- --- --- --- --- --- --- ---
    // 2. DOM ELEMENT SELECTORS
    // --- --- --- --- --- --- --- --- ---
    const dom = {
        themeToggle: document.getElementById('theme-toggle'),
        settingsBtn: document.getElementById('settings-btn'),
        settingsModal: document.getElementById('settings-modal'),
        loginModal: document.getElementById('login-modal'),
        userMenu: document.getElementById('user-menu'),
        closeModalBtns: document.querySelectorAll('.close-modal-btn'),
        themeSelect: document.getElementById('theme-select'),
        languageSelect: document.getElementById('language-select'),
        newChatBtn: document.getElementById('new-chat-btn'),
        chatHistory: document.getElementById('chat-history'),
        welcomeSection: document.getElementById('welcome-section'),
        messagesContainer: document.getElementById('messages-container'),
        messageInput: document.getElementById('message-input'),
        sendBtn: document.getElementById('send-btn'),
        stopBtn: document.getElementById('stop-btn'),
        googleLoginBtn: document.getElementById('google-login-btn'),
        userName: document.getElementById('user-name'),
        userAvatar: document.getElementById('user-avatar'),
        logoutLink: document.getElementById('logout-link'),
    };

    // --- --- --- --- --- --- --- --- ---
    // 3. INTERNATIONALIZATION (i18n)
    // --- --- --- --- --- --- --- --- ---
    const translations = {
        // ... (translations object remains the same)
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' || lang === 'hi' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.textContent = translations[lang][key] || el.textContent;
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            el.placeholder = translations[lang][key] || el.placeholder;
        });
        localStorage.setItem('osirisLanguage', lang);
    };
    
    // --- --- --- --- --- --- --- --- ---
    // 4. THEME MANAGEMENT
    // --- --- --- --- --- --- --- --- ---
    const applyTheme = (theme) => {
        document.body.classList.remove('light-theme', 'dark-theme');
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
            dom.themeToggle.innerHTML = `<i class="fas ${prefersDark ? 'fa-sun' : 'fa-moon'}"></i>`;
        } else {
            document.body.classList.add(`${theme}-theme`);
            dom.themeToggle.innerHTML = `<i class="fas ${theme === 'light' ? 'fa-sun' : 'fa-moon'}"></i>`;
        }
        localStorage.setItem('osirisTheme', theme);
        dom.themeSelect.value = theme;
    };
    
    // --- --- --- --- --- --- --- --- ---
    // 5. UI & MODAL MANAGEMENT
    // --- --- --- --- --- --- --- --- ---
    const toggleModal = (modal, show) => {
        if (show) modal.classList.add('active');
        else modal.classList.remove('active');
    };

    // --- --- --- --- --- --- --- --- ---
    // 6. CHAT FUNCTIONALITY
    // --- --- --- --- --- --- --- --- ---
    const addMessage = (sender, text) => {
        dom.welcomeSection.style.display = 'none';
        dom.messagesContainer.style.display = 'block';

        const messageWrapper = document.createElement('div');
        messageWrapper.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'user' ? (dom.userName.textContent[0] || 'U') : 'أ';

        const content = document.createElement('div');
        content.className = 'message-content';
        // Sanitize and parse markdown
        content.innerHTML = DOMPurify.sanitize(marked.parse(text));

        messageWrapper.append(avatar, content);
        dom.messagesContainer.appendChild(messageWrapper);
        dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
        
        // Highlight code blocks
        content.querySelectorAll('pre code').forEach(hljs.highlightElement);
    };

    const handleSendMessage = async () => {
        const message = dom.messageInput.value.trim();
        if (!message) return;

        addMessage('user', message);
        dom.messageInput.value = '';
        dom.messageInput.style.height = 'auto'; // Reset height
        dom.stopBtn.classList.add('visible');

        try {
            // --- API Call Simulation ---
            // In a real app, replace this with your actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            const botResponse = `هذا رد نموذجي على رسالتك: **"${message}"**. لتنفيذ وظيفة حقيقية، قم بربط هذا بكود الواجهة الخلفية الخاص بك.`;
            addMessage('bot', botResponse);
        } catch (error) {
            addMessage('bot', 'عذراً، حدث خطأ أثناء معالجة طلبك.');
            console.error(error);
        } finally {
            dom.stopBtn.classList.remove('visible');
        }
    };
    
    // --- --- --- --- --- --- --- --- ---
    // 7. AUTHENTICATION
    // --- --- --- --- --- --- --- --- ---
    const updateUserInfo = (user) => {
        if (user) {
            dom.userName.textContent = user.displayName || 'User';
            dom.userAvatar.textContent = (user.displayName || 'U')[0];
            toggleModal(dom.loginModal, false);
        } else {
            dom.userName.textContent = translations[localStorage.getItem('osirisLanguage') || 'ar']['guest'];
            dom.userAvatar.textContent = 'ض';
        }
    };

    // --- --- --- --- --- --- --- --- ---
    // 8. EVENT LISTENERS
    // --- --- --- --- --- --- --- --- ---
    dom.themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('osirisTheme') || 'dark';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    dom.settingsBtn.addEventListener('click', () => toggleModal(dom.settingsModal, true));
    dom.userMenu.addEventListener('click', () => toggleModal(dom.loginModal, true));
    
    dom.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleModal(dom.settingsModal, false);
            toggleModal(dom.loginModal, false);
        });
    });

    dom.themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
    dom.languageSelect.addEventListener('change', (e) => setLanguage(e.target.value));

    dom.newChatBtn.addEventListener('click', () => {
        dom.messagesContainer.innerHTML = '';
        dom.messagesContainer.style.display = 'none';
        dom.welcomeSection.style.display = 'block';
    });
    
    dom.sendBtn.addEventListener('click', handleSendMessage);
    dom.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Auto-resize textarea
    dom.messageInput.addEventListener('input', () => {
        dom.messageInput.style.height = 'auto';
        dom.messageInput.style.height = `${dom.messageInput.scrollHeight}px`;
    });
    
    // --- --- --- --- --- --- --- --- ---
    // 9. APP STARTUP LOGIC
    // --- --- --- --- --- --- --- --- ---
    const initializeApp = () => {
        const savedTheme = localStorage.getItem('osirisTheme') || 'dark';
        const savedLang = localStorage.getItem('osirisLanguage') || 'ar';
        
        applyTheme(savedTheme);
        dom.languageSelect.value = savedLang;
        setLanguage(savedLang);

        // Placeholder for checking auth state
        // auth.onAuthStateChanged(user => updateUserInfo(user));
    };
    
    initializeApp();
});