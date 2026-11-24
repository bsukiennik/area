# Backend technologies comparative

The purpose of this document is to compare different backend technologies and select the most appropriate one for the AREA project.

The backend is responsible for managing users, authentication, workflows, triggers, reactions, conditions, external service integrations and communication with the frontend and mobile application.

The technologies evaluated are:

- **Go**
- **Node.js with TypeScript**
- **Python**
- **Java**

## Comparison Criteria

The technologies are evaluated using the following criteria:

| Criteria | Description |
|---|---|
| Performance | Ability to handle multiple requests and execute workflows efficiently. |
| Concurrency | Ability to manage multiple workflows and background tasks simultaneously. |
| Security | Availability of tools and libraries for authentication, data validation and secure communication. |
| Ecosystem | Availability of libraries for APIs, databases, authentication and external integrations. |
| Maintainability | Ease of organising, understanding and extending the codebase. |
| Learning curve | Time and effort required for developers to become productive. |
| Deployment | Ease of building, packaging and deploying the backend using Docker. |

## Comparative Table

| Criteria | Go | Node.js / TypeScript | Python | Java |
|---|---|---|---|---|
| Performance | Excellent | Very good | Moderate | Excellent |
| Concurrency | Excellent | Very good | Good with appropriate architecture | Excellent |
| Security ecosystem | Good | Very good | Very good | Excellent |
| Ecosystem | Good | Excellent | Excellent | Excellent |
| Maintainability | Very good | Very good | Very good | Very good |
| Learning curve | Moderate | Moderate | Easy | Moderate to difficult |
| Docker deployment | Excellent | Very good | Very good | Good |

These evaluations are qualitative and depend on the frameworks, libraries and architecture selected.

## Detailed Comparison for the AREA Project

The AREA backend has several specific requirements that influence the technology selection.

### Workflow execution

The backend must be able to execute multiple workflows simultaneously. Each workflow may contain several triggers, conditions and reactions.

Go is particularly suitable for this requirement because goroutines are lightweight and can handle a large number of concurrent tasks.

Node.js also handles asynchronous network operations efficiently, but CPU-intensive operations need to be managed carefully.

Python can handle asynchronous tasks using asyncio, although CPU-intensive operations may require multiprocessing or other approaches.

Java provides mature concurrency mechanisms, but its implementation can require more configuration and complexity.

**Preferred technology: Go.**

### External service integrations

The application must communicate with external services through their APIs. These integrations may require HTTP requests, OAuth2 authentication, webhook handling and asynchronous processing.

All four technologies provide libraries capable of handling these requirements.

Node.js and Python have particularly extensive ecosystems for interacting with external APIs. Go also provides sufficient libraries and a standard HTTP client that covers most of the project's needs.

**Preferred technology: Go or Node.js.**

### API development

The backend must expose an API used by the web frontend and mobile application.

Go provides a built-in HTTP server and frameworks such as Chi and Gin.

Node.js offers several mature frameworks, while Python provides FastAPI, which includes automatic OpenAPI documentation.

Java offers Spring Boot, a mature framework for developing REST APIs.

All four technologies are suitable for this requirement.

**Preferred technology: Go or Node.js.**

### Deployment and maintenance

The backend must be easy to deploy and maintain throughout the project.

Go compiles into a standalone binary, which makes it possible to create relatively small Docker images without requiring a complete runtime environment.

Node.js and Python require their respective runtimes and dependencies to be included in the deployment environment.

Java requires a JVM runtime, although optimised deployment options are available.

**Preferred technology: Go.**

## Decision

After comparing the different technologies, **Go is selected for the AREA backend**.

The main reasons for this decision are:

1. **Concurrency:** Goroutines make it straightforward to execute multiple workflows and background tasks simultaneously.
2. **Performance:** Go provides good execution performance while maintaining relatively low resource consumption.
3. **Networking:** Its standard library provides the necessary tools for HTTP communication, API development and external service integrations.
4. **Deployment:** The compilation process produces standalone binaries, simplifying Docker deployment.
5. **Maintainability:** Static typing and a relatively simple language make it easier to maintain a structured backend.
6. **Project suitability:** Go provides the necessary features without introducing the complexity of a larger framework.

Although Node.js and Python offer larger ecosystems for certain integrations and rapid prototyping, Go provides a better balance between performance, concurrency, deployment simplicity and maintainability for this project.
