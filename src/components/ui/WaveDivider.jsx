/**
 * Onda decorativa no topo de uma seção. Use `text-<cor-da-seção-anterior>` no className;
 * a seção que a contém precisa ter `relative`.
 */
export default function WaveDivider({ className = 'text-cream' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 top-0 h-8 w-full sm:h-14 ${className}`}
    >
      <path
        fill="currentColor"
        d="M0 0h1440v20c-120 30-240 44-360 40S840 22 720 22 480 60 360 62 120 46 0 20z"
      />
    </svg>
  )
}
