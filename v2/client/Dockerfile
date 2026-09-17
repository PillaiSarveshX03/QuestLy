# Node.js 20 Alpine Linux image - lightweight, fast, and secure
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package manifests first for Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server default port
EXPOSE 5173

# Run Vite dev server with host flag to listen on all interfaces
CMD ["npm", "run", "dev", "--", "--host"]
