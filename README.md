# NeighbourHub

NeighbourHub is a Vue 3 front-end web application for Riverside Migrant Health Charity. It supports migrant community health workshops, bookings, ratings and a small admin management workflow for FIT5032 Assignment 2.

## Project Overview

The application helps community users browse health education sessions, register, log in, book workshops, view their bookings and rate events. Administrators can review summary statistics and manage the workshop list.

## Target Community

The target users are migrant communities seeking accessible, low-cost health education and support services, including mental health information, nutrition workshops, women health seminars, vaccination information and caregiver support.

## Implemented Business Requirements

- A.1: Vue 3, Vite, Vue single-file components, Composition API with `script setup`, Vue Router and npm scripts.
- A.2: Bootstrap 5 responsive layouts, responsive navbar, containers, rows, columns, multi-column cards, mobile-friendly forms and horizontally scrollable admin tables.
- B.1: Registration, login, event form and booking validations.
- B.2: Dynamic events, users, bookings and ratings using JavaScript data structures plus `localStorage`.
- C.1: Register, login, logout, current session and protected routes using `sessionStorage`.
- C.2: Route meta roles and global navigation guards for `user` and `admin`.
- C.3: Aggregated event ratings with one rating per user per event.
- C.4: Basic front-end security controls for input sanitisation, role checks and storage parsing.

## Installation

```bash
npm install
```

On Windows PowerShell, if `npm.ps1` is blocked by execution policy, run:

```bash
npm.cmd install
```

## Run

```bash
npm run dev
```

PowerShell alternative:

```bash
npm.cmd run dev
```

## Build

```bash
npm run build
```

PowerShell alternative:

```bash
npm.cmd run build
```

## Demo Admin Credentials

- Email: `admin@neighbourhub.org.au`
- Password: `Admin123!`

This account is only for course demonstration. The password is not stored in `localStorage`; the demo admin user is seeded with a precomputed salt and SHA-256 hash.

## User Features

- Register as a normal `user`.
- Log in and log out.
- Browse and filter health workshops.
- View full event details.
- Book available events.
- View and cancel personal bookings.
- Submit or update a 1 to 5 rating for an event.

## Admin Features

- Log in as the demo admin.
- View total users, total events, active bookings and average rating.
- Create, edit and delete events.
- View bookings linked to each event.
- Admin actions re-check the current role at the service/action layer.

## LocalStorage Data Model

- `neighbourhub.events`: `id`, `title`, `description`, `category`, `language`, `date`, `time`, `location`, `facilitator`, `capacity`, `accessibility`.
- `neighbourhub.users`: `id`, `name`, `email`, `passwordHash`, `passwordSalt`, `role`, `createdAt`.
- `neighbourhub.bookings`: `id`, `userId`, `eventId`, `createdAt`, `status`.
- `neighbourhub.ratings`: `id`, `userId`, `eventId`, `score`, `createdAt`, `updatedAt`.
- `neighbourhub.session` is stored in `sessionStorage` and contains `userId`, `role` and `createdAt`.

## Validation Approach

Registration validates required fields, email format, password strength, password confirmation, name length and duplicate email. Login validates required fields, email format and shows the generic message `Invalid email or password.` for credential failures. Event forms validate required fields, positive integer capacity, non-past dates, title and description lengths and allowed language options. Booking validation checks login state, event existence, available places, duplicate active bookings and ended events.

## Security Approach

This front-end authentication system is implemented for assessment demonstration only. A production application would require secure server-side authentication and database access control.

Basic controls include plain-text sanitisation, email normalisation, role validation, safe JSON parsing with fallbacks, route-level role checks and action-level admin checks. Passwords are salted and hashed with the browser Web Crypto API using SHA-256 before user records are stored.

## Security Reflection

Vue default text interpolation helps avoid directly executing HTML from user input. The application does not use `v-html`, `innerHTML` or `eval`. User input is validated and passed through plain-text sanitisation before storage. Passwords are stored as a salt and SHA-256 hash rather than plaintext. Roles are checked by both Vue Router guards and service/action functions.

`localStorage` is not suitable for production storage of sensitive authentication data. A real system should use server-side authentication, HTTPS, HttpOnly cookies and server-side access control. This project does not claim production-grade security.

## Known Limitations

- Authentication and data persistence are front-end only and can be modified by a user with browser developer tools.
- There is no backend, cloud database, Firebase, email API, map API, OpenAI API, advanced charts or deployment.
- Data is local to the browser and device.
- Category D, E and F features are intentionally not implemented.
