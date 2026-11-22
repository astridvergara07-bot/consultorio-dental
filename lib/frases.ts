const FRASES_MOTIVACIONALES = [
  "Cada sonrisa que arreglas hoy es una historia que cambias.",
  "Eres la razon por la que mucha gente ya no le tiene miedo al dentista.",
  "Tu trabajo se nota en cada paciente que sale sonriendo de verdad.",
  "Lo que haces con tus manos, lo haces primero con paciencia y carino.",
  "No cualquiera convierte un consultorio en un lugar seguro. Tu si.",
  "Detras de cada tratamiento hay horas de estudio que hoy dan fruto.",
  "Eres exactamente la profesional que tus pacientes necesitan.",
  "Un buen dia empieza con la misma disciplina de siempre. Esa es tu marca.",
  "Lo dificil ya lo lograste: llegar hasta aqui. Lo de hoy, lo haces con los ojos cerrados.",
  "Tu calma es la que mas tranquiliza a quien esta en la silla.",
  "Hay personas que curan dientes. Tu curas el miedo a ir al dentista.",
  "Cada diagnostico certero es anos de esfuerzo hablando por ti.",
  "No se trata solo de dientes derechos, se trata de confianza que construyes.",
  "Hoy, como siempre, vas a hacer bien las cosas.",
  "Eres de las que se nota que disfruta lo que hace. Eso no se finge.",
  "Un dia mas cuidando sonrisas es un dia mas dejando huella.",
  "Tu paciencia explicando cada procedimiento vale tanto como tu tecnica.",
  "Lo que para otros es rutina, para ti es vocacion.",
  "Sigue asi, que se nota el cuidado en cada detalle.",
  "Cada paciente que vuelve es la prueba de que haces las cosas bien.",
];

export function fraseDelDia(): string {
  const hoy = new Date();
  const inicioDeAno = new Date(hoy.getFullYear(), 0, 0);
  const diaDelAno = Math.floor((hoy.getTime() - inicioDeAno.getTime()) / 86400000);
  return FRASES_MOTIVACIONALES[diaDelAno % FRASES_MOTIVACIONALES.length];
}
