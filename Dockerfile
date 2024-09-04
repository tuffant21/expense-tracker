FROM node:20-alpine3.20

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY server.js .
COPY public public

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
