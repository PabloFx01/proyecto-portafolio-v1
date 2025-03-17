FROM openjdk:19-jdk-slim
ARG JAR_FILE=target/SpringBootRestctrlPagos-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app_ctrlPagos.jar
EXPOSE 8020
ENTRYPOINT ["java", "-jar", "app_ctrlPagos.jar"]