# DevsConnect - Rede Social para Desenvolvedores

Uma rede social completa focada em programadores, onde é possível compartilhar projetos, encontrar vagas de emprego e conectar-se com outros desenvolvedores.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Sistema de Autenticação**: Registro e login de usuários
- **Projetos**: Criar, listar, curtir e comentar projetos
- **Vagas de Emprego**: Sistema completo de vagas com filtros
- **Plano Premium**: Upgrade para funcionalidades premium
- **Interface Responsiva**: Design moderno e responsivo
- **Limitações**: Usuários gratuitos têm limite de 5 candidaturas por mês

### 🎯 Recursos Premium
- Candidaturas ilimitadas a vagas
- Badge premium no perfil
- Destaque em projetos
- Acesso a vagas exclusivas
- Suporte prioritário

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Mongoose** - ODM para MongoDB

### Frontend
- **React** - Biblioteca JavaScript
- **React Router** - Roteamento
- **Styled Components** - Estilização
- **Axios** - Cliente HTTP
- **React Icons** - Ícones

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- MongoDB (local ou MongoDB Atlas)

### 1. Clone o repositório
```bash
git clone https://github.com/ricardomilos117-dev/DevsConnect.git
cd DevsConnect
```

### 2. Instale as dependências do backend
```bash
npm install
```

### 3. Instale as dependências do frontend
```bash
cd client
npm install
cd ..
```

### 4. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# Porta do servidor
PORT=12000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/devsconnect
# Ou use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devsconnect

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui

# Ambiente
NODE_ENV=development
```

### 5. Execute a aplicação

#### Opção 1: Executar backend e frontend separadamente

**Terminal 1 - Backend:**
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

#### Opção 2: Executar ambos simultaneamente
```bash
npm run dev:full
```

### 6. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:12000

## 🗂️ Estrutura do Projeto

```
DevsConnect/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Context API
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── styles/         # Estilos globais
│   │   └── utils/          # Utilitários e API
│   └── package.json
├── config/                 # Configurações
├── middleware/             # Middlewares Express
├── models/                 # Modelos MongoDB
├── routes/                 # Rotas da API
├── server.js              # Servidor principal
├── package.json
└── README.md
```

## 🔧 Scripts Disponíveis

### Backend
- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento com nodemon
- `npm run dev:full` - Inicia backend e frontend simultaneamente

### Frontend (dentro da pasta client/)
- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa testes
- `npm run eject` - Ejeta configurações do Create React App

## 🚨 Solução de Problemas Comuns

### Erro: "Cannot find module"
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install

# Para o frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port already in use"
```bash
# Mate processos nas portas
sudo lsof -ti:12000 | xargs kill -9
sudo lsof -ti:3000 | xargs kill -9
```

### Erro de conexão com MongoDB
1. Verifique se o MongoDB está rodando:
```bash
# Para MongoDB local
sudo systemctl start mongod
# ou
brew services start mongodb/brew/mongodb-community
```

2. Ou use MongoDB Atlas (recomendado):
   - Crie uma conta em https://cloud.mongodb.com
   - Crie um cluster gratuito
   - Obtenha a string de conexão
   - Atualize a variável `MONGODB_URI` no arquivo `.env`

### Erro: "Module not found: Can't resolve 'styled-components'"
```bash
cd client
npm install styled-components react-icons axios react-router-dom
```

## 🌐 Deploy

### Heroku
1. Instale o Heroku CLI
2. Faça login: `heroku login`
3. Crie uma aplicação: `heroku create devsconnect-app`
4. Configure as variáveis de ambiente no Heroku
5. Faça deploy: `git push heroku main`

### Vercel (Frontend)
1. Instale o Vercel CLI: `npm i -g vercel`
2. Na pasta `client/`: `vercel --prod`

### Railway (Backend)
1. Conecte seu repositório no Railway
2. Configure as variáveis de ambiente
3. Deploy automático

## 📱 Funcionalidades Detalhadas

### Sistema de Usuários
- Registro com validação
- Login com JWT
- Perfis de usuário
- Sistema de seguidores

### Projetos
- Criação de projetos com tecnologias
- Upload de imagens
- Sistema de curtidas
- Comentários
- Filtros por tecnologia

### Vagas de Emprego
- Criação de vagas por empresas
- Filtros por nível, tipo e localização
- Sistema de candidaturas
- Limitações para usuários gratuitos

### Plano Premium
- Upgrade via simulação de pagamento
- Candidaturas ilimitadas
- Badge premium
- Recursos exclusivos

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Ricardo Milos**
- GitHub: [@ricardomilos117-dev](https://github.com/ricardomilos117-dev)

## 🙏 Agradecimentos

- Design inspirado em redes sociais modernas
- Comunidade React e Node.js
- Contribuidores do projeto

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!