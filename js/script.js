// ============================================================
//  Arreglo de aficiones (estructura de datos global)
// ============================================================
var aficiones = [];

// ============================================================
//  Objeto con datos del usuario (se construye al enviar)
// ============================================================
var datosUsuario = {};

// ============================================================
//  Función principal de validación
// ============================================================
function validar() {
    var usernameValido   = validarUsername();
    var passwordValido   = validarPassword();
    var rePasswordValido = validarRePassword();
    var direccionValida  = validarDireccion();
    var comunaValida     = validarComuna();
    var telefonoValido   = validarTelefono();
    var urlValida        = validarURL();
    var aficionesValidas = validarAficiones();

    var formularioValido = usernameValido && passwordValido && rePasswordValido &&
                           direccionValida && comunaValida && telefonoValido &&
                           urlValida && aficionesValidas;

    if (formularioValido) {
        // Construir objeto con datos del usuario
        datosUsuario = construirDatosUsuario();
        console.log("Datos del usuario:", datosUsuario);
    }

    return formularioValido;
}

// ============================================================
//  Construir objeto de datos del usuario
// ============================================================
function construirDatosUsuario() {
    return {
        username:  document.getElementById("username").value.trim(),
        password:  document.getElementById("password").value,
        direccion: document.getElementById("direccion").value.trim(),
        comuna:    document.getElementById("comuna").value,
        telefono:  document.getElementById("telefono").value.trim(),
        url:       document.getElementById("url").value.trim(),
        aficiones: aficiones.slice() // copia del arreglo
    };
}

// ============================================================
//  Validar nombre de usuario
//  - Obligatorio
//  - 5 a 10 caracteres
//  - Comienza con una letra
//  - Dígitos solo al final
//  - Sin caracteres especiales ni acentos
// ============================================================
function validarUsername() {
    var input    = document.getElementById("username");
    var div      = document.getElementById("username-msg");
    var username = input.value.trim();

    if (username === "") {
        mostrarError(input, div, "El nombre de usuario es obligatorio.");
        return false;
    }

    if (username.length < 5 || username.length > 10) {
        mostrarError(input, div, "El nombre de usuario debe tener entre 5 y 10 caracteres.");
        return false;
    }

    // Comprobar que comienza con letra (a-z o A-Z, sin acentos)
    var primeraLetra = username.charCodeAt(0);
    if (!esLetraSimple(primeraLetra)) {
        mostrarError(input, div, "El nombre de usuario debe comenzar con una letra (sin acentos).");
        return false;
    }

    // Comprobar que todos los caracteres son letras simples o dígitos,
    // y que los dígitos están solo al final
    var encontroDigito = false;
    for (var i = 0; i < username.length; i++) {
        var codigo = username.charCodeAt(i);
        if (esDigito(codigo)) {
            encontroDigito = true;
        } else if (esLetraSimple(codigo)) {
            if (encontroDigito) {
                // Hay una letra después de un dígito
                mostrarError(input, div, "Los dígitos del nombre de usuario deben estar solo al final.");
                return false;
            }
        } else {
            // Carácter especial, acento u otro
            mostrarError(input, div, "El nombre de usuario no puede tener caracteres especiales ni acentos.");
            return false;
        }
    }

    mostrarExito(input, div);
    return true;
}

