# Build stage
FROM node:20.18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy .env file so Vite can bake in VITE_* variables at build time
COPY .env ./

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Copy the build output to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx template for dynamic port support (Zeabur uses $PORT)
# Official nginx image will run envsubst on files in /etc/nginx/templates/*.template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Default port if $PORT is not provided
ENV PORT=80

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
