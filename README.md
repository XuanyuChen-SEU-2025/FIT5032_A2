# NeighbourHub

NeighbourHub is a responsive Vue 3 single-page application developed for **FIT5032 Assignment 2**. It supports Riverside Migrant Health Charity in publishing accessible health workshops for migrant communities and gives community members a simple way to discover, book and rate those events.

The application is a front-end assessment prototype. All records are stored in the browser, so no backend or external database is required.

## Core Features

### Public visitors

- View the charity overview and featured workshops.
- Browse all workshops and filter by keyword, category, language and availability.
- View workshop details, including date, location, facilitator, capacity, accessibility information and aggregate rating.
- Register a community-member account and log in.

### Authenticated users

- Book an upcoming workshop when places are available.
- Prevent duplicate active bookings for the same workshop.
- View active and cancelled bookings.
- Cancel an active booking.
- Submit or update one rating from 1 to 5 for each workshop.

### Administrators

- View dashboard totals for users, events, active bookings and average ratings.
- Create, edit and delete workshops.
- Inspect the bookings associated with each workshop.
- Access admin pages through role-protected routes.
- Re-check the administrator role inside event-management actions.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Vue 3.5 with Composition API and `<script setup>` |
| Build tool | Vite 7 |
| Routing | Vue Router 4 |
| UI | Bootstrap 5 and custom CSS |
| Persistence | `localStorage` and `sessionStorage` |
| Password processing | Browser Web Crypto API (`crypto.subtle`, SHA-256) |

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```bash
git clone https://github.com/XuanyuChen-SEU-2025/FIT5032_A2.git
cd FIT5032_A2
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Production build

```bash
npm run build
npm run preview
```

The compiled files are written to `dist/`. A production host must support SPA history fallback so direct visits to routes such as `/events` are served with `index.html`.

## Demo Administrator

| Field | Value |
| --- | --- |
| Email | `admin@neighbourhub.org.au` |
| Password | `Admin123!` |

This account is seeded for course demonstration only. Its password is represented by a precomputed salt and SHA-256 hash rather than stored as plaintext.

To test the normal-user workflow, create an account through the **Register** page. New accounts always receive the `user` role.

## Suggested Test Flow

1. Browse and filter workshops without logging in.
2. Open a workshop and select **Book Event** to confirm that login is required.
3. Register a user, log in and book an available upcoming workshop.
4. Open **My Bookings**, cancel the booking and confirm its status changes to `cancelled`.
5. Add a rating on a workshop detail page, then select another score to update it.
6. Log out and sign in with the demo administrator account.
7. Review dashboard statistics and create, edit or delete a workshop from **Manage Events**.

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home page and featured workshops |
| `/events` | Public | Searchable and filterable workshop list |
| `/events/:id` | Public | Workshop details, booking and rating controls |
| `/register` | Guest only | Community-member registration |
| `/login` | Guest only | User and administrator login |
| `/my-bookings` | User or admin | Current user's booking history |
| `/admin` | Admin only | Summary dashboard |
| `/admin/events` | Admin only | Workshop and booking management |
| `/access-denied` | Public | Role-permission feedback |

Unknown URLs are handled by a dedicated not-found page. Protected routes redirect unauthenticated visitors to login and preserve the intended destination.

## Project Structure

```text
FIT5032_A2/
├── src/
│   ├── assets/          # Global visual styles
│   ├── components/      # Navbar, event card, form error and rating UI
│   ├── data/            # Workshop seed data and allowed filter options
│   ├── router/          # Routes and authentication/role guards
│   ├── services/        # Auth, booking, event, rating, security and storage logic
│   ├── views/           # Public, user, admin and error pages
│   ├── App.vue          # Shared application shell and footer
│   └── main.js          # Bootstrap, router and initial-data setup
├── index.html
├── package.json
└── vite.config.js
```

The views focus on presentation and user interaction. Business rules and browser-storage operations are separated into service modules so that route checks are not the only protection around privileged actions.

## Browser Data Model

| Storage key | Storage | Main fields |
| --- | --- | --- |
| `neighbourhub.events` | `localStorage` | `id`, `title`, `description`, `category`, `language`, `date`, `time`, `location`, `facilitator`, `capacity`, `accessibilityInfo` |
| `neighbourhub.users` | `localStorage` | `id`, `name`, `email`, `passwordHash`, `passwordSalt`, `role`, `createdAt` |
| `neighbourhub.bookings` | `localStorage` | `id`, `userId`, `eventId`, `createdAt`, `status`, optional `cancelledAt` |
| `neighbourhub.ratings` | `localStorage` | `id`, `userId`, `eventId`, `score`, `createdAt`, `updatedAt` |
| `neighbourhub.session` | `sessionStorage` | `userId`, `role`, `createdAt` |

Initial workshops and the demo administrator are added on first load. Data persists in the current browser profile until that site's storage is cleared.

To reset the application, open the browser developer tools for the local site, clear its Local Storage and Session Storage, and reload the page. The initial workshops and demo administrator will be seeded again.

## Validation and Business Rules

- Registration requires a name, a valid and unique email address, and matching passwords with at least eight characters, uppercase, lowercase and a number.
- Login uses a generic credential-error message and validates both required fields and email format.
- Workshop forms require all fields, a positive whole-number capacity, a non-past date, a unique title and an allowed language value.
- Booking requires an authenticated user, an existing future event, remaining capacity and no duplicate active booking.
- Ratings must be whole numbers from 1 to 5, with one stored rating per user and workshop.
- Deleting a workshop also deletes its associated bookings and ratings.

## Security Approach

This project demonstrates basic client-side safeguards:

- Plain-text input is trimmed, length-limited and stripped of HTML-like tags before storage.
- Vue text interpolation is used instead of `v-html`, `innerHTML` or `eval`.
- Emails are normalised before comparison.
- Stored JSON and record shapes are validated before use.
- Passwords are salted and hashed with the Web Crypto API before user records are stored.
- Vue Router guards enforce authentication and role metadata.
- Administrator mutations perform a second role check in the service layer.

These controls do **not** provide production-grade security. Because the application has no server, users can still inspect or alter browser data. A real deployment would require server-side authentication and authorisation, a protected database, HTTPS, secure password hashing designed for credentials, and secure session cookies.

## Accessibility and Responsive Design

- Responsive Bootstrap grid layouts, navigation, cards, forms and an overflow-safe admin table.
- Associated labels for form controls and visible validation feedback.
- Native links and buttons for keyboard operation, with visible focus styles.
- `aria-label`, `aria-pressed`, `role="status"` and `aria-live="polite"` where appropriate.
- Written **Full** and **Ended** states so availability is not communicated by colour alone.
- Accessibility information displayed for every workshop.
- Larger minimum control sizes on small screens.

The interface includes accessibility-minded implementation, but it has not undergone a formal WCAG 2.1 AA audit.

## FIT5032 Assignment 2 Coverage

| Requirement | Implementation |
| --- | --- |
| A.1 | Vue 3, Vite, reusable single-file components, Composition API and Vue Router |
| A.2 | Bootstrap responsive layouts plus custom mobile and admin-table styling |
| B.1 | Registration, login, workshop and booking validation |
| B.2 | Dynamic events, users, bookings and ratings persisted in browser storage |
| C.1 | Registration, login, logout and session-aware navigation |
| C.2 | Route metadata, global guards and user/admin role handling |
| C.3 | Aggregate workshop ratings with one rating per user per workshop |
| C.4 | Input sanitisation, safe storage parsing, password hashing and action-level role checks |

## Known Limitations

- Authentication, authorisation and persistence are entirely client-side.
- Data is limited to the current browser profile and device.
- There is no backend, cloud database, email service, map integration or external API.
- Password hashing uses SHA-256 for demonstration and is not a replacement for a server-side password-hashing algorithm such as Argon2 or bcrypt.
- Automated unit, component and end-to-end tests are not included.
- Assignment categories D, E and F are outside the implemented scope.

## Academic Context

NeighbourHub was created as a university assessment prototype. It is not a deployed health service and must not be used to store real personal, medical or credential data.
