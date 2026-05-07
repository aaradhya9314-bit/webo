# LuxeCart MERN E-commerce

Premium responsive e-commerce starter built with React, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, Redux Toolkit, Axios, and reusable UI components.

## Features

- User registration, login, logout, JWT auth, encrypted passwords, persisted sessions
- Responsive home, products, product detail, cart, checkout, dashboard, admin, contact, and about pages
- Product search, category filters, price sorting, pagination, reviews, wishlist, dark/light mode
- Cart quantity management with local persistence
- Admin product CRUD with image URL support and order management
- Dummy checkout UI and order creation
- Toasts, loading states, mobile-friendly navigation, SEO-friendly page titles

## Project Structure

```txt
client/   React + Vite + Tailwind frontend
server/   Node.js + Express + MongoDB REST API
```

## Environment Setup

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/luxecart
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

```bash
cd server
npm install
npm run seed
npm run dev
```

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000/api`

## Demo Accounts

After running `npm run seed`:

- Admin: `admin@luxecart.dev` / `Admin123!`
- User: `user@luxecart.dev` / `User123!`

## Deployment Notes

- Set production environment variables on your host.
- Use MongoDB Atlas for `MONGO_URI`.
- Build frontend with `npm run build` inside `client`.
- Deploy backend as a Node service and frontend as static assets.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin
- `PUT /api/products/:id` admin
- `DELETE /api/products/:id` admin
- `POST /api/products/:id/reviews`
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders` admin
- `PATCH /api/orders/:id/status` admin

