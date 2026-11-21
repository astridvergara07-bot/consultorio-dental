"use client";

import { useState, type FormEvent } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { Icono } from "./Iconos";

export function FormularioCita() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<"ok" | "error" | null>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);

    const supabase = crearClienteNavegador();
    const { error } = await supabase.from("citas").insert({
      nombre,
      telefono,
      mensaje: mensaje || null,
    });

    setEnviando(false);
    if (error) {
      setResultado("error");
      return;
    }
    setResultado("ok");
    setNombre("");
    setTelefono("");
    setMensaje("");
  }

  return (
    <form className="form-card" onSubmit={enviar}>
      <div className="form-field">
        <label htmlFor="cita-nombre">Nombre</label>
        <input
          id="cita-nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>
      <div className="form-field">
        <label htmlFor="cita-telefono">Telefono</label>
        <input
          id="cita-telefono"
          required
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Para contactarte y confirmar"
        />
      </div>
      <div className="form-field">
        <label htmlFor="cita-mensaje">Mensaje (opcional)</label>
        <textarea
          id="cita-mensaje"
          rows={3}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Que procedimiento te interesa, horario preferido, etc."
        />
      </div>
      {resultado === "ok" && (
        <p className="form-msg ok">Listo, recibimos tu solicitud. Te contactaremos pronto para confirmar.</p>
      )}
      {resultado === "error" && (
        <p className="form-msg error">No se pudo enviar. Intenta de nuevo o escribenos por WhatsApp.</p>
      )}
      <button type="submit" className="btn-primary" disabled={enviando}>
        <Icono id="ic-calendar" />
        {enviando ? "Enviando..." : "Solicitar cita"}
      </button>
    </form>
  );
}
