import { crearClienteServidor } from "@/lib/supabase/server";
import { DefinicionesIconos, Icono } from "@/components/Iconos";
import { Nav } from "@/components/Nav";
import { HeroPrincipal } from "@/components/HeroPrincipal";
import { FormularioCita } from "@/components/FormularioCita";
import { FormularioTestimonio } from "@/components/FormularioTestimonio";

const PROCEDIMIENTOS = [
  {
    icono: "ic-tooth",
    titulo: "Limpieza dental",
    descripcion:
      "Se elimina la placa y el sarro que se acumulan en los dientes y encias, incluso en zonas dificiles de alcanzar con el cepillo en casa.",
    paraQuien: "Cualquier persona, de forma preventiva cada 6 meses.",
    duracion: "30 a 45 minutos aprox.",
    antesDespues: false,
  },
  {
    icono: "ic-star",
    titulo: "Blanqueamiento dental",
    descripcion:
      "Aclara el color natural de los dientes usando un gel especial, para una sonrisa mas clara y luminosa de forma segura.",
    paraQuien: "Dientes opacados por cafe, tabaco o el paso del tiempo.",
    duracion: "45 a 60 minutos, o varias sesiones cortas.",
    antesDespues: true,
  },
  {
    icono: "ic-tooth",
    titulo: "Resinas (calzas)",
    descripcion:
      "Un material del mismo color del diente repara caries pequenas o fracturas leves, devolviendo la forma y funcion del diente.",
    paraQuien: "Caries detectadas a tiempo o dientes con fracturas pequenas.",
    duracion: "30 a 60 minutos por diente.",
    antesDespues: true,
  },
  {
    icono: "ic-tooth",
    titulo: "Endodoncia (conducto)",
    descripcion:
      "Se limpia y desinfecta el interior del diente cuando el nervio esta infectado o muy danado, y luego se sella para salvar el diente sin extraerlo.",
    paraQuien: "Dolor intenso o infeccion por caries profunda o un golpe.",
    duracion: "1 a 2 citas de 60 a 90 minutos.",
    antesDespues: false,
  },
  {
    icono: "ic-tooth",
    titulo: "Extracciones",
    descripcion:
      "Se retira de forma segura y sin dolor un diente que ya no se puede conservar, cuidando siempre el bienestar del paciente.",
    paraQuien: "Dientes muy danados, con infeccion severa o muelas del juicio.",
    duracion: "20 a 40 minutos, mas en casos complejos.",
    antesDespues: false,
  },
  {
    icono: "ic-tooth",
    titulo: "Ortodoncia",
    descripcion:
      "Corrige la posicion de los dientes y la mordida con brackets fijos o alineadores transparentes removibles, segun lo que mejor se adapte a ti.",
    paraQuien: "Dientes chuecos, apinados o mordida desalineada; ninos, jovenes y adultos.",
    duracion: "Tratamiento de 12 a 24 meses, con controles periodicos.",
    antesDespues: true,
  },
  {
    icono: "ic-star",
    titulo: "Diseno de sonrisa",
    descripcion:
      "Un plan personalizado que combina distintos tratamientos para mejorar la forma, el color y la armonia general de tu sonrisa.",
    paraQuien: "Quien quiere mejorar la estetica general de su sonrisa.",
    duracion: "Varia segun los tratamientos incluidos en el plan.",
    antesDespues: true,
  },
  {
    icono: "ic-tooth",
    titulo: "Implantes dentales",
    descripcion:
      "Un pequeno tornillo de titanio se coloca en el hueso para reemplazar la raiz de un diente perdido, y luego se coloca una corona sobre el.",
    paraQuien: "Personas que perdieron uno o varios dientes.",
    duracion: "Proceso de varios meses (cirugia, cicatrizacion y corona).",
    antesDespues: false,
  },
  {
    icono: "ic-tooth",
    titulo: "Protesis y coronas",
    descripcion:
      "Las coronas cubren y protegen un diente debilitado; las protesis reemplazan uno o varios dientes perdidos, de forma fija o removible.",
    paraQuien: "Dientes muy desgastados o perdida de varios dientes.",
    duracion: "2 a 3 citas repartidas en algunas semanas.",
    antesDespues: false,
  },
  {
    icono: "ic-cap",
    titulo: "Odontopediatria",
    descripcion:
      "Atencion dental para ninos en un ambiente amigable, pensado para que se sientan comodos desde su primera visita.",
    paraQuien: "Ninos desde la primera infancia.",
    duracion: "30 a 45 minutos por cita.",
    antesDespues: false,
  },
];

