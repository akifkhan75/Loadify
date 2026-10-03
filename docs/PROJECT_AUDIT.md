# Project Audit

## Current Architecture
- **Mobile Application**: The current application is built with bare React Native CLI (React Native 0.80.1), NOT Expo. It uses React Navigation (Native Stack, Bottom Tabs) for routing, Redux Toolkit for state management, Styled-components for styling, and Axios for API requests.
- **Existing Backend**: There is a simple existing Node.js/Express server in the `/server` directory acting as a mock/stub backend. It uses `db.js` for some in-memory or basic data storage.
- **State Management**: Redux slices exist for `auth`, `booking`, and `driver`. React Context is used for `ThemeContext` and `LanguageContext`.
- **API Client**: A centralized API client exists in `services/api.ts` utilizing `axios`. It defines endpoints for auth, AI service (Gemini parsing), user/booking flow, driver flow, and chat.

## Existing Features
- Authentication (Login, Signup) for both Users and Drivers.
- Booking flow with AI text parsing (`parseRideRequestWithAI`).
- Driver matching and discovery (`findDrivers`).
- Booking confirmation and driver responses (`confirmBooking`, `respondToRideRequest`).
- Chat functionality (`getChatHistory`, `sendMessage`).

## Existing Screens & Components
- App navigators based on role: `AuthNavigator`, `UserNavigator`, `DriverNavigator`.
- Components divided by domain: `auth`, `common`, `driver`, `user`, `profile`.
- Core screens include `BookingWizard`, `BookingStatusTracker`, `DriverOnboarding`, `GeminiVehicleSuggester`, `ChatModal`, `RatingScreen`, `MapPlaceholder`.

## Existing Navigation
- The navigation is role-based and dynamically rendered in `AppNavigator.tsx` based on the Redux `auth` slice state (`AppView.USER_HOME`, `AppView.DRIVER_HOME`, etc.).
- Custom theme integration with React Navigation.

## Existing Data Flows
- Mobile -> Redux Actions -> Axios (services/api.ts) -> Mock Backend (`/server`).
- Data contracts are defined in `types/types.ts` (`User`, `Driver`, `Account`, `BookingSchedule`, etc.).

## Existing Dependencies
- **Mobile**: `react-native`, `react-redux`, `@reduxjs/toolkit`, `@react-navigation/*`, `axios`, `styled-components`, `react-native-maps`, `react-native-localize`, `i18n-js`.
- **Server**: Minimal Node.js setup (to be replaced).

## Existing Technical Debt & Risks
- **Bare React Native vs Expo**: The requirement mentions "React Native + Expo mobile frontend", but the project is a bare React Native project. **Assumption/Decision**: We will maintain it as a bare React Native app in the new monorepo to avoid breaking changes, as strictly instructed ("DO NOT replace React Native with another framework", "DO NOT break the existing app").
- Mock data and hardcoded API URLs (e.g., `http://10.0.2.2:3000/api`) exist in `services/api.ts`.
- The current backend is a basic express server that needs to be entirely replaced with the robust NestJS/Prisma architecture.

## Proposed Backend Architecture
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Monorepo**: Turborepo with `apps/mobile`, `apps/api`, and shared `packages/*`.
- **Modules**:
  - `AuthModule`: Registration, login, session management.
  - `UsersModule`: Rider and driver profiles.
  - `BookingsModule`: Ride requests, matching, scheduling.
  - `ChatModule`: Chat history and messaging.
  - `AIModule`: Interface with Gemini for ride parsing.

## Migration Strategy
1. **Phase 1**: Audit existing application (Completed).
2. **Phase 2**: Initialize Turborepo and pnpm workspace, restructure root.
3. **Phase 3**: Move existing React Native app to `apps/mobile`, verify it works.
4. **Phase 4-5**: Create `apps/api` with NestJS, PostgreSQL, and Prisma schema.
5. **Phase 6-8**: Implement Auth, Booking, and User domain logic and APIs.
6. **Phase 9-10**: Update `apps/mobile/services/api.ts` to use new backend, remove mock backend (`/server`).
7. **Phase 11-15**: Validation, Dockerization, Testing, CI/CD, and Production readiness.

## Assumptions
- The existing React Native app must be preserved as bare React Native (no forced migration to Expo), since it currently works as bare RN.
- The existing Redux state and Axios client structure will be preserved; only the base URLs and exact DTO formats will be synchronized via shared packages.
