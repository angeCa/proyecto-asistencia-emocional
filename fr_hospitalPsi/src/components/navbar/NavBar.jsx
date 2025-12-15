import React, { useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ServicesUsuario from "../../services/servicesUsuario";

function NavBar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [perfilForm, setPerfilForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  const obtenerToken = () => {
    return (
      localStorage.getItem("access_paciente") ||
      localStorage.getItem("access_psicologo") ||
      localStorage.getItem("access_admin") ||
      localStorage.getItem("access") ||
      localStorage.getItem("token")
    );
  };

  const obtenerIdUsuario = () => {
    return (
      localStorage.getItem("id_usuario") ||
      localStorage.getItem("id_user") ||
      localStorage.getItem("id_paciente") ||
      localStorage.getItem("id_psicologo") ||
      localStorage.getItem("id_admin")
    );
  };

  const isLoggedIn = !!obtenerToken();

  const CerrarSesion = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Espera",
      text: "¿Seguro que quieres cerrar sesión?",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      localStorage.clear();

      await Swal.fire({
        icon: "success",
        title: "¡Hasta luego!",
        text: "Has cerrado sesión correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/login");
    }
  };



  const abrirModalPerfil = async () => {
    const userId = obtenerIdUsuario();
    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "Ups",
        text: "No se pudo obtener tu usuario.",
      });
      return;
    }

    try {
      const usuarios = await ServicesUsuario.getUsuarios();
      const usuario = usuarios.find((u) => u.id === parseInt(userId));

      if (!usuario) {
        await Swal.fire({
          icon: "error",
          title: "Ups",
          text: "No se encontró tu información de usuario.",
        });
        return;
      }

      setPerfilForm({
        first_name: usuario.first_name || "",
        last_name: usuario.last_name || "",
        email: usuario.email || "",
      });

      setOpenMenu(false);
      setShowPerfilModal(true);
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar tu información.",
      });
    }
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePerfilSubmit = async (e) => {
    e.preventDefault();
    const userId = obtenerIdUsuario();

    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "Ups",
        text: "No se pudo obtener tu usuario.",
      });
      return;
    }

    try {
      await ServicesUsuario.updateUsuarios(userId, perfilForm);

      await Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tu información se guardó correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowPerfilModal(false);
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar tu perfil.",
      });
    }
  };

  const abrirModalPassword = () => {
    setPasswordForm({ actual: "", nueva: "", confirmar: "" });
    setOpenMenu(false);
    setShowPasswordModal(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.actual || !passwordForm.nueva || !passwordForm.confirmar) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos.",
      });
      return;
    }

    if (passwordForm.nueva !== passwordForm.confirmar) {
      await Swal.fire({
        icon: "warning",
        title: "Contraseñas diferentes",
        text: "La nueva contraseña y la confirmación no coinciden.",
      });
      return;
    }

    if (passwordForm.nueva.length < 6) {
      await Swal.fire({
        icon: "warning",
        title: "Contraseña muy corta",
        text: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

   
    console.log("Cambiar password:", passwordForm);

    await Swal.fire({
      icon: "success",
      title: "Contraseña actualizada",
      text: "Tu contraseña se ha cambiado (conecta esto al backend).",
    });

    setShowPasswordModal(false);
  };

  const eliminarCuenta = async () => {
    const userId = obtenerIdUsuario();

    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "No se pudo identificar tu usuario para eliminar la cuenta.",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar cuenta?",
      text: "Esta acción eliminará tu cuenta permanentemente. ¿Seguro que quieres continuar?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await ServicesUsuario.deleteUsuarios(userId);
      localStorage.clear();

      await Swal.fire({
        icon: "success",
        title: "Cuenta eliminada",
        text: "Tu cuenta ha sido eliminada correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      setOpenMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la cuenta. Inténtalo nuevamente.",
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/")}>
          ConectaMente
        </div>

        <ul className="navbar-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/recursos">Recursos</Link></li>
          <li><Link to="/foro">Foro</Link></li>
          {!isLoggedIn && (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>


        <div className="nav-right">
          {/* Botón "¿Serás admin?" SOLO cuando NO hay sesión */}
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/admin-invite")}
              className="btn-admin-link"
            >
              ¿Serás admin?
            </button>
          )}

          {isLoggedIn && (
            <>
              <button className="logout-btn" onClick={CerrarSesion}>
                Cerrar sesión
              </button>

              <div className="perfil">
                <button
                  className="user-btn"
                  onClick={() => setOpenMenu((prev) => !prev)}
                >
                  👤
                </button>

                {openMenu && (
                  <div className="user-menu">
                    <p className="menu-title">Mi cuenta</p>

                    <button className="menu-item" onClick={abrirModalPerfil}>
                      Editar perfil
                    </button>
                    <button className="menu-item" onClick={abrirModalPassword}>
                      Cambiar contraseña
                    </button>

                    <hr className="menu-divider" />

                    <button className="menu-item danger" onClick={eliminarCuenta}>
                      Eliminar cuenta
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </nav>

      {showPerfilModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar perfil</h3>
            <form onSubmit={handlePerfilSubmit} className="modal-form">
              <label>
                Nombre
                <input
                  type="text"
                  name="first_name"
                  value={perfilForm.first_name}
                  onChange={handlePerfilChange}
                />
              </label>

              <label>
                Apellido
                <input
                  type="text"
                  name="last_name"
                  value={perfilForm.last_name}
                  onChange={handlePerfilChange}
                />
              </label>

              <label>
                Correo
                <input
                  type="email"
                  name="email"
                  value={perfilForm.email}
                  onChange={handlePerfilChange}
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPerfilModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cambiar contraseña</h3>
            <form onSubmit={handlePasswordSubmit} className="modal-form">
              <label>
                Contraseña actual
                <input
                  type="password"
                  name="actual"
                  value={passwordForm.actual}
                  onChange={handlePasswordChange}
                />
              </label>

              <label>
                Nueva contraseña
                <input
                  type="password"
                  name="nueva"
                  value={passwordForm.nueva}
                  onChange={handlePasswordChange}
                />
              </label>

              <label>
                Confirmar nueva contraseña
                <input
                  type="password"
                  name="confirmar"
                  value={passwordForm.confirmar}
                  onChange={handlePasswordChange}
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Actualizar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
