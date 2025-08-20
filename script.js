// Global Variables
let currentTool = 'chat';
let isGenerating = false;
let chatHistory = [];
let currentChatId = null;

// DOM Elements
const elements = {
    toolBtns: document.querySelectorAll('.tool-btn'),
    toolCards: document.querySelectorAll('.tool-card'),
    welcomeSection: document.getElementById('welcome-section'),
    messagesContainer: document.getElementById('messages-container'),
    messageInput: document.getElementById('message-input'),
    sendBtn: document.getElementById('send-btn'),
    stopBtn: document.getElementById('stop-btn'),
    newChatBtn: document.getElementById('new-chat-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    settingsBtn: document.getElementById('settings-btn'),
    chatHistory: document.getElementById('chat-history'),
    modals: document.querySelectorAll('.modal'),
    closeModalBtns: document.querySelectorAll('.close-modal-btn')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadChatHistory();
    initializeTheme();
    setupAutoResize();
    addWelcomeAnimations();
});

// Event Listeners
function initializeEventListeners() {
    // Tool buttons
    elements.toolBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTool(btn.dataset.tool));
    });

    // Tool cards
    elements.toolCards.forEach(card => {
        card.addEventListener('click', () => handleToolCardClick(card.dataset.action));
    });

    // Message input
    elements.messageInput.addEventListener('keydown', handleInputKeydown);
    elements.messageInput.addEventListener('input', handleInputChange);

    // Send button
    elements.sendBtn.addEventListener('click', sendMessage);

    // Stop button
    elements.stopBtn.addEventListener('click', stopGeneration);

    // New chat button
    elements.newChatBtn.addEventListener('click', startNewChat);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Settings button
    elements.settingsBtn.addEventListener('click', () => openModal('settings-modal'));

    // Modal close buttons
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.modal));
    });

    // Click outside modal to close
    elements.modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // File upload
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    // Voice recording
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceRecording);
    }
}

// Tool Management
function switchTool(toolName) {
    currentTool = toolName;
    
    // Update active tool button
    elements.toolBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === toolName);
    });

    // Update UI based on tool
    updateUIForTool(toolName);
    
    // Add visual feedback
    showNotification(`تم التبديل إلى أداة ${getToolDisplayName(toolName)}`, 'info');
}

function updateUIForTool(toolName) {
    const headerTitle = document.querySelector('.header-title');
    const placeholder = elements.messageInput;
    
    switch(toolName) {
        case 'chat':
            headerTitle.textContent = 'أوزيريس AI - المحادثة';
            placeholder.placeholder = 'اكتب رسالتك هنا...';
            break;
        case 'image':
            headerTitle.textContent = 'أوزيريس AI - إنشاء الصور';
            placeholder.placeholder = 'صف الصورة التي تريد إنشاءها...';
            break;
        case 'code':
            headerTitle.textContent = 'أوزيريس AI - مساعد البرمجة';
            placeholder.placeholder = 'اكتب سؤالك البرمجي أو الكود...';
            break;
        case 'document':
            headerTitle.textContent = 'أوزيريس AI - كتابة المحتوى';
            placeholder.placeholder = 'اطلب كتابة مقال أو محتوى...';
            break;
        case 'analysis':
            headerTitle.textContent = 'أوزيريس AI - تحليل البيانات';
            placeholder.placeholder = 'ارفع بياناتك أو اطلب تحليلاً...';
            break;
        case 'search':
            headerTitle.textContent = 'أوزيريس AI - البحث الذكي';
            placeholder.placeholder = 'ابحث عن أي معلومة...';
            break;
    }
}

function getToolDisplayName(toolName) {
    const names = {
        'chat': 'المحادثة',
        'image': 'إنشاء الصور',
        'code': 'البرمجة',
        'document': 'المستندات',
        'analysis': 'التحليل',
        'search': 'البحث'
    };
    return names[toolName] || toolName;
}

