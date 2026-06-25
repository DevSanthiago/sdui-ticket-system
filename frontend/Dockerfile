FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env ./
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine-slim AS final

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]