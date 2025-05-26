# 1단계: 빌드
FROM gradle:8.2.1-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle build -x test

# 2단계: 실행
FROM openjdk:21-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]