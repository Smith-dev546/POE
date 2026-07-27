# Solución de Ejercicios Prácticos (TypeScript)

Este repositorio contiene la solución guiada a los 4 ejercicios prácticos de TypeScript y métodos de arreglos vistos en clase. Sigue los pasos a continuación para clonar, configurar y ejecutar las pruebas localmente en tu máquina.

---

## 🚀 Guía de Inicio Rápido

Sigue estos comandos en tu terminal para clonar el proyecto y preparar tu entorno de desarrollo.

### 1. Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd <NOMBRE_DE_LA_CARPETA>
```

### 2. Inicializar el proyecto Node.js
```bash
npm init -y
```

### 3. Instalar TypeScript como dependencia de desarrollo
```bash
npm install -D typescript
```

### 4. Inicializar la configuración de TypeScript
Este comando genera el archivo `tsconfig.json` preconfigurado para compilar a JavaScript moderno (ES6) y usar módulos CommonJS:
```bash
npx tsc --init --target ES6 --module commonjs
```
*(Nota: Asegúrate de configurar la propiedad `"outDir": "./dist"` en tu archivo `tsconfig.json` para almacenar los archivos JavaScript compilados en la carpeta correcta).*

---


## 🛠️ Compilación y Ejecución

Una vez que tengas el código listo, ejecuta los siguientes comandos en tu consola para ver los resultados en la terminal:

### 1. Compilar el código TypeScript a JavaScript
```bash
npx tsc
```

### 2. Ejecutar el archivo compilado con Node.js
```bash
node dist/index.js
```

---

## 🎯 Objetivos Evaluados
* **`.map()`**: Transformación inmutable de arreglos.
* **`.filter()`**: Filtrado condicional de colecciones de datos.
* **Desestructuración**: Extracción limpia de datos en objetos anidados.
* **Enums**: Tipado estricto y prevención de errores mediante constantes de texto cerradas.
