# ⚖️ LexHub - Plataforma de Gestão Jurídica

## 📋 Sobre o Projeto

**LexHub** é uma plataforma completa de gestão jurídica que conecta advogados e clientes de forma eficiente e moderna. O sistema centraliza informações de processos, documentos, boletos, agendamentos e permite comunicação direta através de chat integrado.

### 🎯 Objetivo

Facilitar a comunicação e o acompanhamento de processos entre advogados e clientes, proporcionando uma experiência moderna e intuitiva para ambas as partes.

### 🏗️ Arquitetura

O projeto é dividido em duas aplicações:

- **Backend (NestJS)** - API RESTful robusta e escalável *(este repositório)*
- **Dashboard Web (Angular)** - Interface administrativa para advogados
- **PWA (Progressive Web App)** - Aplicação web progressiva para clientes consultarem processos, documentos e suporte via chat

---

## ✨ Funcionalidades

### 👥 Gestão de Usuários e Clientes
- Autenticação JWT com roles (Admin, Colaborador, Cliente)
- Upload de avatares
- Recuperação de senha via email
- Controle de acesso baseado em permissões

### ⚖️ Gestão de Processos
- CRUD completo de processos jurídicos
- Vinculação com clientes e advogados responsáveis
- Status e tipos de processo
- Informações de tribunal
- Upload de documentos do processo

### 📄 Gestão de Documentos
- Upload de documentos por cliente
- Armazenamento seguro no Cloudflare R2
- Suporte a múltiplos formatos (PDF, imagens, Word)
- Listagem por cliente

### 💰 Gestão de Boletos
- Upload de boletos por cliente
- Controle de vencimento
- Status de pagamento
- Observações e títulos personalizados

### 📅 Agendamentos
- Criação de compromissos com clientes
- Informações de data, hora e local
- Suporte a links de reunião online
- Listagem por cliente

### 📍 Endereços
- Cadastro de endereço por cliente (relação 1:1)
- Informações completas (CEP, rua, número, complemento, cidade, estado)

### 💬 Chat em Tempo Real
- Comunicação direta entre advogados e clientes
- Mensagens instantâneas
- Histórico de conversas

---

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset tipado de JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Prisma** - ORM moderno
- **Cloudflare R2** - Armazenamento de arquivos
- **JWT** - Autenticação e autorização
- **Swagger** - Documentação automática da API
- **Nodemailer** - Envio de emails
- **Throttler** - Rate limiting

---

## 🔧 Configuração do Ambiente

### Pré-requisitos

- Node.js
- MongoDB
- Conta Cloudflare com R2 habilitado

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/williamuteich/lexhub-backend.git
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
R2_BUCKET_NAME="lexhub"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app"
EMAIL_FROM="LexHub <noreply@lexhub.com>"

# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:4200"
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

## 📚 Estrutura da API

### Endpoints Principais

#### Autenticação
- `POST /auth/login` - Login de usuários
- `POST /auth/register` - Registro de novos usuários
- `POST /password-reset/request` - Solicitar reset de senha
- `POST /password-reset/reset` - Resetar senha

#### Usuários
- `GET /user` - Listar usuários
- `GET /user/:id` - Buscar usuário por ID
- `POST /user` - Criar usuário
- `PATCH /user/:id` - Atualizar usuário
- `PATCH /user/:id/avatar` - Upload de avatar
- `DELETE /user/:id` - Deletar usuário

#### Clientes
- `GET /client` - Listar clientes
- `GET /client/:id` - Buscar cliente por ID
- `POST /client` - Criar cliente
- `PATCH /client/:id` - Atualizar cliente
- `PATCH /client/:id/avatar` - Upload de avatar
- `DELETE /client/:id` - Deletar cliente

#### Processos
- `GET /processo` - Listar processos
- `GET /processo/:id` - Buscar processo por ID
- `POST /processo` - Criar processo
- `PATCH /processo/:id` - Atualizar processo
- `DELETE /processo/:id` - Deletar processo

#### Documentos
- `GET /document/client/:clientId` - Listar documentos por cliente
- `GET /document/:id` - Buscar documento por ID
- `POST /document/:clientId` - Upload de documento
- `PATCH /document/:id` - Atualizar documento
- `DELETE /document/:id` - Deletar documento

#### Documentos de Processo
- `GET /documento-processo` - Listar documentos
- `GET /documento-processo/processo/:processoId` - Listar por processo
- `GET /documento-processo/:id` - Buscar por ID
- `POST /documento-processo/:processoId` - Upload de documento
- `PATCH /documento-processo/:id` - Atualizar documento
- `DELETE /documento-processo/:id` - Deletar documento

#### Boletos
- `GET /boleto` - Listar boletos
- `GET /boleto/client/:clientId` - Listar boletos por cliente
- `GET /boleto/:id` - Buscar boleto por ID
- `POST /boleto/:clientId` - Upload de boleto
- `PATCH /boleto/:id` - Atualizar boleto
- `DELETE /boleto/:id` - Deletar boleto

#### Agendamentos
- `GET /agendamento` - Listar agendamentos
- `GET /agendamento/client/:clientId` - Listar por cliente
- `GET /agendamento/:id` - Buscar por ID
- `POST /agendamento` - Criar agendamento
- `PATCH /agendamento/:id` - Atualizar agendamento
- `DELETE /agendamento/:id` - Deletar agendamento

#### Endereços
- `GET /endereco` - Listar endereços
- `GET /endereco/:id` - Buscar endereço por ID
- `POST /endereco/:clientId` - Criar endereço
- `PATCH /endereco/:id` - Atualizar endereço
- `DELETE /endereco/:id` - Deletar endereço

### 📤 Upload de Arquivos

Todos os endpoints de upload utilizam `multipart/form-data`:
- **Key do arquivo:** `file`
- **Outros campos:** enviar como form fields

**Exemplo (Postman/Insomnia):**
```
POST /boleto/:clientId
Content-Type: multipart/form-data

file: [arquivo.pdf]
titulo: "Pagamento de honorários"
dataVencimento: "2025-10-25T00:00:00.000Z"
observacao: "Referente a outubro/2025"
```

---

## 🔒 Segurança

- **Autenticação JWT** com refresh tokens
- **Rate Limiting** para prevenir abuso
- **Validação de dados** em todas as requisições
- **CORS** configurado
- **Guards de autorização** baseados em roles
- **Validação de tipos de arquivo** nos uploads

---

## 🗺️ Status do Projeto

🚧 **Em desenvolvimento ativo** - Novas funcionalidades sendo implementadas constantemente.

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 📞 Contato

**Email:** williamuteich14@gmail.com  
**GitHub:** [@williamuteich](https://github.com/williamuteich)  
**Link do Projeto:** [https://github.com/williamuteich/lexhub-backend](https://github.com/williamuteich/lexhub-backend)

---

<p align="center">Desenvolvido para facilitar a gestão jurídica 💼⚖️</p>
