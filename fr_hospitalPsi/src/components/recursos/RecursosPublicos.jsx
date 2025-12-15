// src/components/recursos/RecursosPublicos.jsx

import { useEffect, useState } from "react";
import ServicesRecursos from "../../services/ServicesRecursos";
import "./RecursosPublicos.css";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";

function RecursosPublicos() {
    const [recursos, setRecursos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargar();
    }, []);

    async function cargar() {
        try {
            setCargando(true);
            const data = await ServicesRecursos.getRecursos();
            setRecursos(data);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los recursos.");
        } finally {
            setCargando(false);
        }
    }

    if (cargando) return <p>Cargando recursos...</p>;
    if (error) return <p>{error}</p>;

    if (!recursos.length) return <p>No hay recursos disponibles por el momento.</p>;

    return (
        <div>
            <NavBar />
            <div className="recursos-container">
                <h2>Recursos de apoyo</h2>

                <div className="recursos-grid">
                    {recursos.map((r) => (
                        <div key={r.id} className="recurso-card">
                            <h3>{r.titulo}</h3>

                            <p>{r.descripcion}</p>

                            <p className="fecha">
                                Publicado: {new Date(r.fecha_publicacion).toLocaleDateString()}
                            </p>

                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-video">
                                Ver recurso
                            </a>

                            <small>Psicólogo: {r.psicologo_nombre}</small>
                        </div>
                    ))}
                </div>

            </div>
            <Footer />


        </div>
    );
}

export default RecursosPublicos;
