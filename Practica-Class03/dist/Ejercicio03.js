"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Función flecha con parámetros obligatorios y uno opcional
const calcularPrecio = (precioBase, tipo, codigo) => {
    //Calcular precio base según el tipo de boleto
    let precioAcumulado = precioBase;
    if (tipo === "VIP") {
        precioAcumulado += 20;
    }
    //Aplicar descuento si el código opcional es correcto
    if (codigo === "ESTUDIANTE") {
        precioAcumulado = precioAcumulado * 0.5; // 50% de descuento
    }
    return precioAcumulado;
};
// --- Pruebas de funcionamiento ---
console.log("=== CALCULADORA DE ENTRADAS ===");
// Caso 1: Entrada General sin código
const caso1 = calcularPrecio(30, "GENERAL");
console.log(`General estándar: $${caso1}`); // Resultado: $30
// Caso 2: Entrada VIP sin código
const caso2 = calcularPrecio(30, "VIP");
console.log(`VIP estándar: $${caso2}`); // Resultado: $30 + $20 = $50
// Caso 3: Entrada General con código de estudiante
const caso3 = calcularPrecio(30, "GENERAL", "ESTUDIANTE");
console.log(`General Estudiante: $${caso3}`); // Resultado: $30 - 50% = $15
// Caso 4: Entrada VIP con código de estudiante
const caso4 = calcularPrecio(30, "VIP", "ESTUDIANTE");
console.log(`VIP Estudiante: $${caso4}`); // Resultado: ($30 + $20) - 50% = $25
// Caso 5: Código incorrecto (no aplica descuento)
const caso5 = calcularPrecio(30, "GENERAL", "INVITADO");
console.log(`General Código Inválido: $${caso5}`); // Resultado: $30
//# sourceMappingURL=Ejercicio03.js.map