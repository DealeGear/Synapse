// Variáveis globais
let currentUser = null;
let users = [];
let projects = [];
let ratings = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados do localStorage
    loadData();
    
    // Verificar se há um usuário logado
    if (localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        showDashboard();
    } else {
        showLoginScreen();
    }
    
    // Configurar event listeners
    setupEventListeners();
});

// Carregar dados do localStorage
function loadData() {
    // Carregar usuários
    const usersData = localStorage.getItem('users');
    if (usersData) {
        users = JSON.parse(usersData);
        
        // Garantir que todos os usuários tenham a propriedade rating
        users.forEach(user => {
            if (user.rating === undefined) {
                user.rating = 0;
            }
            if (!user.history) {
                user.history = [];
            }
        });
        saveUsers();
    } else {
        // Criar usuários padrão para demonstração
        users = [
            {
                id: generateId(),
                name: 'Projetista Demo',
                password: '123',
                role: 'Projetista',
                rating: 0,
                history: []
            },
            {
                id: generateId(),
                name: 'Conselheiro Demo',
                password: '123',
                role: 'Conselheiro',
                rating: 0,
                history: []
            },
            {
                id: generateId(),
                name: 'Conciliador Demo',
                password: '123',
                role: 'Conciliador',
                rating: 0,
                history: []
            }
        ];
        saveUsers();
    }
    
    // Carregar projetos
    const projectsData = localStorage.getItem('projects');
    if (projectsData) {
        projects = JSON.parse(projectsData);
    } else {
        projects = [];
    }
    
    // Carregar avaliações
    const ratingsData = localStorage.getItem('ratings');
    if (ratingsData) {
        ratings = JSON.parse(ratingsData);
    } else {
        ratings = [];
    }
}

// Salvar usuários no localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Salvar projetos no localStorage
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Salvar avaliações no localStorage
function saveRatings() {
    localStorage.setItem('ratings', JSON.stringify(ratings));
}

// Gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Configurar event listeners
function setupEventListeners() {
    // Tabs de login/cadastro
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Para tabs de login/cadastro
            if (tabName === 'login' || tabName === 'register') {
                document.querySelectorAll('#loginScreen .tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                if (tabName === 'login') {
                    document.getElementById('loginForm').classList.remove('hidden');
                    document.getElementById('registerForm').classList.add('hidden');
                } else {
                    document.getElementById('loginForm').classList.add('hidden');
                    document.getElementById('registerForm').classList.remove('hidden');
                }
            }
            
            // Para tabs do dashboard
            if (tabName === 'myProjects' || tabName === 'invitations' || tabName === 'allProjects') {
                document.querySelectorAll('#viewProjectsSection .tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('#viewProjectsSection .tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.getElementById(`${tabName}Tab`).classList.add('active');
            }
        });
    });
    
    // Formulário de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('loginName').value;
        const password = document.getElementById('loginPassword').value;
        
        login(name, password);
    });
    
    // Formulário de cadastro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        
        createUser(name, password, role);
    });
    
    // Botão de logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Menu do dashboard
    document.getElementById('createIdeaBtn').addEventListener('click', () => showSection('createIdeaSection'));
    document.getElementById('viewProjectsBtn').addEventListener('click', () => showSection('viewProjectsSection'));
    document.getElementById('profileBtn').addEventListener('click', () => showSection('profileSection'));
    
    // Formulário de criação de projeto
    document.getElementById('createProjectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createProject();
    });
    
    // Formulário de opinião
    document.getElementById('opinionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitOpinion();
    });
    
    // Formulário de mediação
    document.getElementById('mediationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitMediation();
    });
    
    // Formulário de avaliação
    document.getElementById('ratingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitRating();
    });
    
    // Botão de atualizar função
    document.getElementById('updateRoleBtn').addEventListener('click', updateRole);
    
    // Fechar modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// Mostrar tela de login
function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('dashboardScreen').classList.remove('active');
}

// Mostrar dashboard
function showDashboard() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('dashboardScreen').classList.add('active');
    
    // Garantir que currentUser tenha a propriedade rating
    if (currentUser.rating === undefined) {
        currentUser.rating = 0;
    }
    
    // Atualizar informações do usuário
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileRating').textContent = currentUser.rating.toFixed(1);
    document.getElementById('changeRole').value = currentUser.role;
    
    // Carregar dados do dashboard
    loadDashboardData();
}

