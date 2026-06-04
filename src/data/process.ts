import type { ProcessStep } from "@/types";

/** The 6-step path from a customer's plan to a delivered part. */
export const PROCESS: readonly ProcessStep[] = [
  {
    step: 1,
    title: "Cliente envía plano",
    description: "Recibimos tu archivo CAD, boceto o idea por WhatsApp o correo.",
    icon: "cad",
  },
  {
    step: 2,
    title: "Diseño CAD",
    description: "Optimizamos el diseño para fabricación y validamos medidas.",
    icon: "cad",
  },
  {
    step: 3,
    title: "Corte CNC Láser",
    description: "Cortamos con láser de fibra para máxima precisión.",
    icon: "laser",
  },
  {
    step: 4,
    title: "Fabricación",
    description: "Plegamos, soldamos y ensamblamos las piezas.",
    icon: "fabrication",
  },
  {
    step: 5,
    title: "Control de calidad",
    description: "Inspeccionamos cada pieza contra plano y estándar.",
    icon: "parts",
  },
  {
    step: 6,
    title: "Entrega",
    description: "Coordinamos despacho o retiro de tu producto terminado.",
    icon: "industrial",
  },
] as const;
