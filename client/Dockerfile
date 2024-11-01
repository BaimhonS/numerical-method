# Stage 1: Build
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Install rollup explicitly
RUN npm install @rollup/rollup-linux-x64-musl

EXPOSE 3000

# Start Vite server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]