# Debian 기반 (apt 사용 가능)
FROM openjdk:21-slim

RUN apt-get update && apt-get install -y coreutils

WORKDIR /app
COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew build -x test

COPY build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]