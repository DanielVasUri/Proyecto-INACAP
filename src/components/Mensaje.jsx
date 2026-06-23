import { Fragment } from "react";

// Muestra un mensaje de alerta de Bootstrap
// props.tipo: "danger", "warning", "success", etc.
// props.texto: texto a mostrar
export function Mensaje({ tipo, texto }) {
    return (
        <Fragment>
            <div className={"alert alert-" + tipo} role="alert">
                <p className="mb-0">{texto}</p>
            </div>
        </Fragment>
    );
}
