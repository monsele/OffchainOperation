# Use Node.js LTS (Long Term Support) as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY . .

# Copy environment files if needed
COPY .env ./

# Build TypeScript code
RUN npm run build

# Expose the port your app runs on (adjust if different)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]