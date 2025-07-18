# 🤝 Contributing to the Q&A Project

Thank you for considering contributing to this project! We welcome contributions of all kinds — from ideas and bug reports to code, design, documentation, and more.

## 🧱 Project Structure

This is a monorepo structured as follows:

```
qa-project/
├── apps/
│   ├── web/           # Main Next.js frontend app
│   └── ai-service/    # (Planned) FastAPI backend for ML features
├── prisma/            # Prisma schema and seed scripts
├── packages/          # Shared code (types, utils) – optional
├── .github/           # GitHub workflows
```

## 📦 Setup Instructions

1. **Clone the repository**:

```bash
git clone https://github.com/Zilola-Nazarova/qa-project.git
cd qa-project
```

2. **Install dependencies**:

```bash
npm install
```

3. **Setup your env vars**:

```bash
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
```

4. **Start development server (it regenerates next-env.d.ts)**:

```bash
npm run web:dev
```

## 📑 Available Scripts

```bash
npm run web:dev      # Start the frontend
npm run ai:dev       # (Planned) Start AI service
npm run web:build    # Build the web app
npm run ai:build     # (Planned) Build the AI service
npm run build        # Build web + ai-service
npm run lint:js      # Lint JS/TS files in the web app
npm run lint:css     # Lint CSS files in the web app
npm run lint         # Run both linters (JS + CSS)
npm run format       # Format the web app with Prettier
npm run validate     # Run lint + format together
```

## ✅ Guidelines

### 1. Issues
- Use [GitHub Issues](https://github.com/your-username/qa-project/issues) to report bugs or suggest features.

### 2. Branching
- Main branches: `dev` (default), `prod` (for deployment)
- Use feature branches: `feature/ask-form`, `fix/header`, etc.

### 3. Commits
Follow conventional commits. Example:
```
feat: add search bar to homepage
fix: resolve crash on ask form submit
```

### 4. Pull Requests
- Target the `dev` branch
- Include a clear description of your change
- One feature/fix per PR

## 🧪 Linters & Formatters

Code is linted and formatted using:
- ESLint (for JavaScript/TypeScript)
- Stylelint (for CSS/Tailwind)
- Prettier (for general formatting)

You can run all checks before committing:

```bash
npm run validate
```

## 🛡️ Code of Conduct

Please be kind and respectful in all interactions.

---

Thank you for helping make this project better! 🙌
