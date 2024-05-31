# Stage 1: Build
FROM node:18-alpine3.16 AS build

WORKDIR /usr/src/app

# Copy only package.json and yarn.lock for dependency installation
COPY package.json ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Install necessary global packages and generate Prisma client
RUN yarn global add prisma prisma-dbml-generator
RUN yarn prisma generate

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:18-alpine3.16 AS production

WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the production image
COPY package.json ./

# Install only production dependencies
RUN yarn install

# Copy the Prisma schema and generated client
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copy the build artifacts
COPY --from=build /usr/src/app/build ./build

# Generate the Prisma Client
RUN yarn prisma generate

# # Create a migration and migrate your database
# RUN yarn prisma migrate dev --name init


# Expose the port your application will run on
EXPOSE 4006

# Command to run your application
CMD ["node", "build/index.js"]
