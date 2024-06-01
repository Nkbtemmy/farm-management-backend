# Farmer Ordering System

This project is a Farmer Ordering System developed using Express.js, Prisma, PostgreSQL, and TypeScript. The system allows farmers to order fertilizers and seeds based on their land size. The following sections provide information on how to set up the project and configure the necessary environment variables.

# Features

- Create and Retrieve ranked users with different roles
- Enable CRUD operation on products
- Also Enable CRUD operations to order the fertilizer you want
- Use of PostgreSQL arrays, JSONB for unstructured data

## Prerequisites

Make sure you have the following software installed on your machine:

- Node.js (version >= 18)
- PostgreSQL (version >= 15) with a database instance set up

## Technologies Used

- [Express.js](https://expressjs.com/): Fast and minimalist web application framework for Node.js.
- [Prisma](https://www.prisma.io/): Modern database toolkit for TypeScript and Node.js.
- [PostgreSQL](https://www.postgresql.org/): Powerful open-source relational database system.
- [TypeScript](https://www.typescriptlang.org/):Typed superset of JavaScript that compiles to plain JavaScript.
-  [Docker](https://www.typescriptlang.org/):Docker and docker compose used to make this app containerized.


## Getting Started

To get started with the Farmer Ordering System, follow these steps:

   ```bash
   git clone https://github.com/Nkbtemmy/farm-management-backend.git
   cd farm-management-backend
   Open Terminal in current directory
   Run 'npm install' or 'yarn install'
   CREATE .env file and copy all variable from .env.example file 
   RUN npm 'run dev' for developement or 'npm build' and 'npm start' for production
   Then open your browser and start explore
   ```



1. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```shell
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
   ```

   ```
   NODE_ENV="development"
   ```

   ```
   PORT=2024
   ```

   ```
   JWT_SECRET="<secret>"
   ```

   ```
   JWT_ACCESS_EXPIRATION_MINUTES=30
   ```

2. Run the database push:

   ```shell
    yarn db:push
   ```

3. Run the database seed:

   ```shell
    yarn db:seed
   ```

### Configuration

    Environment variables and configuration settings can be managed in `.env` or `.env.example`.

   ```bash
      - npm run `dev` for starting development server
      - npm run `test` to run tests
      - npm run `start` for production while did npm run `build`
   ```



# CI/CD Pipelines

The service utilizes Jenkins for continuous integration and delivery workflows including:

## Development Pipeline

    Run unit tests
    Build Docker images
    Validate Swagger docs
    Push images to Docker registry
    Deploy to dev environment
    Production Pipeline
### Automated version tagging

    Run integration tests
    Container image upgrade
    Zero downtime deploy
    Traffic shift
    Monitoring and rollback
    Jenkins enables automating testing, Docker build/deploy.

## Deployment

This app is deployed on the Onrender server the link has been shared on the right side of this repository.
