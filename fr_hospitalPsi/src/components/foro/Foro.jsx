import { useEffect, useState } from "react";
import ServicesForo from "../../services/ServicesForo";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "./Foro.css";

export default function ForoPage() {
  const [posts, setPosts] = useState([]);
  const [postActivo, setPostActivo] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [contenidoPost, setContenidoPost] = useState("");

  const [comentarioTxt, setComentarioTxt] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarPosts = async () => {
    try {
      const data = await ServicesForo.getPostsForo();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      setMensaje(e.message || "Error cargando posts.");
    }
  };

  const cargarComentarios = async (postId) => {
    try {
      const data = await ServicesForo.getComentarios(postId);
      setComentarios(Array.isArray(data) ? data : []);
    } catch (e) {
      setMensaje(e.message || "Error cargando comentarios.");
    }
  };

  useEffect(() => {
    cargarPosts();
  }, []);

  const seleccionarPost = async (p) => {
    setMensaje("");
    setPostActivo(p);
    setComentarioTxt("");
    await cargarComentarios(p.id);
  };

  const crearPost = async () => {
    setMensaje("");
    if (!titulo.trim() || !contenidoPost.trim()) {
      setMensaje("Escribe un título y el contenido del post.");
      return;
    }

    try {
      await ServicesForo.postForo({
        titulo: titulo.trim(),
        contenido: contenidoPost.trim(),
      });
      setTitulo("");
      setContenidoPost("");
      await cargarPosts();
      setMensaje("Post publicado.");
    } catch (e) {
      setMensaje(e.message || "No se pudo publicar el post.");
    }
  };

  const crearComentario = async () => {
    setMensaje("");
    if (!postActivo) return;

    if (!comentarioTxt.trim()) {
      setMensaje("Escribe un comentario.");
      return;
    }

    try {
      await ServicesForo.postComentario({
        post: postActivo.id,
        contenido: comentarioTxt.trim(),
      });
      setComentarioTxt("");
      await cargarComentarios(postActivo.id);
    } catch (e) {
      setMensaje(e.message || "No se pudo crear el comentario.");
    }
  };

  const eliminarComentario = async (comentarioId) => {
    try {
      await ServicesForo.deleteComentario(comentarioId);
      if (postActivo) await cargarComentarios(postActivo.id);
    } catch (e) {
      setMensaje(e.message || "No se pudo eliminar el comentario.");
    }
  };

  const toggleLike = async (comentarioId) => {
    try {
      await ServicesForo.toggleLikeComentario(comentarioId);
      if (postActivo) await cargarComentarios(postActivo.id);
    } catch (e) {
      setMensaje(e.message || "No se pudo dar/quitar like.");
    }
  };

  return (
    <>
      <NavBar />

      <div className="foro-container">
        <h2 className="titulo-seccion">Foro</h2>
        {mensaje && <p className="mensaje-info">{mensaje}</p>}

        <div className="foro-grid">
          <div className="foro-panel">
            <h3>Publicar</h3>

            <input
              className="foro-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
            />

            <textarea
              className="foro-textarea"
              rows={4}
              value={contenidoPost}
              onChange={(e) => setContenidoPost(e.target.value)}
              placeholder="Escribe tu publicación..."
            />

            <button className="foro-btn" onClick={crearPost}>
              Publicar
            </button>

            <h3 style={{ marginTop: 16 }}>Temas</h3>
            <div className="foro-list">
              {posts.map((p) => (
                <button
                  key={p.id}
                  className={`foro-item ${postActivo?.id === p.id ? "active" : ""}`}
                  onClick={() => seleccionarPost(p)}
                >
                  <div className="foro-item-title">{p.titulo}</div>
                  <div className="foro-item-meta">
                    {p.autor_nombre} {p.autor_apellido} · {p.autor_rol}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PANEL: comentarios */}
          <div className="foro-panel">
            {!postActivo ? (
              <p className="texto-secundario">Selecciona un tema para ver comentarios.</p>
            ) : (
              <>
                <h3>{postActivo.titulo}</h3>
                <p className="foro-post-body">{postActivo.contenido}</p>

                <div className="foro-comentar">
                  <textarea
                    className="foro-textarea"
                    rows={3}
                    value={comentarioTxt}
                    onChange={(e) => setComentarioTxt(e.target.value)}
                    placeholder="Escribe un comentario..."
                  />
                  <button className="foro-btn" onClick={crearComentario}>
                    Comentar
                  </button>
                </div>

                <div className="foro-comentarios">
                  {comentarios.map((c) => (
                    <div key={c.id} className="foro-comentario">
                      <div className="foro-comentario-meta">
                        {c.autor_nombre} {c.autor_apellido} · {c.autor_rol}
                      </div>

                      <div className="foro-comentario-text">{c.contenido}</div>

                      <div className="foro-comentario-actions">
                        <button className="btn-like" onClick={() => toggleLike(c.id)}>
                          👍 {c.likes_count ?? 0}
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => eliminarComentario(c.id)}
                        >
                          🗑 Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
