import { useEffect, useState } from "react";
import ServicesPacientes from "../../services/ServicesPacientes";
import ServicesDiario from "../../services/ServicesDiario";

const { getDiarios } = ServicesDiario;
const { getPacientes } = ServicesPacientes;

function DiariosPaciente({ pacienteId }) {
    const [pacientes, setPacientes] = useState([]);
    const [diarios, setDiarios] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");

    useEffect(() => {
        async function fetchP() {
            const data = await getPacientes();
            setPacientes(data);
        }
        fetchP();
    }, []);

    useEffect(() => {
        if (!pacienteId) return;

        const cargarDiarios = async () => {
            try {
                const data = await getDiariosPaciente(pacienteId);
                console.log("📘 Diarios recibidos:", data);
                setDiarios(data);
            } catch (error) {
                console.error("Error cargando diarios:", error);
            }
        };

        cargarDiarios();
    }, [pacienteId]);




    return (
        <div>
            <h2>Diarios del Paciente</h2>

            <select
                value={pacienteSeleccionado}
                onChange={(e) => {
                    setPacienteSeleccionado(e.target.value);
                    setDiarios([]); // reset para evitar mostrar datos pasados
                }}
            >
                <option value="">Seleccione un paciente</option>
                {pacientes.map(p => (
                    <option key={p.id} value={p.id}>
                        {p.nombre} {p.apellido}
                    </option>
                ))}
            </select>

            <hr />

            {pacienteSeleccionado && diarios.length === 0 && (
                <p>Este paciente no tiene diarios.</p>
            )}

            {diarios.map(d => (
                <div key={d.id} className="diario-card">
                    <h3>{d.titulo}</h3>
                    <p>{d.descripcion}</p>
                    <p><strong>Estado emocional:</strong> {d.estado_emocional}</p>
                    <p><strong>Fecha:</strong> {d.fecha}</p>
                </div>
            ))}
        </div>
    );
}

export default DiariosPaciente;
