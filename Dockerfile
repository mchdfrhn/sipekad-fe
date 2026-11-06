# Build stage
FROM node:20.18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Accept build arguments for environment variables
# These must start with VITE_ to be picked up by Vite
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG VITE_WHATSAPP_NUMBER
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

# Copy .env file only if it exists (using wildcard to prevent build crash)
COPY .env* ./

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Which nginx config to use. Default keeps the Railway behaviour (proxy /api to the backend);
# the VPS build passes nginx.static.conf.template.
ARG NGINX_CONF=nginx.conf.template
# Copy the build output to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx template for dynamic port support (Railway injects $PORT)
# Official nginx image will run envsubst on files in /etc/nginx/templates/*.template
COPY ${NGINX_CONF} /etc/nginx/templates/default.conf.template

# Default port if $PORT is not provided
ENV PORT=80

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
