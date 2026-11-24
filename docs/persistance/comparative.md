# Persistence Technologies Comparative

The purpose of this document is to compare different persistence technologies and select the most appropriate solution for the AREA project.

The persistence layer is responsible for storing and retrieving the application's data. This includes user accounts, connected services, workflows, triggers, conditions, reactions and workflow execution history.

The database technologies evaluated are:

- **PostgreSQL**
- **MySQL**
- **SQLite**
- **MongoDB**

The document also compares different database-access solutions for Go, with the intention of selecting GORM.

## Comparison Criteria

The technologies are evaluated using the following criteria:

| Criteria | Description |
|---|---|
| Data integrity | Ability to maintain consistent and valid data. |
| Relationships | Support for relationships between entities. |
| Performance | Efficiency when storing and retrieving data. |
| Scalability | Ability to support increasing amounts of data and users. |
| Transactions | Support for reliable operations involving multiple data modifications. |
| Security | Availability of authentication, permissions and access-control mechanisms. |
| Go integration | Availability and quality of libraries for Go. |
| Maintainability | Ease of managing and evolving the database structure. |
| Deployment | Ease of installation, configuration and deployment using Docker. |

## Comparative Table

The following table provides a qualitative evaluation of the four database technologies.

| Criteria | PostgreSQL | MySQL | SQLite | MongoDB |
|---|---|---|---|---|
| Data integrity | Excellent | Very good | Very good | Good |
| Relationships | Excellent | Very good | Very good | Limited compared with SQL databases |
| Performance | Excellent | Excellent | Very good | Very good |
| Scalability | Excellent | Excellent | Limited for concurrent writes | Excellent |
| Transactions | Excellent | Very good | Very good | Very good |
| Security | Excellent | Very good | File-system dependent | Very good |
| Go integration | Excellent | Excellent | Very good | Excellent |
| Maintainability | Very good | Very good | Very good | Good |
| Docker deployment | Very good | Very good | Excellent | Very good |

These evaluations are qualitative. Actual performance depends on the database configuration, workload, data structure and application architecture.

## Detailed Comparison for the AREA Project

The AREA application has several specific requirements that influence the database selection.

### Data relationships

The application will store several interconnected types of data.

For example:
- A user can connect multiple external services.
- A user can create multiple workflows.
- A workflow can contain multiple triggers, conditions and reactions.
- A workflow can have multiple execution records.
- Each execution record belongs to a specific workflow.

These relationships make a relational database particularly suitable.

PostgreSQL and MySQL provide foreign keys, relational constraints and SQL joins, allowing these relationships to be represented clearly.

MongoDB can also represent relationships, but managing highly interconnected data may require additional application logic.

**Preferred technology: PostgreSQL.**

### Data integrity and transactions

The application must maintain consistent data when users create, modify or delete workflows.

For example, creating a workflow may involve inserting the workflow itself, its trigger configuration, its conditions and its reactions.

These operations should be treated as a single transaction. If one operation fails, the database should be able to roll back the changes.

PostgreSQL provides strong transaction support and ACID guarantees, making it suitable for these operations.

MySQL also supports transactions through InnoDB, while SQLite provides transactional operations with more limited concurrency.

**Preferred technology: PostgreSQL.**

### Workflow configuration

Workflow configurations may contain different types of information depending on the selected triggers and reactions.

For example, a GitHub trigger may require a repository and event type, while a Discord reaction may require a channel and message.

PostgreSQL provides JSONB, which allows semi-structured configuration data to be stored alongside relational data.

This makes it possible to maintain a relational database structure while allowing flexible workflow configurations.

MongoDB also provides flexible document storage, but its advantages are less significant when most of the application's data has clear relationships.

**Preferred technology: PostgreSQL.**

### Integration with Go

The backend will be implemented in Go, so the database must have reliable support for this language.

PostgreSQL has several Go integration options, including pgx and GORM.