// Mostrar seção específica do dashboard
function showSection(sectionId) {
    // Atualizar navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (sectionId === 'createIdeaSection') {
        document.getElementById('createIdeaBtn').classList.add('active');
        loadAdvisors();
    } else if (sectionId === 'viewProjectsSection') {
        document.getElementById('viewProjectsBtn').classList.add('active');
        loadProjects();
    } else if (sectionId === 'profileSection') {
        document.getElementById('profileBtn').classList.add('active');
        loadUserHistory();
    }
    
    // Mostrar seção
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
}

// Função de login
function login(name, password) {
    const user = users.find(u => u.name === name && u.password === password);
    
    if (user) {
        // Garantir que o usuário tenha a propriedade rating
        if (user.rating === undefined) {
            user.rating = 0;
        }
        
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard();
    } else {
        showNotification('Nome ou senha incorretos!', 'error');
    }
}

// Função de logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginScreen();
}

// Criar usuário
function createUser(name, password, role) {
    // Verificar se usuário já existe
    if (users.some(u => u.name === name)) {
        showNotification('Usuário já existe!', 'error');
        return;
    }
    
    const newUser = {
        id: generateId(),
        name: name,
        password: password,
        role: role,
        rating: 0,
        history: []
    };
    
    users.push(newUser);
    saveUsers();
    
    // Fazer login automático
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showDashboard();
}

// Carregar conselheiros disponíveis
function loadAdvisors() {
    const advisorsList = document.getElementById('advisorsList');
    advisorsList.innerHTML = '';
    
    const advisors = users.filter(u => u.role === 'Conselheiro');
    
    if (advisors.length === 0) {
        advisorsList.innerHTML = '<p>Não há conselheiros disponíveis no momento.</p>';
        return;
    }
    
    advisors.forEach(advisor => {
        const advisorItem = document.createElement('div');
        advisorItem.className = 'advisor-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `advisor-${advisor.id}`;
        checkbox.value = advisor.id;
        
        const label = document.createElement('label');
        label.htmlFor = `advisor-${advisor.id}`;
        label.innerHTML = `
            <div class="advisor-name">${advisor.name}</div>
            <div class="advisor-rating">Avaliação: ${advisor.rating.toFixed(1)}</div>
        `;
        
        advisorItem.appendChild(checkbox);
        advisorItem.appendChild(label);
        advisorsList.appendChild(advisorItem);
    });
}

// Criar projeto
function createProject() {
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const tagsInput = document.getElementById('projectTags').value;
    
    // Processar tags
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // Obter conselheiros selecionados
    const selectedAdvisors = [];
    document.querySelectorAll('#advisorsList input[type="checkbox"]:checked').forEach(checkbox => {
        selectedAdvisors.push(checkbox.value);
    });
    
    // Criar objeto do projeto
    const newProject = {
        id: generateId(),
        title: title,
        description: description,
        tags: tags,
        creatorId: currentUser.id,
        invitedAdvisors: selectedAdvisors,
        acceptedAdvisors: [],
        opinions: [],
        conflict: false,
        mediatorId: null,
        createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    saveProjects();
    
    // Adicionar ao histórico do usuário
    currentUser.history.push({
        type: 'project_created',
        projectId: newProject.id,
        timestamp: new Date().toISOString()
    });
    saveUsers();
    
    // Limpar formulário
    document.getElementById('createProjectForm').reset();
    
    // Mostrar mensagem de sucesso
    showNotification('Projeto criado com sucesso!', 'success');
    
    // Ir para a seção de projetos
    showSection('viewProjectsSection');
}

// Carregar projetos
function loadProjects() {
    // Meus projetos
    const myProjectsList = document.getElementById('myProjectsList');
    myProjectsList.innerHTML = '';
    
    const myProjects = projects.filter(p => p.creatorId === currentUser.id);
    
    if (myProjects.length === 0) {
        myProjectsList.innerHTML = '<div class="empty-state"><p>Você ainda não criou nenhum projeto.</p></div>';
    } else {
        myProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            myProjectsList.appendChild(projectCard);
        });
    }
    
    // Convites
    const invitationsList = document.getElementById('invitationsList');
    invitationsList.innerHTML = '';
    
    const invitations = projects.filter(p => 
        p.invitedAdvisors.includes(currentUser.id) && 
        !p.acceptedAdvisors.includes(currentUser.id)
    );
    
    if (invitations.length === 0) {
        invitationsList.innerHTML = '<div class="empty-state"><p>Você não tem convites pendentes.</p></div>';
    } else {
        invitations.forEach(project => {
            const projectCard = createProjectCard(project, true);
            invitationsList.appendChild(projectCard);
        });
    }
    
    // Todos os projetos
    const allProjectsList = document.getElementById('allProjectsList');
    allProjectsList.innerHTML = '';
    
    if (projects.length === 0) {
        allProjectsList.innerHTML = '<div class="empty-state"><p>Não há projetos disponíveis.</p></div>';
    } else {
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            allProjectsList.appendChild(projectCard);
        });
    }
}

