import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        Busca apoyo si pasas por una situación grave.  
        Si estás en peligro o enfrentando una crisis emocional, contacta a los servicios de emergencia o a una línea de ayuda local inmediatamente.
      </p>

      <p className="footer-copy">
        © {new Date().getFullYear()} ConectaMente. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
