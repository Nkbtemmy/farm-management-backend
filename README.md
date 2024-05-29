# Farmer Ordering System

This project is a Farmer Ordering System developed using Express.js, Prisma, PostgreSQL, and TypeScript. The system allows farmers to order fertilizers and seeds based on their land size. The following sections provide information on how to set up the project and configure the necessary environment variables.

## Prerequisites

Make sure you have the following software installed on your machine:

- Node.js (version >= 12)
- PostgreSQL (version >= 9) with a database instance set up

## Getting Started

To get started with the Farmer Ordering System, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/nicele08/farm-backend.git
   ```

2. Install the dependencies:

   ```shell
    yarn install
   ```

3. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```shell
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
   ```

   ```
   NODE_ENV="development"
   ```

   ```
   PORT=3000
   ```

   ```
   JWT_SECRET="<secret>"
   ```

   ```
   JWT_ACCESS_EXPIRATION_MINUTES=30
   ```

4. Run the database push:

   ```shell
    yarn db:push
   ```

5. Run the database seed:

   ```shell
    yarn db:seed
   ```

6. Start the server:

```shell
    cd farm-backend
```

```shell
 yarn dev
```

7. Open your browser and navigate to `http://localhost:3000/docs` to view the Swagger documentation.

## Technologies Used

- [Express.js](https://expressjs.com/): Fast and minimalist web application framework for Node.js.
- [Prisma](https://www.prisma.io/): Modern database toolkit for TypeScript and Node.js.
- [PostgreSQL](https://www.postgresql.org/): Powerful open-source relational database system.
- [TypeScript](https://www.typescriptlang.org/):Typed superset of JavaScript that compiles to plain JavaScript.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
