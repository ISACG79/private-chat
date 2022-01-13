FROM node:16

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install socket.io

RUN npm install socket.io mysql

COPY . .

EXPOSE 4320

CMD ["node", "server.js"]
