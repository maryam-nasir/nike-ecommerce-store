# Nike Ecommerce app with Cursor

A Nike-inspired e‑commerce store built with Next.js 15, React 19, Tailwind CSS v4, and Drizzle ORM. It features a landing page, product catalog with filters, product detail pages, cart, and authentication. The entire project is developed using cursor.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Zustand
- Better Auth
- Neon
- Drizzle ORM
- Cursor

## Main Features

- **Landing Page**: A fast, engaging homepage that introduces your brand and products with smooth animations and clear calls to action.

- **Product Listing Page**: Browse all products with filters, sorting, and real-time availability—powered by Cursor AI-generated content for dynamic updates.

- **Product Details Page**: Detailed product info, images, and reviews with AI-enhanced descriptions to help customers make confident buying decisions.

- **Auth Pages**: Secure and seamless user signup and login using Better Auth, ensuring smooth access without backend hassles.

## Getting Started

Follow these steps to set up the project locally on your machine.

**Prerequisites**<br />
Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en)

**Clone the Repository**

```
git clone https://github.com/maryam-nasir/nike-ecommerce-store.git
cd nike-ecommerce-store
```

**Installation**<br />
Install the project dependencies using npm:

```
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

Replace the placeholder values with your actual NeonDB and BetterAuth values and secrets.

**Running the Project**<br />
Run:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser to view the project.

## Access the Deployed version on Vercel

The app is deployed on Vercel and can be accessed here: [Nike Ecommerce App]().

## Acknowledgements

I have developed this project by following the JavaScript Mastery tutorial on [YouTube](https://www.youtube.com/watch?v=fZdTYswuZjU).