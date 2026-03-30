FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
