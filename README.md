# FA HRM

FA HRM is a people operations workspace built with Next.js, React, and TypeScript. The initial product release focuses on the everyday workflows an HR or team administrator needs: an at-a-glance team overview, a people directory, attendance, and leave review.

## Included

- Responsive HR workspace with overview, people, attendance, leave, hiring, and reports areas.
- Add employees to the directory, search by name/role/department, and export the directory as CSV.
- Review, approve, and decline leave requests.
- Toggle a sample check-in/check-out state.
- Persist changes in the current browser using local storage.
- Sample data is fictional and shown only to make the interface usable on first launch.

## Run locally

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current product boundary

This release is a local, single-browser product prototype. It has no user accounts, server-side database, access controls, or multi-user synchronization. Do not enter real employee or payroll information. Before using it for an organization, add authenticated access, server-side authorization, a database with migrations and backups, audit history, and deployment configuration. Hiring and reports are presented as clearly marked upcoming workspaces; payroll and statutory calculations are intentionally not represented as implemented.

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4 (base tooling)

