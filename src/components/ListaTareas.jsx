import { Fragment, useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
import { ItemTarea } from "./ItemTarea";
import { Mensaje } from "./Mensaje";

const CLAVE = "tareas-app-tareas";

// Lee las notas desde localStorage con manejo de errores
const leerDesdeStorage = () => {
    try {
        const datos = localStorage.getItem(CLAVE);
        return datos ? JSON.parse(datos) : [];
    } catch {
        return [];
    }
};

export function ListaTareas() {
    const [tareas, setTareas] = useState(leerDesdeStorage);

    // Estado del formulario
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [importante, setImportante] = useState(false);
    const [error, setError] = useState("");

    // Sincronizar localStorage cada vez que cambia el arreglo de tareas
    useEffect(() => {
        localStorage.setItem(CLAVE, JSON.stringify(tareas));
    }, [tareas]);

    const agregarTarea = () => {
        // Solo la descripcion es obligatoria
        if (descripcion.trim() === "") {
            setError("La descripción es obligatoria.");
            return;
        }

        setError("");

        const nuevaTarea = {
            id: uuid_v4(),
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            importante,
        };

        setTareas((prev) => [...prev, nuevaTarea]);

        // Limpiar formulario
        setTitulo("");
        setDescripcion("");
        setImportante(false);
    };

    const eliminarTarea = (id) => {
        setTareas((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <Fragment>
            <div style={{ minHeight: "100vh", backgroundColor: "#4a4a4a", padding: "2rem" }}>
                <div className="container">
                    <h2 className="mb-4 fw-bold" style={{ color: "#fff" }}>Post It :D!</h2>

                    {/* Formulario */}
                    <div className="card p-4 mb-5 shadow-sm">
                        <h5 className="mb-3">Nueva nota</h5>

                        <div className="mb-3">
                            <label htmlFor="titulo" className="form-label">Título (opcional)</label>
                            <input
                                id="titulo"
                                type="text"
                                className="form-control"
                                placeholder="Título de la nota"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">
                                Descripción <span className="text-danger">*</span>
                            </label>
                            <textarea
                                id="descripcion"
                                className={`form-control ${error ? "is-invalid" : ""}`}
                                placeholder="Descripción de la nota"
                                rows={3}
                                value={descripcion}
                                onChange={(e) => {
                                    setDescripcion(e.target.value);
                                    if (e.target.value.trim() !== "") setError("");
                                }}
                            />
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                id="importante"
                                type="checkbox"
                                className="form-check-input"
                                checked={importante}
                                onChange={(e) => setImportante(e.target.checked)}
                            />
                            <label htmlFor="importante" className="form-check-label">Marcar como importante</label>
                        </div>

                        {error && <Mensaje tipo="danger" texto={error} />}

                        <button onClick={agregarTarea} className="btn btn-success">
                            Agregar nota
                        </button>
                    </div>

                    {/* Grid de notas */}
                    {tareas.length === 0 ? (
                        <p style={{ color: "#ccc" }}>No hay notas todavía. ¡Agrega una!</p>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-4 g-3">
                            {tareas.map((tarea) => (
                                <div key={tarea.id} className="col">
                                    <ItemTarea tarea={tarea} onEliminar={eliminarTarea} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
}
