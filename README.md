# Vanish Vault - Backend

The backend for Vanish Vault, a secure platform for sharing ephemeral secrets and files.

## Features

- **Secure Secrets**: Shares text-based secrets with optional password protection and view limits.
- **Ephemeral Files**: Upload and share files that vanish after expiration or a set number of views.
- **Burn After Reading**: Option to make secrets/files burn immediately after the first view.
- **Subscription Plans**: Managed user plans (Free, Pro) with varying limits.
- **Payment Integration**: Razorpay for subscription management.
- **Infrastructure**: AWS S3 for secure file storage and PostgreSQL for data persistence.
- **API Documentation**: Interactive Swagger-based API documentation.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Storage**: AWS S3
- **Payments**: Razorpay
- **Documentation**: Swagger (OpenAPI)

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- AWS Account (for S3)
- Razorpay Account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

### Database Setup

This project uses TypeORM migrations for schema management.

1. **Initial Migration**: (Already generated in `src/config/migrations`)
2. **Run Migrations**:
   ```bash
   npm run migration:run
   ```
3. **Seed Plans**:
   ```bash
   npm run seed
   ```

### Running the App

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## API Documentation

Once the server is running, you can access the API documentation at:
`http://localhost:4000/swagger` (default port 4000)

## Scripts

- `npm run dev`: Start dev server with nodemon and ts-node.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run start`: Run the compiled production bundle.
- `npm run seed`: Seed initial data (like plans).
- `npm run migration:generate -- <path>`: Generate a new migration based on entity changes.
- `npm run migration:run`: Execute pending migrations.
- `npm run migration:revert`: Revert the last migration.

## License

MIT