function handleToolCardClick(action) {
    switchTool(action);
    
    // Hide welcome section and show chat
    elements.welcomeSection.style.display = 'none';
    elements.messagesContainer.style.display = 'block';
    
    // Focus on input
    elements.messageInput.focus();
    
    // Add sample message based on tool
    const sampleMessages = {
        'chat': 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        'image': 'أخبرني عن الصورة التي تريد إنشاءها وسأقوم بتصميمها لك.',
        'code': 'أنا هنا لمساعدتك في البرمجة. ما هو السؤال أو المشكلة التي تواجهها؟',
        'document': 'أستطيع مساعدتك في كتابة أي نوع من المحتوى. ما الذي تريد كتابته؟',
        'analysis': 'ارفع بياناتك وسأقوم بتحليلها وتقديم رؤى قيمة.',
        'translate': 'أستطيع ترجمة النصوص بين العديد من اللغات. ما النص الذي تريد ترجمته؟'
    };
    
    if (sampleMessages[action]) {
        addMessage('bot', sampleMessages[action]);
    }
}

// Message Management
function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message || isGenerating) return;

    // Add user message
    addMessage('user', message);
    
    // Clear input
    elements.messageInput.value = '';
    resetInputHeight();
    
    // Show generating state
    startGenerating();
    
    // Simulate AI response
    setTimeout(() => {
        generateAIResponse(message);
    }, 1000);
}

function addMessage(sender, content, timestamp = new Date()) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = sender === 'user' ? 'م' : 'أ';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (sender === 'bot') {
        // Process markdown for bot messages
        messageContent.innerHTML = processMarkdown(content);
        // Highlight code blocks
        messageContent.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    } else {
        messageContent.textContent = content;
    }
    
    // Add message actions for bot messages
    if (sender === 'bot') {
        const actions = document.createElement('div');
        actions.className = 'message-actions';
        actions.innerHTML = `
            <button class="msg-action-btn" onclick="copyMessage(this)">
                <i class="fas fa-copy"></i> نسخ
            </button>
            <button class="msg-action-btn" onclick="regenerateMessage(this)">
                <i class="fas fa-redo"></i> إعادة توليد
            </button>
            <button class="msg-action-btn" onclick="shareMessage(this)">
                <i class="fas fa-share"></i> مشاركة
            </button>
        `;
        messageContent.appendChild(actions);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    elements.messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
    
    // Save to history
    if (currentChatId) {
        saveChatMessage(currentChatId, sender, content, timestamp);
    }
}

function generateAIResponse(userMessage) {
    // Simulate different responses based on current tool
    let response = '';
    
    switch(currentTool) {
        case 'chat':
            response = generateChatResponse(userMessage);
            break;
        case 'image':
            response = generateImageResponse(userMessage);
            break;
        case 'code':
            response = generateCodeResponse(userMessage);
            break;
        case 'document':
            response = generateDocumentResponse(userMessage);
            break;
        case 'analysis':
            response = generateAnalysisResponse(userMessage);
            break;
        case 'search':
            response = generateSearchResponse(userMessage);
            break;
        default:
            response = 'عذراً، لم أتمكن من فهم طلبك. يرجى المحاولة مرة أخرى.';
    }
    
    // Simulate typing effect
    typeMessage(response);
}

function typeMessage(message) {
    const words = message.split(' ');
    let currentText = '';
    let wordIndex = 0;
    
    // Add empty message first
    addMessage('bot', '');
    const lastMessage = elements.messagesContainer.lastElementChild;
    const messageContent = lastMessage.querySelector('.message-content');
    
    const typeInterval = setInterval(() => {
        if (wordIndex < words.length) {
            currentText += words[wordIndex] + ' ';
            messageContent.innerHTML = processMarkdown(currentText) + '<span class="typing-indicator">|</span>';
            wordIndex++;
            scrollToBottom();
        } else {
            clearInterval(typeInterval);
            messageContent.innerHTML = processMarkdown(message);
            
            // Add message actions
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            actions.innerHTML = `
                <button class="msg-action-btn" onclick="copyMessage(this)">
                    <i class="fas fa-copy"></i> نسخ
                </button>
                <button class="msg-action-btn" onclick="regenerateMessage(this)">
                    <i class="fas fa-redo"></i> إعادة توليد
                </button>
                <button class="msg-action-btn" onclick="shareMessage(this)">
                    <i class="fas fa-share"></i> مشاركة
                </button>
            `;
            messageContent.appendChild(actions);
            
            // Highlight code blocks
            messageContent.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
            
            stopGenerating();
        }
    }, 100);
}

