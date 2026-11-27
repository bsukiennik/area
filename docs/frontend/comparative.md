# Frontend Technologies Comparative

The purpose of this document is to compare different frontend technologies and select the most appropriate one for the AREA project.

The frontend is responsible for providing the user interface through which users can interact with the application. It must allow users to manage their accounts, connect external services, create and configure workflows, and monitor their execution.

The technologies evaluated are:

- **React**
- **Vue.js**
- **Svelte**

## Comparison Criteria

The technologies are evaluated using the following criteria:

| Criteria | Description |
|---|---|
| Performance | Ability to render interfaces efficiently and handle frequent updates. |
| Component architecture | Ability to organise the application into reusable components. |
| Ecosystem | Availability of libraries for routing, API communication, authentication and UI development. |
| Maintainability | Ease of organising, understanding and extending the codebase. |
| Learning curve | Time and effort required for developers to become productive. |
| Flexibility | Ability to adapt the frontend architecture to the project's requirements. |
| Documentation and community | Availability of documentation, tutorials and community support. |
| Deployment | Ease of building and deploying the application. |

## Comparative Table

The following table provides a qualitative evaluation of the four technologies.

| Criteria | React | Vue.js | Svelte |
|---|---|---|---|
| Performance | Very good | Very good | Excellent |
| Component architecture | Excellent | Excellent | Very good |
| Ecosystem | Excellent | Very good | Good |
| Maintainability | Very good | Very good | Very good |
| Learning curve | Moderate | Easy | Easy |
| Flexibility | Excellent | Very good | Very good |
| Documentation and community | Excellent | Very good | Good |
| Deployment | Excellent | Excellent | Excellent |

These evaluations are qualitative. Actual performance and maintainability depend on the application's architecture, implementation and selected libraries.

## Detailed Comparison for the AREA Project

The AREA frontend has several specific requirements that influence the technology selection.

### Workflow editor

One of the main features of the application is a visual workflow editor.

Users must be able to create workflows by connecting triggers, conditions and reactions. This requires an interactive interface that supports nodes, connections, drag-and-drop interactions and dynamic updates.

React provides access to React Flow, a library specifically designed to create node-based editors and interactive diagrams.

Vue and Svelte also have dedicated flow libraries.

**Preferred technology: React.**

### API communication

The frontend must communicate with the Go backend through HTTP requests.

It must retrieve user information, manage authentication, obtain available services and actions, create workflows and display their execution status.

All four technologies support HTTP communication.

React can use the native Fetch API or Axios for requests. TanStack Query can additionally manage server-side data, caching, loading states and automatic updates.

**Preferred technology: React.**

### Dynamic interface

The application must update its interface when users interact with workflows or when new information becomes available.

For example, selecting a trigger should update the available configuration options. Adding a condition may change which fields are displayed. Workflow execution information may also need to be refreshed.

React's component-based architecture and state management ecosystem are well suited to this type of interface.

Vue and Svelte also provide reactive systems that handle these requirements effectively.

**Preferred technology: React.**

### Maintainability and extensibility

The application will likely gain additional integrations and features throughout development.

The frontend should therefore be organised into reusable components and independent modules.

React provides enough flexibility to organise the application according to its responsibilities, such as authentication, workflow management, service integrations and user settings.

However, this flexibility requires the team to define and follow consistent architectural conventions.

**Preferred technology: React.**

### Deployment

The frontend must be deployable independently of the backend.

React applications built with Vite generate static files that can be served through a lightweight web server such as Nginx.

These files can be packaged into a Docker image and deployed alongside the backend and database using Docker Compose.

Vue and Svelte provide similar deployment possibilities.

**Preferred technology: React.**

## Decision

After comparing the different technologies, **React is selected for the AREA frontend**.

The main reasons for this decision are:

1. **Component architecture:** React makes it possible to create reusable components and organise the interface into independent modules.
2. **Workflow editor:** React Flow provides an existing solution for building interactive node-based interfaces, which is particularly relevant to the project's main functionality.
3. **Ecosystem:** React has a large ecosystem of libraries for routing, state management, API communication and testing.
4. **Flexibility:** React allows the team to choose the tools and architecture that best fit the project.
5. **TypeScript support:** Combining React with TypeScript improves code organisation and helps detect errors during development.
6. **Deployment:** Vite produces static production files that can easily be served through Nginx and packaged with Docker.

Although Vue and Svelte offer simpler development experiences, React offers a particularly suitable balance between flexibility, ecosystem support and the requirements of the AREA project.
