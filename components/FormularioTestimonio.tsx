"use client";

import { useState, type FormEvent } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";

export function FormularioTestimonio() {
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<"ok" | "error" | null>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);

    const supabase = crearClienteNavegador();
    const { error } = await supabase.from("testimonios").insert({
      nombre_paciente: nombre,
      comentario,
    });

    setEnviando(false);
    if (error) {
      setResultado("error");
      return;
    }
    setResultado("ok");
    setNombre("");
    setComentario("");
  }

  return (
    <form className="form-card" onSubmit={enviar}>
      <div className="form-field">
        <label htmlFor="testi-nombre">Tu nombre</label>
        <input
          id="testi-nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="testi-comentario">Tu experiencia</label>
        <textarea
          id="testi-comentario"
          required
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Cuentanos como fue tu visita"
        />
      </div>
      {resultado === "ok" && (
        <p className="form-msg ok">Gracias por tu comentario. Se publicara despues de ser revisado.</p>
      )}
      {resultado === "error" && <p className="form-msg error">No se pudo enviar, intenta de nuevo.</p>}
      <button type="submit" className="btn-secondary" disabled={enviando}>
        {enviando ? "Enviando..." : "Dejar un comentario"}
      </button>
    </form>
  );
}
