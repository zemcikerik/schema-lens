FROM eclipse-temurin:21-jre-alpine

RUN mkdir /app

RUN mkdir /app/translations
VOLUME /app/translations
ENV translate.base-path=/app/translations

COPY ./build/libs/*.jar /app/api.jar

ENTRYPOINT ["java", "-jar", "/app/api.jar"]
