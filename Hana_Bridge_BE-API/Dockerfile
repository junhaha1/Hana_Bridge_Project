FROM openjdk:21-slim

RUN apt-get update && apt-get install -y coreutils

WORKDIR /app
COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew build -x test

# 여기는 빌드된 jar 파일을 이미 가지고 있으므로 ENTRYPOINT만!
ENTRYPOINT ["java", "-jar", "build/libs/Hana_Bridge_BE-API-0.0.1.jar"]