export default async function Home() {
  const supabase = await crearClienteServidor();

  const { data: testimonios } = await supabase
    .from("testimonios")
    .select("id, nombre_paciente, comentario")
    .eq("aprobado", true)
    .order("creado_en", { ascending: false })
    .limit(9);

  const { data: config } = await supabase.from("configuracion").select("clave, valor");
  const cfg = new Map((config ?? []).map((c) => [c.clave, c.valor]));
  const direccion = cfg.get("direccion") || "[Calle, numero, barrio, ciudad]";
  const telefono = cfg.get("telefono") || "[+XX XXX XXX XXXX]";
  const horario = cfg.get("horario") || "[Horario de atencion]";
  const whatsapp = cfg.get("whatsapp") || "";
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola, quiero agendar una cita")}`
    : "https://wa.me/XXXXXXXXXXX?text=Hola%2C%20quiero%20agendar%20una%20cita";

  return (
    <>
      <DefinicionesIconos />
      <Nav />
      <main>
        <HeroPrincipal />

        <section className="soft" id="doctora">
          <div className="wrap">
            <p className="eyebrow">Sobre la doctora</p>
            <div className="doctor-grid">
              <div className="doctor-photo">
                <img src="/doctora.jpg" alt="Dra. Astrid Carolina Vergara" />
              </div>
              <div className="doctor-info">
                <h2>Dra. Astrid Carolina Vergara</h2>
                <p className="role">Ortodoncista</p>
                <p className="doctor-bio">
                  Egresada de la Universidad Santiago de Cali, la Dra. Astrid Carolina Vergara lleva
                  6 anos dedicada a la ortodoncia con un sello muy suyo: tratar a cada paciente como
                  si fuera el unico del dia. Le encanta explicar cada paso del tratamiento en
                  palabras sencillas, para que salgas de tu cita con una sonrisa mas segura y ninguna
                  duda en el camino.
                </p>
                <div className="fact-row">
                  <div className="fact">
                    <div className="num">Santiago de Cali</div>
                    <div className="label">Universidad</div>
                  </div>
                  <div className="fact">
                    <div className="num">6</div>
                    <div className="label">Anos de experiencia</div>
                  </div>
                  <div className="fact">
                    <div className="num">Ortodoncia</div>
                    <div className="label">Area de enfoque</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="procedimientos">
          <div className="wrap">
            <p className="eyebrow">Procedimientos</p>
            <h2 className="section-title">Lo que hacemos por tu sonrisa</h2>
            <p className="section-sub">
              Cada tratamiento, explicado en palabras sencillas para que sepas que esperar antes de
              tu cita.
            </p>
            <div className="proc-grid">
              {PROCEDIMIENTOS.map((p) => (
                <article className="proc-card" key={p.titulo}>
                  <div className="proc-head">
                    <div className="proc-icon">
                      <Icono id={p.icono} />
                    </div>
                    <h3>{p.titulo}</h3>
                  </div>
                  <p className="proc-desc">{p.descripcion}</p>
                  <div className="img-slot">
                    <Icono id="ic-camera" />
                    Foto del procedimiento
                  </div>
                  {p.antesDespues && (
                    <div className="ba-row">
                      <div className="ba-slot">
                        <Icono id="ic-camera" />
                        Antes
                      </div>
                      <div className="ba-slot">
                        <Icono id="ic-camera" />
                        Despues
                      </div>
                    </div>
                  )}
                  <div className="proc-meta">
                    <div className="row">
                      <span className="k">Para quien:</span>
                      <span className="v">{p.paraQuien}</span>
                    </div>
                    <div className="row">
                      <span className="k">Duracion:</span>
                      <span className="v">{p.duracion}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="soft" id="testimonios">
          <div className="wrap">
            <p className="eyebrow">Testimonios</p>
            <h2 className="section-title">Lo que dicen nuestros pacientes</h2>
            <p className="section-sub">Comentarios reales de pacientes que ya visitaron el consultorio.</p>
            <div className="testi-grid">
              {testimonios && testimonios.length > 0 ? (
                testimonios.map((t) => (
                  <div className="testi-card" key={t.id}>
                    <Icono id="ic-star" className="proc-icon" />
                    <p className="quote">&ldquo;{t.comentario}&rdquo;</p>
                    <p className="autor">{t.nombre_paciente}</p>
                  </div>
                ))
              ) : (
                <div className="testi-empty">
                  <Icono id="ic-star" />
                  Todavia no hay testimonios publicados. Los que dejen los pacientes aparecen aqui
                  despues de ser revisados.
                </div>
              )}
            </div>
            <FormularioTestimonio />
          </div>
        </section>

        <section id="contacto">
          <div className="wrap">
            <p className="eyebrow">Contacto</p>
            <h2 className="section-title">Visitanos o escribenos</h2>
            <div className="contact-grid">
              <div className="contact-list">
                <div className="contact-item">
                  <div className="ic">
                    <Icono id="ic-pin" />
                  </div>
                  <div>
                    <div className="t">Direccion</div>
                    <div className="d">{direccion}</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ic">
                    <Icono id="ic-phone" />
                  </div>
                  <div>
                    <div className="t">Telefono</div>
                    <div className="d">{telefono}</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ic">
                    <Icono id="ic-clock" />
                  </div>
                  <div>
                    <div className="t">Horario de atencion</div>
                    <div className="d">{horario}</div>
                  </div>
                </div>
              </div>
              <div className="map-slot">
                <Icono id="ic-pin" />
                <div>Mapa de ubicacion</div>
                <a
                  className="map-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
                  target="_blank"
                  rel="noopener"
                >
                  Ver en Google Maps
                </a>
              </div>
            </div>

            <FormularioCita />

            <div className="whatsapp-box">
              <div>
                <div className="t">Prefieres escribirnos directo?</div>
                <div className="d">Agenda tu cita por WhatsApp en minutos.</div>
              </div>
              <a className="btn-primary" href={whatsappHref} target="_blank" rel="noopener">
                <Icono id="ic-whatsapp" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>Dental Lab - Dra. Astrid Carolina Vergara, Ortodoncista.</footer>
    </>
  );
}
