"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { fraseDelDia } from "@/lib/frases";

export interface CitaFila {
  id: string;
  creado_en: string;
  nombre: string;
  telefono: string;
  mensaje: string | null;
  atendida: boolean;
}

export interface TestimonioFila {
  id: string;
  nombre_paciente: string;
  comentario: string;
  aprobado: boolean;
}

export function PanelAdmin({
  citasIniciales,
  testimoniosIniciales,
  configuracionInicial,
  children,
}: {
  citasIniciales: CitaFila[];
  testimoniosIniciales: TestimonioFila[];
  configuracionInicial: Record<string, string>;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [citas, setCitas] = useState(citasIniciales);
  const [testimonios, setTestimonios] = useState(testimoniosIniciales);
  const [config, setConfig] = useState(configuracionInicial);
  const [guardandoConfig, setGuardandoConfig] = useState(false);
  const [mensajeConfig, setMensajeConfig] = useState<string | null>(null);

  async function cerrarSesion() {
    const supabase = crearClienteNavegador();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function marcarAtendida(id: string, atendida: boolean) {
    const supabase = crearClienteNavegador();
    await supabase.from("citas").update({ atendida }).eq("id", id);
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, atendida } : c)));
  }

  async function cambiarAprobado(id: string, aprobado: boolean) {
    const supabase = crearClienteNavegador();
    await supabase.from("testimonios").update({ aprobado }).eq("id", id);
    setTestimonios((prev) => prev.map((t) => (t.id === id ? { ...t, aprobado } : t)));
  }

  async function eliminarTestimonio(id: string) {
    const supabase = crearClienteNavegador();
    await supabase.from("testimonios").delete().eq("id", id);
    setTestimonios((prev) => prev.filter((t) => t.id !== id));
  }

  async function guardarConfig(e: React.FormEvent) {
    e.preventDefault();
    setGuardandoConfig(true);
    setMensajeConfig(null);
    const supabase = crearClienteNavegador();
    for (const [clave, valor] of Object.entries(config)) {
      await supabase.from("configuracion").update({ valor }).eq("clave", clave);
    }
    setGuardandoConfig(false);
    setMensajeConfig("Guardado. Los cambios ya se ven en la pagina principal.");
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="wrap admin-header-inner">
          <h1 style={{ fontSize: "1.2rem" }}>Panel del consultorio</h1>
          <button className="link-btn" onClick={cerrarSesion} type="button">
            Cerrar sesion
          </button>
        </div>
      </header>

      <div className="wrap" style={{ paddingBlock: 32 }}>
        <div className="frase-dia">
          <p>&ldquo;{fraseDelDia()}&rdquo;</p>
          <span>— Jorge Vergara, te quiero mucho</span>
        </div>

        <section className="admin-section">
          <h2 style={{ fontSize: "1.05rem" }}>Informacion de contacto y horario</h2>
          <p className="section-sub" style={{ marginTop: 4 }}>
            Esto se muestra en la pagina principal, en la sección de Contacto.
          </p>
          <form onSubmit={guardarConfig} style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14, maxWidth: 480 }}>
            <div className="form-field">
              <label htmlFor="cfg-direccion">Direccion</label>
              <input
                id="cfg-direccion"
                value={config.direccion ?? ""}
                onChange={(e) => setConfig((c) => ({ ...c, direccion: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label htmlFor="cfg-telefono">Telefono</label>
              <input
                id="cfg-telefono"
                value={config.telefono ?? ""}
                onChange={(e) => setConfig((c) => ({ ...c, telefono: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label htmlFor="cfg-whatsapp">Numero de WhatsApp (solo digitos, con codigo de pais)</label>
              <input
                id="cfg-whatsapp"
                value={config.whatsapp ?? ""}
                onChange={(e) => setConfig((c) => ({ ...c, whatsapp: e.target.value }))}
                placeholder="Ej: 573001234567"
              />
            </div>
            <div className="form-field">
              <label htmlFor="cfg-horario">Horario de atencion</label>
              <textarea
                id="cfg-horario"
                rows={2}
                value={config.horario ?? ""}
                onChange={(e) => setConfig((c) => ({ ...c, horario: e.target.value }))}
              />
            </div>
            {mensajeConfig && <p className="form-msg ok">{mensajeConfig}</p>}
            <button className="btn-primary" type="submit" disabled={guardandoConfig} style={{ alignSelf: "flex-start" }}>
              {guardandoConfig ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2 style={{ fontSize: "1.05rem" }}>Solicitudes de cita ({citas.length})</h2>
          <table className="admin-table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Mensaje</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {citas.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ color: "var(--muted)" }}>
                    Todavia no hay solicitudes de cita.
                  </td>
                </tr>
              )}
              {citas.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.creado_en).toLocaleString("es-CO")}</td>
                  <td>{c.nombre}</td>
                  <td>{c.telefono}</td>
                  <td>{c.mensaje || "-"}</td>
                  <td>
                    <span className={`badge ${c.atendida ? "ok" : "pendiente"}`}>
                      {c.atendida ? "Atendida" : "Pendiente"}
                    </span>
                  </td>
                  <td>
                    <button className="link-btn" onClick={() => marcarAtendida(c.id, !c.atendida)} type="button">
                      {c.atendida ? "Marcar pendiente" : "Marcar atendida"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-section">
          <h2 style={{ fontSize: "1.05rem" }}>Testimonios ({testimonios.length})</h2>
          <table className="admin-table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Comentario</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {testimonios.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ color: "var(--muted)" }}>
                    Todavia no hay testimonios.
                  </td>
                </tr>
              )}
              {testimonios.map((t) => (
                <tr key={t.id}>
                  <td>{t.nombre_paciente}</td>
                  <td>{t.comentario}</td>
                  <td>
                    <span className={`badge ${t.aprobado ? "ok" : "pendiente"}`}>
                      {t.aprobado ? "Publicado" : "Pendiente"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 10 }}>
                    <button className="link-btn" onClick={() => cambiarAprobado(t.id, !t.aprobado)} type="button">
                      {t.aprobado ? "Despublicar" : "Publicar"}
                    </button>
                    <button className="link-btn" onClick={() => eliminarTestimonio(t.id)} type="button" style={{ color: "var(--danger)" }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {children}
      </div>
    </div>
  );
}
