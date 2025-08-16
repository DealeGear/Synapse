// Gerenciamento de estado
const app = {
    currentUser: null,
    users: [],
    posts: []
};

// Elementos do DOM
const elements = {
    // Tela de autenticação
    authScreen: document.getElementById('authScreen'),
    feedScreen: document.getElementById('feedScreen'),
    loginTab: document.getElementById('loginTab'),
    registerTab: document.getElementById('registerTab'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    authMessage: document.getElementById('authMessage'),
    
    // Tela principal
    currentUser: document.getElementById('currentUser'),
    logoutBtn: document.getElementById('logoutBtn'),
    postForm: document.getElementById('postForm'),
    postContent: document.getElementById('postContent'),
    charCount: document.getElementById('charCount'),
    feed: document.getElementById('feed')
};

// Inicialização
function init() {
    loadDataFromStorage();
    setupEventListeners();
    checkAuthStatus();
}

// Carregar dados do localStorage
function loadDataFromStorage() {
    const usersData = localStorage.getItem('synapse_users');
    const postsData = localStorage.getItem('synapse_posts');
    
    if (usersData) {
        app.users = JSON.parse(usersData);
    }
    
    if (postsData) {
        app.posts = JSON.parse(postsData);
    }
}

// Salvar dados no localStorage
function saveDataToStorage() {
    localStorage.setItem('synapse_users', JSON.stringify(app.users));
    localStorage.setItem('synapse_posts', JSON.stringify(app.posts));
}

// Verificar status de autenticação
function checkAuthStatus() {
    const savedUser = localStorage.getItem('synapse_current_user');
    if (savedUser) {
        app.currentUser = JSON.parse(savedUser);
        showFeedScreen();
    } else {
        showAuthScreen();
    }
}

// Mostrar tela de autenticação
function showAuthScreen() {
    elements.authScreen.classList.remove('hidden');
    elements.feedScreen.classList.add('hidden');
}

// Mostrar tela do feed
function showFeedScreen() {
    elements.authScreen.classList.add('hidden');
    elements.feedScreen.classList.remove('hidden');
    elements.currentUser.textContent = app.currentUser.username;
    renderFeed();
}

// Configurar event listeners
function setupEventListeners() {
    // Tabs de autenticação
    elements.loginTab.addEventListener('click', () => switchTab('login'));
    elements.registerTab.addEventListener('click', () => switchTab('register'));
    
    // Formulários
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.registerForm.addEventListener('submit', handleRegister);
    elements.postForm.addEventListener('submit', handlePost);
    
    // Logout
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Contador de caracteres
    elements.postContent.addEventListener('input', updateCharCount);
}

// Alternar entre login e cadastro
function switchTab(tab) {
    if (tab === 'login') {
        elements.loginTab.classList.add('active');
        elements.registerTab.classList.remove('active');
        elements.loginForm.classList.remove('hidden');
        elements.registerForm.classList.add('hidden');
    } else {
        elements.registerTab.classList.add('active');
        elements.loginTab.classList.remove('active');
        elements.registerForm.classList.remove('hidden');
        elements.loginForm.classList.add('hidden');
    }
    clearAuthMessage();
}

// Limpar mensagem de autenticação
function clearAuthMessage() {
    elements.authMessage.textContent = '';
    elements.authMessage.className = 'message';
}

// Mostrar mensagem de autenticação
function showAuthMessage(message, type) {
    elements.authMessage.textContent = message;
    elements.authMessage.className = `message ${type}`;
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const user = app.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        app.currentUser = user;
        localStorage.setItem('synapse_current_user', JSON.stringify(user));
        showFeedScreen();
        elements.loginForm.reset();
    } else {
        showAuthMessage('Usuário ou senha inválidos', 'error');
    }
}

// Handle cadastro
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    // Verificar se usuário já existe
    if (app.users.some(u => u.username === username)) {
        showAuthMessage('Este nome de usuário já está em uso', 'error');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        username,
        password
    };
    
    app.users.push(newUser);
    saveDataToStorage();
    
    showAuthMessage('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
    elements.registerForm.reset();
    
    // Mudar para aba de login após 2 segundos
    setTimeout(() => {
        switchTab('login');
    }, 2000);
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('synapse_current_user');
    app.currentUser = null;
    showAuthScreen();
}

// Handle post
function handlePost(e) {
    e.preventDefault();
    
    const content = elements.postContent.value.trim();
    
    if (!content) return;
    
    const newPost = {
        id: Date.now(),
        author: app.currentUser.username,
        content,
        timestamp: new Date().toISOString()
    };
    
    app.posts.unshift(newPost);
    saveDataToStorage();
    
    elements.postContent.value = '';
    updateCharCount();
    renderFeed();
}

// Atualizar contador de caracteres
function updateCharCount() {
    const length = elements.postContent.value.length;
    elements.charCount.textContent = `${length}/280`;
    
    if (length > 250) {
        elements.charCount.classList.add('warning');
    } else {
        elements.charCount.classList.remove('warning');
    }
}

// Renderizar feed
function renderFeed() {
    elements.feed.innerHTML = '';
    
    if (app.posts.length === 0) {
        elements.feed.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum post ainda. Seja o primeiro a publicar!</p>';
        return;
    }
    
    app.posts.forEach(post => {
        const postElement = createPostElement(post);
        elements.feed.appendChild(postElement);
    });
}

// Criar elemento de post
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    
    const date = new Date(post.timestamp);
    const formattedDate = formatRelativeTime(date);
    
    postDiv.innerHTML = `
        <div class="post-header">
            <span class="post-author">${post.author}</span>
            <span class="post-time">${formattedDate}</span>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
    `;
    
    return postDiv;
}

// Formatar tempo relativo
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'agora';
    if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR');
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicializar aplicativo
init();