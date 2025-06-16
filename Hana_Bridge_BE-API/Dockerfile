# backend/Dockerfile
FROM openjdk:21-slim

WORKDIR /app
# GitHub Actions에서 만든 .jar만 복사
COPY build/libs/Hana_Bridge_BE-API-0.0.1.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]