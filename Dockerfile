FROM node:18-alpine3.16 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn global add prisma prisma-dbml-generator
RUN yarn prisma generate
RUN yarn build

FROM node:18-alpine3.16 AS dev
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/yarn.lock ./
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
RUN yarn install
EXPOSE 4006

FROM node:18-alpine3.16 AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/yarn.lock ./
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/build ./build
RUN yarn install --production
EXPOSE 4006
CMD [ "yarn", "start" ]
