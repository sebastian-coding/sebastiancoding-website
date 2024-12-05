---
title: 'Building an E2E Testing Environment with Docker Compose'
description: 'Learn how to set up a complete environment for end-to-end testing using Docker Compose, simplifying development workflows and testing processes'
pubDate: 'Dec 5 2024'
heroImage: '/docker-compose.jpg'
category: 'decode-spot'
type: 'post'
---

Setting up a development-ready environment for E2E testing can be tricky, especially when multiple services need to run
and be configured. It can turn into a headache, but this is where Docker Compose will simplify things for us.

Get ready! It's time to start Decode!

## The Docker Compose file

Docker Compose is a tool that helps us manage multi-container Docker applications with ease. Instead of starting each
container one by one, we can define everything in a single file, making it much simpler to set up and run an entire
environment.

The file used for this is called `docker-compose.yaml`. It's written in YAML, a format that is easy to read. In this
file, we describe all the containers (called "services") that our application needs, along with things like how they
connect to each other, which ports they use, and where data is stored.

Here’s a simple example:

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: example
      POSTGRES_PASSWORD: example
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

In this example:

- **web:** This runs an Nginx web server and makes it available on your computer's port 8080.
- **db:** This runs a PostgreSQL database with the username and password set through environment variables.
- **volumes:** This stores the database data, so it isn’t lost when the container stops.

## A real-world example

Our example API allows users to register. The process includes:

1. Validating the request payload (e.g., email format).
2. Storing user data in a PostgreSQL database.

We will use Go for this example, but there is also a Node (TypeScript) example here:
https://github.com/sebastian-coding/e2e-testing-docker-node

### Go API

```go
func SetupRouter(db *sql.DB) *gin.Engine {
	router := gin.Default()

	// POST /users endpoint
	router.POST("/users", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		user.ID = uuid.New().String()

		// Store user in database
		_, err := db.Exec("INSERT INTO users (id, name, email) VALUES ($1, $2, $3)", user.ID, user.Name, user.Email)
		if err != nil {
			println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User created"})
	})

	return router
}
```

## Adding our tests

Let's add the tests:

```go
package main

import (
	"bytes"
	"database/sql"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestCreateUserEndpoint(t *testing.T) {
	// Set environment variables needed for the test
	err := os.Setenv("DATABASE_URL", "postgres://user:password@localhost:5432/testdb?sslmode=disable")
	assert.NoError(t, err)

	// Set up the Gin router in test mode
	gin.SetMode(gin.TestMode)

	// Initialize dependencies
	db, err := InitializeDependencies()
	if err != nil {
		t.Fatalf("Failed to initialize dependencies: %v", err)
	}
	defer db.Close()

	truncateTable(t, db)

	router := SetupRouter(db)

	t.Run("Responds OK", func(t *testing.T) {
		// Create a test HTTP server
		server := httptest.NewServer(router)
		defer server.Close()

		// Prepare payload
		userPayload := `{"name": "John Doe", "email": "john.doe@example.com"}`

		// Send POST request
		resp, err := http.Post(server.URL+"/users", "application/json", bytes.NewBuffer([]byte(userPayload)))
		assert.NoError(t, err)
		assert.Equal(t, http.StatusCreated, resp.StatusCode)
	})

	truncateTable(t, db)
}

func truncateTable(t *testing.T, db *sql.DB) {
	_, err := db.Exec("TRUNCATE TABLE users")
	assert.NoError(t, err)
}
```

In an End-to-End (E2E) test, the focus is on verifying the entire system's behavior, including all integrations and real
dependencies, under conditions as close to production as possible. Unlike unit tests, which isolate and mock
dependencies, E2E tests aim to validate the real interactions between components. For instance, the test above sets up a
real database connection using environment variables and initializes the full application stack. By doing so, it ensures
that the actual database, routes, and middleware work together seamlessly, providing confidence in the system's
reliability.

## Creating our Docker Compose file

This will be our Docker Compose file. Here we will be managing PostgreSQL and our application container:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=testdb
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Mount SQL initialization file
    ports:
      - "5432:5432"
  app:
    build:
      context: .
    depends_on:
      - postgres
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://user:password@postgres:5432/testdb?sslmode=disable
```

This `docker-compose` file defines two services: `postgres` and `app`. Here's a brief explanation of its configuration:

**Postgres Service**

- **Image**: Uses the lightweight `postgres:16-alpine` image.
- **Environment Variables**:
    - Sets up the database with user credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`) and a database named `testdb` (
      `POSTGRES_DB`).
- **Volumes**:
    - Mounts a local SQL file (`init.sql`) into the Postgres container's initialization directory (
      `/docker-entrypoint-initdb.d/`). This ensures the database is pre-populated or configured during startup.
- **Ports**:
    - Exposes the Postgres service on port `5432` of the host machine, mapping it to the container's port `5432`.

**App Service**

- **Build**:
    - Specifies the build context as the current directory (`.`), indicating a Dockerfile in the same location will be
      used to build the app image.
- **Dependencies**:
    - Specifies that the `app` service depends on the `postgres` service, ensuring Postgres starts before the app.
- **Ports**:
    - Maps port `8080` of the container to port `8080` on the host, making the app accessible on the host machine.
- **Environment Variables**:
    - Provides the app with a connection string (`DATABASE_URL`) to connect to the `postgres` database.

## Running our tests

Finally, we will run our tests. But first of all, we will use the following command to start all services defined in our
`docker-compose.yaml` file in detached mode. This ensures the containers are built (if needed), started in the correct
order, and run in the background, keeping the terminal free for other tasks:

```shell
docker compose up -d
```

Then, we will be able to run our tests:

```shell
go test ./...
```

As you can see, all our tests are passing!

![image](/testing-passing.png)

This means our E2E testing environment is successfully emulating real-world interactions, and our system is behaving
exactly as expected under test conditions. From database initialization to API calls and service orchestration, every
component is communicating seamlessly.

## Conclusion

In this article, we've demonstrated how to set up an End-to-End (E2E) testing environment using Docker Compose. By
simulating real-world services like PostgreSQL, Docker Compose provides an isolated and reproducible environment for
testing our applications.

But Docker Compose isn't just for testing; it's also a game-changer for development. It gives us a fully working,
consistent environment that mirrors production, all with a single command. This means we can develop and test in the
same environment, ensuring that what works locally works everywhere. No more configuration issues, no more surprises,
just a smooth, easy development experience.

All the code examples and resources discussed in this article can be found at:
https://github.com/sebastian-coding/e2e-testing-docker-go

That's it for today. Decode... dismissed!