# Manual de Instalação Local - Projeto TCC Wayne Industries

## 1. Pré-requisitos

Antes de iniciar, verifique se o computador possui:

- **Python 3.10+** (backend)
- **Node.js 18+** e **npm** ou **yarn** (frontend)
- **Git**
- Editor de código recomendado: **VSCode**

---

## 2. Clonando o projeto

```bash
git clone https://github.com/PedroStaRosa/Wayne-Industries_Infinity-School.git

cd Wayne-Industries_Infinity-School
```

---

## 3. Configuração do ambiente

### 3.1 Backend (Flask)

**Entrar na pasta do backend:**

```bash
cd backend
```

#### 3.1.1 Criar ambiente virtual

```bash
python -m venv venv
```

Ativar o ambiente virtual:

- **Linux / Mac:**
  ```bash
  source venv/Scripts/activate
  ```
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```

#### 3.1.2 Instalar dependências

```bash
pip install -r requirements.txt
```

#### 3.1.3 Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
JWT_SECRET_KEY=sua_chave_secreta
JWT_ACCESS_TOKEN_EXPIRES=3600
PROTECTED_LOGINS_ID=1,2,3
FLASK_DEBUG=True
```

> **Observação:** Os primeiros usuários são criados automaticamente ao iniciar o servidor.

#### 3.1.4 Rodar a aplicação

```bash
flask run
```

- Backend: [http://localhost:5000](http://localhost:5000)  
> ## Documentação Swagger: [http://localhost:5000/docs](http://localhost:5000/docs)

---

### 3.2 Frontend (React)

**Entrar na pasta do frontend:**

```bash
cd frontend
```

#### 3.2.1 Instalar dependências

```bash
npm install
```

#### 3.2.2 Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_URL_BASE=http://localhost:5000
```

#### 3.2.3 Rodar a aplicação

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)  
- Logins de teste disponíveis na página inicial.

### Telas

> Home - Dashboard
<div style="display: flex; gap: 10px;">
<img src="https://res.cloudinary.com/dofu14mb0/image/upload/v1758577392/HOME_zakknj.png" alt="Tela inicial frontend" width="400">

<img src="https://res.cloudinary.com/dofu14mb0/image/upload/v1758577392/dashboard_uk208g.png" alt="Tela Dashboard frontend" width="400">

</div>
<br>

> Usuário
<div style="display: flex; gap: 10px;">
<img src="https://res.cloudinary.com/dofu14mb0/image/upload/v1758577393/users_jlcmw7.png" alt="Tela user frontend" width="400">

<img src="https://res.cloudinary.com/dofu14mb0/image/upload/v1758577392/Edit_users_vcn2ua.png" alt="Tela edit user frontend" width="400">
</div>
<br>

> Recursos
<div style="display: flex; gap: 10px;">
<img src="https://res.cloudinary.com/dofu14mb0/image/upload/v1758577393/Resources_qgcefy.png" alt="Tela recursos frontend" width="400">

<img src="https://res.cloudinary.com/dofu14mb0/image/upload/v1758577392/Edit_resources_uqgjau.png" alt="Tela Edit recurso frontend" width="400">
</div>

<br>

>Logs
<div style="display: flex; gap: 10px;">
<img src="https://res.cloudinary.com/dofu14mb0/image/upload/v1758577392/Logs_aejs0k.png" alt="Tela log frontend" width="400">
</div>


