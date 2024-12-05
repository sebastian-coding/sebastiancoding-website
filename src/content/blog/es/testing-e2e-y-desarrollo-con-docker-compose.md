---
title: 'Construyendo un Entorno de Pruebas E2E con Docker Compose'
description: 'Aprende a configurar un entorno completo para pruebas de extremo a extremo utilizando Docker Compose, simplificando los flujos de trabajo de desarrollo y los procesos de pruebas'
pubDate: 'Dec 5 2024'
heroImage: '/docker-compose.jpg'
category: 'decode-spot'
type: 'post'
---

Configurar un entorno listo para el desarrollo de testing E2E puede ser complicado, especialmente cuando se necesitan
ejecutar y configurar múltiples servicios. Esto puede convertirse en un dolor de cabeza, pero aquí es donde Docker
Compose simplificará las cosas para nosotros.

¡Prepárense! ¡Es hora de hacer Decode!

## El archivo Docker Compose

Docker Compose es una herramienta que nos ayuda a gestionar aplicaciones Docker de múltiples contenedores con facilidad.
En lugar de iniciar cada contenedor uno por uno, podemos definir todo en un solo archivo, lo que hace mucho más sencillo
configurar y ejecutar un entorno completo.

El archivo utilizado para esto se llama `docker-compose.yaml`. Está escrito en YAML, un formato fácil de leer. En este
archivo, describimos todos los contenedores (llamados "servicios") que nuestra aplicación necesita, junto con aspectos
como cómo se conectan entre sí, qué puertos utilizan y dónde se almacenan los datos.

Aquí hay un ejemplo simple:

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

En este ejemplo:

- **web:** Ejecuta un servidor web Nginx y lo deja disponible en el puerto 8080.
- **db:** Ejecuta una base de datos PostgreSQL con el nombre de usuario y la contraseña configurados mediante variables
  de entorno.
- **volumes:** Esto le indica al contenedor, donde se almacenan los datos de la base de datos, para que no se pierdan
  cuando el contenedor se detenga.

## Ejemplo del mundo real

Nuestra API de ejemplo permite a los usuarios registrarse. El proceso incluye:

1. Validar la solicitud (por ejemplo, el formato del correo electrónico).
2. Almacenar los datos del usuario en una base de datos PostgreSQL.

Usaremos Go para este ejemplo.

### API en Go

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

## Agregando nuestros tests

Ahora vamos a agregar nuestros tests:

```go
package main

import (
	"bytes"
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
}
```

En un test end-to-end (E2E), el enfoque está en verificar el comportamiento de todo el sistema, incluidas todas las
integraciones y dependencias reales, bajo condiciones lo más cercanas posible a un entorno de producción. A diferencia
de los tests unitarios, que aíslan y simulan dependencias, los tests E2E buscan validar las interacciones reales
entre los componentes. Por ejemplo, el test anterior configura una conexión real a la base de datos usando variables de
entorno e inicializa toda la pila de la aplicación. Al hacer esto, asegura que la base de datos, las rutas y los
middleware funcionen juntos de manera fluida, proporcionándonos confianza en la fiabilidad del sistema.

## Creando nuestro archivo Docker Compose

Este será nuestro archivo Docker Compose. Aquí gestionaremos PostgreSQL y el contenedor de nuestra aplicación:

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

Este archivo de `docker-compose` define dos servicios: `postgres` y `app`. Aquí tenemos una breve explicación de su
configuración:

**Servicio Postgres**

- **Imagen**: Utiliza la imagen `postgres:16-alpine`.
- **Variables de Entorno**:
    - Configura la base de datos con credenciales de usuario (`POSTGRES_USER`, `POSTGRES_PASSWORD`) y una base de datos
      llamada `testdb` (`POSTGRES_DB`).
- **Volúmenes**:
    - Monta un archivo SQL local (`init.sql`) en el directorio de inicialización del contenedor de Postgres (
      `/docker-entrypoint-initdb.d/`). Esto asegura que la base de datos se inicialice o configure durante el inicio.
- **Puertos**:
    - Expone el servicio de Postgres en el puerto `5432` del host, mapeándolo al puerto `5432` del contenedor.

**Servicio de la Aplicación**

- **Build**:
    - Especifica el contexto del build al directorio actual (`.`), indicando que un Dockerfile en la misma ubicación
      será utilizado para hacer el build de la imagen de la aplicación.
- **Dependencias**:
    - Especifica que el servicio `app` depende del servicio `postgres`, asegurando que Postgres inicie antes que la
      aplicación.
- **Puertos**:
    - Mapea el puerto `8080` del contenedor al puerto `8080` de la máquina host, haciendo que la aplicación sea
      accesible desde el host.
- **Variables de Entorno**:
    - Proporciona a la aplicación una URL de conexión (`DATABASE_URL`) para conectarse a la base de datos `postgres`.

## Corriendo nuestros tests

Finalmente, ejecutaremos nuestras pruebas. Pero antes de todo, utilizaremos el siguiente comando para iniciar todos los
servicios definidos en nuestro archivo docker-compose.yaml en modo detached (`-d`). Esto asegura que los contenedores se
construyan (si es necesario), se inicien en el orden correcto y se ejecuten en segundo plano, manteniendo libre la
terminal para otras tareas:

```shell
docker compose up -d
```

Luego, podremos ejecutar nuestros, tests:

```shell
go test ./...
```

¡Como pueden ver, todos nuestros tests están pasando!

![image](/testing-passing.png)

Esto significa que nuestro entorno de pruebas E2E está simulando todo correctamente, y que nuestro sistema se comporta
exactamente como se esperaba bajo las condiciones de prueba. Desde la inicialización de la base de datos hasta las
llamadas a la API y la orquestación de servicios, cada componente está comunicándose sin problemas.

## Conclusión

En este artículo, hemos mostrado cómo configurar un entorno de pruebas end-to-end (E2E) utilizando Docker Compose. Al
simular servicios del mundo real como PostgreSQL, Docker Compose proporciona un entorno aislado y reproducible para
probar nuestras aplicaciones.

Pero Docker Compose no es solo para testing; también es una gran herramienta para el desarrollo. Nos brinda un entorno
completamente funcional y consistente que refleja un ambiente de producción, todo con un solo comando. Esto significa
que podemos desarrollar y testear en el mismo entorno, asegurando que lo que funciona localmente funcione en todas
partes. Sin problemas de configuración, sin sorpresas, solo una experiencia de desarrollo fluida y sencilla.

Todo el código de ejemplo y los recursos vistos en este artículo están disponibles en:
https://github.com/sebastian-coding/e2e-testing-docker-go

Eso es todo por hoy. Decode... ¡finalizado!