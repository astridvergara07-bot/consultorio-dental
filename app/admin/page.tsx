import { crearClienteServidor } from "@/lib/supabase/server";
import { PanelAdmin } from "@/components/admin/PanelAdmin";
import { PanelPacientes } from "@/components/admin/PanelPacientes";

export default async function AdminHome() {
  const supabase = await crearClienteServidor();

  const { data: citas } = await supabase
    .from("citas")
    .select("id, creado_en, nombre, telefono, mensaje, atendida")
    .order("creado_en", { ascending: false });

  const { data: testimonios } = await supabase
    .from("testimonios")
    .select("id, nombre_paciente, comentario, aprobado")
    .order("creado_en", { ascending: false });

  const { data: configuracion } = await supabase.from("configuracion").select("clave, valor");
  const configMap = Object.fromEntries((configuracion ?? []).map((c) => [c.clave, c.valor]));

  const { data: pacientes } = await supabase
    .from("pacientes")
    .select(
      "id, nombre, telefono, correo, fecha_nacimiento, notas_generales, proxima_cita, historial_pacientes(id, fecha, procedimiento, notas)"
    )
    .order("proxima_cita", { ascending: true, nullsFirst: false })
    .order("fecha", { ascending: false, referencedTable: "historial_pacientes" });

  return (
    <PanelAdmin
      citasIniciales={citas ?? []}
      testimoniosIniciales={testimonios ?? []}
      configuracionInicial={configMap}
    >
      <PanelPacientes pacientesIniciales={pacientes ?? []} />
    </PanelAdmin>
  );
}
