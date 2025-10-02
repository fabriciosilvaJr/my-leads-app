# My Leads App

Aplicativo para gerenciar leads, construído com **Next.js** e **MongoDB**. Permite visualizar, buscar, deletar e exportar leads.

---

## 🛠 Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- Node.js

---

## ⚙️ Pré-requisitos

- Node.js >= 20
- Conta no MongoDB Atlas ou MongoDB local

---

## 🚀 Instalação

### 1. Clone o repositório:

```bash
git clone https://github.com/fabriciosilvaJr/my-leads-app.git
cd my-leads-app
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Configure as variáveis de ambiente:

Renomeie o arquivo `env.example` para `.env.local` e preencha a URI do MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DATABASE>?retryWrites=true&w=majority
```

### 4. Execute o script de inicialização:

Antes de rodar o projeto, execute o script para criar o usuário admin:

```bash
node scripts/seedUser.js
```

**Credenciais padrão:**
- Email: `admin@teste.com`
- Senha: `123456`

### 5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

---

## ✨ Funcionalidades

- ✅ Listagem de leads
- 🔍 Busca por nome ou email
- 👁️ Visualização de detalhes de cada lead
- 🗑️ Exclusão de leads
- 📊 Exportação de leads em CSV
- 👤 Usuário admin pré-configurado

---




