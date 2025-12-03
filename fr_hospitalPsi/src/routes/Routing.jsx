import { Routes, Route, Navigate } from 'react-router-dom'

import RegistroGeneralPage from "../pages/RegistroGeneralPage";
import LoginGeneralPage from '../pages/LoginGeneralPage';
import PacientePage from '../pages/PacientePage';
import AdminPage from '../pages/AdminPage';
import PsicologoPage from '../pages/PsicologoPage';
import PaginaPrincipalPage from '../pages/PaginaPrincipalPage';
import RegistroPsicologos from '../pages/RegistroPsicologos';
import NosotrosPage from '../pages/NosotrosPage';
import Dashboard from '../components/dashboard/Dashboard';

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pp" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/registropsicologos" element={<RegistroPsicologos />} />
      <Route path="/registro" element={<RegistroGeneralPage />} />
      <Route path="/login" element={<LoginGeneralPage />} />
      <Route path="/pp" element={<PaginaPrincipalPage />} />
      <Route path="/nosotros" element={<NosotrosPage />} />

      <Route path='/admin' element={<AdminPage/> } />
      <Route path="/paciente" element={<PacientePage />} />
      <Route path="/psicologo" element={<PsicologoPage />} />
    </Routes>
  )
}

export default Routing
