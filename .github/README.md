# Sports Leagues SPA

A single-page application that displays sports leagues from around the world with filtering capabilities and badge viewing.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)

## Features

- 🏆 **Browse Leagues** - View all sports leagues from TheSportsDB API
- 🔍 **Search** - Filter leagues by name in real-time
- 🎯 **Filter by Sport** - Dropdown to filter by sport type (Soccer, Basketball, etc.)
- 🏅 **View Badges** - Click any league to view its season badge
- 💾 **Caching** - Badge responses are cached in localStorage
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- 🌙 **Dark Mode** - Automatic dark mode support

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **API**: [TheSportsDB](https://www.thesportsdb.com/free_sports_api)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/zatkniz/sporty-group.git
cd sporty-group

# Install dependencies
npm install
```

### Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
app/
├── components/         # Vue components
│   ├── LeagueCard.vue     # Individual league card
│   ├── LeaguesFilters.vue # Search & filter controls
│   ├── LeaguesGrid.vue    # Grid layout for leagues
│   └── BadgeModal.vue     # Modal for displaying badges
├── composables/        # Reusable composition functions
│   └── useApi.ts          # API client wrapper
├── stores/             # Pinia stores
│   └── sportsLeagues.ts   # Leagues state management
├── types/              # TypeScript definitions
│   └── thesportsdb.ts     # API response types
├── pages/              # Route pages
│   └── index.vue          # Main leagues page
└── layouts/            # Layout components
    └── default.vue        # Default layout
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `all_leagues.php` | Fetch all sports leagues |
| `search_all_seasons.php?badge=1&id={id}` | Fetch league badge by ID |

## Documentation

For detailed development documentation, including architecture decisions and AI tools used, see [DEVELOPMENT.md](./DEVELOPMENT.md).

## License

This project is for demonstration purposes.
