# 📚 BookStack - Sistema de Gestión de Biblioteca

BookStack es una plataforma web para la administración de una biblioteca, desarrollada bajo una **Arquitectura de Microservicios**. Este proyecto utiliza un enfoque de **Monorepo**, donde todos los servicios residen en este único repositorio para facilitar el desarrollo en equipo.

##  Arquitectura del Sistema

El sistema está compuesto por la siguiente infraestructura base y microservicios de negocio:

* **Eureka Server (`eureka-server`):** Servidor de descubrimiento. Actúa como el directorio central donde todos los microservicios se registran para poder comunicarse entre sí sin depender de IPs o puertos fijos.
* **API Gateway (`api-gateway`):** Puerta de enlace principal. Centraliza las peticiones del cliente, maneja la seguridad/autenticación y enruta el tráfico al microservicio correspondiente.
* **User Service (`user-service`):** Microservicio encargado de la gestión de usuarios, roles y autenticación. (Base de datos: PostgreSQL).
* **Catalog Service (`catalog-service`):** Microservicio encargado del catálogo de libros, autores y categorías. (Base de datos: MongoDB).
* **Loan Service (`loan-service`):** Microservicio encargado de la gestión de préstamos, devoluciones y multas. (Base de datos: PostgreSQL).

## 🛠️ Stack Tecnológico

* **Lenguaje:** Java 21
* **Framework:** Spring Boot 3.3.x
* **Ecosistema Cloud:** Spring Cloud (Netflix Eureka, Spring Cloud Gateway)
* **Gestor de Dependencias:** Maven
* **Bases de Datos:** PostgreSQL (Relacional) y MongoDB (NoSQL)

## 📂 Estructura del Monorepo

```text
BookStack/
│
├── eureka-server/         # Servidor de descubrimiento (Puerto 8761)
├── api-gateway/           # Puerta de entrada principal (Puerto 8080)
├── user-service/          # Lógica de usuarios
├── catalog-service/       # Lógica de catálogo de libros
└── loan-service/          # Lógica de préstamos
