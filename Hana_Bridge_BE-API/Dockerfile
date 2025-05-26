FROM openjdk:21
WORKDIR /app
COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew build -x test

COPY build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]