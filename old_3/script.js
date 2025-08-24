// Sistema de Persistência com localStorage
class Storage {
    static getUsers() {
        return JSON.parse(localStorage.getItem('synapse_users') || '{}');
    }

    static saveUsers(users) {
        localStorage.setItem('synapse_users', JSON.stringify(users));
    }

    static getNodes() {
        return JSON.parse(localStorage.getItem('synapse_nodes') || '[]');
    }

    static saveNodes(nodes) {
        localStorage.setItem('synapse_nodes', JSON.stringify(nodes));
    }

    static getConnections() {
        return JSON.parse(localStorage.getItem('synapse_connections') || '[]');
    }

    static saveConnections(connections) {
        localStorage.setItem('synapse_connections', JSON.stringify(connections));
    }
}

// Gerenciador de Aplicação
class App {
    constructor() {
        this.currentUser = null;
        this.nodes = [];
        this.connections = [];
        this.isDarkMode = false;
        this.canvas = null;
        this.ctx = null;
        this.selectedNode = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.viewOffset = { x: 0, y: 0 };
        this.scale = 1;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.checkAuth();
    }

    setupEventListeners() {
        // Autenticação
        document.getElementById('authForm').addEventListener('submit', (e) => this.handleAuth(e));
        document.getElementById('authToggleLink').addEventListener('click', (e) => this.toggleAuthMode(e));

        // Tela Principal
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('profileLogoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('profileThemeToggle').addEventListener('click', () => this.toggleTheme());

        // Sidebar
        document.getElementById('createNodeBtn').addEventListener('click', () => this.openCreateNodeModal());
        document.getElementById('profileBtn').addEventListener('click', () => this.showProfile());
        document.getElementById('randomNodeBtn').addEventListener('click', () => this.showRandomNode());

        // Modais
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal('nodeModal'));
        document.getElementById('closeViewModal').addEventListener('click', () => this.closeModal('viewNodeModal'));
        document.getElementById('nodeForm').addEventListener('submit', (e) => this.saveNode(e));
        document.getElementById('createSparkBtn').addEventListener('click', () => this.createSpark());
        document.getElementById('commentBtn').addEventListener('click', () => this.createComment());

        // Canvas
        document.getElementById('canvas').addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        document.getElementById('canvas').addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        document.getElementById('canvas').addEventListener('mouseup', () => this.handleCanvasMouseUp());
        document.getElementById('canvas').addEventListener('wheel', (e) => this.handleCanvasWheel(e));

        // Busca
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));
    }

    checkAuth() {
        const userData = localStorage.getItem('synapse_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showMainApp();
        }
    }

    toggleAuthMode(e) {
        e.preventDefault();
        const loginFields = document.getElementById('loginFields');
        const registerFields = document.getElementById('registerFields');
        const toggleText = document.getElementById('authToggleText');
        const toggleLink = document.getElementById('authToggleLink');

        if (loginFields.style.display === 'none') {
            loginFields.style.display = 'block';
            registerFields.style.display = 'none';
            toggleText.textContent = 'Não tem uma conta?';
            toggleLink.textContent = 'Cadastre-se';
        } else {
            loginFields.style.display = 'none';
            registerFields.style.display = 'block';
            toggleText.textContent = 'Já tem uma conta?';
            toggleLink.textContent = 'Faça login';
        }
    }

    handleAuth(e) {
        e.preventDefault();
        const isLogin = document.getElementById('loginFields').style.display !== 'none';

        if (isLogin) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const users = Storage.getUsers();

        if (users[username] && users[username].password === password) {
            this.currentUser = users[username];
            localStorage.setItem('synapse_current_user', JSON.stringify(this.currentUser));
            this.showMainApp();
        } else {
            this.showMessage('Usuário ou senha incorretos', 'error');
        }
    }

    register() {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const avatar = document.getElementById('registerAvatar').value;
        const users = Storage.getUsers();

        if (users[username]) {
            this.showMessage('Nome de usuário já existe', 'error');
            return;
        }

        users[username] = {
            username,
            password,
            avatar: avatar || null,
            createdAt: new Date().toISOString()
        };

        Storage.saveUsers(users);
        this.showMessage('Conta criada com sucesso!', 'success');
        
        // Voltar para login
        document.getElementById('authToggleLink').click();
        document.getElementById('loginUsername').value = username;
    }

    showMainApp() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'flex';
        
        this.loadData();
        this.initCanvas();
        this.render();
    }

    showProfile() {
        document.getElementById('mainContainer').style.display = 'none';
        document.getElementById('profileContainer').style.display = 'block';
        
        this.updateProfileStats();
        this.renderUserNodes();
    }

    updateProfileStats() {
        const userNodes = this.nodes.filter(node => node.author === this.currentUser.username);
        const userSparks = this.connections.filter(conn => 
            conn.type === 'spark' && (conn.fromAuthor === this.currentUser.username || conn.toAuthor === this.currentUser.username)
        );
        const userBranches = this.connections.filter(conn => 
            conn.type === 'comment' && conn.fromAuthor === this.currentUser.username
        );

        document.getElementById('profileUsername').textContent = this.currentUser.username;
        document.getElementById('profileAvatar').textContent = this.currentUser.avatar ? '🖼️' : '👤';
        document.getElementById('nodesCount').textContent = userNodes.length;
        document.getElementById('sparksCount').textContent = userSparks.length;
        document.getElementById('branchesCount').textContent = userBranches.length;
    }

    renderUserNodes() {
        const container = document.getElementById('userNodes');
        const userNodes = this.nodes.filter(node => node.author === this.currentUser.username);
        
        container.innerHTML = userNodes.map(node => `
            <div class="node-card" onclick="app.viewNode('${node.id}')">
                <h4>${node.content.substring(0, 50)}${node.content.length > 50 ? '...' : ''}</h4>
                <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 8px;">
                    ${new Date(node.createdAt).toLocaleDateString()}
                </p>
            </div>
        `).join('');
    }

    logout() {
        localStorage.removeItem('synapse_current_user');
        this.currentUser = null;
        document.getElementById('authContainer').style.display = 'flex';
        document.getElementById('mainContainer').style.display = 'none';
        document.getElementById('profileContainer').style.display = 'none';
        
        // Limpar formulários
        document.getElementById('authForm').reset();
    }

    loadData() {
        this.nodes = Storage.getNodes();
        this.connections = Storage.getConnections();
        
        // Adicionar alguns nós iniciais se não existirem
        if (this.nodes.length === 0) {
            this.addInitialNodes();
        }
    }

    addInitialNodes() {
        const initialNodes = [
            {
                id: this.generateId(),
                content: "A inteligência artificial está transformando a forma como interagimos com a tecnologia",
                author: "system",
                tags: ["tecnologia", "ia", "inovação"],
                createdAt: new Date().toISOString(),
                x: 400,
                y: 300
            },
            {
                id: this.generateId(),
                content: "A filosofia nos ajuda a questionar o significado da existência",
                author: "system",
                tags: ["filosofia", "existência", "pensamento"],
                createdAt: new Date().toISOString(),
                x: 600,
                y: 200
            },
            {
                id: this.generateId(),
                content: "A arte é a expressão mais pura da criatividade humana",
                author: "system",
                tags: ["arte", "criatividade", "cultura"],
                createdAt: new Date().toISOString(),
                x: 200,
                y: 400
            }
        ];

        this.nodes = initialNodes;
        Storage.saveNodes(this.nodes);
    }

    initCanvas() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = document.getElementById('ideaMap');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.render();
    }

    render() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.translate(this.viewOffset.x, this.viewOffset.y);
        this.ctx.scale(this.scale, this.scale);

        // Desenhar conexões
        this.connections.forEach(conn => {
            const fromNode = this.nodes.find(n => n.id === conn.from);
            const toNode = this.nodes.find(n => n.id === conn.to);
            
            if (fromNode && toNode) {
                this.drawConnection(fromNode, toNode, conn.type);
            }
        });

        // Desenhar nós
        this.nodes.forEach(node => {
            this.drawNode(node);
        });

        this.ctx.restore();
    }

    drawConnection(fromNode, toNode, type) {
        const gradient = this.ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        
        if (type === 'spark') {
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#a855f7');
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
        } else if (type === 'comment') {
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#34d399');
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
        } else {
            this.ctx.strokeStyle = '#9ca3af';
            this.ctx.lineWidth = 1;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.stroke();
    }

    drawNode(node) {
        const isSelected = this.selectedNode && this.selectedNode.id === node.id;
        
        // Sombra
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 4;

        // Fundo
        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-secondary');
        this.ctx.strokeStyle = isSelected ? '#ec4899' : '#6366f1';
        this.ctx.lineWidth = isSelected ? 3 : 2;

        const width = 200;
        const height = 80;
        const x = node.x - width / 2;
        const y = node.y - height / 2;

        // Desenhar retângulo arredondado
        this.roundRect(x, y, width, height, 12);
        this.ctx.fill();
        this.ctx.stroke();

        // Resetar sombra
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        // Texto
        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
        this.ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        
        const lines = this.wrapText(node.content, width - 20);
        lines.forEach((line, index) => {
            this.ctx.fillText(line, x + 10, y + 25 + (index * 18));
        });

        // Autor
        this.ctx.fillStyle = '#6366f1';
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        this.ctx.fillText(`@${node.author}`, x + 10, y + height - 10);
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (let word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.slice(0, 2); // Máximo 2 linhas
    }

    handleCanvasMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.viewOffset.x) / this.scale;
        const y = (e.clientY - rect.top - this.viewOffset.y) / this.scale;

        // Verificar se clicou em um nó
        const clickedNode = this.nodes.find(node => {
            const nodeWidth = 200;
            const nodeHeight = 80;
            return x >= node.x - nodeWidth / 2 && x <= node.x + nodeWidth / 2 &&
                   y >= node.y - nodeHeight / 2 && y <= node.y + nodeHeight / 2;
        });

        if (clickedNode) {
            this.selectedNode = clickedNode;
            this.viewNode(clickedNode.id);
        } else {
            this.isDragging = true;
            this.dragOffset.x = e.clientX - this.viewOffset.x;
            this.dragOffset.y = e.clientY - this.viewOffset.y;
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleCanvasMouseMove(e) {
        if (this.isDragging) {
            this.viewOffset.x = e.clientX - this.dragOffset.x;
            this.viewOffset.y = e.clientY - this.dragOffset.y;
            this.render();
        }
    }

    handleCanvasMouseUp() {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }

    handleCanvasWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.scale *= delta;
        this.scale = Math.max(0.5, Math.min(2, this.scale));
        this.render();
    }

    openCreateNodeModal() {
        document.getElementById('nodeModal').classList.add('active');
        document.getElementById('modalTitle').textContent = 'Criar Nova Ideia';
        document.getElementById('nodeForm').reset();
        document.getElementById('tagsInput').innerHTML = '<input type="text" id="tagInput" placeholder="Adicionar tag...">';
        document.getElementById('tagInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTag();
            }
        });
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    saveNode(e) {
        e.preventDefault();
        
        const content = document.getElementById('nodeContent').value;
        const link = document.getElementById('nodeLink').value;
        const tags = Array.from(document.querySelectorAll('.tag-item')).map(tag => 
            tag.textContent.replace('×', '').trim()
        );

        const newNode = {
            id: this.generateId(),
            content,
            link: link || null,
            tags,
            author: this.currentUser.username,
            createdAt: new Date().toISOString(),
            x: Math.random() * (this.canvas.width - 200) + 100,
            y: Math.random() * (this.canvas.height - 100) + 50
        };

        this.nodes.push(newNode);
        Storage.saveNodes(this.nodes);

        // Conectar automaticamente com nós relacionados
        this.autoConnectNodes(newNode);

        this.closeModal('nodeModal');
        this.render();
        this.showMessage('Ideia criada com sucesso!', 'success');
    }

    autoConnectNodes(newNode) {
        const relatedNodes = this.nodes.filter(node => {
            if (node.id === newNode.id) return false;
            
            // Verificar tags em comum
            const commonTags = node.tags.filter(tag => newNode.tags.includes(tag));
            return commonTags.length > 0;
        });

        relatedNodes.forEach(node => {
            const connection = {
                id: this.generateId(),
                from: newNode.id,
                to: node.id,
                type: 'auto',
                createdAt: new Date().toISOString()
            };
            this.connections.push(connection);
        });

        Storage.saveConnections(this.connections);
    }

    addTag() {
        const input = document.getElementById('tagInput');
        const tag = input.value.trim();
        
        if (tag) {
            const tagsContainer = document.getElementById('tagsInput');
            const tagElement = document.createElement('span');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `${tag} <span class="tag-remove" onclick="this.parentElement.remove()">×</span>`;
            
            tagsContainer.insertBefore(tagElement, input);
            input.value = '';
        }
    }

    viewNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        document.getElementById('viewNodeModal').classList.add('active');
        document.getElementById('viewNodeTitle').textContent = 'Ideia';
        document.getElementById('viewNodeText').textContent = node.content;
        document.getElementById('viewNodeAuthor').textContent = `@${node.author}`;
        document.getElementById('viewNodeDate').textContent = new Date(node.createdAt).toLocaleString();
        
        if (node.link) {
            document.getElementById('viewNodeLinkGroup').style.display = 'block';
            document.getElementById('viewNodeLink').textContent = node.link;
            document.getElementById('viewNodeLink').href = node.link;
        } else {
            document.getElementById('viewNodeLinkGroup').style.display = 'none';
        }

        const tagsContainer = document.getElementById('viewNodeTags');
        tagsContainer.innerHTML = node.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');

        this.selectedNode = node;
    }

    createSpark() {
        if (!this.selectedNode) return;

        // Implementar lógica de criar faísca (conectar com outro nó)
        this.showMessage('Selecione outro nó para criar uma faísca', 'info');
        // Aqui poderia implementar um modo de seleção de segundo nó
    }

    createComment() {
        if (!this.selectedNode) return;

        const commentContent = prompt('Digite seu comentário:');
        if (commentContent) {
            const commentNode = {
                id: this.generateId(),
                content: commentContent,
                author: this.currentUser.username,
                tags: ['comentário'],
                createdAt: new Date().toISOString(),
                x: this.selectedNode.x + (Math.random() - 0.5) * 200,
                y: this.selectedNode.y + 100
            };

            this.nodes.push(commentNode);

            const connection = {
                id: this.generateId(),
                from: this.selectedNode.id,
                to: commentNode.id,
                type: 'comment',
                fromAuthor: this.selectedNode.author,
                toAuthor: this.currentUser.username,
                createdAt: new Date().toISOString()
            };

            this.connections.push(connection);
            
            Storage.saveNodes(this.nodes);
            Storage.saveConnections(this.connections);
            
            this.closeModal('viewNodeModal');
            this.render();
            this.showMessage('Comentário adicionado!', 'success');
        }
    }

    showRandomNode() {
        if (this.nodes.length === 0) return;
        
        const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        this.viewNode(randomNode.id);
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            this.render();
            return;
        }

        // Destacar nós que correspondem à busca
        this.nodes.forEach(node => {
            const matches = node.content.toLowerCase().includes(searchTerm) ||
                          node.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                          node.author.toLowerCase().includes(searchTerm);
            
            // Aqui poderia implementar destaque visual
        });

        this.render();
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        
        const themeBtn = document.getElementById('themeToggle');
        const profileThemeBtn = document.getElementById('profileThemeToggle');
        themeBtn.textContent = this.isDarkMode ? '☀️' : '🌙';
        profileThemeBtn.textContent = this.isDarkMode ? '☀️' : '🌙';
        
        localStorage.setItem('synapse_theme', this.isDarkMode ? 'dark' : 'light');
        this.render();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('synapse_theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('themeToggle').textContent = '☀️';
            document.getElementById('profileThemeToggle').textContent = '☀️';
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showMessage(message, type) {
        // Criar elemento de mensagem
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            animation: slideIn 0.3s ease-out;
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// Inicializar aplicação
const app = new App();