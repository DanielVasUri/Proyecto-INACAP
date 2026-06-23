import { Fragment } from "react";

// Estilos post-it: amarillo para notas normales, rojo para importantes
const estiloPostIt = {
    normal: {
        backgroundColor: "#fff176",
        border: "1px solid #f9a825",
    },
    importante: {
        backgroundColor: "#ef9a9a",
        border: "1px solid #c62828",
    },
};

export function ItemTarea({ tarea, onEliminar }) {
    const estilo = tarea.importante ? estiloPostIt.importante : estiloPostIt.normal;

    return (
        <Fragment>
            <div
                className="p-3 rounded position-relative"
                style={{ ...estilo, minHeight: "100px" }}
            >
                {/* Boton eliminar en esquina superior derecha */}
                <button
                    onClick={() => onEliminar(tarea.id)}
                    className="btn btn-sm position-absolute top-0 end-0 m-1 p-0 lh-1"
                    style={{ background: "transparent", border: "none", fontSize: "1.1rem", fontWeight: "bold", color: "#555" }}
                    aria-label="Eliminar nota"
                >
                    &times;
                </button>

                {tarea.titulo && (
                    <h6 className="fw-bold mb-1 pe-4">{tarea.titulo}</h6>
                )}
                <p className="mb-0 pe-4" style={{ whiteSpace: "pre-wrap" }}>{tarea.descripcion}</p>

                {tarea.importante && (
                    <span className="badge mt-2" style={{ backgroundColor: "#c62828" }}>Importante</span>
                )}
            </div>
        </Fragment>
    );
}
