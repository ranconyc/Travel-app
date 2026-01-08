# Application Structure Overview

## Pages & Routes (Frontend)

| Path                          | Description                                                 |
| :---------------------------- | :---------------------------------------------------------- |
| `/`                           | **Home**: Main landing page (shows `HomeLoggedIn` if auth). |
| `/signin`                     | **Login**: Sign-in page.                                    |
| `/test`                       | **Test**: Development/Testing page.                         |
| `/nearby-mates`               | **Nearby**: Browse users near you.                          |
| `/chats`                      | **Chats List**: List of active conversations.               |
| `/chat/[id]`                  | **Chat Room**: Individual chat interface.                   |
| `/profile/[id]`               | **User Profile**: Public/Private profile view.              |
| `/profile/complete`           | **Onboarding**: Profile completion flow.                    |
| `/profile/travel-persona`     | **Persona**: Edit travel persona settings.                  |
| `/profile/travel-preferences` | **Preferences**: Edit travel preferences.                   |
| `/country/[id]`               | **Country Detail**: View country info.                      |
| `/city`                       | **City Index**: List of cities (assumed).                   |
| `/city/[slug]`                | **City Detail**: View city info.                            |
| `/activity/[slug]`            | **Activity Detail**: View activity info.                    |

## Data Models (Backend)

Mapped relations between Prisma Schema, Types, Repositories, and Actions.

| Model              | Schema / Types        | Repository (`src/lib/db`) | Server Actions              |
| :----------------- | :-------------------- | :------------------------ | :-------------------------- |
| **User**           | `src/domain/user`     | `user.repo.ts`            | ( Auth via NextAuth )       |
| **Trip**           | `src/domain/trip`     | `trip.repo.ts`            | `itinerary.actions.ts`      |
| **City**           | `src/domain/city`     | `cityLocation.repo.ts`    | `locationActions`           |
| **Country**        | `src/domain/country`  | `country.repo.ts`         | `locationActions`           |
| **Activity**       | `src/domain/activity` | `activity.repo.ts`        | -                           |
| **Chat / Message** | `src/domain/chat`     | `chat.repo.ts`            | `chat.actions.ts` (implied) |
| **Friendship**     | (In Prisma)           | `friendship.repo.ts`      | `friendship.actions.ts`     |

## Key Directories

- **`src/app`**: Next.js App Router pages and layouts.
- **`src/app/component`**: Reusable UI components (buttons, cards, etc.).
- **`src/lib/db`**: Database access layer (Prisma repositories).
- **`src/domain`**: Zod schemas and TypeScript type definitions.
- **`src/app/actions`**: Server Actions for mutations (location updates, etc.).
- **`src/store`**: Client-side state management (Zustand).

## API & Actions

- **Location**: `src/app/actions/locationActions/index.tsx`
  - `updateUserLocationWithCityAction`: Updates coords + logic for travel history.
  - `getAllCitiesAction`, `getAllCountriesAction`.
- **Friendship**: `src/app/profile/actions/friendship.actions.ts`
  - Friend request management (send, accept, reject).
- **Socket**: `src/lib/socket` - Real-time features (online status).
