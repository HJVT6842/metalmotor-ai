export type FabricationGroup = {
  readonly title: string;
  readonly items: readonly string[];
};

/** "Qué fabricamos" — concrete items grouped by use case. */
export const FABRICATION_GROUPS: readonly FabricationGroup[] = [
  {
    title: "Arquitectura y decoración",
    items: [
      "Celosías metálicas",
      "Paneles decorativos",
      "Revestimientos de fachada",
      "Separadores y biombos",
    ],
  },
  {
    title: "Cierres y seguridad",
    items: [
      "Portones",
      "Rejas modernas",
      "Barandas y pasamanos",
      "Protecciones metálicas",
    ],
  },
  {
    title: "Estructuras",
    items: [
      "Estructuras metálicas",
      "Escaleras",
      "Pérgolas y quinchos",
      "Soportes y bastidores",
    ],
  },
  {
    title: "Piezas y producción",
    items: [
      "Piezas de precisión CNC",
      "Repuestos a medida",
      "Fabricación en serie",
      "Prototipos",
    ],
  },
] as const;
