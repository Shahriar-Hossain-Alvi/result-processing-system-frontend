FROM node:23-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Ensure vite listens on 0.0.0.0 so the port mapping works
CMD ["npm", "run", "dev", "--", "--host"]