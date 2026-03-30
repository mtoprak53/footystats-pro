FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . .

EXPOSE 5173

# Vite needs --host to be accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
