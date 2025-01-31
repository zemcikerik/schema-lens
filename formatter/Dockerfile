FROM denoland/deno:alpine

EXPOSE 8000
WORKDIR /app
USER deno

COPY . .
RUN deno install
RUN deno cache main.ts

CMD ["task", "run"]
