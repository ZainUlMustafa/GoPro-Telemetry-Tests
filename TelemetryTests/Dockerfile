FROM node:16.14-alpine

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

CMD ["node", "index.js"]
