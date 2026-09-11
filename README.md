# Astra AI 🚀✨

Astra AI is a quirky, AI-powered web app for tracking your job applications and managing your job search efficiently.  
Organise every opportunity, keep notes, and never miss a step in your job hunt! 💼🔎

---

## Features 🌟

- 📝 **Track job applications** and their current status (applied, interviewing, offer, rejected, etc.)
- 💡 **Add notes** and keep important details for each job
- ✏️ **Edit** and 🗑️ **delete** job entries as your search evolves
- 📱 **Responsive, animated UI** with fun, quirky design
- 🔐 **Secure authentication** (register/login/logout)
- 🗄️ **Data persistence** with PostgreSQL for reliable, cloud-backed storage

---

## Tech Stack 🛠️

- **Frontend:**  
  React (Next.js), TypeScript, Tailwind CSS, Framer Motion, [shadcn/ui](https://ui.shadcn.com/) 🎨
- **Backend:**  
  Standalone Node.js (Express) API in [`server/`](server/README.md), Prisma, PostgreSQL ⚙️
- **Auth:**  
  Self-hosted JWT + bcrypt (no third-party auth provider) 🔐
- **Deployment:**  
  Frontend on Vercel ▲, API + Postgres self-hosted on a plain VPS (PM2 + Nginx) — see [`server/README.md`](server/README.md) for setup.
  