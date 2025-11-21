import React from "react";
import "./Nosotros.css";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import EquipoImg from "../img/EquipoImg.jpg";

function Nosotros() {
    return (
        <div>

            <div className="NavBar"><NavBar /></div>

            <div className="nosotros-container">


                <div className="nosotros-hero">
                    <img src={EquipoImg} alt="Equipo ConectaMente" className="nosotros-img" />
                    <h1>Sobre Nosotros</h1>
                    <p className="nosotros-intro">
                        En ConectaMente creemos en la importancia del apoyo emocional accesible,
                        humano y seguro para todas las personas.
                    </p>
                </div>


                <section className="nosotros-section">
                    <h2>Nuestra Misión</h2>
                    <p>
                        Brindar un espacio seguro donde las personas puedan recibir orientación emocional,
                        herramientas de bienestar y acompañamiento por parte de profesionales.
                    </p>
                </section>

                <section className="nosotros-section">
                    <h2>Nuestra Visión</h2>
                    <p>
                        Convertirnos en una plataforma de referencia en apoyo emocional digital,
                        conectando a usuarios con psicólogos de manera rápida, respetuosa y efectiva.
                    </p>
                </section>

                <section className="nosotros-section">
                    <h2>Nuestros Valores</h2>
                    <ul>
                        <li>Empatía y respeto</li>
                        <li>Confidencialidad</li>
                        <li>Accesibilidad para todos</li>
                        <li>Profesionalismo</li>
                        <li>Inclusión</li>
                    </ul>
                </section>

            </div>
            <div className="Footer"><Footer /></div>
        </div>
    );
}

export default Nosotros;
