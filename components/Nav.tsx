"use client";

import { useState } from "react";
import { Icono } from "./Iconos";

export function Nav() {
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className={`nav ${abierto ? "open" : ""}`}>
      <div className="nav-inner wrap">
        <div className="brand">
          <Icono id="ic-tooth" />
          [Nombre del Consultorio]
        </div>
        <ul className="nav-links">
          <li>
            <a href="#inicio" onClick={() => setAbierto(false)}>
              Inicio
            </a>
          </li>
          <li>
            <a href="#doctora" onClick={() => setAbierto(false)}>
              La doctora
            </a>
          </li>
          <li>
            <a href="#procedimientos" onClick={() => setAbierto(false)}>
              Procedimientos
            </a>
          </li>
          <li>
            <a href="#testimonios" onClick={() => setAbierto(false)}>
              Testimonios
            </a>
          </li>
          <li>
            <a href="#contacto" onClick={() => setAbierto(false)}>
              Contacto
            </a>
          </li>
        </ul>
        <a className="nav-cta" href="#contacto">
          <Icono id="ic-calendar" />
          Agendar cita
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Abrir menu"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
