FROM node:18-alpine3.16 AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn global add prisma prisma-dbml-generator
RUN yarn prisma generate
RUN yarn build

# Stage 3: Production
FROM node:18-alpine3.16 AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/build ./build
RUN yarn install --production
RUN npx prisma generate
EXPOSE 4006
CMD [ "node", "build/index.js" ]