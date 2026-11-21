import { crearClienteServidor } from "@/lib/supabase/server";
import { PanelAdmin } from "@/components/admin/PanelAdmin";

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

  return (
    <PanelAdmin
      citasIniciales={citas ?? []}
      testimoniosIniciales={testimonios ?? []}
      configuracionInicial={configMap}
    />
  );
}
