# Development Deployment Instructions

This document outlines the steps taken to deploy the React frontend application in development mode using Docker.

## Configuration Files Created/Updated

1. **Dockerfile**
   - Created a development-focused Dockerfile using Node.js 18 Alpine as the base image
   - Set up proper working directory and dependencies installation
   - Configured to run in development mode

2. **docker-compose.dev.yml**
   - Created a Docker Compose configuration file for development
   - Set up volume mapping for hot reloading
   - Configured environment variables from .env.development
   - Exposed port 3001 (mapped to internal port 3000)

3. **.dockerignore**
   - Added proper exclusions for Docker builds
   - Optimized build context by ignoring unnecessary files

## Deployment Steps

1. Created Docker configuration files
2. Built and started the container using:
   ```bash
   docker compose -f docker-compose.dev.yml up --build -d
   ```
3. Verified the container is running:
   ```bash
   docker ps -a | grep app-yk-frontend-dev
   ```
4. Checked application accessibility:
   ```bash
   curl -I localhost:3001
   ```

## Accessing the Application

The React application is now running in development mode and can be accessed at:
- **URL**: http://localhost:3001
- **Container Name**: app-yk-frontend-dev

## Common Commands

- **View logs**:
  ```bash
  docker logs -f app-yk-frontend-dev
  ```

- **Restart the container**:
  ```bash
  docker restart app-yk-frontend-dev
  ```

- **Stop the development environment**:
  ```bash
  docker compose -f docker-compose.dev.yml down
  ```

- **Rebuild and restart after changes to Dockerfile or docker-compose.dev.yml**:
  ```bash
  docker compose -f docker-compose.dev.yml up --build -d
  ```

## Notes
- The application uses hot reloading for development
- Any changes made to the source code will automatically reflect in the browser
- Environment variables are configured for development in the docker-compose.dev.yml file