Prompt ultra detalhado para IA gerar o MVP do Synapse:

Crie um MVP funcional do Synapse usando HTML, CSS e JavaScript puro, separado em três arquivos (index.html, style.css, script.js). A aplicação roda 100% no navegador, usando localStorage para armazenar todos os dados. Não usar frameworks ou bibliotecas externas.

O Synapse deve permitir que Projetistas criem ideias, Conselheiros opinem e Conciliadores mediem conflitos, com sistema de notas para avaliar interações.

Estruturas de dados sugeridas para localStorage
// Usuários
user = {
    id: 'uniqueID',
    name: 'Nome do usuário',
    password: 'senha', 
    role: 'Projetista|Conselheiro|Conciliador',
    rating: 0, // média das notas recebidas
    history: [] // lista de interações
}

// Projetos
project = {
    id: 'uniqueProjectID',
    title: 'Título do projeto',
    description: 'Descrição detalhada',
    tags: ['tag1', 'tag2'],
    creatorId: 'userID do projetista',
    invitedAdvisors: ['userID1', 'userID2'],
    acceptedAdvisors: ['userID'],
    opinions: [
        { advisorId: 'userID', text: 'Opinião', ratingGiven: false }
    ],
    conflict: false,
    mediatorId: null
}

// Notas
rating = {
    fromUserId: 'userID',
    toUserId: 'userID',
    value: 1-5
}

Fluxo detalhado de telas e funcionalidades

1. Tela de Login/Cadastro

Campos: nome, senha, função inicial (Projetista, Conselheiro, Conciliador)

Botões: Entrar, Criar Conta

Ao criar conta: salvar usuário no localStorage

Ao login: salvar usuário ativo (currentUser) no localStorage e abrir Dashboard

2. Dashboard (tela principal)

Cabeçalho: nome do usuário logado + botão Logout

Menu lateral: Criar Ideia | Ver Projetos | Perfil

Área central: lista de projetos visíveis (dependendo da função do usuário)

3. Criação de ideia (Projetista)

Modal com campos: título, descrição, tags

Lista de Conselheiros disponíveis com checkbox para convidar

Botão Salvar → cria projeto, salva no localStorage e envia convites

4. Aceite de convites (Conselheiro)

Lista de convites pendentes

Botões: Aceitar / Recusar

Aceitar: permite escrever opinião

Recusar: remove do convite

5. Opiniões (Conselheiro)

Campo de texto para escrever opinião

Botão Enviar → adiciona opinião ao projeto no localStorage

6. Mediação (Conciliador)

Projetista marca conflito → sistema seleciona conciliador mais bem avaliado

Conciliador escreve mensagem ou sugestão

Salvar mediação no localStorage

7. Sistema de notas

Usuário pode dar nota de 1 a 5 após interação

Salvar nota → recalcular média do usuário

Nota influencia futuras escolhas de convites e seleção de conciliadores

8. Perfil do usuário

Exibir: nome, função, nota média, histórico de projetos/opiniões/mediações

Botão para alterar função

Layout e estilo

Tema escuro, cores azul e roxo, gradientes suaves

Responsivo para desktop e mobile

Cards para projetos, convites e opiniões

Modais para criação de ideias e envio de opiniões

Botões animados suavemente

Funções JS sugeridas

createUser(userObject) → salva no localStorage

login(name, password) → valida e retorna usuário

createProject(projectObject) → salva projeto e envia convites

acceptInvitation(projectId, advisorId) → adiciona Conselheiro aceito

submitOpinion(projectId, advisorId, text) → salva opinião

markConflict(projectId) → seleciona conciliador

giveRating(fromUserId, toUserId, value) → salva nota e recalcula média