import { Icono } from "@/components/Iconos";

export function HeroPrincipal({
  className = "hero wrap",
  conAncla = true,
}: {
  className?: string;
  conAncla?: boolean;
}) {
  return (
    <section className={className} id={conAncla ? "inicio" : undefined}>
      <div className="hero-text">
        <p className="eyebrow">Bienvenida a Dental Lab</p>
        <h1>
          Dra. <span className="clinic-name">Astrid Carolina Vergara</span>
        </h1>
        <p className="tagline">
          Cuidamos tu sonrisa con calidez y precision, en cada etapa de tu vida. En{" "}
          <strong>Dental Lab</strong> encuentras atencion dental cercana, clara y
          pensada para ti.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href="#contacto">
            <Icono id="ic-calendar" />
            Agendar una cita
          </a>
          <a className="btn-secondary" href="#procedimientos">
            Ver procedimientos
          </a>
        </div>
      </div>
      <div className="hero-photo">
        <img src="/doctora.jpg" alt="Dra. Astrid Carolina Vergara" />
      </div>
    </section>
  );
}
