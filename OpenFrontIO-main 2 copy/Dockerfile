FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build:server
EXPOSE 8080
CMD ["npm", "run", "start:server"]
