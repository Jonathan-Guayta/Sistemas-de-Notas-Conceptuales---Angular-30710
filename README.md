# Sistema de Notas Conceptuales - Angular

## Descripción

Sistema web desarrollado con **Angular** para la gestión de Notas Conceptuales. La aplicación permite administrar la información mediante una interfaz web moderna, ejecutándose como una aplicación SPA (Single Page Application).

---

# Tecnologías utilizadas

| Tecnología | Descripción |
|------------|-------------|
| Angular 18 | Framework principal para el desarrollo del frontend. |
| TypeScript | Lenguaje principal utilizado en el proyecto. |
| HTML5 | Estructura de las vistas. |
| CSS3 | Estilos de la aplicación. |
| Node.js | Entorno de ejecución para JavaScript. |
| npm | Administrador de dependencias del proyecto. |
| Angular CLI | Herramienta para compilación, ejecución y despliegue. |
| RxJS | Programación reactiva utilizada por Angular. |
| Zone.js | Gestión de detección de cambios en Angular. |
| Docker | Contenerización de la aplicación para facilitar su despliegue. |

---

# Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js 20 o superior
- npm 10 o superior
- Angular CLI

Instalación de Angular CLI:

```bash
npm install -g @angular/cli
```

Verificar las versiones:

```bash
node -v
npm -v
ng version
```

---

# Estructura del proyecto

```
nota-conceptual-angular/
│
├── src/                    # Código fuente de la aplicación
│   ├── app/                # Componentes, servicios y lógica
│   ├── assets/             # Recursos estáticos
│   ├── environments/       # Configuración por entorno
│   └── styles.css          # Estilos globales
│
├── public/                 # Archivos públicos
├── angular.json            # Configuración del proyecto Angular
├── package.json            # Dependencias y scripts
├── package-lock.json       # Versiones exactas de dependencias
├── tsconfig.json           # Configuración de TypeScript
├── dockerfile              # Configuración de Docker
├── .dockerignore           # Exclusiones para Docker
└── README.md               # Documentación
```

---

# Instalación

Clonar el repositorio:

```bash
git clone <Uhttps://github.com/Jonathan-Guayta/Sistemas-de-Notas-Conceptuales---Angular---PW30710>
```

Ingresar al proyecto:

```bash
cd nota-conceptual-angular
```

Instalar las dependencias:

```bash
npm install
```

---

# Ejecución del proyecto

Iniciar el servidor de desarrollo:

```bash
npm start
```

o

```bash
ng serve
```

La aplicación estará disponible en:

```
http://localhost:4200
```

---

# Scripts disponibles

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm start
```

### Compilar la aplicación

```bash
npm run build
```

### Compilar en modo desarrollo con observación de cambios

```bash
npm run watch
```

### Ejecutar pruebas

```bash
npm test
```

---

# Docker

La aplicación puede ejecutarse mediante Docker, evitando instalar Node.js o Angular en la máquina anfitriona.

## 1. Iniciar sesión en Docker Hub

```bash
docker login
```

---

## 2. Construir la imagen

```bash
docker build -t nota-conceptual-angular .
```

---

## 3. Etiquetar la imagen

```bash
docker tag nota-conceptual-angular jonag47/nota-conceptual-angular:latest
```

---

## 4. Publicar la imagen

```bash
docker push jonag47/nota-conceptual-angular:latest
```

---

## 5. Ejecutar el contenedor

La imagen ya se encuentra publicada en Docker Hub:

```bash
docker run -d --name nota-conceptual-angular -p 8080:80 jonag47/nota-conceptual-angular:latest
```

> **Nota:** El comando anterior descarga automáticamente la imagen desde Docker Hub y ejecuta el contenedor.

---

# Flujo de trabajo

1. Clonar el proyecto.
2. Instalar dependencias con `npm install`.
3. Ejecutar la aplicación con `npm start`.
4. Desarrollar o modificar el código.
5. Compilar con `npm run build`.
6. Crear la imagen Docker.
7. Publicar la imagen en Docker Hub.
8. Ejecutar la aplicación mediante Docker.

---

# Dependencias principales

- Angular
- Angular Router
- Angular Forms
- Angular Animations
- RxJS
- Zone.js
- TypeScript

---

# Autores

**Jonathan Guayta - Matías Rojas**

Proyecto desarrollado como parte de la implementación del **Sistema de Notas Conceptuales**, utilizando Angular y Docker para facilitar su desarrollo, despliegue y distribución.