GORM provides an ORM that allows developers to represent database tables as Go structures and interact with the database using Go methods.

It supports PostgreSQL through its dedicated driver and provides features such as associations, transactions and automatic migration support.

MySQL and SQLite are also supported by GORM.

**Preferred technology: PostgreSQL with GORM.**

### Deployment and maintenance

The database must be deployable alongside the backend and frontend using Docker Compose.

PostgreSQL provides an official Docker image and can store its data in a persistent volume.

This allows the database to run independently of the Go backend while preserving data between container restarts.

The database can also be backed up and maintained independently.

**Preferred technology: PostgreSQL.**

## Go Database-Access Solutions

In addition to selecting a database, the backend needs a solution for communicating with it.

The following options are considered.

### GORM

GORM is an ORM library for Go. It allows developers to interact with databases using Go structures instead of writing every SQL query manually.

**Advantages:**
- Reduces repetitive SQL code.
- Supports multiple database systems.
- Provides automatic migrations.
- Supports relationships and associations.
- Provides transaction management.
- Simplifies common CRUD operations.
- Integrates directly with PostgreSQL.

**Disadvantages:**
- Can generate SQL queries that are less efficient than manually written queries.
- Some complex queries still require raw SQL.
- Automatic migrations do not replace a complete database migration strategy.
- ORM abstractions can make database behaviour less explicit.

### sqlc

sqlc is a tool that generates type-safe Go code from SQL queries.

Developers write SQL queries directly, and sqlc generates the corresponding Go functions and structures.

**Advantages:**
- Full control over SQL queries.
- Type-safe generated Go code.
- Good performance and predictable queries.
- Makes database operations explicit.
- Reduces the need for manually writing database-access code.

**Disadvantages:**
- Requires writing SQL queries manually.
- Less convenient for simple CRUD operations.
- Requires a generation step.
- Developers need a good understanding of SQL.

### pgx

pgx is a PostgreSQL driver and toolkit for Go.

It provides direct access to PostgreSQL functionality without requiring an ORM.

**Advantages:**
- Excellent PostgreSQL support.
- Good performance.
- Supports transactions and connection pooling.
- Provides access to PostgreSQL-specific features.
- Gives developers direct control over database operations.

**Disadvantages:**
- Requires more manual database-access code.
- Does not provide ORM-style automatic relationships.
- Developers must manage SQL queries themselves.
- More repetitive for standard CRUD operations.

### Comparative Table

| Criteria | GORM | sqlc | pgx |
|---|---|---|---|
| Abstraction level | High | Medium | Low |
| Development speed | Excellent | Very good | Moderate |
| SQL control | Limited compared with direct SQL | Excellent | Excellent |
| Type safety | Good | Excellent | Good |
| Performance | Very good | Excellent | Excellent |
| Relationships | Built-in associations | Explicit SQL | Manual SQL |
| Automatic migrations | Supported | Requires separate tooling | Requires separate tooling |
| Learning curve | Easy to moderate | Moderate | Moderate |

## Decision

After comparing the different database technologies and Go database-access solutions, **PostgreSQL with GORM is selected for the AREA persistence layer**.

The main reasons for this decision are:

1. **Relational structure:** PostgreSQL is particularly suitable for the interconnected data used by the application.
2. **Data integrity:** Foreign keys, constraints and transactions help maintain consistent application data.
3. **Flexibility:** JSONB allows workflow-specific configuration data to be stored without sacrificing relational structure.
4. **Go integration:** GORM provides a convenient way to interact with PostgreSQL from the Go backend.
5. **Development speed:** GORM simplifies common database operations and reduces repetitive code.
6. **Deployment:** PostgreSQL can easily be deployed using Docker and Docker Compose.
7. **Maintainability:** The combination provides a structured way to manage application data as the project evolves.

Although sqlc and pgx offer more direct control over SQL queries, GORM is considered a suitable choice for the project because it simplifies development while providing the necessary database features.
