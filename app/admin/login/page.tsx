"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase/client";
import { Icono, DefinicionesIconos } from "@/components/Iconos";

export default function LoginAdmin() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    const supabase = crearClienteNavegador();
    const { error: errorLogin } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave,
    });

    setCargando(false);
    if (errorLogin) {
      setError("Correo o contrasena incorrectos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-login-wrap">
      <DefinicionesIconos />
      <form className="admin-card" onSubmit={entrar}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icono id="ic-tooth" className="hero-icon" />
          <h2 style={{ fontSize: "1.2rem" }}>Panel del consultorio</h2>
        </div>
        <div className="form-field">
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="clave">Contrasena</label>
          <input
            id="clave"
            type="password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
        </div>
        {error && <p className="form-msg error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={cargando}>
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
