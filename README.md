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

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` (same keys as in the repo template)
4. Deploy

```bash
npm run build
```

## Environment Variables

See `.env.local` in the project root for the complete list of variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `AUTH_SECRET` | Yes | NextAuth secret (min 32 chars) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `SMTP_*` | No | Email configuration |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | WhatsApp contact number |

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
