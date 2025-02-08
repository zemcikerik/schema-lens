FROM eclipse-temurin:21-jre-alpine
RUN apk --no-cache add curl

COPY ./build/libs/*.jar /app/api.jar

VOLUME /app/profile-pictures
ENV storage.profile-picture.folder-path=/app/profile-pictures

HEALTHCHECK --interval=1m --timeout=5s --start-period=45s --retries=3 \
    CMD curl --fail --silent --show-error http://localhost:8081/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/api.jar"]
