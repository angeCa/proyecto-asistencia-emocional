// src/pages/RegistroDeadmin.jsx
import React from "react";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import RegistroAdmin from "../components/registroAdmin/RegistroAdmin";

function RegistroDeadmin() {
  return (
    <>
      <NavBar />

      <div className="PrincipalDiv">
        <div className="DosColumnas">
          <div className="ColumnaIzquierda">
            <div className="ContenedorPrin">
              <RegistroAdmin />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default RegistroDeadmin;
