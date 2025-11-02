# Frontend Documentation — Porikroma

Location: `frontend/`

Overview

- Built with React + TypeScript (create-react-app).
- Uses Tailwind for styling and several API helper modules under `src/api/`.

Local development

1. Install dependencies

   npm install

2. Start development server

   npm start

Build for production

   npm run build

Environment variables

- The project uses a client-side config pattern. If any environment variables are required, set them in a `.env` file in `frontend/`. Example:

  REACT_APP_API_BASE_URL=http://localhost:8080

Testing

   npm test

Notes for developers

- API client files are in `src/api/`.
- Main pages are in `src/pages/` and components in `src/components/`.
- If you add new environment vars, document them here and in `README.md`.
