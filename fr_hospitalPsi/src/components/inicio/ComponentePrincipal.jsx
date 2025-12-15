import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroImage from "../img/principalfoto.jpg";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "./ComponentePrincipal.css";

export default function ComponentePrincipal() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Es gratuito?",
      answer: "Sí. El uso básico de la plataforma es completamente gratuito."
    },
    {
      question: "¿Es para todo el público?",
      answer: "Sí. Está diseñada para adolescentes, jóvenes y adultos que buscan apoyo emocional."
    },
    {
      question: "¿Es normal sentir un tic en el párpado?",
      answer: "Es común y suele estar relacionado con estrés, cansancio o falta de sueño."
    },
    {
      question: "¿Esta página sustituye diagnósticos médicos?",
      answer:
        "No. Brinda apoyo emocional y orientación general, pero no reemplaza consultas médicas o psicológicas."
    },
    {
      question: "¿Mi información es privada?",
      answer:
        "Sí. Toda la información está protegida y solo puede ser vista por personal autorizado."
    },
    {
      question: "¿Qué hago si tengo una emergencia emocional?",
      answer:
        "La plataforma no maneja emergencias. Se recomienda acudir a un centro médico o llamar a líneas de ayuda locales."
    }
  ];

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const servicios = [
    {
      title: "Consultas por chat",
      desc: "Comunícate con psicólogos mediante un chat seguro y privado."
    },
    {
      title: "Citas por Zoom",
      desc: "Agenda videollamadas con profesionales para recibir orientación."
    },
    {
      title: "Información pública",
      desc: "Acceso a información confiable sobre trastornos y sus características."
    },
    {
      title: "Protección de información",
      desc: "Tus datos están protegidos y se manejan de forma confidencial."
    },
    {
      title: "Página inclusiva",
      desc: "Creada para todas las personas sin importar su identidad o situación."
    },
    {
      title: "Asistencia con AmigoBot",
      desc: "Bot amigable para apoyo emocional básico y respuestas rápidas."
    },
    {
      title: "Plataforma confiable",
      desc: "Un espacio seguro, cercano y lleno de apoyo emocional."
    }
  ];

  return (
    <div className="PrincipalPage">
      <NavBar />

      <main className="Principal">
        <div className="saludo">
          <div className="Hero">
            <img src={HeroImage} alt="Imagen de bienvenida" className="hero-image" />

            <div className="hero-text">
              <h1>Bienvenido a tu espacio seguro 💙</h1>
              <p>Encuentra apoyo emocional, orientación profesional y recursos confiables.</p>
            </div>
          </div>
        </div>

        {/* BOTÓN DE REGISTRO PARA PACIENTE */}
        <div className="botonesLR">
          <div className="botones-apoyo">
            <p className="texto-apoyo">
              ¿Quieres hablar con un psicólogo certificado y recibir apoyo o resolver tus dudas?
            </p>

            <div className="botones-apoyo-contenedor">
              <button
                className="btn-apoyo"
                onClick={() => navigate("/registro")}
              >
                Sí quiero
              </button>
            </div>
          </div>
        </div>

        {/* PREGUNTAS FRECUENTES */}
        <div className="PreguntasFrecuentes">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => toggle(i)}>
                {faq.question}
              </button>
              {openIndex === i && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* CARDS DE SERVICIOS */}
        <div className="Cards">
          {servicios.map((item, i) => (
            <div key={i} className="card-servicio">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* QUE OFRECE LA PÁGINA */}
        <div className="RecursosDestacados">
          <section>
            <h2>Recursos Emocionales Destacados</h2>
            <ul>
              <li>Identificar síntomas de ansiedad</li>
              <li>Manejo del estrés</li>
              <li>Técnicas de respiración</li>
              <li>Cómo apoyar a un ser querido</li>
            </ul>
          </section>
        </div>

        {/* Sección para psicólogos */}
        <div className="SeccionPsicolgos">
          <section>
            <h2>¿Eres psicólogo y deseas ayudar?</h2>
            <p>
              Únete a nuestra misión de brindar apoyo emocional a quienes más lo necesitan.
              Tendrás acceso a una plataforma organizada, pacientes asignados y herramientas
              de comunicación seguras.
            </p>

            <button onClick={() => navigate("/registropsicologos")}>
              Quiero unirme como psicólogo
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
