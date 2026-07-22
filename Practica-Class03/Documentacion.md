# 🚀 Ejercicios de TypeScript - Fundamentos y Lógica

Este repositorio contiene una colección de ejercicios prácticos desarrollados en **TypeScript** para dominar conceptos clave como el tipado estricto, interfaces, funciones flecha, operadores ternarios y manipulación de arreglos.

## 🛠️ Requisitos Previos

Antes de empezar, asegúrate de tener instalado [Node.js](https://nodejs.org) en tu equipo.

---

## 💻 Guía de Configuración e Inicialización

Sigue estos pasos en tu terminal para configurar el entorno de TypeScript desde cero:

### 1. Inicializar el proyecto Node.js
Crea el archivo `package.json` con la configuración por defecto:
```bash
npm init -y
```

### 2. Instalar TypeScript
Instala el compilador de TypeScript como una dependencia de desarrollo:
```bash
npm install -D typescript
```

### 3. Generar el archivo de configuración (`tsconfig.json`)
Inicializa la configuración de TypeScript especificando la versión de JavaScript de salida y el sistema de módulos:
```bash
npx tsc --init --target ES6 --module commonjs
```

⚠️ **Nota importante de configuración:** Al generar el archivo `tsconfig.json`, debes abrirlo y **descomentar** (quitar los caracteres `//`) las siguientes dos líneas para manejar correctamente las carpetas de origen y de salida:
* `"rootDir": "./src"` *(Define dónde buscar los archivos `.ts`)*
* `"outDir": "./dist"` *(Define dónde se guardarán los archivos `.js` compilados)*

---

## 🏃 El Flujo de Ejecución

Cada vez que realices cambios en tus archivos TypeScript o quieras probar un ejercicio, ejecuta los siguientes comandos:

### 1. Compilar el código
Traduce todos los archivos `.ts` de la carpeta `src` a archivos `.js` en la carpeta `dist`:
```bash
npx tsc
```

### 2. Ejecutar con Node.js
Ejecuta el archivo compilado final (por ejemplo, el Ejercicio 1):
```bash
node dist/Ejercicio01.js
```

---

## 📝 Descripción de los Ejercicios

### 📋 Ejercicio 1: Registro de Asistencia a Eventos
* **Archivo:** `src/Ejercicio01.ts`
* **Conceptos clave:** `interface`, propiedades opcionales, validación estricta de datos numéricos y control de flujo condicional.
* **Descripción:** Crea un molde estructurado para los asistentes de un seminario universitario. Implementa una función que evalúa condicionalmente si los campos opcionales (correo electrónico y número de asiento) existen, imprimiendo respuestas por defecto personalizadas de forma limpia y controlando que los valores numéricos como el `0` no generen falsos negativos.

### 🛒 Ejercicio 2: Carrito de Compras con Descuentos
* **Archivo:** `src/Ejercicio02.ts`
* **Conceptos clave:** `interface`, propiedades opcionales (`?`), método `.forEach()`, operador ternario y formateo numérico con `.toFixed(2)`.
* **Descripción:** Modela un listado de productos tecnológicos. Recorre el carrito, detecta de forma dinámica qué artículos tienen un descuento asignado, calcula el precio final acumulado y muestra un desglose formateado del ahorro en la consola.

### 🎟️ Ejercicio 3: Calculadora de Entradas Universitarias
* **Archivo:** `src/Ejercicio03.ts`
* **Conceptos clave:** Tipos de unión literal (`type`), funciones flecha, parámetros opcionales y lógica condicional.
* **Descripción:** Una función estricta que calcula el precio de boletos para un evento de la universidad. Aplica un recargo automático de \$20 si la entrada es `"VIP"` y aplica un descuento drástico del 50% si se proporciona el código opcional `"ESTUDIANTE"`.