# CastDeck 🚀

**CastDeck** is a Farcaster Mini App for scheduling and draft management. It helps creators plan their content flow by writing, saving, and scheduling casts for future posting directly within the Farcaster ecosystem.

## ✨ Features

- **Draft Manager**: Write casts and save them as drafts
- **Scheduling**: Pick a date/time for automatic posting
- **Mini App Integration**: Seamless experience within Farcaster clients
- **Touch-Optimized UI**: Large buttons and simplified interface
- **Real-time Sync**: Cloud storage with Supabase
- **Open Source**: Built in TypeScript, MIT-licensed

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + Tailwind CSS
- **Mini App SDK**: @farcaster/miniapp-sdk
- **Backend**: Supabase (Database)
- **Authentication**: Farcaster native auth
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Farcaster account
- Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd castdeck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://doyaoaygeszezfluehld.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveWFvYXlnZXN6ZXpmbHVlaGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0Mzc4MzYsImV4cCI6MjA3MTAxMzgzNn0.WDEEwXFZsrEcV5LXzbpeCQgelIO_NnP7ktHIomUZzGg
   NEXT_PUBLIC_FARCASTER_DEVELOPER_MNEMONIC=your_farcaster_developer_mnemonic
   NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.farcaster.standardcrypto.vc:2283
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The app uses three main tables:

- **users**: Farcaster user profiles
- **drafts**: Content drafts with status tracking
- **scheduled_posts**: Scheduled posts with timing and status

## 🤝 Contributing

This project is open source and welcomes contributions! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Farcaster Documentation](https://docs.farcaster.xyz/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
