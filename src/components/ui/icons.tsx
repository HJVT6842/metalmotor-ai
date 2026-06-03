import type { SVGProps } from "react";

import type { ServiceIcon } from "@/types";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/** Maps a ServiceIcon key to a decorative line icon. */
export function ServiceGlyph({ name, ...props }: IconProps & { name: ServiceIcon }) {
  switch (name) {
    case "laser":
      return (
        <svg {...base(props)}>
          <path d="M12 2v6M12 8l-3 9h6l-3-9z" />
          <path d="M5 21h14" />
        </svg>
      );
    case "panel":
      return (
        <svg {...base(props)}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8" cy="8" r="1.2" />
          <circle cx="16" cy="8" r="1.2" />
          <circle cx="8" cy="16" r="1.2" />
          <circle cx="16" cy="16" r="1.2" />
          <circle cx="12" cy="12" r="1.2" />
        </svg>
      );
    case "lattice":
      return (
        <svg {...base(props)}>
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      );
    case "fold":
      return (
        <svg {...base(props)}>
          <path d="M3 20h7l11-11-3-3L7 14v6z" />
          <path d="M14 6l4 4" />
        </svg>
      );
    case "weld":
      return (
        <svg {...base(props)}>
          <path d="M4 7l8 4 8-4M4 7v10l8 4 8-4V7M12 11v10" />
        </svg>
      );
    case "cad":
      return (
        <svg {...base(props)}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 9v12M3 15h6" />
        </svg>
      );
    default:
      return null;
  }
}
