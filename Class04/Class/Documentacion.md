# Contenido Visto en Clase

Este repositorio contiene los apuntes y conceptos clave explicados durante la sesión de clase. Se cubrieron métodos avanzados de arreglos, desestructuración de datos y el uso de enumeraciones para mejorar la robustez del código.

---

## 1. Método `.map()`

### 📌 ¿Qué es `.map()`?
`.map()` es un método de arreglos que transforma cada elemento de un arreglo y devuelve un nuevo arreglo con los resultados. No modifica el arreglo original.

### 🔹 Sintaxis
```javascript
const nuevoArreglo = arregloOriginal.map((elemento, índice, arreglo) => {
    // Transformar el elemento
    return elementoTransformado;
});
```
*Nota: El índice y el arreglo son parámetros opcionales.*

### 🔹 Ejemplo práctico
```javascript
// Duplicar cada número
const numeros =;
const dobles = numeros.map(n => n * 2);
// dobles = [2, 4, 6, 8]
```

> 💡 **Para POE:** `.map()` es útil para transformar listas de eventos o datos antes de mostrarlos o procesarlos.

### ✅ Características clave:
* Devuelve un nuevo arreglo del mismo tamaño que el original.
* No modifica el arreglo original (inmutabilidad).
* Se usa para transformar datos (ej: formatear, calcular, extraer).
* Es una alternativa más limpia que un bucle `for` tradicional.

---

## 2. Método `.filter()`

### 📌 ¿Qué es `.filter()`?
`.filter()` es un método de arreglos que crea un nuevo arreglo con todos los elementos que cumplen una condición (devuelven `true`). No modifica el arreglo original.

### 🔹 Sintaxis
```javascript
const filtrados = arregloOriginal.filter((elemento, índice, arreglo) => {
    // Devolver true o false
    return condición;
});
```
*Nota: Solo los elementos que devuelven `true` pasan al nuevo arreglo.*

### 🔹 Ejemplo práctico
```javascript
// Filtrar números pares
const numeros =;
const pares = numeros.filter(n => n % 2 === 0);
// pares = [2, 4, 6]
```

> 💡 **Para POE:** `.filter()` es útil para seleccionar eventos específicos de una lista o filtrar datos según el tipo de evento.

### ✅ Características clave:
* Devuelve un nuevo arreglo (puede ser más pequeño que el original).
* No modifica el arreglo original (inmutabilidad).
* Se usa para filtrar datos según una condición.
* Es una alternativa más legible que un bucle `for` con `if`.

---

## 📊 Comparativa rápida

| Método | Propósito | Tamaño del Arreglo Resultante |
| :--- | :--- | :--- |
| `.map()` | Transforma los elementos | Mismo tamaño que el original |
| `.filter()` | Selecciona elementos | Tamaño variable (igual o menor) |

---

## 3. Desestructuración de Objetos y Arreglos

### 📌 ¿Qué es la desestructuración?
Es una sintaxis rápida y elegante para extraer propiedades de un objeto o elementos de un arreglo directamente en variables individuales, sin tener que escribir `objeto.propiedad` repetidamente.

### 🔹 Desestructuración de Objetos
```javascript
const usuario = { nombre: "Ana", edad: 25, ciudad: "San Salvador" };

// Con desestructuración
const { nombre, edad, ciudad } = usuario;
// nombre = "Ana", edad = 25, ciudad = "San Salvador"
```
> 💡 **Ventaja:** Extraes múltiples propiedades en una sola línea utilizando el nombre exacto de la propiedad.

### 🔹 Desestructuración con alias y valores por defecto
```javascript
const usuario = { nombre: "Ana", edad: 25 };

// Cambiar el nombre de la variable (Alias)
const { nombre: nombreUsuario, edad: edadUsuario } = usuario;

// Con valores por defecto (si la propiedad no existe)
const { ciudad = "Santa Tecla" } = usuario;
```

### 🔹 Desestructuración de Arreglos
```javascript
const colores = ["rojo", "verde", "azul"];

// Con desestructuración
const [primero, segundo, tercero] = colores;
// primero = "rojo", segundo = "verde", tercero = "azul"
```

### 🔹 Desestructuración con el operador Rest (`...`)
```javascript
// Omitir elementos y capturar el resto
const colores = ["rojo", "verde", "azul", "amarillo"];
const [primero, ...resto] = colores;
// primero = "rojo", resto = ["verde", "azul", "amarillo"]
```

> 💡 **Para POE:** La desestructuración es muy útil para extraer datos de eventos que llegan como objetos, o para capturar parámetros de funciones manejadoras de eventos.

---

## 4. Enumeraciones (`enum`)

### 📌 ¿Qué es un enum?
Un `enum` sirve para crear un conjunto de constantes con nombre. En lugar de usar cadenas de texto sueltas (como `"ADMIN"`, `"USER"`), creamos una lista cerrada de opciones. Esto evita errores de dedo (typos) en el código.

### 🔹 Sintaxis básica (Numérica)
```typescript
enum Rol {
    ADMIN,
    USUARIO,
    INVITADO
}

// Uso
const miRol: Rol = Rol.ADMIN;
console.log(miRol); // 0 (valor numérico por defecto asignado automáticamente)
```

### 🔹 Enum con valores String
```typescript
enum TipoEvento {
    CLICK = "CLICK",
    KEYDOWN = "KEYDOWN",
    MOUSEMOVE = "MOUSEMOVE"
}

// Uso
const evento: TipoEvento = TipoEvento.CLICK;
console.log(evento); // "CLICK"
```

### ❌ Sin enum (Propenso a errores)
```javascript
// Un error de dedo puede pasar desapercibido
const rol = "ADMIN";   // OK
const rol2 = "ADMINN"; // ¡Error no detectado por el editor!
```

### ✅ Con enum (Seguro y con autocompletado)
```typescript
enum Rol { ADMIN, USUARIO, INVITADO }

const rol = Rol.ADMIN; 
// TypeScript no permitirá asignar un valor inválido como Rol.ADMINN
```

> 💡 **Para POE:** Los `enum` son ideales para tipos de eventos, estados o categorías que tienen un conjunto fijo de valores. Evitan errores en tiempo de desarrollo y mejoran la experiencia de autocompletado en el editor.
