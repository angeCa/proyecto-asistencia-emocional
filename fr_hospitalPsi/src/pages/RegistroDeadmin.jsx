// src/pages/RegistroDeadmin.jsx
import React from "react";

import RegistroAdmin from "../components/registroAdmin/RegistroAdmin";

function RegistroDeadmin() {
  return (
    <>
     

      <div className="PrincipalDiv">
        <div className="DosColumnas">
          <div className="ColumnaIzquierda">
            <div className="ContenedorPrin">
              <RegistroAdmin />
            </div>
          </div>
        </div>
      </div>

 
    </>
  );
}

export default RegistroDeadmin;
