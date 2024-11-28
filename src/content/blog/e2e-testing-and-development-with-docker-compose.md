---
title: 'Building an E2E Testing Environment with Docker Compose'
description: 'Learn how to set up a complete environment for end-to-end testing using Docker Compose, simplifying development workflows and testing processes'
pubDate: 'Oct 14 2024'
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

The file used for this is called `docker-compose.yml`. It's written in YAML, a format that is easy to read. In this
file,
we describe all the containers (called "services") that our application needs, along with things like how they connect
to each other, which ports they use, and where data is stored.

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

Think about a REST API to create a user. We will need to perform validations over the request, store user details in a
PostgreSQL database, and then publish a message in Apache Kafka once the user has been successfully created.

## Adding our tests

## Creating our Docker Compose file

## Running our tests

## Conclusion