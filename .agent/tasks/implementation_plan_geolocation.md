---
description: Implement User Location Resolution and "Get Current City" functionality
---

# Implementation Plan - User Location Resolution

The goal is to allow users to update their "Current City" on their profile by detecting their device location. The system handles this by attempting to find a matching city in the database (using geospatial queries) and falling back to the LocationIQ API (Reverse Geocoding) if no match is found. New cities found via API are automatically created in the database.

## User Review Required

> **Provider & Logic Confirmation**:
>
> - **Provider**: logic confirms **LocationIQ** is the configured provider for reverse geocoding.
> - **Fallback**: The system uses a "DB First" strategy matching your request. It searches the database using `$geoNear` (radius search). If no city is found within range, it queries LocationIQ.
> - **Bounding Box**: Direct bounding box checks are replaced by efficient `$geoNear` spatial queries, which are more performant and robust for "nearest city" logic.

## Proposed Changes

### 1. Server Action: `updateUserLocationAction`

**Location**: `src/domain/user/user.actions.ts` (or new `location.actions.ts`)

- Define a new server action `updateUserLocationAction(lat: number, lng: number)`.
- **Validation**: Ensure user is authenticated.
- **Logic**:
  - Call `findNearestCityFromCoords(lat, lng, { createIfMissing: true })` from `@/lib/db/cityLocation.repo.ts`.
  - This function handles the logic: Check DB -> If fail -> LocationIQ API -> Create City.
  - Update the authenticated user's `currentCityId` with the resolved city ID.
  - Revalidate the profile path (`/profile/[id]`).
- **Return**: The updated City object or success status.

### 2. Frontend Integration: Profile Page

**Location**: `src/app/profile/[id]/page.tsx` -> `src/app/profile/[id]/CurrentCitySection.tsx`

- **Refactor**: Extract internal `CurrentCitySection` from `page.tsx` into a new file `CurrentCitySection.tsx` marked with `"use client"`.
- Update `CurrentCitySection` to use the `useLocation` hook (from our new `LocationProvider`).
- **Interaction**:
  - When "Get current city" is clicked:
  - Call `requestLocation()` to get browser coordinates.
  - If successful, call `updateUserLocationAction(coords.latitude, coords.longitude)`.
  - Show loading state (spinner/toast) during the process.
  - Handle success/error (e.g., "Location permission denied").

### 3. Verify `LocationProvider`

**Location**: `src/app/providers/LocationProvider.tsx`

- Ensure `requestLocation` correctly handles permission states and errors for a smooth UX. (Already verified in previous step).

## Verification Plan

### Automated Tests

- None planned for this specific UI interaction, as it relies on browser Geolocation API.

### Manual Verification

1. **Profile Page**: Navigate to `/profile/[id]`.
2. **Action**: Click "Get current city".
   - **Expectation**: Browser prompts for location permission.
3. **Success**:
   - Toast message "Location updated".
   - The "Current City" section updates to show the detected city (e.g., "New York, US").
   - Database `User.currentCityId` is updated.
4. **Fallback Test**:
   - Use a mock location (via Developer Tools) for a city NOT in the DB.
   - Verify that the system fetches from LocationIQ, creates the city, and updates the profile correctly.
