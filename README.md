# TravelMate 🌍

A modern, full-stack travel companion application built with Next.js 16, featuring intelligent traveler matching, real-time chat, comprehensive destination guides, and personalized travel planning.

## ✨ Features

### 🤝 Intelligent Traveler Matching

- **Dual-Mode Matching System**: Match with travelers based on compatibility scores
  - **Mates Mode**: Find travel companions with similar interests and styles
  - **Locals Mode**: Connect with locals at your destination
- **Advanced Compatibility Algorithm**: Calculates match scores based on:
  - Travel styles and preferences
  - Shared interests and languages
  - Daily rhythms and routines
  - Visited countries and travel history
- **Interactive Match Breakdown**: Visual representation of compatibility across multiple dimensions

### 👤 Rich User Profiles

- **Complete Profile System**: Detailed user profiles with avatar, bio, and travel preferences
- **Travel Persona**: Define your travel style (adventurer, luxury, budget, cultural, etc.)
- **Travel History**: Track and showcase visited cities and countries with visual stamps
- **Home Base & Current Location**: Geolocation-based city detection and updates
- **Interests & Languages**: Multi-select preferences for better matching

### 🗺️ Comprehensive Destination Data

- **3-Tier World Hierarchy**: Country → State → City with full metadata
- **5,700+ Cities**: Standardized city data with readable IDs (e.g., `bangkok-th-115367`)
- **Rich Country Pages**: Detailed information including:
  - Safety ratings and travel advisories
  - Language guides and common phrases
  - Currency, budget estimates, and money tips
  - Best seasons and ideal duration
  - Getting around and transportation
  - Neighborhoods and districts
- **City Detail Pages**: Comprehensive city guides with places, media, and local insights
- **Geospatial Queries**: Find nearby cities and travelers using MongoDB geospatial indexes

### 💬 Real-Time Chat

- **WebSocket-Based Messaging**: Instant messaging powered by Socket.IO
- **Friend System**: Send and accept friend requests
- **Chat Rooms**: One-on-one and group conversations
- **Online Status**: Real-time presence indicators
- **Message History**: Persistent chat history with timestamps

### 🛠️ Admin Dashboard

- **User Management**: View and manage all users
- **Destination Editor**: CRUD operations for countries, cities, and places
- **API Documentation**: Built-in API reference with usage examples
- **Component Library**: Browse all reusable UI components
- **Schema Viewer**: Visual representation of the Prisma database schema
- **Forms Directory**: Quick access to all application forms

### 🔐 Authentication & Security

- **NextAuth.js Integration**: Secure authentication with multiple providers
- **OAuth Support**: Google and Facebook login
- **Email/Password**: Traditional authentication with bcrypt hashing
- **Session Management**: Server-side session handling
- **Role-Based Access**: User and Admin roles

## 🚀 Tech Stack

### Frontend

- **Next.js 16** (App Router) - React framework with server components
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **React Hook Form** - Form management with Zod validation
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Lucide React** - Icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6** - Type-safe ORM
- **MongoDB** - NoSQL database with geospatial support
- **NextAuth.js** - Authentication
- **Socket.IO** - Real-time WebSocket communication
- **Zod** - Runtime validation

### DevOps & Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database GUI
- **tsx** - TypeScript execution for scripts

## 📦 Installation

### Prerequisites

- Node.js 20+ and npm
- MongoDB Atlas account (or local MongoDB instance)
- Google OAuth credentials (optional)
- Facebook OAuth credentials (optional)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travel-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/TravelMate?retryWrites=true&w=majority"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-app-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
   ```

4. **Generate Prisma Client**

   ```bash
   npm run prisma:generate
   ```

5. **Seed the database** (optional)

   ```bash
   # Seed world data (countries, states, cities)
   export DATABASE_URL="your-mongodb-url"
   LIMIT=250 npx tsx scripts/seed-world-data.ts

   # Seed test users
   npx tsx scripts/seed-users.ts
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Start the WebSocket server** (in a separate terminal)

   ```bash
   npm run dev:ws
   ```

8. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The Prisma schema is organized into **8 domain-specific files** for better maintainability:

```
prisma/
└── schema/
    ├── _base.prisma      # Generator, datasource, enums
    ├── user.prisma       # User, UserProfile
    ├── auth.prisma       # Account, Session, VerificationToken
    ├── media.prisma      # Media
    ├── location.prisma   # Country, State, City, Place
    ├── social.prisma     # Friendship, CityVisit
    ├── chat.prisma       # Chat, ChatMember, Message
    └── analytics.prisma  # SearchEvent
```

### Core Models

- **User**: User accounts with authentication, profile, and location data
- **UserProfile**: Extended profile information (bio, interests, travel preferences)
- **Country**: Country data with metadata (population, GDP, languages, etc.)
- **State**: State/province data linked to countries
- **City**: City data with geospatial coordinates and timezone
- **Place**: Points of interest within cities
- **Media**: Unified media storage for images/videos
- **Friendship**: Friend relationships between users
- **Chat**: Chat rooms and conversations
- **ChatMember**: User membership in chats
- **Message**: Chat messages with timestamps
- **CityVisit**: User travel history

### Key Features

- **Geospatial Indexing**: MongoDB 2dsphere indexes for location-based queries
- **Flexible JSON Fields**: Store complex metadata (safety, budget, neighborhoods, etc.)
- **Relational Integrity**: Foreign key relationships with cascading deletes
- **Timestamps**: Automatic `createdAt` and `updatedAt` tracking

## 📁 Project Structure

```
travel-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   ├── seed-world-data.ts     # World data seeding
│   ├── seed-users.ts          # User data seeding
│   ├── cleanup-world-data.ts  # Batched deletion utility
│   └── analyze-json-data.ts   # Data analysis tool
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── actions/           # Server actions
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── chats/             # Chat interface
│   │   ├── cities/            # City pages
│   │   ├── countries/         # Country pages
│   │   ├── mates/             # Traveler matching
│   │   ├── profile/           # User profiles
│   │   ├── signin/            # Authentication
│   │   └── components/        # Shared UI components
│   ├── data/                  # Static data (JSON files)
│   ├── lib/
│   │   ├── db/                # Database repositories
│   │   ├── domain/            # Domain logic and queries
│   │   └── services/          # Business logic services
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── server.ts                  # WebSocket server
└── package.json
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:ws           # Start WebSocket server

# Build & Production
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:seed      # Run database seeding

# Code Quality
npm run lint             # Run ESLint
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (caution: deletes all data)
npx tsx scripts/cleanup-world-data.ts

# Seed world data
LIMIT=250 npx tsx scripts/seed-world-data.ts

# Analyze JSON data completeness
npx tsx scripts/analyze-json-data.ts
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

- **Color Palette**: Curated HSL-based colors with dark mode support
- **Typography**: Inter font family from Google Fonts
- **Components**: Reusable UI components in `/src/app/components/`
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first design with breakpoints

## 🌐 API Routes

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Users

- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update user profile
- `GET /api/users/nearby` - Find nearby users

### Destinations

- `GET /api/countries` - List all countries
- `GET /api/countries/[slug]` - Get country details
- `GET /api/cities/[id]` - Get city details
- `POST /api/cities/generate` - AI-powered city content generation

### Chat

- `GET /api/chats` - List user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/[id]/messages` - Get chat messages
- `POST /api/chats/[id]/messages` - Send message

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- World data sourced from [countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database)
- Icons by [Lucide](https://lucide.dev/)
- Avatars from [RandomUser.me](https://randomuser.me/) and [Pravatar](https://i.pravatar.cc/)

---

Built with ❤️ using Next.js and modern web technologies.
