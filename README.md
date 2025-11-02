# Porikroma

This repository contains the Porikroma application (backend + frontend).

Quick overview

- Backend: Java Spring Boot (maven) located in `backend/`.
- Frontend: React + TypeScript located in `frontend/`.
- Database: SQL schema files in `database/`.

Quick start

Prerequisites

- Java 17+ (or the version declared in `backend/pom.xml`)
- Maven
- Node.js 16+ and npm/yarn

Run backend

1. From the `backend/` directory:

   mvn spring-boot:run

or build a jar:

   mvn package
   java -jar target/porikroma-backend-0.0.1-SNAPSHOT.jar

Run frontend

1. From the `frontend/` directory:

   npm install
   npm start

Database

- SQL schema files are in `database/schema.sql`. Import into your preferred RDBMS.

Contributing

Please open issues or pull requests with changes. Add documentation updates here.