// Criar card de projeto
function createProjectCard(project, isInvitation = false) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Status do projeto
    let statusBadge = '';
    if (project.conflict) {
        statusBadge = '<span class="status-badge conflict">Em Conflito</span>';
    } else if (isInvitation) {
        statusBadge = '<span class="status-badge invitation">Convite Pendente</span>';
    } else if (project.acceptedAdvisors.length > 0) {
        statusBadge = '<span class="status-badge active">Em Andamento</span>';
    } else {
        statusBadge = '<span class="status-badge new">Novo</span>';
    }
    
    // Criador do projeto
    const creator = users.find(u => u.id === project.creatorId);
    
    // Tags do projeto
    const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${project.title}</h3>
            ${statusBadge}
        </div>
        <div class="card-body">
            <p class="project-description">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
            <div class="project-meta">
                <div class="creator-info">
                    <span class="label">Criador:</span>
                    <span>${creator ? creator.name : 'Desconhecido'}</span>
                </div>
                <div class="date-info">
                    <span class="label">Criado em:</span>
                    <span>${new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="project-tags">
                ${tagsHtml}
            </div>
        </div>
        <div class="card-footer">
            <div class="project-stats">
                <div class="stat">
                    <span class="stat-value">${project.acceptedAdvisors.length}</span>
                    <span class="stat-label">Conselheiros</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${project.opinions.length}</span>
                    <span class="stat-label">Opiniões</span>
                </div>
            </div>
            <div class="project-actions">
                <button class="btn-primary btn-small view-details-btn" data-id="${project.id}">Ver Detalhes</button>
                ${isInvitation ? `
                    <button class="btn-primary btn-small accept-btn" data-id="${project.id}">Aceitar</button>
                    <button class="btn-secondary btn-small decline-btn" data-id="${project.id}">Recusar</button>
                ` : ''}
                ${project.creatorId === currentUser.id && !project.conflict ? `
                    <button class="btn-secondary btn-small conflict-btn" data-id="${project.id}">Marcar Conflito</button>
                ` : ''}
            </div>
        </div>
    `;
    
    // Adicionar event listeners aos botões
    card.querySelector('.view-details-btn').addEventListener('click', () => showProjectDetails(project.id));
    
    if (isInvitation) {
        card.querySelector('.accept-btn').addEventListener('click', () => acceptInvitation(project.id));
        card.querySelector('.decline-btn').addEventListener('click', () => declineInvitation(project.id));
    }
    
    if (project.creatorId === currentUser.id && !project.conflict) {
        card.querySelector('.conflict-btn').addEventListener('click', () => markConflict(project.id));
    }
    
    return card;
}

// Mostrar detalhes do projeto
function showProjectDetails(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const projectDetails = document.getElementById('projectDetails');
    projectDetails.innerHTML = '';
    
    // Criador do projeto
    const creator = users.find(u => u.id === project.creatorId);
    
    // Status do projeto
    let statusHtml = '';
    if (project.conflict) {
        statusHtml = '<span class="status-badge conflict">Em Conflito</span>';
    } else if (project.acceptedAdvisors.length > 0) {
        statusHtml = '<span class="status-badge active">Em Andamento</span>';
    } else {
        statusHtml = '<span class="status-badge new">Novo</span>';
    }
    
    // Tags do projeto
    const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // Conciliador se houver conflito
    let mediatorHtml = '';
    if (project.conflict && project.mediatorId) {
        const mediator = users.find(u => u.id === project.mediatorId);
        mediatorHtml = `
            <div class="detail-item">
                <span class="label">Conciliador:</span>
                <span>${mediator ? mediator.name : 'Desconhecido'}</span>
            </div>
        `;
    }
    
    projectDetails.innerHTML = `
        <div class="project-header">
            <h2>${project.title}</h2>
            ${statusHtml}
        </div>
        
        <div class="project-meta">
            <div class="detail-item">
                <span class="label">Criador:</span>
                <span>${creator ? creator.name : 'Desconhecido'}</span>
            </div>
            <div class="detail-item">
                <span class="label">Criado em:</span>
                <span>${new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            ${mediatorHtml}
        </div>
        
        <div class="project-description-full">
            <h3>Descrição</h3>
            <p>${project.description}</p>
        </div>
        
        <div class="project-tags">
            <h3>Tags</h3>
            <div class="tags-container">${tagsHtml}</div>
        </div>
        
        <div class="project-participants">
            <h3>Participantes</h3>
            <div class="participants-list">
                <div class="participant">
                    <div class="participant-avatar">${creator ? creator.name.charAt(0) : '?'}</div>
                    <div class="participant-info">
                        <div class="participant-name">${creator ? creator.name : 'Desconhecido'}</div>
                        <div class="participant-role">Projetista</div>
                    </div>
                </div>
                ${project.acceptedAdvisors.map(advisorId => {
                    const advisor = users.find(u => u.id === advisorId);
                    return `
                        <div class="participant">
                            <div class="participant-avatar">${advisor ? advisor.name.charAt(0) : '?'}</div>
                            <div class="participant-info">
                                <div class="participant-name">${advisor ? advisor.name : 'Desconhecido'}</div>
                                <div class="participant-role">Conselheiro</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // Mostrar opiniões se houver
    if (project.opinions.length > 0) {
        const opinionsHtml = project.opinions.map(opinion => {
            const advisor = users.find(u => u.id === opinion.advisorId);
            return `
                <div class="opinion-item">
                    <div class="opinion-header">
                        <div class="opinion-author">
                            <div class="author-avatar">${advisor ? advisor.name.charAt(0) : '?'}</div>
                            <div class="author-info">
                                <div class="author-name">${advisor ? advisor.name : 'Desconhecido'}</div>
                                <div class="author-role">Conselheiro</div>
                            </div>
                        </div>
                        <div class="opinion-date">${new Date(opinion.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div class="opinion-content">
                        <p>${opinion.text}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        projectDetails.innerHTML += `
            <div class="project-opinions">
                <h3>Opiniões (${project.opinions.length})</h3>
                <div class="opinions-list">
                    ${opinionsHtml}
                </div>
            </div>
        `;
    }
    
    // Mostrar mediação se houver
    if (project.mediation) {
        const mediator = users.find(u => u.id === project.mediation.mediatorId);
        projectDetails.innerHTML += `
            <div class="project-mediation">
                <h3>Mediação de Conflito</h3>
                <div class="mediation-item">
                    <div class="mediation-header">
                        <div class="mediator-info">
                            <div class="mediator-avatar">${mediator ? mediator.name.charAt(0) : '?'}</div>
                            <div class="mediator-details">
                                <div class="mediator-name">${mediator ? mediator.name : 'Desconhecido'}</div>
                                <div class="mediator-role">Conciliador</div>
                            </div>
                        </div>
                        <div class="mediation-date">${new Date(project.mediation.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div class="mediation-content">
                        <p>${project.mediation.text}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Adicionar botões de ação
    const actionsHtml = [];
    
    // Se for conselheiro aceito, mostrar botão para adicionar opinião
    if (project.acceptedAdvisors.includes(currentUser.id) && currentUser.role === 'Conselheiro') {
        const existingOpinion = project.opinions.find(o => o.advisorId === currentUser.id);
        
        if (!existingOpinion) {
            actionsHtml.push(`
                <button class="btn-primary add-opinion-btn" data-id="${project.id}">
                    <i class="icon">💬</i> Adicionar Opinião
                </button>
            `);
        } else if (!existingOpinion.ratingGiven) {
            actionsHtml.push(`
                <button class="btn-primary rate-btn" data-id="${project.creatorId}">
                    <i class="icon">⭐</i> Avaliar Projeto
                </button>
            `);
        }
    }
    
    // Se for conciliador e houver conflito, mostrar botão para mediar
    if (project.conflict && project.mediatorId === currentUser.id && currentUser.role === 'Conciliador') {
        actionsHtml.push(`
            <button class="btn-primary mediate-btn" data-id="${project.id}">
                <i class="icon">🤝</i> Enviar Mediação
            </button>
        `);
    }
    
    if (actionsHtml.length > 0) {
        projectDetails.innerHTML += `
            <div class="project-actions">
                ${actionsHtml.join('')}
            </div>
        `;
        
        // Adicionar event listeners aos botões
        if (projectDetails.querySelector('.add-opinion-btn')) {
            projectDetails.querySelector('.add-opinion-btn').addEventListener('click', () => showOpinionModal(project.id));
        }
        
        if (projectDetails.querySelector('.rate-btn')) {
            projectDetails.querySelector('.rate-btn').addEventListener('click', () => showRatingModal(project.creatorId));
        }
        
        if (projectDetails.querySelector('.mediate-btn')) {
            projectDetails.querySelector('.mediate-btn').addEventListener('click', () => showMediationModal(project.id));
        }
    }
    
    // Mostrar modal
    document.getElementById('projectModal').classList.add('active');
}

// Aceitar convite
function acceptInvitation(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Adicionar conselheiro à lista de aceitos
    if (!project.acceptedAdvisors.includes(currentUser.id)) {
        project.acceptedAdvisors.push(currentUser.id);
        saveProjects();
        
        // Adicionar ao histórico do usuário
        currentUser.history.push({
            type: 'invitation_accepted',
            projectId: project.id,
            timestamp: new Date().toISOString()
        });
        saveUsers();
        
        // Recarregar projetos
        loadProjects();
        
        showNotification('Convite aceito com sucesso!', 'success');
    }
}

// Recusar convite
function declineInvitation(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Remover conselheiro da lista de convidados
    project.invitedAdvisors = project.invitedAdvisors.filter(id => id !== currentUser.id);
    saveProjects();
    
    // Adicionar ao histórico do usuário
    currentUser.history.push({
        type: 'invitation_declined',
        projectId: project.id,
        timestamp: new Date().toISOString()
    });
    saveUsers();
    
    // Recarregar projetos
    loadProjects();
    
    showNotification('Convite recusado!', 'info');
}

// Marcar conflito
function markConflict(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Verificar se já há conflito
    if (project.conflict) {
        showNotification('Este projeto já está em conflito!', 'warning');
        return;
    }
    
    // Marcar conflito
    project.conflict = true;
    
    // Selecionar conciliador com melhor avaliação
    const mediators = users.filter(u => u.role === 'Conciliador');
    
    if (mediators.length > 0) {
        // Ordenar por avaliação (maior primeiro)
        mediators.sort((a, b) => b.rating - a.rating);
        
        // Selecionar o melhor avaliado
        project.mediatorId = mediators[0].id;
        
        // Adicionar ao histórico do conciliador
        const mediator = users.find(u => u.id === project.mediatorId);
        mediator.history.push({
            type: 'conflict_assigned',
            projectId: project.id,
            timestamp: new Date().toISOString()
        });
        saveUsers();
    }
    
    saveProjects();
    
    // Adicionar ao histórico do usuário
    currentUser.history.push({
        type: 'conflict_marked',
        projectId: project.id,
        timestamp: new Date().toISOString()
    });
    saveUsers();
    
    // Recarregar projetos
    loadProjects();
    
    showNotification('Conflito marcado com sucesso! Um conciliador será notificado.', 'success');
}

// Mostrar modal de opinião
function showOpinionModal(projectId) {
    document.getElementById('opinionForm').setAttribute('data-project-id', projectId);
    document.getElementById('opinionModal').classList.add('active');
}

// Enviar opinião
function submitOpinion() {
    const projectId = document.getElementById('opinionForm').getAttribute('data-project-id');
    const opinionText = document.getElementById('opinionText').value;
    
    if (!opinionText.trim()) {
        showNotification('Por favor, escreva sua opinião!', 'warning');
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Adicionar opinião ao projeto
    project.opinions.push({
        advisorId: currentUser.id,
        text: opinionText,
        ratingGiven: false,
        timestamp: new Date().toISOString()
    });
    
    saveProjects();
    
    // Adicionar ao histórico do usuário
    currentUser.history.push({
        type: 'opinion_submitted',
        projectId: project.id,
        timestamp: new Date().toISOString()
    });
    saveUsers();
    
    // Limpar formulário e fechar modal
    document.getElementById('opinionText').value = '';
    document.getElementById('opinionModal').classList.remove('active');
    
    // Recarregar detalhes do projeto
    showProjectDetails(projectId);
    
    showNotification('Opinião enviada com sucesso!', 'success');
}

// Mostrar modal de mediação
function showMediationModal(projectId) {
    document.getElementById('mediationForm').setAttribute('data-project-id', projectId);
    document.getElementById('mediationModal').classList.add('active');
}

// Enviar mediação
function submitMediation() {
    const projectId = document.getElementById('mediationForm').getAttribute('data-project-id');
    const mediationText = document.getElementById('mediationText').value;
    
    if (!mediationText.trim()) {
        showNotification('Por favor, escreva sua sugestão!', 'warning');
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Adicionar mediação ao projeto
    project.mediation = {
        mediatorId: currentUser.id,
        text: mediationText,
        timestamp: new Date().toISOString()
    };
    
    // Resolver conflito
    project.conflict = false;
    
    saveProjects();
    
    // Adicionar ao histórico do usuário
    currentUser.history.push({
        type: 'mediation_submitted',
        projectId: project.id,
        timestamp: new Date().toISOString()
    });
    saveUsers();
    
    // Limpar formulário e fechar modal
    document.getElementById('mediationText').value = '';
    document.getElementById('mediationModal').classList.remove('active');
    
    // Recarregar detalhes do projeto
    showProjectDetails(projectId);
    
    showNotification('Mediação enviada com sucesso!', 'success');
}

// Mostrar modal de avaliação
function showRatingModal(toUserId) {
    document.getElementById('ratingForm').setAttribute('data-to-user-id', toUserId);
    document.getElementById('ratingModal').classList.add('active');
}

// Enviar avaliação
function submitRating() {
    const toUserId = document.getElementById('ratingForm').getAttribute('data-to-user-id');
    const ratingValue = document.querySelector('input[name="rating"]:checked');
    
    if (!ratingValue) {
        showNotification('Por favor, selecione uma avaliação!', 'warning');
        return;
    }
    
    const value = parseInt(ratingValue.value);
    
    // Criar avaliação
    const newRating = {
        fromUserId: currentUser.id,
        toUserId: toUserId,
        value: value,
        timestamp: new Date().toISOString()
    };
    
    ratings.push(newRating);
    saveRatings();
    
    // Atualizar avaliação do usuário
    const toUser = users.find(u => u.id === toUserId);
    if (toUser) {
        // Calcular média de avaliações
        const userRatings = ratings.filter(r => r.toUserId === toUserId);
        const sum = userRatings.reduce((acc, curr) => acc + curr.value, 0);
        toUser.rating = sum / userRatings.length;
        
        saveUsers();
        
        // Adicionar ao histórico do usuário
        currentUser.history.push({
            type: 'rating_given',
            toUserId: toUserId,
            value: value,
            timestamp: new Date().toISOString()
        });
        saveUsers();
    }
    
    // Marcar que a avaliação foi dada
    const project = projects.find(p => 
        p.opinions.some(o => o.advisorId === currentUser.id && !o.ratingGiven)
    );
    
    if (project) {
        const opinion = project.opinions.find(o => o.advisorId === currentUser.id);
        if (opinion) {
            opinion.ratingGiven = true;
            saveProjects();
        }
    }
    
    // Limpar formulário e fechar modal
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.checked = false;
    });
    document.getElementById('ratingModal').classList.remove('active');
    
    // Recarregar detalhes do projeto
    if (project) {
        showProjectDetails(project.id);
    }
    
    showNotification('Avaliação enviada com sucesso!', 'success');
}

// Atualizar função do usuário
function updateRole() {
    const newRole = document.getElementById('changeRole').value;
    
    if (newRole === currentUser.role) {
        showNotification('Você já possui esta função!', 'warning');
        return;
    }
    
    // Atualizar função
    const oldRole = currentUser.role;
    currentUser.role = newRole;
    saveUsers();
    
    // Atualizar interface
    document.getElementById('profileRole').textContent = newRole;
    
    // Adicionar ao histórico
    currentUser.history.push({
        type: 'role_changed',
        oldRole: oldRole,
        newRole: newRole,
        timestamp: new Date().toISOString()
    });
    saveUsers();
    
    showNotification('Função atualizada com sucesso!', 'success');
}

// Carregar histórico do usuário
function loadUserHistory() {
    const historyList = document.getElementById('userHistory');
    historyList.innerHTML = '';
    
    if (currentUser.history.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><p>Você ainda não tem histórico de atividades.</p></div>';
        return;
    }
    
    // Ordenar histórico por data (mais recente primeiro)
    const sortedHistory = [...currentUser.history].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    sortedHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(item.timestamp).toLocaleString();
        let description = '';
        let icon = '';
        
        switch (item.type) {
            case 'project_created':
                const project = projects.find(p => p.id === item.projectId);
                description = `Criou o projeto "${project ? project.title : 'Projeto desconhecido'}"`;
                icon = '💡';
                break;
            case 'invitation_accepted':
                const accProject = projects.find(p => p.id === item.projectId);
                description = `Aceitou convite para o projeto "${accProject ? accProject.title : 'Projeto desconhecido'}"`;
                icon = '✅';
                break;
            case 'invitation_declined':
                const decProject = projects.find(p => p.id === item.projectId);
                description = `Recusou convite para o projeto "${decProject ? decProject.title : 'Projeto desconhecido'}"`;
                icon = '❌';
                break;
            case 'opinion_submitted':
                const opProject = projects.find(p => p.id === item.projectId);
                description = `Enviou uma opinião para o projeto "${opProject ? opProject.title : 'Projeto desconhecido'}"`;
                icon = '💬';
                break;
            case 'conflict_marked':
                const confProject = projects.find(p => p.id === item.projectId);
                description = `Marcou conflito no projeto "${confProject ? confProject.title : 'Projeto desconhecido'}"`;
                icon = '⚠️';
                break;
            case 'conflict_assigned':
                const confAssignedProject = projects.find(p => p.id === item.projectId);
                description = `Foi designado para mediar conflito no projeto "${confAssignedProject ? confAssignedProject.title : 'Projeto desconhecido'}"`;
                icon = '🤝';
                break;
            case 'mediation_submitted':
                const medProject = projects.find(p => p.id === item.projectId);
                description = `Enviou uma mediação para o projeto "${medProject ? medProject.title : 'Projeto desconhecido'}"`;
                icon = '✍️';
                break;
            case 'rating_given':
                const ratedUser = users.find(u => u.id === item.toUserId);
                description = `Avaliou ${ratedUser ? ratedUser.name : 'usuário desconhecido'} com ${item.value} estrelas`;
                icon = '⭐';
                break;
            case 'role_changed':
                description = `Alterou sua função de ${item.oldRole} para ${item.newRole}`;
                icon = '🔄';
                break;
            default:
                description = 'Atividade desconhecida';
                icon = '❓';
        }
        
        historyItem.innerHTML = `
            <div class="history-content">
                <div class="history-icon">${icon}</div>
                <div class="history-text">${description}</div>
                <div class="history-date">${date}</div>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Carregar dados do dashboard
function loadDashboardData() {
    // Carregar projetos
    loadProjects();
    
    // Carregar histórico do usuário
    loadUserHistory();
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Ícone baseado no tipo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'warning':
            icon = '⚠️';
            break;
        default:
            icon = 'ℹ️';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Adicionar ao corpo
    document.body.appendChild(notification);
    
    // Adicionar evento para fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}