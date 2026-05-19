// Arreglo global de aficiones
var aficiones = [];

// ---- Validación principal ----

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
        var datosUsuario = {
            username:  document.getElementById("username").value.trim(),
            password:  document.getElementById("password").value,
            direccion: document.getElementById("direccion").value.trim(),
            comuna:    document.getElementById("comuna").value,
            telefono:  document.getElementById("telefono").value.trim(),
            url:       document.getElementById("url").value.trim(),
            aficiones: aficiones.slice()
        };
        console.log("Datos del usuario:", datosUsuario);
    }

    return formularioValido;
}

// ---- Validaciones de campo ----

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
    if (!esLetraSimple(username.charCodeAt(0))) {
        mostrarError(input, div, "El nombre de usuario debe comenzar con una letra (sin acentos).");
        return false;
    }

    var encontroDigito = false;
    for (var i = 0; i < username.length; i++) {
        var codigo = username.charCodeAt(i);
        if (esDigito(codigo)) {
            encontroDigito = true;
        } else if (esLetraSimple(codigo)) {
            if (encontroDigito) {
                mostrarError(input, div, "Los dígitos deben estar solo al final del nombre de usuario.");
                return false;
            }
        } else {
            mostrarError(input, div, "El nombre de usuario no puede tener caracteres especiales ni acentos.");
            return false;
        }
    }

    mostrarExito(input, div);
    return true;
}

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
        if (esDigito(codigo))  tieneDigito = true;
        else if (esLetra(codigo)) tieneLetra = true;
    }

    if (!tieneDigito) { mostrarError(input, div, "La contraseña debe contener al menos un dígito."); return false; }
    if (!tieneLetra)  { mostrarError(input, div, "La contraseña debe contener al menos una letra."); return false; }

    if (username !== "" && contieneSubcadena(password.toLowerCase(), username)) {
        mostrarError(input, div, "La contraseña no puede contener el nombre de usuario.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

function validarRePassword() {
    var input      = document.getElementById("re-password");
    var div        = document.getElementById("re-password-msg");
    var rePassword = input.value;
    var password   = document.getElementById("password").value;

    if (rePassword === "") { mostrarError(input, div, "Debes confirmar la contraseña."); return false; }
    if (rePassword !== password) { mostrarError(input, div, "Las contraseñas no coinciden."); return false; }

    mostrarExito(input, div);
    return true;
}

function validarDireccion() {
    var input = document.getElementById("direccion");
    var div   = document.getElementById("direccion-msg");

    if (input.value.trim() === "") {
        mostrarError(input, div, "La dirección es obligatoria.");
        return false;
    }
    mostrarExito(input, div);
    return true;
}

function validarComuna() {
    var select = document.getElementById("comuna");
    var div    = document.getElementById("comuna-msg");

    if (select.value === "") {
        mostrarError(select, div, "Debes seleccionar una comuna.");
        return false;
    }
    mostrarExito(select, div);
    return true;
}

function validarTelefono() {
    var input    = document.getElementById("telefono");
    var div      = document.getElementById("telefono-msg");
    var telefono = input.value.trim();

    if (telefono === "") { mostrarError(input, div, "El número de teléfono es obligatorio."); return false; }

    var inicio = (telefono.charAt(0) === "+") ? 1 : 0;

    if (telefono.length <= inicio) { mostrarError(input, div, "El número de teléfono no es válido."); return false; }

    for (var i = inicio; i < telefono.length; i++) {
        if (!esDigito(telefono.charCodeAt(i))) {
            mostrarError(input, div, "El teléfono solo puede contener dígitos (y un + inicial).");
            return false;
        }
    }

    var cantDigitos = telefono.length - inicio;
    if (cantDigitos < 8 || cantDigitos > 15) {
        mostrarError(input, div, "El teléfono debe tener entre 8 y 15 dígitos.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

function validarURL() {
    var input = document.getElementById("url");
    var div   = document.getElementById("url-msg");
    var url   = input.value.trim();

    if (url === "") {
        input.classList.remove("is-invalid", "is-valid");
        div.innerText = "";
        return true;
    }
    if (contieneEspacio(url)) { mostrarError(input, div, "La URL no puede contener espacios."); return false; }

    var tieneHttps = empiezaCon(url, "https://");
    var tieneHttp  = empiezaCon(url, "http://");

    if (!tieneHttp && !tieneHttps) {
        mostrarError(input, div, "La URL debe comenzar con http:// o https://");
        return false;
    }

    var resto = url.substring(tieneHttps ? 8 : 7);
    if (resto.length === 0 || resto.indexOf(".") < 1 || url.charAt(url.length - 1) === ".") {
        mostrarError(input, div, "La URL no es válida.");
        return false;
    }

    mostrarExito(input, div);
    return true;
}

function validarAficiones() {
    var div = document.getElementById("hobby-count-msg");
    if (aficiones.length < 2) {
        div.innerText = "Debes agregar al menos 2 aficiones.";
        return false;
    }
    div.innerText = "";
    return true;
}

// ---- Gestión de aficiones ----

function agregarAficion() {
    var input = document.getElementById("hobby");
    var div   = document.getElementById("hobby-msg");
    var valor = input.value.trim();

    if (valor === "") { div.innerText = "Escribe una afición antes de agregar."; return; }

    for (var i = 0; i < aficiones.length; i++) {
        if (aficiones[i].toLowerCase() === valor.toLowerCase()) {
            div.innerText = "Esa afición ya está en la lista.";
            return;
        }
    }

    aficiones.push(valor);
    div.innerText = "";
    input.value   = "";
    renderizarAficiones();
}

function eliminarAficion(indice) {
    aficiones.splice(indice, 1);
    renderizarAficiones();
}

function renderizarAficiones() {
    var lista = document.getElementById("hobby-list");
    lista.innerHTML = "";

    for (var i = 0; i < aficiones.length; i++) {
        var li   = document.createElement("li");
        li.className = "list-group-item";
        li.appendChild(document.createTextNode(aficiones[i]));

        var boton = document.createElement("button");
        boton.className = "btn-remove";
        boton.innerHTML = "&#x2715;";
        boton.setAttribute("type", "button");

        (function(idx) {
            boton.onclick = function() { eliminarAficion(idx); };
        })(i);

        li.appendChild(boton);
        lista.appendChild(li);
    }
}

// ---- Funciones auxiliares (sin regex) ----

function esLetraSimple(c) { return (c >= 65 && c <= 90) || (c >= 97 && c <= 122); }
function esLetra(c)       { return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c >= 192; }
function esDigito(c)      { return c >= 48 && c <= 57; }

function contieneSubcadena(cadena, sub) {
    for (var i = 0; i <= cadena.length - sub.length; i++) {
        var ok = true;
        for (var j = 0; j < sub.length; j++) {
            if (cadena.charAt(i + j) !== sub.charAt(j)) { ok = false; break; }
        }
        if (ok) return true;
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

// ---- Helpers de UI ----

function mostrarError(input, div, mensaje) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    div.innerText = mensaje;
}

function mostrarExito(input, div) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    div.innerText = "";
}
