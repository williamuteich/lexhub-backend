# ⚖️ LexHub - Plataforma de Gestão Jurídica

## 📋 Sobre o Projeto

**LexHub** é uma plataforma completa de gestão jurídica que conecta advogados e clientes de forma eficiente e moderna. O sistema centraliza informações de processos, documentos e permite comunicação direta através de chat integrado.

### 🎯 Objetivo

Facilitar a comunicação e o acompanhamento de processos entre advogados e clientes, proporcionando uma experiência moderna e intuitiva para ambas as partes.

### 🏗️ Arquitetura

O projeto é dividido em três aplicações:

- **Backend (NestJS)** - API RESTful robusta e escalável *(este repositório)*
- **Dashboard Web (Angular)** - Interface administrativa para advogados
- **Mobile (React Native)** - App para clientes consultarem processos e suporte via chat

---

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset tipado de JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Prisma** - ORM moderno
- **Cloudflare R2** - Armazenamento de arquivos
- **JWT** - Autenticação e autorização

---

## 🔧 Configuração do Ambiente

### Pré-requisitos

- Node.js
- MongoDB
- Conta Cloudflare com R2 habilitado

### Instalação

1. **Clone o repositório**
```bash
git clone [https://github.com/seu-usuario/lexhub-backend.git](https://github.com/williamuteich/lexhub-backend.git)
cd lexhub-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/lexhub"

# JWT
JWT_SECRET="seu_secret_super_seguro_aqui"
JWT_EXPIRES_IN="7d"

# Cloudflare R2
R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="sua_access_key_id"
R2_SECRET_ACCESS_KEY="sua_secret_access_key"
R2_PUBLIC_URL="https://pub-xxxxx.r2.dev"

# Application
PORT=3000
NODE_ENV=development
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

5. **Inicie a aplicação**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

6. **Acesse a documentação da API**

Abra seu navegador em: `http://localhost:3000/api`

---

## 🗺️ Status do Projeto

🚧 **Em desenvolvimento ativo** - Novas funcionalidades sendo implementadas constantemente.

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 📞 Contato

**Email: williamuteich14@gmail.com

---

<p align="center">Desenvolvido para facilitar a gestão jurídica</p>
