// Classe principal do aplicativo
class Synapse {
    constructor() {
        this.currentUser = null;
        this.users = this.loadFromStorage('users') || [];
        this.posts = this.loadFromStorage('posts') || [];
        this.notifications = this.loadFromStorage('notifications') || [];
        this.clusters = this.loadFromStorage('clusters') || [];
        this.achievements = this.loadFromStorage('achievements') || {};
        this.reports = this.loadFromStorage('reports') || [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.loadTheme();
        this.initializeDefaultData();
    }

    // Métodos de armazenamento
    loadFromStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    }

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Verificar autenticação
    checkAuth() {
        const savedUser = this.loadFromStorage('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showApp();
        } else {
            this.showAuth();
        }
    }

    // Mostrar página de autenticação
    showAuth() {
        document.getElementById('auth-page').classList.add('active');
        document.querySelectorAll('.page:not(#auth-page)').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('logout-btn').style.display = 'none';
    }

    // Mostrar aplicativo
    showApp() {
        document.getElementById('auth-page').classList.remove('active');
        document.getElementById('feed-page').classList.add('active');
        document.getElementById('logout-btn').style.display = 'block';
        this.updateUI();
        this.loadFeed();
        this.loadTrends();
        this.loadSuggestions();
        this.updateNotificationsBadge();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Abas de autenticação
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                e.target.classList.add('active');
                const formId = e.target.dataset.tab === 'login' ? 'login-form' : 'register-form';
                document.getElementById(formId).classList.add('active');
            });
        });

        // Formulário de login
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Formulário de cadastro
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        // Navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Toggle tema
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Notificações
        document.getElementById('notifications-btn').addEventListener('click', () => {
            this.showNotifications();
        });

        // Publicar post
        document.getElementById('publish-post-btn').addEventListener('click', () => {
            this.publishPost();
        });

        // Busca
        document.getElementById('search-btn').addEventListener('click', () => {
            this.search();
        });

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });

        // Modais
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });

        // Formulário de denúncia
        document.getElementById('report-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReport();
        });

        // Criar cluster
        document.getElementById('create-cluster-btn').addEventListener('click', () => {
            this.createCluster();
        });

        // Abas de conexões
        document.querySelectorAll('.connection-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.connection-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.loadConnections(e.target.dataset.tab);
            });
        });

        // Toggle visualização de conexões
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const view = e.target.dataset.view;
                if (view === 'graph') {
                    document.getElementById('connections-list').style.display = 'none';
                    document.getElementById('connections-graph').style.display = 'block';
                    this.drawConnectionGraph();
                } else {
                    document.getElementById('connections-list').style.display = 'grid';
                    document.getElementById('connections-graph').style.display = 'none';
                }
            });
        });

        // Abas de perfil
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const tabName = e.target.dataset.tab;
                if (tabName === 'mindmap') {
                    document.getElementById('profile-posts').style.display = 'none';
                    document.getElementById('profile-mindmap').style.display = 'block';
                    this.drawMindMap();
                } else {
                    document.getElementById('profile-posts').style.display = 'block';
                    document.getElementById('profile-mindmap').style.display = 'none';
                }
            });
        });

        // Editar perfil
        document.getElementById('edit-profile-btn').addEventListener('click', () => {
            this.editProfile();
        });
    }

    // Login
    login() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.saveToStorage('currentUser', user);
            this.showApp();
            this.showNotification('Login realizado com sucesso!', 'success');
        } else {
            this.showNotification('Usuário ou senha incorretos', 'error');
        }
    }

    // Cadastro
    register() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const bio = document.getElementById('register-bio').value;

        if (this.users.find(u => u.username === username)) {
            this.showNotification('Nome de usuário já existe', 'error');
            return;
        }

        const newUser = {
            id: Date.now(),
            username,
            password,
            bio,
            avatar: `https://picsum.photos/seed/${username}/150/150.jpg`,
            following: [],
            followers: [],
            posts: [],
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveToStorage('users', this.users);

        this.currentUser = newUser;
        this.saveToStorage('currentUser', newUser);
        this.showApp();
        this.showNotification('Cadastro realizado com sucesso!', 'success');
        this.checkAchievement('firstAccount');
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showAuth();
        this.showNotification('Você saiu da sua conta', 'info');
    }

    // Navegação entre páginas
    navigateToPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Carregar conteúdo específico da página
        switch (page) {
            case 'feed':
                this.loadFeed();
                break;
            case 'explore':
                this.loadExplore();
                break;
            case 'clusters':
                this.loadClusters();
                break;
            case 'connections':
                this.loadConnections('following');
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    // Publicar post
    publishPost() {
        const content = document.getElementById('post-content').value.trim();
        
        if (!content) {
            this.showNotification('Digite algo para publicar', 'warning');
            return;
        }

        const post = {
            id: Date.now(),
            author: this.currentUser,
            content,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: [],
            reposts: [],
            hashtags: this.extractHashtags(content)
        };

        this.posts.unshift(post);
        this.currentUser.posts.push(post.id);
        this.saveToStorage('posts', this.posts);
        this.saveToStorage('users', this.users);

        document.getElementById('post-content').value = '';
        this.loadFeed();
        this.showNotification('Post publicado com sucesso!', 'success');
        this.checkAchievement('firstPost');
    }

    // Extrair hashtags do conteúdo
    extractHashtags(content) {
        const hashtagRegex = /#[\w]+/g;
        return content.match(hashtagRegex) || [];
    }

    // Carregar feed
    loadFeed() {
        const feedContainer = document.getElementById('posts-feed');
        feedContainer.innerHTML = '';

        // Obter posts de usuários seguidos e do próprio usuário
        const followingIds = this.currentUser.following.map(u => u.id);
        const feedPosts = this.posts.filter(post => 
            post.author.id === this.currentUser.id || 
            followingIds.includes(post.author.id)
        );

        feedPosts.forEach(post => {
            const postElement = this.createPostElement(post);
            feedContainer.appendChild(postElement);
        });
    }

    // Criar elemento de post
    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.dataset.postId = post.id;

        const isLiked = post.likes.includes(this.currentUser.id);
        const isReposted = post.reposts.includes(this.currentUser.id);

        postDiv.innerHTML = `
            <div class="post-header">
                <img src="${post.author.avatar}" alt="${post.author.username}" class="post-avatar" onclick="synapse.navigateToProfile(${post.author.id})">
                <div class="post-info">
                    <h4 onclick="synapse.navigateToProfile(${post.author.id})">${post.author.username}</h4>
                    <span class="post-time">${this.formatTime(post.timestamp)}</span>
                </div>
                <button class="post-action-btn" onclick="synapse.showReportModal('post', ${post.id})">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <div class="post-content">
                ${this.formatContent(post.content)}
            </div>
            <div class="post-actions">
                <button class="post-action ${isLiked ? 'liked' : ''}" onclick="synapse.toggleLike(${post.id})">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes.length}</span>
                </button>
                <button class="post-action" onclick="synapse.toggleComments(${post.id})">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments.length}</span>
                </button>
                <button class="post-action ${isReposted ? 'reposted' : ''}" onclick="synapse.toggleRepost(${post.id})">
                    <i class="fas fa-retweet"></i>
                    <span>${post.reposts.length}</span>
                </button>
            </div>
            <div class="comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-list">
                    ${post.comments.map(comment => this.createCommentElement(comment)).join('')}
                </div>
                <div class="comment-input">
                    <input type="text" placeholder="Adicionar um comentário..." id="comment-input-${post.id}">
                    <button onclick="synapse.addComment(${post.id})">Enviar</button>
                </div>
            </div>
        `;

        return postDiv;
    }

    // Criar elemento de comentário
    createCommentElement(comment) {
        return `
            <div class="comment">
                <img src="${comment.author.avatar}" alt="${comment.author.username}" class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author.username}</span>
                        <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
                    </div>
                    <p class="comment-text">${comment.content}</p>
                </div>
            </div>
        `;
    }

    // Formatar conteúdo (hashtags e links)
    formatContent(content) {
        // Converter hashtags em links
        content = content.replace(/#[\w]+/g, match => {
            return `<a href="#" onclick="synapse.filterByHashtag('${match}')">${match}</a>`;
        });

        // Converter URLs em links
        content = content.replace(/https?:\/\/[^\s]+/g, match => {
            return `<a href="${match}" target="_blank">${match}</a>`;
        });

        return content;
    }

    // Curtir post
    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        const likeIndex = post.likes.indexOf(this.currentUser.id);

        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(this.currentUser.id);
            
            // Notificar o autor se não for o próprio usuário
            if (post.author.id !== this.currentUser.id) {
                this.addNotification({
                    type: 'like',
                    from: this.currentUser,
                    to: post.author,
                    postId: postId,
                    timestamp: new Date().toISOString()
                });
            }
        }

        this.saveToStorage('posts', this.posts);
        this.loadFeed();
        this.updateNotificationsBadge();
    }

    // Toggle comentários
    toggleComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }

    // Adicionar comentário
    addComment(postId) {
        const input = document.getElementById(`comment-input-${postId}`);
        const content = input.value.trim();

        if (!content) return;

        const post = this.posts.find(p => p.id === postId);
        const comment = {
            id: Date.now(),
            author: this.currentUser,
            content,
            timestamp: new Date().toISOString()
        };

        post.comments.push(comment);
        this.saveToStorage('posts', this.posts);

        // Notificar o autor se não for o próprio usuário
        if (post.author.id !== this.currentUser.id) {
            this.addNotification({
                type: 'comment',
                from: this.currentUser,
                to: post.author,
                postId: postId,
                timestamp: new Date().toISOString()
            });
        }

        input.value = '';
        this.loadFeed();
        this.updateNotificationsBadge();
    }

    // Repostar
    toggleRepost(postId) {
        const post = this.posts.find(p => p.id === postId);
        const repostIndex = post.reposts.indexOf(this.currentUser.id);

        if (repostIndex > -1) {
            post.reposts.splice(repostIndex, 1);
        } else {
            post.reposts.push(this.currentUser.id);
            
            // Notificar o autor se não for o próprio usuário
            if (post.author.id !== this.currentUser.id) {
                this.addNotification({
                    type: 'repost',
                    from: this.currentUser,
                    to: post.author,
                    postId: postId,
                    timestamp: new Date().toISOString()
                });
            }
        }

        this.saveToStorage('posts', this.posts);
        this.loadFeed();
        this.updateNotificationsBadge();
    }

    // Adicionar notificação
    addNotification(notification) {
        this.notifications.unshift(notification);
        this.saveToStorage('notifications', this.notifications);
        this.updateNotificationsBadge();
    }

    // Atualizar badge de notificações
    updateNotificationsBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    // Mostrar notificações
    showNotifications() {
        const modal = document.getElementById('notifications-modal');
        const list = document.getElementById('notifications-list');
        
        list.innerHTML = '';
        
        this.notifications.forEach(notification => {
            const notificationEl = document.createElement('div');
            notificationEl.className = `notification-item ${notification.read ? '' : 'unread'}`;
            
            let icon, message;
            switch (notification.type) {
                case 'like':
                    icon = 'like';
                    message = `${notification.from.username} curtiu seu post`;
                    break;
                case 'comment':
                    icon = 'comment';
                    message = `${notification.from.username} comentou no seu post`;
                    break;
                case 'repost':
                    icon = 'repost';
                    message = `${notification.from.username} repostou seu conteúdo`;
                    break;
            }
            
            notificationEl.innerHTML = `
                <div class="notification-icon ${icon}">
                    <i class="fas fa-${icon === 'like' ? 'heart' : icon === 'comment' ? 'comment' : 'retweet'}"></i>
                </div>
                <div class="notification-content">
                    <h4>${message}</h4>
                    <p>${this.formatTime(notification.timestamp)}</p>
                </div>
            `;
            
            notificationEl.addEventListener('click', () => {
                notification.read = true;
                this.saveToStorage('notifications', this.notifications);
                this.updateNotificationsBadge();
                modal.classList.remove('active');
                this.navigateToPage('feed');
            });
            
            list.appendChild(notificationEl);
        });
        
        modal.classList.add('active');
    }

    // Carregar tendências
    loadTrends() {
        const trendingContainer = document.getElementById('trending-hashtags');
        const hashtagCounts = {};
        
        // Contar hashtags em todos os posts
        this.posts.forEach(post => {
            post.hashtags.forEach(hashtag => {
                hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
            });
        });
        
        // Ordenar por frequência
        const sortedHashtags = Object.entries(hashtagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        trendingContainer.innerHTML = sortedHashtags.map(([hashtag, count]) => `
            <div class="trending-item" onclick="synapse.filterByHashtag('${hashtag}')">
                <span class="trending-hashtag">${hashtag}</span>
                <span class="trending-count">${count} posts</span>
            </div>
        `).join('');
    }

    // Filtrar por hashtag
    filterByHashtag(hashtag) {
        this.navigateToPage('explore');
        document.getElementById('search-input').value = hashtag;
        this.search();
    }

    // Carregar sugestões de usuários
    loadSuggestions() {
        const suggestionsContainer = document.getElementById('user-suggestions');
        
        // Usuários não seguidos
        const suggestions = this.users.filter(user => 
            user.id !== this.currentUser.id && 
            !this.currentUser.following.some(f => f.id === user.id)
        ).slice(0, 3);
        
        suggestionsContainer.innerHTML = suggestions.map(user => `
            <div class="suggestion-item">
                <img src="${user.avatar}" alt="${user.username}" style="width: 2rem; height: 2rem; border-radius: 50%;">
                <div style="flex: 1;">
                    <h4>${user.username}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary);">${user.bio || 'Sem biografia'}</p>
                </div>
                <button class="btn-secondary" onclick="synapse.followUser(${user.id})">Seguir</button>
            </div>
        `).join('');
    }

    // Seguir usuário
    followUser(userId) {
        const user = this.users.find(u => u.id === userId);
        
        if (!this.currentUser.following.some(f => f.id === userId)) {
            this.currentUser.following.push(user);
            user.followers.push(this.currentUser);
            
            this.saveToStorage('users', this.users);
            this.saveToStorage('currentUser', this.currentUser);
            
            this.showNotification(`Você está seguindo ${user.username}`, 'success');
            this.checkAchievement('firstConnection');
            this.loadSuggestions();
        }
    }

    // Busca
    search() {
        const query = document.getElementById('search-input').value.toLowerCase();
        const activeTab = document.querySelector('.explore-tab.active').dataset.tab;
        const resultsContainer = document.getElementById('explore-results');
        
        resultsContainer.innerHTML = '';
        
        switch (activeTab) {
            case 'posts':
                const matchingPosts = this.posts.filter(post => 
                    post.content.toLowerCase().includes(query) ||
                    post.author.username.toLowerCase().includes(query)
                );
                
                matchingPosts.forEach(post => {
                    const postEl = this.createPostElement(post);
                    resultsContainer.appendChild(postEl);
                });
                break;
                
            case 'users':
                const matchingUsers = this.users.filter(user => 
                    user.username.toLowerCase().includes(query) ||
                    (user.bio && user.bio.toLowerCase().includes(query))
                );
                
                matchingUsers.forEach(user => {
                    const userCard = document.createElement('div');
                    userCard.className = 'connection-card';
                    userCard.innerHTML = `
                        <img src="${user.avatar}" alt="${user.username}" class="connection-avatar">
                        <h3 class="connection-name">${user.username}</h3>
                        <p class="connection-bio">${user.bio || 'Sem biografia'}</p>
                        <button class="follow-btn ${this.currentUser.following.some(f => f.id === user.id) ? 'following' : ''}" 
                                onclick="synapse.followUser(${user.id})">
                            ${this.currentUser.following.some(f => f.id === user.id) ? 'Seguindo' : 'Seguir'}
                        </button>
                    `;
                    resultsContainer.appendChild(userCard);
                });
                break;
                
            case 'hashtags':
                const matchingHashtags = this.posts
                    .flatMap(post => post.hashtags)
                    .filter(hashtag => hashtag.toLowerCase().includes(query))
                    .filter((hashtag, index, self) => self.indexOf(hashtag) === index);
                
                matchingHashtags.forEach(hashtag => {
                    const hashtagEl = document.createElement('div');
                    hashtagEl.className = 'trending-item';
                    hashtagEl.innerHTML = `
                        <span class="trending-hashtag">${hashtag}</span>
                    `;
                    hashtagEl.onclick = () => this.filterByHashtag(hashtag);
                    resultsContainer.appendChild(hashtagEl);
                });
                break;
        }
        
        if (resultsContainer.children.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum resultado encontrado</p>';
        }
    }

    // Carregar clusters
    loadClusters() {
        const clustersContainer = document.getElementById('clusters-grid');
        
        if (this.clusters.length === 0) {
            // Criar clusters padrão
            this.clusters = [
                {
                    id: 1,
                    name: 'Tecnologia',
                    description: 'Discussões sobre tecnologia e inovação',
                    icon: 'fa-microchip',
                    members: [this.currentUser.id],
                    posts: [],
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Arte',
                    description: 'Compartilhamento artístico e criativo',
                    icon: 'fa-palette',
                    members: [this.currentUser.id],
                    posts: [],
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Ciência',
                    description: 'Descobertas e discussões científicas',
                    icon: 'fa-flask',
                    members: [this.currentUser.id],
                    posts: [],
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveToStorage('clusters', this.clusters);
        }
        
        clustersContainer.innerHTML = this.clusters.map(cluster => `
            <div class="cluster-card" onclick="synapse.enterCluster(${cluster.id})">
                <div class="cluster-header">
                    <div class="cluster-icon">
                        <i class="fas ${cluster.icon}"></i>
                    </div>
                    <div class="cluster-info">
                        <h3>${cluster.name}</h3>
                        <p>${cluster.description}</p>
                    </div>
                </div>
                <div class="cluster-stats">
                    <div class="cluster-stat">
                        <i class="fas fa-users"></i>
                        <span>${cluster.members.length} membros</span>
                    </div>
                    <div class="cluster-stat">
                        <i class="fas fa-file-alt"></i>
                        <span>${cluster.posts.length} posts</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Criar cluster
    createCluster() {
        const name = prompt('Nome do cluster:');
        if (!name) return;
        
        const description = prompt('Descrição do cluster:');
        if (!description) return;
        
        const icons = ['fa-star', 'fa-heart', 'fa-fire', 'fa-bolt', 'fa-gem', 'fa-crown'];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        
        const newCluster = {
            id: Date.now(),
            name,
            description,
            icon,
            members: [this.currentUser.id],
            posts: [],
            createdAt: new Date().toISOString()
        };
        
        this.clusters.push(newCluster);
        this.saveToStorage('clusters', this.clusters);
        this.loadClusters();
        this.showNotification('Cluster criado com sucesso!', 'success');
    }

    // Entrar no cluster
    enterCluster(clusterId) {
        const cluster = this.clusters.find(c => c.id === clusterId);
        
        if (!cluster.members.includes(this.currentUser.id)) {
            cluster.members.push(this.currentUser.id);
            this.saveToStorage('clusters', this.clusters);
        }
        
        this.showNotification(`Você entrou no cluster ${cluster.name}`, 'info');
        // Aqui você poderia implementar uma página específica para o cluster
    }

    // Carregar conexões
    loadConnections(tab) {
        const connectionsContainer = document.getElementById('connections-list');
        connectionsContainer.innerHTML = '';
        
        const users = tab === 'following' ? this.currentUser.following : this.currentUser.followers;
        
        users.forEach(user => {
            const connectionCard = document.createElement('div');
            connectionCard.className = 'connection-card';
            connectionCard.innerHTML = `
                <img src="${user.avatar}" alt="${user.username}" class="connection-avatar">
                <h3 class="connection-name">${user.username}</h3>
                <p class="connection-bio">${user.bio || 'Sem biografia'}</p>
                <button class="follow-btn following" onclick="synapse.unfollowUser(${user.id})">
                    Deixar de seguir
                </button>
            `;
            connectionsContainer.appendChild(connectionCard);
        });
        
        if (users.length === 0) {
            connectionsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Nenhuma conexão encontrada</p>';
        }
    }

    // Deixar de seguir
    unfollowUser(userId) {
        this.currentUser.following = this.currentUser.following.filter(u => u.id !== userId);
        const user = this.users.find(u => u.id === userId);
        user.followers = user.followers.filter(u => u.id !== this.currentUser.id);
        
        this.saveToStorage('users', this.users);
        this.saveToStorage('currentUser', this.currentUser);
        
        this.showNotification(`Você deixou de seguir ${user.username}`, 'info');
        this.loadConnections('following');
    }

    // Desenhar grafo de conexões
    drawConnectionGraph() {
        const canvas = document.getElementById('graph-canvas');
        const ctx = canvas.getContext('2d');
        
        // Configurar tamanho do canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Obter nós (usuários)
        const nodes = [this.currentUser, ...this.currentUser.following];
        const edges = [];
        
        // Criar arestas (conexões)
        this.currentUser.following.forEach(following => {
            edges.push({ from: this.currentUser, to: following });
            
            // Conexões entre usuários seguidos
            following.following.forEach(followingOfFollowing => {
                if (nodes.includes(followingOfFollowing)) {
                    edges.push({ from: following, to: followingOfFollowing });
                }
            });
        });
        
        // Posicionar nós em círculo
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 3;
        
        nodes.forEach((node, index) => {
            const angle = (index / nodes.length) * 2 * Math.PI;
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        });
        
        // Desenhar arestas
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        ctx.lineWidth = 1;
        
        edges.forEach(edge => {
            ctx.beginPath();
            ctx.moveTo(edge.from.x, edge.from.y);
            ctx.lineTo(edge.to.x, edge.to.y);
            ctx.stroke();
        });
        
        // Desenhar nós
        nodes.forEach(node => {
            // Círculo
            ctx.beginPath();
            ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
            ctx.fillStyle = node.id === this.currentUser.id ? 
                getComputedStyle(document.documentElement).getPropertyValue('--primary-color') :
                getComputedStyle(document.documentElement).getPropertyValue('--surface-color');
            ctx.fill();
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
            ctx.stroke();
            
            // Avatar
            const img = new Image();
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(img, node.x - 25, node.y - 25, 50, 50);
                ctx.restore();
            };
            img.src = node.avatar;
            
            // Nome
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(node.username, node.x, node.y + 45);
        });
    }

    // Carregar perfil
    loadProfile() {
        document.getElementById('profile-avatar').src = this.currentUser.avatar;
        document.getElementById('profile-username').textContent = this.currentUser.username;
        document.getElementById('profile-bio').textContent = this.currentUser.bio || 'Sem biografia';
        document.getElementById('profile-posts-count').textContent = this.currentUser.posts.length;
        document.getElementById('profile-following-count').textContent = this.currentUser.following.length;
        document.getElementById('profile-followers-count').textContent = this.currentUser.followers.length;
        
        // Carregar posts do perfil
        const profilePosts = document.getElementById('profile-posts');
        profilePosts.innerHTML = '';
        
        const userPosts = this.posts.filter(post => post.author.id === this.currentUser.id);
        userPosts.forEach(post => {
            const postEl = this.createPostElement(post);
            profilePosts.appendChild(postEl);
        });
    }

    // Editar perfil
    editProfile() {
        const newBio = prompt('Nova biografia:', this.currentUser.bio || '');
        if (newBio !== null) {
            this.currentUser.bio = newBio;
            this.saveToStorage('users', this.users);
            this.saveToStorage('currentUser', this.currentUser);
            this.loadProfile();
            this.showNotification('Perfil atualizado!', 'success');
        }
    }

    // Desenhar mapa mental
    drawMindMap() {
        const canvas = document.getElementById('mindmap-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Obter posts do usuário
        const userPosts = this.posts.filter(post => post.author.id === this.currentUser.id);
        
        if (userPosts.length === 0) {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Nenhum post para mostrar no mapa mental', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Posicionar posts em árvore
        const centerX = canvas.width / 2;
        const centerY = 100;
        const levelHeight = 120;
        
        // Nó central (usuário)
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        ctx.fill();
        
        // Avatar do usuário
        const userImg = new Image();
        userImg.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(userImg, centerX - 35, centerY - 35, 70, 70);
            ctx.restore();
        };
        userImg.src = this.currentUser.avatar;
        
        // Desenhar posts como ramificações
        userPosts.forEach((post, index) => {
            const angle = (index / userPosts.length) * 2 * Math.PI;
            const x = centerX + 200 * Math.cos(angle);
            const y = centerY + 150 + (index % 3) * 80;
            
            // Linha de conexão
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + 40);
            ctx.lineTo(x, y - 20);
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
            ctx.stroke();
            
            // Nó do post
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface-color');
            ctx.fill();
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
            ctx.stroke();
            
            // Conteúdo do post (resumido)
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            const truncatedContent = post.content.length > 30 ? 
                post.content.substring(0, 30) + '...' : 
                post.content;
            ctx.fillText(truncatedContent, x, y + 45);
            
            // Comentários como sub-ramificações
            post.comments.forEach((comment, commentIndex) => {
                const commentX = x + 80 * Math.cos(commentIndex * Math.PI / 2);
                const commentY = y + 60 + commentIndex * 30;
                
                // Linha de conexão
                ctx.beginPath();
                ctx.moveTo(x, y + 30);
                ctx.lineTo(commentX, commentY);
                ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
                ctx.stroke();
                
                // Nó do comentário
                ctx.beginPath();
                ctx.arc(commentX, commentY, 15, 0, 2 * Math.PI);
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
                ctx.fill();
            });
        });
    }

    // Mostrar modal de denúncia
    showReportModal(type, id) {
        const modal = document.getElementById('report-modal');
        modal.dataset.type = type;
        modal.dataset.id = id;
        modal.classList.add('active');
    }

    // Enviar denúncia
    submitReport() {
        const modal = document.getElementById('report-modal');
        const type = modal.dataset.type;
        const id = parseInt(modal.dataset.id);
        const reason = document.getElementById('report-reason').value;
        const description = document.getElementById('report-description').value;
        
        const report = {
            id: Date.now(),
            type,
            targetId: id,
            reporter: this.currentUser,
            reason,
            description,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        this.reports.push(report);
        this.saveToStorage('reports', this.reports);
        
        modal.classList.remove('active');
        document.getElementById('report-form').reset();
        this.showNotification('Denúncia enviada com sucesso!', 'success');
    }

    // Verificar conquistas
    checkAchievement(achievementId) {
        if (!this.achievements[achievementId]) {
            this.achievements[achievementId] = {
                id: achievementId,
                unlocked: true,
                timestamp: new Date().toISOString()
            };
            this.saveToStorage('achievements', this.achievements);
            this.showAchievementNotification(achievementId);
        }
    }

    // Mostrar notificação de conquista
    showAchievementNotification(achievementId) {
        const achievements = {
            firstAccount: { name: 'Primeiro Passo', icon: 'fa-user', description: 'Criou sua conta' },
            firstPost: { name: 'Primeira Palavra', icon: 'fa-pen', description: 'Fez seu primeiro post' },
            firstConnection: { name: 'Conectado', icon: 'fa-users', description: 'Seguiu seu primeiro usuário' }
        };
        
        const achievement = achievements[achievementId];
        this.showNotification(`🏆 Conquista desbloqueada: ${achievement.name}!`, 'success');
    }

    // Carregar conquistas na sidebar
    loadAchievements() {
        const achievementsContainer = document.getElementById('achievements');
        const unlockedAchievements = Object.values(this.achievements).filter(a => a.unlocked);
        
        achievementsContainer.innerHTML = unlockedAchievements.map(achievement => {
            const achievementData = {
                firstAccount: { name: 'Primeiro Passo', icon: 'fa-user' },
                firstPost: { name: 'Primeira Palavra', icon: 'fa-pen' },
                firstConnection: { name: 'Conectado', icon: 'fa-users' }
            }[achievement.id];
            
            return `
                <div class="achievement-item">
                    <div class="achievement-icon">
                        <i class="fas ${achievementData.icon}"></i>
                    </div>
                    <div class="achievement-info">
                        <h4>${achievementData.name}</h4>
                        <p>Desbloqueado</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Alternar tema
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        
        const themeIcon = document.querySelector('#theme-toggle i');
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Carregar tema
    loadTheme() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            document.querySelector('#theme-toggle i').className = 'fas fa-sun';
        }
    }

    // Navegar para perfil
    navigateToProfile(userId) {
        // Implementar navegação para perfil de outros usuários
        console.log('Navegar para perfil do usuário:', userId);
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 5rem;
            right: 2rem;
            background-color: ${type === 'success' ? 'var(--success-color)' : 
                                 type === 'error' ? 'var(--danger-color)' : 
                                 type === 'warning' ? 'var(--warning-color)' : 
                                 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Formatar tempo
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'agora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
        
        return date.toLocaleDateString('pt-BR');
    }

    // Inicializar dados padrão
    initializeDefaultData() {
        // Criar usuário demo se não existirem usuários
        if (this.users.length === 0) {
            const demoUser = {
                id: 1,
                username: 'demo',
                password: 'demo123',
                bio: 'Usuário de demonstração',
                avatar: 'https://picsum.photos/seed/demo/150/150.jpg',
                following: [],
                followers: [],
                posts: [],
                createdAt: new Date().toISOString()
            };
            
            this.users.push(demoUser);
            this.saveToStorage('users', this.users);
            
            // Criar alguns posts de demonstração
            const demoPosts = [
                {
                    id: 1,
                    author: demoUser,
                    content: 'Bem-vindo ao Synapse! #redesocial #comunidade',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    likes: [],
                    comments: [],
                    reposts: [],
                    hashtags: ['#redesocial', '#comunidade']
                },
                {
                    id: 2,
                    author: demoUser,
                    content: 'Esta é uma rede social experimental com visualização em grafo e mapa mental! #tecnologia #inovacao',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    likes: [],
                    comments: [],
                    reposts: [],
                    hashtags: ['#tecnologia', '#inovacao']
                }
            ];
            
            this.posts = demoPosts;
            demoUser.posts = [1, 2];
            this.saveToStorage('posts', this.posts);
            this.saveToStorage('users', this.users);
        }
    }

    // Atualizar UI
    updateUI() {
        // Atualizar avatar do usuário atual
        if (this.currentUser) {
            document.getElementById('current-user-avatar').src = this.currentUser.avatar;
            this.loadAchievements();
        }
    }
}

// Animações CSS adicionais
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar aplicativo
const synapse = new Synapse();