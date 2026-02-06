# Architecture Audit: Repository vs. Domain Separation

Audit performed on 2026-02-05 to identify "leaks" where database logic (Prisma) is accessed outside the repository layer (`src/lib/db`).

## Summary of Findings

The codebase follows a repository pattern where most database interactions are centralized. however, there are several instances where `prisma` is imported directly into domain services, server actions, and application routes.

| Category            | Leak Frequency | Severity                                     |
| :------------------ | :------------- | :------------------------------------------- |
| **Domain Actions**  | Moderate       | ⚠️ High (Business logic mixed with DB logic) |
| **Domain Services** | Moderate       | ⚠️ High (Harder to unit test)                |
| **App Pages/API**   | Low            | ℹ️ Medium (Violates consistency)             |

---

## 🚩 Critical Leaks (Highest Priority)

### 1. User Domain Actions

**File:** [user.actions.ts](file:///Users/rancohen/code/travel-app/src/domain/user/user.actions.ts)

- **Leak:** Direct `prisma.user.findUnique` call inside `completeIdentityOnboarding`.
- **Reason:** Performing complex existence checks and validation logic that should be a `repo.isUserComplete(userId)` call.

### 2. City Creation Service

**File:** [city-creation.service.ts](file:///Users/rancohen/code/travel-app/src/domain/city/city-creation.service.ts)

- **Leak:** Direct `prisma.city.findUnique` to check `externalId` collisions.
- **Reason:** This lookup logic should reside in `cityLocation.repo.ts`.

### 3. Media/Image Services

**Files:** `unsplash.service.ts`, `image-provider.service.ts`

- **Leak:** Accessing `prisma` to store or retrieve image metadata.
- **Reason:** The domain logic for "handling images" is tightly coupled to the DB implementation.

---

## ⚠️ Internal Leaks (Medium Priority)

### 4. Application Routes/API

**Files:**

- `src/app/(public)/cities/[slug]/page.tsx`
- `src/app/api/search/route.ts`
- `src/app/api/admin/states/[id]/route.ts`
- **Leak:** Fetching data directly via `prisma`.
- **Reason:** While sometimes done for "speed" in Next.js, it bypasses the abstraction layer (e.g., `cityLocation.repo.ts`).

---

## 🛋️ Recommended Improvements

1. **Move simple lookups to Repos**: Any `.findUnique`, `.findFirst`, or `.count` should have a dedicated method in its respective `.repo.ts`.
2. **Abstract Business Checks**: Move "If user is onboarded" logic into a service that calls a repo, don't perform the check in the action.
3. **Audit Shared Domain**: `src/domain/match` and `src/domain/destination` also contain direct Prisma calls that should be migrated.

## Conclusion

The project has a solid repository foundation, but "convenience coding" has introduced leaks in the domain actions. A cleanup phase is recommended to move these into the `src/lib/db` layer to maintain the "Domain is Database Agnostic" principle.
