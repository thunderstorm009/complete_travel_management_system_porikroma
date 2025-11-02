# Backend Documentation — Porikroma

Location: `backend/`

Overview

- Java Spring Boot application built with Maven.
- Main application entry: `com.porikroma.PorikromaApplication`.
- Configuration files: `backend/src/main/resources/application.properties`.

Local development

Prerequisites

- Java JDK 17+ (match the version in `pom.xml`).
- Maven

Run via Maven

   cd backend
   mvn spring-boot:run

Build and run jar

   mvn package
   java -jar target/porikroma-backend-0.0.1-SNAPSHOT.jar

Configuration

- Database connection, mail, and other properties live in `application.properties`.
- For local development copy `application.properties` to `src/main/resources/application-local.properties` (or use profiles) and override values.

Testing

   mvn test

Notes for developers

- Controller classes are in `backend/src/main/java/com/porikroma/controller/`.
- Services under `service/` and repositories under `repository/`.
- If you update the SQL schema, also update `database/schema.sql`.
