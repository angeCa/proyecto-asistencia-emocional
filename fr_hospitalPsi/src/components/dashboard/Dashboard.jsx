import React from "react";
import PsicologoComponente from "../psicologo/PsicologoComponente";
import PacienteComponente from "../paciente/PacienteComponente";
import AdminComponente from "../admin/AdminComponente";

function Dashboard() {
  const rolePsi = localStorage.getItem("role_psicologo");
  const rolePac = localStorage.getItem("role_paciente");
  const roleAdm = localStorage.getItem("role_admin");

  if (!rolePsi && !rolePac && !roleAdm) {
    return <h1>¡No estas logueado!</h1>
  }
  if (rolePsi) {
    return <PsicologoComponente />
  }
  

  if (rolePac) {
    return <PacienteComponente />
  }

  if (roleAdm) {
    return <AdminComponente />
  }

  return <h1> Rol desconocido</h1>


}

export default Dashboard;