// ============================================================
//  Validar contraseña
//  - Obligatoria
//  - 3 a 6 caracteres
//  - Al menos un dígito
//  - Al menos una letra
//  - No puede contener el nombre de usuario
// ============================================================
function validarPassword() {
    var input    = document.getElementById("password");
    var div      = document.getElementById("password-msg");
    var password = input.value;
    var username = document.getElementById("username").value.trim().toLowerCase();

    if (password === "") {
        mostrarError(input, div, "La contraseña es obligatoria.");
        return false;
    }

    if (password.length < 3 || password.length > 6) {
        mostrarError(input, div, "La contraseña debe tener entre 3 y 6 caracteres.");
        return false;
    }

    var tieneDigito = false;
    var tieneLetra  = false;
    for (var i = 0; i < password.length; i++) {
        var codigo = password.charCodeAt(i);
        if (esDigito(codigo)) {
            tieneDigito = true;
        } else if (esLetra(codigo)) {
            tieneLetra = true;
        }
    }

    if (!tieneDigito) {
        mostrarError(input, div, "La contraseña debe contener al menos un dígito.");
        return false;
    }

    if (!tieneLetra) {
        mostrarError(input, div, "La contraseña debe contener al menos una letra.");
        return false;
    }

    // Comprobar que la contraseña no contiene el nombre de usuario
    if (username !== "" && contieneSubcadena(password.toLowerCase(), username)) {
        mostrarError(input, div, "La contraseña no puede contener el nombre de usuario.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

// ============================================================
//  Validar confirmación de contraseña
// ============================================================
function validarRePassword() {
    var input      = document.getElementById("re-password");
    var div        = document.getElementById("re-password-msg");
    var rePassword = input.value;
    var password   = document.getElementById("password").value;

    if (rePassword === "") {
        mostrarError(input, div, "Debes confirmar la contraseña.");
        return false;
    }

    if (rePassword !== password) {
        mostrarError(input, div, "Las contraseñas no coinciden.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

// ============================================================
//  Validar dirección
// ============================================================
function validarDireccion() {
    var input     = document.getElementById("direccion");
    var div       = document.getElementById("direccion-msg");
    var direccion = input.value.trim();

    if (direccion === "") {
        mostrarError(input, div, "La dirección es obligatoria.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

// ============================================================
//  Validar comuna (debe seleccionarse)
// ============================================================
function validarComuna() {
    var select = document.getElementById("comuna");
    var div    = document.getElementById("comuna-msg");
    var valor  = select.value;

    if (valor === "" || valor === null) {
        mostrarError(select, div, "Debes seleccionar una comuna.");
        return false;
    }

    mostrarExito(select, div);
    return true;
}

// ============================================================
//  Validar número de teléfono
//  - Obligatorio
//  - Formato: puede comenzar con + y luego solo dígitos
//  - Longitud entre 8 y 15 dígitos (sin contar el +)
// ============================================================
function validarTelefono() {
    var input    = document.getElementById("telefono");
    var div      = document.getElementById("telefono-msg");
    var telefono = input.value.trim();

    if (telefono === "") {
        mostrarError(input, div, "El número de teléfono es obligatorio.");
        return false;
    }

    var inicio = 0;
    if (telefono.charAt(0) === "+") {
        inicio = 1;
    }

    // Verificar que el resto son solo dígitos
    if (telefono.length <= inicio) {
        mostrarError(input, div, "El número de teléfono no es válido.");
        return false;
    }

    for (var i = inicio; i < telefono.length; i++) {
        if (!esDigito(telefono.charCodeAt(i))) {
            mostrarError(input, div, "El número de teléfono solo puede contener dígitos (y un + inicial).");
            return false;
        }
    }

    var cantDigitos = telefono.length - inicio;
    if (cantDigitos < 8 || cantDigitos > 15) {
        mostrarError(input, div, "El número de teléfono debe tener entre 8 y 15 dígitos.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

// ============================================================
//  Validar URL de página web personal (campo opcional)
//  Si se ingresa algo, debe ser una URL válida:
//  - Comienza con http:// o https://
//  - Tiene al menos un punto después del dominio
//  - No tiene espacios
// ============================================================
function validarURL() {
    var input = document.getElementById("url");
    var div   = document.getElementById("url-msg");
    var url   = input.value.trim();

    if (url === "") {
        // Campo opcional, no es error si está vacío
        limpiarMensaje(input, div);
        return true;
    }

    // No puede tener espacios
    if (contieneEspacio(url)) {
        mostrarError(input, div, "La URL no puede contener espacios.");
        return false;
    }

    // Debe comenzar con http:// o https://
    var tieneHttp  = empiezaCon(url, "http://");
    var tieneHttps = empiezaCon(url, "https://");

    if (!tieneHttp && !tieneHttps) {
        mostrarError(input, div, "La URL debe comenzar con http:// o https://");
        return false;
    }

    // Obtener la parte después del protocolo
    var resto = "";
    if (tieneHttps) {
        resto = url.substring(8); // quitar "https://"
    } else {
        resto = url.substring(7); // quitar "http://"
    }

    if (resto.length === 0) {
        mostrarError(input, div, "La URL no es válida.");
        return false;
    }

    // Debe haber al menos un punto en el dominio
    var indicePunto = resto.indexOf(".");
    if (indicePunto < 1) {
        mostrarError(input, div, "La URL no es válida (falta el dominio).");
        return false;
    }

    // No debe terminar en punto
    if (url.charAt(url.length - 1) === ".") {
        mostrarError(input, div, "La URL no puede terminar en punto.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

// ============================================================
//  Validar aficiones (mínimo 2)
// ============================================================
function validarAficiones() {
    var div = document.getElementById("hobby-count-msg");

    if (aficiones.length < 2) {
        div.innerText = "Debes agregar al menos 2 aficiones.";
        return false;
    }

    div.innerText = "";
    return true;
}

// ============================================================
//  Agregar afición a la lista
// ============================================================
function agregarAficion() {
    var input  = document.getElementById("hobby");
    var div    = document.getElementById("hobby-msg");
    var valor  = input.value.trim();

    if (valor === "") {
        div.innerText = "Escribe una afición antes de agregar.";
        return;
    }

    // Verificar duplicados (insensible a mayúsculas)
    for (var i = 0; i < aficiones.length; i++) {
        if (aficiones[i].toLowerCase() === valor.toLowerCase()) {
            div.innerText = "Esa afición ya está en la lista.";
            return;
        }
    }

    // Agregar al arreglo
    aficiones.push(valor);
    div.innerText = "";
    input.value   = "";

    renderizarAficiones();
}

// ============================================================
//  Eliminar afición por índice
// ============================================================
function eliminarAficion(indice) {
    aficiones.splice(indice, 1);
    renderizarAficiones();
}

// ============================================================
//  Renderizar lista de aficiones en el DOM
// ============================================================
function renderizarAficiones() {
    var lista = document.getElementById("hobby-list");
    lista.innerHTML = "";

    for (var i = 0; i < aficiones.length; i++) {
        var li      = document.createElement("li");
        li.className = "list-group-item";

        var texto   = document.createTextNode(aficiones[i]);
        li.appendChild(texto);

        var boton   = document.createElement("button");
        boton.className = "btn-remove";
        boton.innerHTML = "&#x2715;";
        boton.title     = "Eliminar";
        boton.setAttribute("type", "button");

        // Closure para capturar el índice correcto
        (function(idx) {
            boton.onclick = function() { eliminarAficion(idx); };
        })(i);

        li.appendChild(boton);
        lista.appendChild(li);
    }
}

// ============================================================
//  Limpiar formulario manualmente
// ============================================================
function limpiarFormulario() {
    // Limpiar campos de texto
    var campos = ["username", "password", "re-password", "direccion", "telefono", "url", "hobby"];
    for (var i = 0; i < campos.length; i++) {
        var campo = document.getElementById(campos[i]);
        campo.value = "";
        campo.classList.remove("is-invalid", "is-valid");
    }

    // Limpiar select
    var comuna = document.getElementById("comuna");
    comuna.value = "";
    comuna.classList.remove("is-invalid", "is-valid");

    // Limpiar mensajes de error
    var mensajes = ["username-msg", "password-msg", "re-password-msg",
                    "direccion-msg", "comuna-msg", "telefono-msg",
                    "url-msg", "hobby-msg", "hobby-count-msg"];
    for (var j = 0; j < mensajes.length; j++) {
        document.getElementById(mensajes[j]).innerText = "";
    }

    // Limpiar aficiones
    aficiones = [];
    renderizarAficiones();
}

// ============================================================
//  Permitir agregar afición con Enter
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    var inputHobby = document.getElementById("hobby");
    inputHobby.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            agregarAficion();
        }
    });
});

// ============================================================
//  Funciones auxiliares (sin regex)
// ============================================================

function esLetraSimple(codigo) {
    // a-z: 97-122 / A-Z: 65-90 (sin acentos)
    return (codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122);
}

function esLetra(codigo) {
    // Incluye letras con acento (para la contraseña puede haber)
    return (codigo >= 65 && codigo <= 90)  ||
           (codigo >= 97 && codigo <= 122) ||
           (codigo >= 192);               // caracteres extendidos
}

function esDigito(codigo) {
    return codigo >= 48 && codigo <= 57;
}

function contieneSubcadena(cadena, subcadena) {
    if (subcadena.length === 0) return false;
    for (var i = 0; i <= cadena.length - subcadena.length; i++) {
        var coincide = true;
        for (var j = 0; j < subcadena.length; j++) {
            if (cadena.charAt(i + j) !== subcadena.charAt(j)) {
                coincide = false;
                break;
            }
        }
        if (coincide) return true;
    }
    return false;
}

function empiezaCon(cadena, prefijo) {
    if (prefijo.length > cadena.length) return false;
    for (var i = 0; i < prefijo.length; i++) {
        if (cadena.charAt(i) !== prefijo.charAt(i)) return false;
    }
    return true;
}

function contieneEspacio(cadena) {
    for (var i = 0; i < cadena.length; i++) {
        if (cadena.charAt(i) === " ") return true;
    }
    return false;
}

// ============================================================
//  Helpers de UI
// ============================================================

function mostrarError(input, div, mensaje) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    div.innerText  = mensaje;
    div.style.color = "var(--error-color, #c0392b)";
}

function mostrarExito(input, div) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    div.innerText = "";
}

function limpiarMensaje(input, div) {
    input.classList.remove("is-invalid", "is-valid");
    div.innerText = "";
}
