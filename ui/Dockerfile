FROM nginx:stable-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/schema-lens/browser /usr/share/nginx/html

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
