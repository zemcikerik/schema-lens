FROM eclipse-temurin:25-jre-alpine
RUN apk --no-cache add curl tzdata

COPY ./build/libs/*.jar /app/api.jar

VOLUME /app/profile-pictures
ENV storage.profile-picture.folder-path=/app/profile-pictures
ENV TZ=UTC
ENV JAVA_TOOL_OPTIONS="-Duser.timezone=UTC -Doracle.jdbc.timezoneAsRegion=false"

HEALTHCHECK --interval=1m --timeout=5s --start-period=45s --retries=3 \
    CMD curl --fail --silent --show-error http://localhost:8081/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/api.jar"]
