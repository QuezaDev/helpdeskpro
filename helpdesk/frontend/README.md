# HelpDeskPRO

Sistema simples de gerenciamento de chamados desenvolvido como projeto acadêmico para a disciplina de Software Product: Analysis, Specification, Project & Implementation.

O sistema permite que usuários se registrem, façam login e criem chamados que são organizados em um quadro estilo Kanban com diferentes status.

---

# 📌 Funcionalidades

* Cadastro de usuários
* Login com autenticação
* Criação de chamados
* Visualização de chamados em quadro Kanban
* Contador de chamados por status
* Popup com detalhes do chamado
* Senhas criptografadas com bcrypt
* Persistência de dados em banco SQL Server

---

# 🛠 Tecnologias Utilizadas

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express

## Banco de Dados

* Microsoft SQL Server

## Bibliotecas

* bcrypt
* cors
* dotenv
* mssql

---

# 📂 Estrutura do Projeto

```
HelpDeskPRO
│
├── css
│   └── style.css
│
├── js
│   ├── chamados.js
│   ├── login.js
│   └── registro.js
│
├── index.html
├── login.html
├── registro.html
│
├── server.js
├── package.json
│
├── .env (não incluído no repositório)
├── .gitignore
└── README.md
```

---

# 🚀 Como Executar o Projeto

## 1. Clonar o repositório

git clone https://github.com/QuezaDev/helpdeskpro.git
Entrar na pasta do projeto:
cd helpdeskpro

## 2. Instalar as dependências

npm install

## 3. Criar arquivo de variáveis de ambiente

Na raiz do projeto, crie um arquivo chamado:

.env
Dentro dele adicione:

DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=
DB_PORT=1433

## 4. Iniciar o servidor

node server.js
Se tudo estiver correto aparecerá:

Conectado ao SQL Server
Servidor rodando na porta 3000

## 5. Abrir o sistema

Abra o arquivo:

login.html no navegador.

# 📊 Funcionamento do Sistema

O sistema possui três colunas principais para organização dos chamados:

* Em aberto
* Em andamento
* Concluído

Cada chamado possui:

* Código automático (ex: TASK00001)
* Título
* Descrição
* Prioridade
* Status

Os chamados são armazenados no banco de dados SQL Server.

---

# 🔐 Segurança

As senhas dos usuários são armazenadas de forma segura utilizando:

* Hash de senha com bcrypt
* Variáveis de ambiente para credenciais do banco
* Arquivo `.env` ignorado pelo Git

---

# 👨‍💻 Autor

Projeto desenvolvido por:

Daniel Quesada

---

# 📄 Licença

Este projeto foi desenvolvido apenas para fins acadêmicos.
