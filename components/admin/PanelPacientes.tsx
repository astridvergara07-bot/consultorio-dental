"use client";

import { useState } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { NOMBRES_PROCEDIMIENTOS } from "@/lib/procedimientos";

export interface HistorialFila {
  id: string;
  fecha: string;
  procedimiento: string;
  notas: string | null;
}

export interface PacienteFila {
  id: string;
  nombre: string;
  telefono: string;
  correo: string | null;
  fecha_nacimiento: string | null;
  notas_generales: string | null;
  proxima_cita: string | null;
  historial_pacientes: HistorialFila[];
}

function estadoProximaCita(fecha: string | null): { etiqueta: string; clase: string } {
  if (!fecha) return { etiqueta: "Sin definir", clase: "pendiente" };
  const hoy = new Date().toISOString().slice(0, 10);
  if (fecha < hoy) return { etiqueta: `Vencida (${fecha})`, clase: "pendiente" };
  return { etiqueta: fecha, clase: "ok" };
}

function FormularioDatos({
  paciente,
  onGuardado,
}: {
  paciente: PacienteFila;
  onGuardado: (cambios: Partial<PacienteFila>) => void;
}) {
  const [correo, setCorreo] = useState(paciente.correo ?? "");
  const [fechaNacimiento, setFechaNacimiento] = useState(paciente.fecha_nacimiento ?? "");
  const [notasGenerales, setNotasGenerales] = useState(paciente.notas_generales ?? "");
  const [proximaCita, setProximaCita] = useState(paciente.proxima_cita ?? "");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    const supabase = crearClienteNavegador();
    const cambios = {
      correo: correo || null,
      fecha_nacimiento: fechaNacimiento || null,
      notas_generales: notasGenerales || null,
      proxima_cita: proximaCita || null,
    };
    const { error } = await supabase.from("pacientes").update(cambios).eq("id", paciente.id);
    setGuardando(false);
    if (error) {
      setMensaje("No se pudo guardar.");
      return;
    }
    setMensaje("Guardado.");
    onGuardado(cambios);
  }

  return (
    <form onSubmit={guardar} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <div className="form-field">
        <label>Correo</label>
        <input value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Fecha de nacimiento</label>
        <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Notas generales (alergias, antecedentes...)</label>
        <textarea rows={2} value={notasGenerales} onChange={(e) => setNotasGenerales(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Proxima cita / seguimiento sugerido</label>
        <input type="date" value={proximaCita} onChange={(e) => setProximaCita(e.target.value)} />
      </div>
      {mensaje && <p className="form-msg ok">{mensaje}</p>}
      <button className="btn-secondary" type="submit" disabled={guardando} style={{ alignSelf: "flex-start" }}>
        {guardando ? "Guardando..." : "Guardar datos"}
      </button>
    </form>
  );
}

function FormularioHistorial({
  pacienteId,
  onAgregado,
}: {
  pacienteId: string;
  onAgregado: (fila: HistorialFila) => void;
}) {
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [procedimiento, setProcedimiento] = useState(NOMBRES_PROCEDIMIENTOS[0]);
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    const supabase = crearClienteNavegador();
    const { data, error } = await supabase
      .from("historial_pacientes")
      .insert({ paciente_id: pacienteId, fecha, procedimiento, notas: notas || null })
      .select("id, fecha, procedimiento, notas")
      .single();
    setGuardando(false);
    if (error || !data) return;
    onAgregado(data);
    setNotas("");
  }

  return (
    <form onSubmit={agregar} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginTop: 14 }}>
      <div className="form-field" style={{ minWidth: 150 }}>
        <label>Fecha</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </div>
      <div className="form-field" style={{ minWidth: 200 }}>
        <label>Procedimiento</label>
        <select
          value={procedimiento}
          onChange={(e) => setProcedimiento(e.target.value)}
          style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", fontSize: "0.92rem" }}
        >
          {NOMBRES_PROCEDIMIENTOS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field" style={{ flex: 1, minWidth: 200 }}>
        <label>Notas de la visita</label>
        <input value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Opcional" />
      </div>
      <button className="btn-primary" type="submit" disabled={guardando}>
        {guardando ? "..." : "Agregar"}
      </button>
    </form>
  );
}

function FilaPaciente({ paciente: inicial }: { paciente: PacienteFila }) {
  const [abierto, setAbierto] = useState(false);
  const [paciente, setPaciente] = useState(inicial);
  const estado = estadoProximaCita(paciente.proxima_cita);

  return (
    <>
      <tr style={{ cursor: "pointer" }} onClick={() => setAbierto((v) => !v)}>
        <td>{paciente.nombre}</td>
        <td>{paciente.telefono}</td>
        <td>{paciente.historial_pacientes.length}</td>
        <td>
          <span className={`badge ${estado.clase}`}>{estado.etiqueta}</span>
        </td>
        <td>
          <button className="link-btn" type="button">
            {abierto ? "Cerrar" : "Ver"}
          </button>
        </td>
      </tr>
      {abierto && (
        <tr>
          <td colSpan={5} style={{ background: "var(--bg-soft)" }}>
            <div style={{ padding: "16px 4px", display: "flex", flexDirection: "column", gap: 20 }}>
              <FormularioDatos
                paciente={paciente}
                onGuardado={(cambios) => setPaciente((p) => ({ ...p, ...cambios }))}
              />

              <div>
                <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>Historial de tratamientos</h3>
                {paciente.historial_pacientes.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Todavia no hay registros.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Procedimiento</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paciente.historial_pacientes
                        .slice()
                        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
                        .map((h) => (
                          <tr key={h.id}>
                            <td>{h.fecha}</td>
                            <td>{h.procedimiento}</td>
                            <td>{h.notas || "-"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                <FormularioHistorial
                  pacienteId={paciente.id}
                  onAgregado={(fila) =>
                    setPaciente((p) => ({ ...p, historial_pacientes: [...p.historial_pacientes, fila] }))
                  }
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function PanelPacientes({ pacientesIniciales }: { pacientesIniciales: PacienteFila[] }) {
  return (
    <section className="admin-section">
      <h2 style={{ fontSize: "1.05rem" }}>Pacientes ({pacientesIniciales.length})</h2>
      <p className="section-sub" style={{ marginTop: 4 }}>
        Se crean solos cuando alguien pide cita desde el sitio. Haz clic en un paciente para ver y
        completar su historial.
      </p>
      <table className="admin-table" style={{ marginTop: 14 }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Visitas</th>
            <th>Proxima cita</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pacientesIniciales.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: "var(--muted)" }}>
                Todavia no hay pacientes registrados.
              </td>
            </tr>
          )}
          {pacientesIniciales.map((p) => (
            <FilaPaciente key={p.id} paciente={p} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
