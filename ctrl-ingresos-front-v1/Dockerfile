FROM node:18-alpine AS build-step

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build && ls /app/dist

#segunda etapa

FROM nginx:1.17.1-alpine

COPY --from=build-step /app/dist/ctrl-ingresos/ /usr/share/nginx/html

RUN rm etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]