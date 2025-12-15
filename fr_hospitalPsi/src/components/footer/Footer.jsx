import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-disclaimer">
          Esta plataforma es un apoyo y acompañamiento emocional. </p>
        <br />
        <p>  No reemplaza una valoración profesional presencial ni una atención de salud integral.
        </p>

        <div className="footer-socials">
          <a href="https://instagram.com" target="_blank" className="social-link" rel="noreferrer">
            Instagram
          </a>
          <a href="https://x.com" target="_blank" className="social-link" rel="noreferrer">
            X
          </a>
          <a href="https://facebook.com" target="_blank" className="social-link" rel="noreferrer">
            Facebook
          </a>
        </div>

        <p className="footer-copy">© 2025 Mi Plataforma – Todos los derechos reservados</p>
      </div>
    </footer>


  );
}

export default Footer;
