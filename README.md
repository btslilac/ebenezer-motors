# Ebenezer Motors Web App

Modern React single-page application for showcasing vehicle inventory, car hire services, and trade-in options for Ebenezer Motors.

## Tech Stack

- React 19 with React Router
- Vite (rolldown engine) for development and builds
- Tailwind CSS 4 with custom theme tokens
- Lucide icons for UI accents
- ESLint 9 for linting

## Prerequisites

- Node.js 20 or later (includes npm)
- Git (optional, but recommended for cloning and source control)

Confirm your versions:

```
node --version
npm --version
```

## Getting Started

1. **Clone the repository** (or download the source):
	```
	git clone https://github.com/<your-org>/ebenezer-motors.git
	cd ebenezer-motors
	```
2. **Install dependencies**:
	```
	npm install
	```
3. **Start the development server**:
	```
	npm run dev
	```
	Vite prints the local URL (default http://localhost:5173). Press `Ctrl+C` to stop when finished.

## Available Scripts

| Command           | Description |
| ----------------- | ----------- |
| `npm run dev`     | Start Vite dev server with hot module replacement. |
| `npm run build`   | Create production build in the `dist` directory. |
| `npm run preview` | Serve the production build locally. Run `npm run build` first. |
| `npm run lint`    | Run ESLint across the project. Add `-- --fix` to auto-fix. |

## Project Structure

```
src/
├─ components/      # Navbar and vehicle card UI pieces
├─ pages/           # Route views (Home, Inventory placeholders)
├─ data/            # Mock vehicle inventory used for UI previews
├─ assets/          # Static assets (images, icons)
└─ App.jsx          # Route configuration and shell layout
```

Tailwind CSS is imported via `src/App.css` and configured in `tailwind.config.js`. Global resets and fonts live in `src/index.css`.

## Styling Guidelines

- Theme colors are defined under the `brand` namespace in `tailwind.config.js`.
- Components should use Tailwind utility classes; add minimal bespoke CSS when utilities fall short.
- Images inside cards use a fixed aspect ratio to remain responsive.

## Linting and Code Quality

Run linting before committing:

```
npm run lint
```

Common fixes can be applied automatically:

```
npm run lint -- --fix
```

## Building for Production

```
npm run build
npm run preview   # optional: verify the dist build locally
```

Deploy the `dist` folder to your static hosting provider (Netlify, Vercel, Azure Static Web Apps, etc.).

## Troubleshooting

- **Dependency not found**: Ensure you ran `npm install` and that the import path matches the package name.
- **Port in use**: Stop other dev servers or start Vite with `npm run dev -- --port 5174`.
- **Styling issues**: Confirm the Tailwind CLI detected your files. Restart `npm run dev` after adding new component paths.

## Recent Fixes (January 2026)

- Removed leftover `[cite_*]` placeholders in [src/pages/Home.jsx](src/pages/Home.jsx#L36-L114) that previously rendered as invalid JSX and caused a white screen on load.
- Corrected the Vehicle Details import in [src/pages/VehicleDetails.jsx](src/pages/VehicleDetails.jsx#L1-L33) to use the named `vehicles` export, fixing the production build failure and ensuring vehicle data loads.
- Replaced the Home search redirect with an in-place results preview by adding local filter state and a `Matching Vehicles` section below the controls [src/pages/Home.jsx](src/pages/Home.jsx#L7-L205). Users now see filtered cards instantly, along with a clear-filters action.
- Verified the updated bundle with `npm run build`, confirming the app compiles without errors.
