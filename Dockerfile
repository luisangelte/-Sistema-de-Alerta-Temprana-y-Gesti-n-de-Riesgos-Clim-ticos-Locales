FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY tsconfig.docker.json ./
COPY src ./src

RUN npx tsc -p tsconfig.docker.json

EXPOSE 4000

CMD ["npx", "tsx", "src/index.ts"]

