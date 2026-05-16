# NIMASA Maritime Tracking System

Real-time vessel tracking, collision avoidance, and restricted-area monitoring for Nigerian coastal waters. Built as the frontend layer for a thesis project integrating AIS data ingestion, a PPO-based collision avoidance model, and rule-based geofencing.

## Architecture

- **Frontend (this repo):** Next.js 16, React 19, Tailwind CSS, Leaflet
- **Backend:** FastAPI (separate repository), running on `localhost:8000`
- **Data:** AISStream → Backend → Frontend via REST + WebSocket
- **ML:** PPO collision avoidance model wrapped by backend `/collision-avoidance/check`

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. Backend must be running at `http://localhost:8000` for authenticated features.

## Environment variables

Configured in `.env.local`:

- `NEXT_PUBLIC_API_BASE_URL` — backend REST base URL
- `NEXT_PUBLIC_WS_BASE_URL` — backend WebSocket base URL

## Screens

| Route | Description | Auth |
|---|---|---|
| `/map` | Public map showing all tracked vessels | No |
| `/login` | Operator sign-in | No |
| `/register` | New operator account | No |
| `/verify` | Vessel verification with statutory document uploads | Yes |
| `/my-vessels` | Operator's fleet overview | Yes |
| `/my-vessels/[mmsi]` | Single vessel dashboard with live alerts | Yes |
| `/vessel/[mmsi]` | Detail view for a non-owned vessel | No |
| `/collision-alert` | Full-screen Collision Alert Center | Yes |

## Frontend-side responsibilities


- Mock data for Sensitive Logistics (cargo, ETA, ISPS level, etc.) in `src/lib/mockData.js`
- AIS navigation status code → human-readable string in `src/lib/constants.js`
- Signal quality calculation (Excellent/Fair/Poor) from update recency
- Nearby vessel filtering for collision checks (haversine within 6nm)
- Alert state transitions (warning → breach → cleared)
- Search and pagination
