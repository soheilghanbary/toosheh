# 📦 Toosheh (Temporary Cloud Clipboard)

**Toosheh** is a high-performance, minimalist web application designed for seamless text and file sharing via temporary cloud clipboards. It enables users to sync data across devices using a unique 6-digit tracking code, featuring advanced security protocols and automated expiration logic.

## ✨ Features

* **Dynamic Syncing**: Create temporary "clips" for text or code snippets.
* **Smart Tracking**: Access data via a unique 6-digit numeric code.
* **Deep Linking**: Full integration with `nuqs` for URL-based state management.
* **Advanced Security**:
* **One-Time Access**: Automatically deletes (burns) the clip after the first successful view.
* **Password Protection**: Secure sensitive data with encrypted password layers.


* **Smart Expiration**: User-defined availability (30m, 1h, 24h).
* **Native Experience**:
* Smooth mobile-first UI powered by **Framer Motion**.
* **Web Share API** integration for native system sharing.
* Automated QR Code generation for instant mobile handoff.



## 🛠 Tech Stack

### Frontend

* **Framework**: [Next.js 16.1 (App Router)](https://nextjs.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Motion](https://www.motion.dev/)
* **State Management**: [React Hook Form](https://react-hook-form.com/) & [TanStack Query](https://tanstack.com/query/latest)
* **URL State**: [nuqs](https://nuqs.47ng.com/)
* **Validation**: [Zod](https://zod.dev/)

### Backend & Database

* **API Framework**: [Hono](https://hono.dev/)
* **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
* **Database**: [PostgreSQL](https://www.postgresql.org/)
* **ID Generation**: [NanoID](https://github.com/ai/nanoid)

## 🚀 Key Implementations

* **Isomorphic Scroll Lock**: Custom implementation preventing background scrolling during modal interactions, optimized for SSR.
* **URL-Sync Tracking**: Real-time synchronization between the UI state and browser search parameters for persistent sessions.
* **Atomic View Counting**: Server-side atomic SQL increments to ensure data integrity during concurrent access.
* **Mobile-First Modals**: Drawer-style sheets designed for optimal ergonomics on touch devices.

## 🏁 Getting Started

1. **Clone the repository**:
```bash
git clone https://github.com/soheilghanbary/toosheh.git

```


2. **Install dependencies**:
```bash
pnpm install

```


3. **Environment Setup**:
Create a `.env` file in the root directory and provide your `DATABASE_URL`.
4. **Database Migration**:
Push the schema to your PostgreSQL instance:
```bash
pnpm dlx drizzle-kit push

```


5. **Run Development Server**:
```bash
pnpm dev

```
---
Run the development server:
```bash
open: http://localhost:3000

```
---
Done! 🎉
