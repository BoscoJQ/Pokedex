# Pokédex Fullstack App (Laravel + Next.js)

This project is a **Pokédex web application** built with a Laravel backend (API provider) and a Next.js frontend (UI).  
It uses [PokeAPI](https://pokeapi.co/) as the data source, and demonstrates clean architecture, pagination, infinite scrolling, and modern frontend design.

---

## Project Structure
- pokedex-frontend/ ← Next.js frontend (UI)
- pokedex-api/ ← Laravel backend (API)


---

## Frontend Setup (Next.js)
1 Prerequisites
- Node.js 18 or newer
- npm or yarn
- Backend running (Laravel API)

2 Install Dependencies
cd pokedex-frontend
npm install

3 Run the Development Server
npm run dev

By default, Next.js runs on:
http://localhost:3000

---

## Backend Setup (Laravel API)
1 Prerequisites
- PHP 8.3 or newer
- Composer
- Laragon (recommended for Windows)
- Internet connection (for fetching from PokeAPI)

2 Install Dependencies
cd pokedex-api
composer install

3 Run the API Server
php artisan serve

By default, Laravel runs on:
http://127.0.0.1:8000

---

## API Documentation
http://127.0.0.1:8000/api

GET /api/pokemon
Fetches a list of Pokémon (paginated and merged with details).

- Query Parameters
| Name     | Type   | Default  | Description                            |
| -------- | ------ | -------- | -------------------------------------- |
| `limit`  | int    | 10       | Number of Pokémon to return            |
| `offset` | int    | 0        | Starting offset (for pagination)       |
| `search` | string | *(none)* | Optional search term (filters by name) |


- Example Request
GET http://127.0.0.1:8000/api/pokemon?limit=12&offset=0

- Example Response
[
  {
    "name": "ivysaur",
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
    "types": ["grass", "poison"],
    "height": 10,
    "weight": 130
  },
  {
    "name": "charmander",
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    "types": ["fire"],
    "height": 6,
    "weight": 85
  }
]

- Response Fields
| Field    | Type   | Description                       |
| -------- | ------ | --------------------------------- |
| `name`   | string | Pokémon name                      |
| `image`  | string | Official artwork image URL        |
| `types`  | array  | Pokémon types (e.g., grass, fire) |
| `height` | number | Pokémon height in decimeters      |
| `weight` | number | Pokémon weight in hectograms      |

---

## Notes
- Infinite scroll automatically fetches more Pokémon as you reach the bottom.
- The search bar filters only the already-loaded Pokémon (client-side).
- Clearing the search restores full list and reactivates infinite scroll.
