# Development Dockerfile for React Frontend

# Base image with Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./

# Install dependencies with npm install instead of npm ci
# to ensure package.json and package-lock.json are in sync
RUN npm install --legacy-peer-deps && \
    npm install -D react-refresh@0.14.0 && \
    npm install -g react-scripts@5.0.1 @craco/craco@7.1.0

# Copy the rest of the application
COPY . .

# Environment variable for development
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

# Expose the development server port
EXPOSE 3000

# Start the development server with increased memory limit
CMD ["npm", "start"]