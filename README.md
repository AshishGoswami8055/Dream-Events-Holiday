# Dream Events & Holiday

A production-ready luxury Tours & Travel website built with Next.js 15, TypeScript, MongoDB, and Cloudinary.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

### Public Website
- Premium responsive design with luxury travel aesthetic
- Home page with hero, search, destinations, packages, testimonials, gallery, FAQ, newsletter
- Package listing with grid/list views, filters, sorting, and pagination
- Package detail pages with gallery, itinerary, FAQs, map, inquiry form
- Destinations, Gallery, Testimonials, FAQ, Contact pages
- Privacy Policy & Terms & Conditions
- WhatsApp integration & sticky book button
- SEO optimized with metadata, Open Graph, JSON-LD, sitemap, robots.txt

### Admin Panel
- Protected authentication (NextAuth.js credentials)
- Dashboard with analytics
- Package CRUD with Cloudinary image upload
- Destination management
- Gallery management
- Inquiry management with status updates

### Technical
- Next.js 15 App Router with Server Components & Server Actions
- MongoDB Atlas with Mongoose ODM
- Cloudinary image optimization
- Zod validation & React Hook Form
- Framer Motion animations
- Shadcn UI components
- Rate limiting & security headers
- ISR caching for performance

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI | Shadcn UI + Radix UI |
| Animation | Framer Motion |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth.js v5 (Credentials) |
| Images | Cloudinary |
| Forms | React Hook Form + Zod |
| Email | Nodemailer |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- SMTP credentials (optional, for email)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Edit `.env.local` with your credentials:

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=your-32-char-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. **Seed the database**

```bash
npm run seed
```

This creates an admin user and sample data. Default credentials:
- Email: `admin@dreamevents.com`
- Password: `ChangeMe123!`

4. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Protected admin panel
│   ├── api/                # API routes (auth, upload)
│   └── (public pages)/     # About, packages, contact, etc.
├── actions/                # Server Actions
├── components/
│   ├── admin/              # Admin-specific components
│   ├── layout/             # Header, Footer
│   ├── shared/             # Reusable components
│   └── ui/                 # Shadcn UI primitives
├── constants/              # App constants & config
├── features/               # Feature-based modules
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, auth, db, email
├── models/                 # Mongoose models
├── scripts/                # Seed script
└── types/                  # TypeScript types
```

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dream-events-holiday.git
git push -u origin main
```

### 2. Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework is auto-detected as **Next.js** — leave build settings as default
4. Click **Deploy** (first deploy may fail until env vars are added)

### 3. Environment variables (required)

In Vercel → **Project → Settings → Environment Variables**, add these for **Production** (and Preview if you use branch deploys):

| Variable | Example | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Your live site URL (no trailing slash) |
| `AUTH_URL` | `https://your-app.vercel.app` | Same as above — required for admin login |
| `AUTH_SECRET` | `openssl rand -base64 32` | Min 32 characters, keep secret |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `your-cloud` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | | From Cloudinary dashboard |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | | Unsigned upload preset name |

Optional: `SMTP_*`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `ADMIN_*` (for seeding only).

Copy the full list from `.env.example` in the project root.

### 4. MongoDB Atlas (important)

In MongoDB Atlas → **Network Access**, allow Vercel to connect:

- Add IP **`0.0.0.0/0`** (allow from anywhere), **or**
- Use Atlas **Vercel integration** if available

Without this, the site builds but database pages will fail at runtime.

### 5. Seed production database (one time)

Run locally with your production `MONGODB_URI` in `.env.local`:

```bash
npm run seed:refresh
```

This creates the admin user and sample packages. Default login:

- Email: `admin@dreamevents.com`
- Password: `ChangeMe123!`

Change the password after first login.

### 6. Redeploy

After adding env vars: **Deployments → ⋯ → Redeploy** so the build picks up new values.

### 7. Custom domain (optional)

Vercel → **Settings → Domains** → add your domain, then update:

- `NEXT_PUBLIC_APP_URL` → `https://yourdomain.com`
- `AUTH_URL` → `https://yourdomain.com`

Redeploy after changing URLs.

### Build locally (optional check)

```bash
npm run build
```

Vercel runs the same `npm run build` command automatically.

## Environment Variables

See `.env.example` for the full template (safe to commit — no secrets).

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Public site URL (localhost or Vercel/custom domain) |
| `AUTH_URL` | Yes | Same as app URL — NextAuth callback base |
| `AUTH_SECRET` | Yes | NextAuth secret (min 32 chars) |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Yes | Cloudinary upload preset |
| `SMTP_*` | No | Email configuration |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | WhatsApp contact number |
| `ADMIN_*` | No | Only for `npm run seed` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |

## Security

- Password hashing with bcryptjs
- JWT session authentication
- Protected admin routes via middleware
- Rate limiting on form submissions
- Input sanitization & Zod validation
- Security headers (HSTS, X-Frame-Options, etc.)
- MongoDB injection protection via Mongoose

## License

Private — Dream Events & Holiday © 2026
