import React from "react";
//import "./NavBar.css";
import { Navigate } from "react-router-dom";


function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        
        <span>ConectaMente</span>
      </div>

      <ul className="navbar-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/nosotros">Nosotros</a></li>
        <li><a href="/login">Login</a></li>
      </ul>

      <div className="nav-user">
        <button className="user-btn">👤</button>
      </div>
    </nav>
  );
}

export default NavBar;