// Response Generators
function generateChatResponse(message) {
    const responses = [
        `شكراً لك على سؤالك: "${message}". هذا سؤال ممتاز! دعني أساعدك بأفضل ما أستطيع.`,
        `أفهم أنك تسأل عن "${message}". إليك ما يمكنني مساعدتك به...`,
        `بناءً على سؤالك حول "${message}"، يمكنني تقديم المعلومات التالية...`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateImageResponse(message) {
    return `رائع! سأقوم بإنشاء صورة بناءً على وصفك: "${message}". 

**تفاصيل الصورة المطلوبة:**
- الموضوع: ${message}
- الأسلوب: واقعي عالي الجودة
- الدقة: 1024x1024 بكسل

سيتم إنشاء الصورة خلال بضع ثوانٍ...

*ملاحظة: هذا مثال توضيحي. في التطبيق الحقيقي، سيتم استخدام API لإنشاء الصور.*`;
}

function generateCodeResponse(message) {
    return `ممتاز! سأساعدك في البرمجة. بناءً على طلبك: "${message}"

\`\`\`javascript
// مثال على كود JavaScript
function sampleFunction() {
    console.log("مرحباً من أوزيريس!");
    return "تم تنفيذ الكود بنجاح";
}

// استدعاء الدالة
sampleFunction();
\`\`\`

**شرح الكود:**
1. تم إنشاء دالة بسيطة
2. تطبع رسالة في وحدة التحكم
3. ترجع نص تأكيد

هل تحتاج إلى مساعدة إضافية في البرمجة؟`;
}

function generateDocumentResponse(message) {
    return `سأساعدك في كتابة محتوى عالي الجودة حول: "${message}"

# العنوان الرئيسي

## مقدمة
هذا مثال على المحتوى الذي يمكنني إنشاؤه لك. سأقوم بكتابة محتوى شامل ومفصل.

## النقاط الرئيسية
- نقطة مهمة أولى
- نقطة مهمة ثانية  
- نقطة مهمة ثالثة

## الخلاصة
يمكنني مساعدتك في كتابة أي نوع من المحتوى بجودة عالية ومعلومات دقيقة.

هل تريد مني توسيع أي جزء من هذا المحتوى؟`;
}

function generateAnalysisResponse(message) {
    return `تحليل ممتاز! بناءً على طلبك: "${message}"

## تحليل البيانات

### الإحصائيات الأساسية:
- **العدد الإجمالي:** 1,234
- **المتوسط:** 85.6%
- **أعلى قيمة:** 98.2%
- **أقل قيمة:** 12.4%

### الرؤى المستخلصة:
1. **الاتجاه العام:** إيجابي بنسبة 78%
2. **النمو المتوقع:** 15% خلال الربع القادم
3. **التوصيات:** تحسين الأداء في المناطق الضعيفة

### الرسم البياني:
\`\`\`
📊 [████████████████████████████████] 85.6%
\`\`\`

هل تريد تحليلاً أكثر تفصيلاً لأي جانب معين؟`;
}

function generateSearchResponse(message) {
    return `نتائج البحث عن: "${message}"

## أهم النتائج:

### 1. المصدر الأول
**الوصف:** معلومات شاملة حول الموضوع المطلوب
**التقييم:** ⭐⭐⭐⭐⭐
**الرابط:** [مثال على رابط]

### 2. المصدر الثاني  
**الوصف:** دراسة متخصصة في المجال
**التقييم:** ⭐⭐⭐⭐
**الرابط:** [مثال على رابط]

### 3. المصدر الثالث
**الوصف:** مقال تفصيلي بأحدث المعلومات
**التقييم:** ⭐⭐⭐⭐⭐
**الرابط:** [مثال على رابط]

**ملخص سريع:** ${message} موضوع مهم يتطلب فهماً عميقاً...

هل تريد البحث عن معلومات أكثر تخصصاً؟`;
}

// Utility Functions
function processMarkdown(text) {
    // Simple markdown processing
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^\- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n/g, '<br>');
}

function startGenerating() {
    isGenerating = true;
    elements.stopBtn.classList.add('visible');
    elements.sendBtn.disabled = true;
    elements.sendBtn.innerHTML = '<i class="fas fa-spinner loading"></i>';
}

function stopGenerating() {
    isGenerating = false;
    elements.stopBtn.classList.remove('visible');
    elements.sendBtn.disabled = false;
    elements.sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
}

function scrollToBottom() {
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function handleInputChange() {
    autoResizeTextarea();
}

function autoResizeTextarea() {
    const textarea = elements.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

function resetInputHeight() {
    elements.messageInput.style.height = '60px';
}

function setupAutoResize() {
    elements.messageInput.addEventListener('input', autoResizeTextarea);
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('light-theme');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Chat History Management
function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    chatHistory = history;
    renderChatHistory();
}

function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function renderChatHistory() {
    if (!elements.chatHistory) return;
    
    elements.chatHistory.innerHTML = '';
    chatHistory.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <i class="history-item-icon fas fa-comment"></i>
            <span>${chat.title}</span>
            <div class="history-item-actions">
                <button class="history-item-action" onclick="deleteChat('${chat.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        item.addEventListener('click', () => loadChat(chat.id));
        elements.chatHistory.appendChild(item);
    });
}

function startNewChat() {
    currentChatId = generateChatId();
    const newChat = {
        id: currentChatId,
        title: 'محادثة جديدة',
        messages: [],
        createdAt: new Date().toISOString()
    };
    
    chatHistory.unshift(newChat);
    saveChatHistory();
    renderChatHistory();
    
    // Clear current chat
    elements.messagesContainer.innerHTML = '';
    elements.welcomeSection.style.display = 'block';
    elements.messagesContainer.style.display = 'none';
    
    showNotification('تم بدء محادثة جديدة', 'success');
}

function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveChatMessage(chatId, sender, content, timestamp) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
        chat.messages.push({ sender, content, timestamp });
        
        // Update chat title based on first user message
        if (sender === 'user' && chat.messages.filter(m => m.sender === 'user').length === 1) {
            chat.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        }
        
        saveChatHistory();
        renderChatHistory();
    }
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// File Upload
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        showNotification(`تم رفع الملف: ${file.name}`, 'success');
        // Here you would typically upload the file to a server
    });
}

