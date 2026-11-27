# AREA backend POC

This folder is dedicated to the POC of the AREA project backend.

It tests multiple backends, including:
- Go + gin
- Python + FastApi
- JS/TS + NestJS

Two python scripts in the tests/ folder test:
- Login
- Load testing

A mock database is set to test how easy it is to access the database.

## How to test

First, start the docker for the database:

```bash
docker compose up -d
```

Go in any of the three folder, and type (respectively) for go, python and node:

```bash
go run main.go

source .venv/bin/activate
python3 main.py

npm install
npm run start
```

Use Ctrl+C to shutdown the backend, and for the database:

```bash
docker compose down -v
```

## The decision

What was evaluated:
- How easy it is to learn and write the language and the documentation
- How the language handles the load
- The architecture used for the language
- How easy it is to interact with the database

### NestJS:
Learning NestJS can be easy if you limit it to simple functionalities, but can start to be heavy and messy once you start implementing more and more content, such as the documentation, even when commands such as "nest generate x" exist.
Additionally, the learning curve gets steep once you see how complex NestJS can be. Custom pipes, types, guards, etc...

Nest handles the load well, and finished the tests/load_test.py in just under 20 seconds.

NestJS architecture is a great one, and the separation of files is, in a way, forced upon the writer. It is not a bad thing, and is perhaps one of the best architecture you can have.

Interacting with the database in NestJS is here done with TypeOrmModule, and the syntax is clear and quite easy.

### Python
Python is by definition one of the easiest language to learn, and its syntax is easy and accessible to anyone. Like NestJS, the documentation can be a little messy.

Python does not handle the load well. It takes almost a minute to complete the test.

Python architecture is basic, you decide where you want to put your routes, and how you organise the code.

Interacting with the databse in Python is here done with sqlalchemyorm, and we find the syntax is little more difficult than NestJS.

### Go
Go is quite easy to learn but the syntax is really different from the other languages we have coded before (especially defining the types of variables). The documentation is done by putting commentaries above route, and no identation makes it less messy than Python and NestJS.

Go handles the load well, and finished the test in just a little above 20 seconds.

Go architecture is basic, you decide where you want to put your routes, and how you organise the code.

Interacting with the database in Go is here done with gorm, and the syntax is clear and quite easy.

---

Based on these criterias, we decided to use the Go language for the AREA backend.