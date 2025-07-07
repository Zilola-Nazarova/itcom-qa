# 🇺🇿 IT Community Q&A Platform

An open-source Q&A website designed by the IT Community of Uzbekistan - built to help developers, students, and tech enthusiasts ask and answer technical questions in Uzbek, Russian, and English.

## 🌐 Live Preview

Coming soon…

## 🚀 Tech Stack

- **Frontend & Backend:** [Next.js (App Router)](https://nextjs.org/docs/app)
- **Database:** PostgreSQL + Prisma ORM
- **Search Engine:** Meilisearch/ElsaticSearch
- **SEO & Analytics:** Google Analytics 4, Yandex Metrica, next-sitemap, OG meta tags
- **AI Add-on (Planned):** FastAPI (Python)
- **UI Framework:** Tailwind CSS + shadcn/ui

## 📦 Features

- Ask & answer questions
- Vote system
- Tags & filtering
- Auth (Google, GitHub)
- Search by keyword/tags
- SEO-friendly question pages
- Admin moderation (WIP)
- (Upcoming) ML-powered suggestions

## 📂 Project Structure (MVP)

/app → App Router structure (Next.js)  
/questions → List and view questions  
/ask → Form to ask a question  
/profile → User profile  
/admin → (Planned) moderation panel  
/prisma → Prisma schema & migrations  
/lib → Helpers & API wrappers  
/ui → Custom components (shadcn/ui)

## 🧪 Getting Started

```bash
git clone git@github.com:Zilola-Nazarova/itcom-qa.git
cd itcom-qa
npm install
```

Setup your env vars

```bash
cp .env.example .env.local
```

Dev mode

```bash
npm run dev
```

## 🧩 Available Scripts

- `npm run web:dev` – Start the Next.js app in `apps/web`
- `npm run ai:dev` – Start the AI service in `apps/ai-service`
- `npm run web:build` – Build the production version of the web app
- `npm run ai:build` – Build the AI service (planned)
- `npm run build` – Build both web and AI apps
- `npm run lint:js` – Lint JavaScript/TypeScript files in the web app
- `npm run lint:css` – Lint CSS files in the web app
- `npm run lint` – Run both JS/TS and CSS linters
- `npm run format` – Format code in the web app with Prettier
- `npm run validate` – Lint and format code
- `npm run bootstrap` – Install dependencies across all workspaces

---

## 💬 Want to Contribute?

We're building this under the umbrella of **IT Community of Uzbekistan**.  
In the future, the project will welcome contributions from volunteers and the open-source community, including:

- Feature requests
- Code contributions
- Design suggestions
- Translations

See CONTRIBUTING.md (coming soon) for guidelines.

## 📄 License

[MIT License](./LICENSE)

## 📬 Contact

Want to get involved, suggest a feature, or use this in your region? Contact us via [Zilola-Nazarova](@ZilolaNazarova) or open an issue.

---

Built with ❤️ for Uzbekistan’s tech future.
