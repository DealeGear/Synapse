

# Synapse - Rede Social Experimental

![Synapse Logo](https://img.shields.io/badge/Synapse-Rede%20Social-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

Synapse é uma rede social experimental inspirada em conceitos do Bluesky, desenvolvida com HTML, CSS e JavaScript puro. Foi projetada para fortalecer comunidades através de interações significativas e visualizações inovadoras de conexões sociais.

## 🌟 Funcionalidades Principais

### Sistema de Usuários
- ✅ Cadastro e login seguro
- ✅ Perfis personalizados com avatar e biografia
- ✅ Armazenamento persistente no localStorage
- ✅ Sistema de sugestões de usuários

### Feed Principal
- ✅ Publicação de posts com texto, imagens e links
- ✅ Sistema de curtidas, comentários e reposts
- ✅ Hashtags clicáveis e tendências
- ✅ Ordenação cronológica (mais recentes primeiro)

### Interações Sociais
- ✅ Seguir/deixar de seguir usuários
- ✅ Notificações em tempo real
- ✅ Sistema de denúncias para moderação
- ✅ Feed personalizado baseado em conexões

### Visualizações Inovadoras
- ✅ **Grafo de Conexões**: Visualização interativa da rede social
- ✅ **Mapa Mental**: Representação visual de posts e comentários como ramificações
- ✅ **Clusters**: Grupos temáticos para discussões coletivas

### Recursos Adicionais
- ✅ Modo claro/escuro
- ✅ Design responsivo (desktop e mobile)
- ✅ Sistema de gamificação com conquistas
- ✅ Busca avançada por usuários, posts e hashtags
- ✅ Interface minimalista e moderna

## 🚀 Demonstração

### Usuário Demo
Para testar a aplicação, use as credenciais:
- **Username**: `demo`
- **Senha**: `demo123`

### Screenshots

#### Página Principal
![Feed Principal](https://via.placeholder.com/800x400?text=Feed+Principal+do+Synapse)

#### Visualização em Grafo
![Grafo de Conexões](https://via.placeholder.com/800x400?text=Visualização+em+Grafo)

#### Mapa Mental
![Mapa Mental](https://via.placeholder.com/800x400?text=Mapa+Mental+de+Posts)

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos com variáveis CSS e animações
- **JavaScript ES6+**: Lógica da aplicação sem frameworks
- **LocalStorage**: Persistência de dados no cliente
- **Canvas API**: Visualizações gráficas (grafo e mapa mental)
- **Font Awesome**: Ícones vetoriais

## 📦 Estrutura do Projeto

```
synapse/
├── index.html          # Estrutura principal da aplicação
├── style.css           # Estilos visuais e design responsivo
├── script.js           # Funcionalidades principais
├── README.md           # Documentação do projeto
└── assets/             # Recursos estáticos (opcional)
    └── images/         # Imagens e ícones
```

## 🚀 Como Usar

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/synapse.git
   cd synapse
   ```

2. **Abra o projeto**
   - Você pode abrir o `index.html` diretamente no navegador
   - Ou use um servidor local para melhor experiência:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js
     npx http-server
     ```

3. **Acesse a aplicação**
   - Abra `http://localhost:8000` no seu navegador
   - Cadastre uma nova conta ou use o usuário demo

### Funcionalidades Passo a Passo

#### 1. Criando uma Conta
- Preencha o formulário de cadastro com username, senha e biografia opcional
- Seu avatar será gerado automaticamente
- Após o cadastro, você será redirecionado para o feed principal

#### 2. Publicando um Post
- Na página inicial, digite seu conteúdo na caixa de publicação
- Use hashtags (#) para categorizar seu conteúdo
- Clique em "Publicar" para compartilhar

#### 3. Interagindo com Conteúdo
- **Curtir**: Clique no coração para curtir posts
- **Comentar**: Expanda a seção de comentários para participar
- **Repostar**: Compartilhe conteúdo de outros usuários

#### 4. Explorando Conexões
- Acesse a página "Conexões" para ver sua rede social
- Alterne entre visualização em lista e grafo interativo
- Clique em "Seguir" para conectar-se com novos usuários

#### 5. Usando Clusters
- Na página "Clusters", explore grupos temáticos
- Crie seu próprio cluster para discussões específicas
- Participe de comunidades existentes

#### 6. Visualização em Mapa Mental
- No seu perfil, acesse a aba "Mapa Mental"
- Veja seus posts e comentários como uma estrutura em árvore
- Explore as ramificações de cada interação

## 🎮 Gamificação

Desbloqueie conquistas enquanto usa a plataforma:

- **🥇 Primeiro Passo**: Criar sua conta
- **✍️ Primeira Palavra**: Fazer seu primeiro post
- **🤝 Conectado**: Seguir seu primeiro usuário
- **🔥 Popular**: Ter um post com 10+ curtidas
- **🌟 Influenciador**: Alcançar 100 seguidores

## 🌙 Modo Escuro

- Clique no ícone da lua/no sol no canto superior direito
- Alternar entre tema claro e escuro
- Sua preferência será salva automaticamente

## 🔧 Personalização

### Adicionando Novas Funcionalidades

O código foi estruturado para ser facilmente extensível:

```javascript
// Exemplo: Adicionar novo tipo de notificação
addNotification({
    type: 'newType',
    from: currentUser,
    to: targetUser,
    data: additionalData,
    timestamp: new Date().toISOString()
});
```

### Estilização Personalizada

Use as variáveis CSS no início de `style.css` para personalizar cores:

```css
:root {
    --primary-color: #0066ff;    /* Cor principal */
    --secondary-color: #00d4ff;  /* Cor secundária */
    --background-color: #ffffff; /* Fundo */
    /* ... outras variáveis */
}
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Diretrizes de Contribuição

- Mantenha o código limpo e bem comentado
- Siga o padrão de nomenclatura existente
- Teste suas alterações em diferentes navegadores
- Atualize a documentação conforme necessário

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **Bluesky** pela inspiração no conceito de rede social descentralizada
- **Font Awesome** pelos ícones vetoriais
- Comunidade de desenvolvedores web por recursos e tutoriais

## 📞 Contato

- **Autor**: Seu Nome
- **Email**: seu.email@exemplo.com
- **Projeto**: https://github.com/seu-usuario/synapse
- **Issues**: https://github.com/seu-usuario/synapse/issues

## 🗺️ Roadmap

### Próximas Funcionalidades Planejadas

- [ ] Sistema de mensagens diretas (DM)
- [ ] Histórias (Stories) temporárias
- [ ] Editor avançado com formatação
- [ ] Integração com API externas
- [ ] Aplicativo mobile (PWA)
- [ ] Sistema de eventos
- [ ] Analytics pessoal
- [ ] Moderação com IA

---

**Synapse** - Conectando mentes, construindo comunidades. 🧠✨