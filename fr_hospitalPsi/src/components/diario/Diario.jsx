import React, { useEffect, useState } from "react";
import ServicesDiario from "../../services/ServicesDiario";
import "./Diario.css";

export default function Diario() {
  const [diarios, setDiarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null); // ID del diario que se edita



  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [emocionPrincipal, setEmocionPrincipal] = useState("");
  const [nivelIntensidad, setNivelIntensidad] = useState(5);
  const [visible, setVisible] = useState(true);

  const [filtro, setFiltro] = useState("todos");

  const cargarDiarios = () => {
    ServicesDiario.getDiarios()
      .then((data) => setDiarios(data))
      .catch((err) => console.error("Error cargando diarios", err));
  };

  useEffect(() => {
    cargarDiarios();
  }, []);

  const enviarDiario = (e) => {
    e.preventDefault();

    const data = {
      titulo,
      descripcion,
      emocion_principal: emocionPrincipal,
      nivel_intensidad: nivelIntensidad,
      visible_para_psicologo: visible,
    };

    if (editando) {
      // MODO EDITAR
      ServicesDiario.updateDiario(editando, data)
        .then(() => {
          limpiarFormulario();
          cargarDiarios();
        })
        .catch((err) => console.error("Error actualizando diario", err));
    } else {
      // MODO CREAR
      ServicesDiario.postDiario(data)
        .then(() => {
          limpiarFormulario();
          cargarDiarios();
        })
        .catch((err) => console.error("Error creando diario", err));
    }
  };


  // ========= Filtro por fecha =========
  const filtrarDiarios = () => {
    const hoy = new Date();

    if (filtro === "hoy") {
      return diarios.filter((d) => d.fecha === hoy.toISOString().split("T")[0]);
    }

    if (filtro === "semana") {
      const hace7 = new Date();
      hace7.setDate(hoy.getDate() - 7);
      return diarios.filter((d) => new Date(d.fecha) >= hace7);
    }

    if (filtro === "mes") {
      const mesActual = hoy.getMonth();
      return diarios.filter((d) => new Date(d.fecha).getMonth() === mesActual);
    }

    return diarios;
  };

  // ========= Emojis según emoción =========
  const emojiEmocion = (emocion) => {
    const mapa = {
      feliz: "😊",
      triste: "😢",
      enojado: "😡",
      ansioso: "😰",
      sorprendido: "😲",
      cansado: "😴",
      amor: "❤️",
    };

    const key = emocion.toLowerCase();
    return mapa[key] || "📝";
  };

  const limpiarFormulario = () => {
    setShowModal(false);
    setEditando(null);
    setTitulo("");
    setDescripcion("");
    setEmocionPrincipal("");
    setNivelIntensidad(5);
    setVisible(true);
  };


  return (
    <div>
      <div className="diario-container">
        <div className="header-diario">
          <h2>Mi Diario Emocional</h2>

          <div className="acciones-diario">
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>

            <button className="btn-nuevo" onClick={() => setShowModal(true)}>
              + Nuevo Diario
            </button>
          </div>
        </div>

        {/* ===== Modal ===== */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editando ? "Editar Diario" : "Crear Diario"}</h3>


              <form onSubmit={enviarDiario} className="form-modal">
                <input
                  type="text"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />

                <textarea
                  placeholder="¿Como va tu día?"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />

                <div className="emociones-selector">
                  <label>Emoción principal:</label>

                  <div className="emociones-opciones">
                    {[
                      { emoji: "😊", valor: "feliz" },
                      { emoji: "😢", valor: "triste" },
                      { emoji: "😡", valor: "enojado" },
                      { emoji: "😰", valor: "ansioso" },
                      { emoji: "😲", valor: "sorprendido" },
                      { emoji: "😴", valor: "cansado" },
                      { emoji: "❤️", valor: "amor" },
                    ].map((e) => (
                      <button
                        key={e.valor}
                        type="button"
                        className={`btn-emocion ${emocionPrincipal === e.valor ? "seleccionado" : ""
                          }`}
                        onClick={() => setEmocionPrincipal(e.valor)}
                      >
                        {e.emoji}
                      </button>
                    ))}
                  </div>
                </div>


                <label>Nivel de intensidad: {nivelIntensidad}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={nivelIntensidad}
                  onChange={(e) => setNivelIntensidad(e.target.value)}
                />

                <label>¿Visible para tu psicólogo?</label>
                <select
                  value={visible}
                  onChange={(e) => setVisible(e.target.value === "true")}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>

                <div className="modal-buttons">
                  <button className="btn-guardar" type="submit">
                    Guardar
                  </button>
                  <button
                    className="btn-cancelar"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== Lista de diarios ===== */}
        <div className="lista-diarios">
          
          {filtrarDiarios().length === 0 && (
            <p className="sin-diarios">No hay diarios...</p>
          )}

          {filtrarDiarios().map((d) => (
            <div key={d.id} className="diario-card">

              <div className="diario-header">
                
                <span className="emoji">{emojiEmocion(d.emocion_principal)}</span>
                <h4>{d.titulo}</h4>
              </div>

              <div className="acciones-card">
                
                <button
                  className="btn-editar"
                  onClick={() => {
                    setEditando(d.id);
                    setTitulo(d.titulo);
                    setDescripcion(d.descripcion);
                    setEmocionPrincipal(d.emocion_principal);
                    setNivelIntensidad(d.nivel_intensidad);
                    setVisible(d.visible_para_psicologo);
                    setShowModal(true);
                  }}
                >
                  ✏️
                </button>

                <button
                  className="btn-eliminar"
                  onClick={() => {
                    if (window.confirm("¿Eliminar este diario?")) {
                      ServicesDiario.deleteDiario(d.id).then(() => cargarDiarios());
                    }
                  }}
                >
                  🗑️
                </button>
                
              </div>

              <p className="descripcion">{d.descripcion}</p>

              <div className="info">
                <span>Emoción: {d.emocion_principal}</span>
                <span>Intensidad: {d.nivel_intensidad}/10</span>
              </div>

              <div className="fecha">{d.fecha}</div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
