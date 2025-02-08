FROM denoland/deno:alpine
RUN apk --no-cache add curl

USER deno
WORKDIR /app

COPY . .
RUN deno install
RUN deno cache main.ts

HEALTHCHECK --interval=1m --timeout=5s --start-period=10s --retries=3 \
    CMD curl --fail --silent --show-error http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["task", "run"]
