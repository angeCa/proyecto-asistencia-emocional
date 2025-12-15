// src/pages/AdminInvitePage.jsx
import React from "react";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import AdminInvite from "../components/admin/AdminInvite";

function AdminInvitePage() {
  return (
    <>
      <NavBar />

      <div className="PrincipalDiv">
        <div className="DosColumnas">
          <div className="ColumnaIzquierda">
            <div className="ContenedorPrin">
              <AdminInvite />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AdminInvitePage;