// Voice Recording
let isRecording = false;
let mediaRecorder = null;

function toggleVoiceRecording() {
    if (!isRecording) {
        startVoiceRecording();
    } else {
        stopVoiceRecording();
    }
}

function startVoiceRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            isRecording = true;
            
            const voiceBtn = document.getElementById('voice-btn');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            voiceBtn.style.color = 'var(--danger)';
            
            showNotification('بدأ التسجيل الصوتي...', 'info');
        })
        .catch(err => {
            showNotification('فشل في الوصول للميكروفون', 'danger');
        });
}

function stopVoiceRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        isRecording = false;
        
        const voiceBtn = document.getElementById('voice-btn');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.style.color = '';
        
        showNotification('تم إيقاف التسجيل', 'success');
    }
}

// Message Actions
function copyMessage(btn) {
    const messageContent = btn.closest('.message-content');
    const text = messageContent.textContent.replace(/نسخإعادة توليدمشاركة/, '').trim();
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم نسخ الرسالة', 'success');
    });
}

function regenerateMessage(btn) {
    const message = btn.closest('.message');
    const messageContent = message.querySelector('.message-content');
    
    // Find the previous user message
    let prevMessage = message.previousElementSibling;
    while (prevMessage && !prevMessage.classList.contains('user')) {
        prevMessage = prevMessage.previousElementSibling;
    }
    
    if (prevMessage) {
        const userText = prevMessage.querySelector('.message-content').textContent;
        
        // Remove current bot message
        message.remove();
        
        // Generate new response
        startGenerating();
        setTimeout(() => {
            generateAIResponse(userText);
        }, 1000);
    }
}

function shareMessage(btn) {
    const messageContent = btn.closest('.message-content');
    const text = messageContent.textContent.replace(/نسخإعادة توليدمشاركة/, '').trim();
    
    if (navigator.share) {
        navigator.share({
            title: 'رسالة من أوزيريس AI',
            text: text
        });
    } else {
        // Fallback: copy to clipboard
        copyMessage(btn);
        showNotification('تم نسخ الرسالة للمشاركة', 'info');
    }
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '10001',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': 'var(--success)',
        'danger': 'var(--danger)',
        'warning': 'var(--warning)',
        'info': 'var(--info)'
    };
    return colors[type] || 'var(--info)';
}

// Welcome Animations
function addWelcomeAnimations() {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        sendMessage();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        elements.modals.forEach(modal => {
            if (modal.classList.contains('active')) {
                closeModal(modal.id);
            }
        });
    }
    
    // Ctrl/Cmd + N for new chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        startNewChat();
    }
});

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    // Add any additional initialization here
    console.log('أوزيريس AI تم تحميله بنجاح!');
}

