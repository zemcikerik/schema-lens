FROM denoland/deno:alpine

RUN apk --no-cache add curl
COPY . .
RUN deno install
RUN deno cache main.ts

EXPOSE 8000
WORKDIR /app
USER deno

HEALTHCHECK --interval=1m --timeout=5s --start-period=10s --retries=3 \
    CMD curl --fail --silent --show-error http://localhost:8000/health || exit 1

CMD ["task", "run"]
