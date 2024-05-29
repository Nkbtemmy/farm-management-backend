FROM  node:18-alpine3.16
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn global add prisma prisma-dbml-generator
RUN yarn add prisma@5.12.0
# RUN yarn add @prisma/client@latest
RUN prisma generate
RUN yarn build
# CMD [ "yarn", "dev" ]
