

```markdown
# Synapse - Rede de Ideias Interconectadas

![Synapse Logo](https://img.shields.io/badge/Synapse-Ideias%20Interconectadas-blueviolet?style=for-the-badge&logo=brain&logoColor=white)

Synapse é uma aplicação web inovadora que cria uma rede visual de ideias interconectadas, permitindo que usuários compartilhem, conectem e explorem conceitos de forma colaborativa. Diferente das redes sociais tradicionais, o Synapse foca na construção de um conhecimento coletivo visualizado através de um grafo interativo.

## 🌟 Características Principais

- 🧠 **Mapa Visual de Ideias**: Visualização interativa em grafo mostrando conexões entre conceitos
- 🔗 **Conexões Inteligentes**: Ideias são automaticamente conectadas baseadas em tags em comum
- ⚡ **Faíscas**: Crie conexões manuais entre ideias existentes
- 💬 **Ramificações**: Adicione comentários que se tornam novos nós no grafo
- 🎲 **Exploração Aleatória**: Descubra ideias surpresa para inspiração
- 🌓 **Modo Claro/Escuro**: Interface adaptável às suas preferências
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- 💾 **Persistência Local**: Todos os dados são salvos no navegador

## 🚀 Instalação

1. Clone este repositório ou baixe os arquivos:
   ```bash
   git clone https://github.com/seu-usuario/synapse.git
   cd synapse
   ```

2. Abra o arquivo `index.html` em seu navegador web preferido:
   ```bash
   # No macOS
   open index.html
   
   # No Windows
   start index.html
   
   # No Linux
   xdg-open index.html
   ```

Ou simplesmente arraste o arquivo `index.html` para uma janela do navegador.

## 📋 Estrutura do Projeto

```
synapse/
├── index.html      # Estrutura HTML principal
├── style.css       # Estilos e design
├── script.js       # Lógica da aplicação
└── README.md       # Este arquivo
```

## 🎯 Como Usar

### 1. Criando uma Conta
- Abra o aplicativo e clique em "Cadastre-se"
- Preencha seu nome de usuário e senha
- Opcionalmente, adicione uma URL para seu avatar
- Clique em "Criar Conta"

### 2. Fazendo Login
- Use seu nome de usuário e senha para acessar o sistema
- Você será redirecionado para o mapa principal de ideias

### 3. Criando uma Nova Ideia
- Clique em "✨ Criar Nó de Ideia" na barra lateral
- Escreva sua ideia no campo de texto
- Adicione links relevantes (opcional)
- Inclua tags para ajudar na conexão automática
- Pressione Enter para adicionar cada tag
- Clique em "Salvar Nó"

### 4. Navegando pelo Mapa
- **Arraste**: Clique e arraste para mover o mapa
- **Zoom**: Use o scroll do mouse para dar zoom in/out
- **Selecionar**: Clique em qualquer nó para ver detalhes
- **Buscar**: Use o campo de busca para encontrar ideias por tags ou palavras

### 5. Interagindo com Ideias
- **Visualizar**: Clique em um nó para ver conteúdo completo
- **Comentar**: Clique em "💬 Comentar" para criar uma ramificação
- **Criar Faísca**: Clique em "⚡ Criar Faísca" para conectar duas ideias
- **Explorar**: Use "🎲 Explorar Nó Aleatório" para descobertas surpresa

### 6. Seu Perfil
- Acesse seu perfil clicando em "👤 Ver Perfil"
- Veja estatísticas de suas contribuições
- Navegue por todas as suas ideias criadas

## 🎨 Conceitos do Sistema

### Nós de Ideia
Cada nó representa uma ideia única contendo:
- Conteúdo textual
- Autor e data de criação
- Tags para categorização
- Links opcionais para recursos externos

### Conexões
- **Conexões Automáticas**: Criadas quando novas ideias compartilham tags com ideias existentes
- **Faíscas**: Conexões manuais criadas por usuários entre ideias relacionadas
- **Ramificações**: Comentários que se tornam novos nós conectados à ideia original

### Tags
Sistema de categorização que:
- Ajuda na organização do conteúdo
- Permite busca eficiente
- Facilita conexões automáticas entre ideias relacionadas

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e elementos modernos
- **CSS3**: Estilos avançados com variáveis, flexbox e animações
- **JavaScript ES6+**: Lógica da aplicação com classes modernas
- **Canvas API**: Renderização do mapa interativo de ideias
- **LocalStorage**: Persistência de dados no navegador
- **Web APIs**: Navegação e manipulação DOM

## 🌈 Design e Interface

### Paleta de Cores
- **Primário**: Indigo (#6366f1)
- **Secundário**: Purple (#a855f7)
- **Acento**: Pink (#ec4899)
- **Modo Escuro**: Interface adaptável para baixa luminosidade

### Princípios de Design
- **Minimalismo**: Interface limpa e focada no conteúdo
- **Acessibilidade**: Contraste adequado e navegação intuitiva
- **Responsividade**: Adaptação a diferentes tamanhos de tela
- **Microinterações**: Animações suaves e feedback visual

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Áreas para Contribuição
- Melhorias na interface do usuário
- Otimizações de performance
- Novos tipos de conexões
- Algoritmos de layout de grafo
- Recursos de colaboração em tempo real

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- A todos os usuários que contribuem com suas ideias
- À comunidade de desenvolvedores web por inspiração
- Aos designers que criam interfaces intuitivas

## 📞 Contato

- **Projeto**: [Synapse GitHub Repository](https://github.com/seu-usuario/synapse)
- **Issues**: [Reportar Bugs ou Solicitar Features](https://github.com/seu-usuario/synapse/issues)
- **Discussions**: [Participe da Comunidade](https://github.com/seu-usuario/synapse/discussions)

---

**Synapse** - Onde ideias se conectam e conhecimento floresce. 🌸✨
```