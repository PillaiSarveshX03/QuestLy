# Node.js 20 Alpine Linux image - lightweight, fast, and secure
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the API server port
EXPOSE 5000

# Run with nodemon for live hot-reloading
CMD ["npm", "run", "dev"]
