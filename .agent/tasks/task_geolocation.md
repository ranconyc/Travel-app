---
status: proposed
implementation_plan: .agent/tasks/implementation_plan_geolocation.md
---

# User Location Resolution

Implement "Get Current City" functionality on the user profile using browser geolocation, database lookup, and LocationIQ reverse geocoding fallback.

## Steps

1. [ ] Create `updateUserLocationAction` Server Action
2. [ ] Extract `CurrentCitySection` to Client Component
3. [ ] Integrate `useLocation` hook and Server Action in `CurrentCitySection`
4. [ ] Manual Verification
