/* Emma OS v1.7.0 — Control Financiero Personal M1
   Archivo: finance-achievements.js
   Propósito: conservar IDs, nombres, condiciones y leyendas de los 12 logros estables. */

export const ACHIEVEMENT_DEFINITIONS = Object.freeze([
  { id:'primer_golpe', icon:'⚔', nombre:'Primer golpe al monstruo', condicion:'Registrar el primer pago confirmado.', leyenda:'La deuda no cayó, pero sintió el golpe. El héroe miró la barra de vida del enemigo y descubrió algo peligroso: sí se podía bajar.' },
  { id:'piedra_pequena', icon:'◆', nombre:'La piedra pequeña desaparece', condicion:'Completar por primera vez una deuda o compra.', leyenda:'No era la montaña completa, pero era una piedra en el zapato. Y, contra todo pronóstico administrativo, dejó de molestar.' },
  { id:'no_era_fase', icon:'↻', nombre:'No era una fase financiera', condicion:'Registrar pagos en 3 meses calendario distintos.', leyenda:'Lo que parecía un arranque de entusiasmo comenzó a mostrar síntomas preocupantes de convertirse en disciplina. La campaña sigue en pie.' },
  { id:'jefe_barra_vida', icon:'25', nombre:'El jefe tiene barra de vida', condicion:'Alcanzar el 25% de avance en deudas.', leyenda:'Antes parecía una sombra enorme sin forma. Ahora tiene porcentaje, saldo pendiente y una barra que baja. El miedo perdió su ventaja narrativa.' },
  { id:'mitad_dragon', icon:'50', nombre:'Mitad del dragón', condicion:'Alcanzar el 50% de avance en deudas.', leyenda:'El dragón sigue respirando, sí. Pero ya no se ve tan inmortal desde que le falta media barra de vida.' },
  { id:'puerta_se_abre', icon:'75', nombre:'La puerta se empieza a abrir', condicion:'Alcanzar el umbral que habilita inversiones.', leyenda:'No se cruzó todavía al reino de las inversiones, pero la puerta dejó de estar sellada. Alguien encontró la llave debajo de varios pagos constantes.' },
  { id:'deuda_derrotada', icon:'★', nombre:'Deuda derrotada', condicion:'Completar el 100% de las deudas activas.', leyenda:'Cayó. Después de cuotas, ajustes, meses raros y más paciencia de la presupuestada, el enemigo principal dejó de ocupar espacio en el mapa.' },
  { id:'compra_sin_culpa', icon:'✓', nombre:'Compra sin culpa', condicion:'Completar por primera vez una compra importante.', leyenda:'El objeto fue adquirido sin invocar demonios crediticios adicionales. Una pequeña victoria para el bolsillo y una gran noticia para la paz mental.' },
  { id:'modo_resistencia', icon:'盾', nombre:'Modo Resistencia financiero', condicion:'Registrar en un mes al menos un pago, aunque el total quede bajo el aporte base.', leyenda:'Hoy no se conquistó el reino. Pero tampoco fue entregado al enemigo. A veces sostener la campaña ya cuenta como hazaña.' },
  { id:'mes_no_te_gano', icon:'☑', nombre:'El mes no te ganó', condicion:'Registrar en un mes pagos por al menos el aporte mensual base.', leyenda:'El calendario presentó batalla, los gastos hicieron ruido y aun así el mes cerró con una marca verde. No fue magia: fue seguimiento.' },
  { id:'contraataque', icon:'↑', nombre:'Contraataque presupuestario', condicion:'Registrar en un mes al menos 150% del aporte mensual base.', leyenda:'El presupuesto encontró munición adicional y decidió no guardarla para decorar. El enemigo recibió daño crítico inesperado.' },
  { id:'otro_lado', icon:'◇', nombre:'Primer paso del otro lado', condicion:'Registrar el primer aporte a una inversión.', leyenda:'La ruta dejó de ser solo salir de deudas. Por primera vez, una parte del esfuerzo comenzó a construir algo que mira hacia adelante.' }
]);
