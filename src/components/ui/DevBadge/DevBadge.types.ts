export interface DevBadgeProps {
  /** Nombre del dev — se muestra en "Powered by: {name}" y en el tooltip como "{name}'s Contact". */
  name: string;
  /** URL de LinkedIn — el badge navega acá al hacer click. */
  linkedinUrl: string;
  className?: string;
}