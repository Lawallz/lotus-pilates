import { studio } from '../../data/site.js'

/** Lótus em traço (inspirado no símbolo da marca). Substitua por SVG oficial do logo, se houver. */
export function LotusMark({ className = 'h-8 w-10' }) {
  return (
    <svg viewBox="0 0 64 44" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="lotus-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3DA9D" />
          <stop offset="0.5" stopColor="#DDAA3F" />
          <stop offset="1" stopColor="#A9741B" />
        </linearGradient>
      </defs>
      <g stroke="url(#lotus-gold)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M32 4C25 12 25 24 32 33 39 24 39 12 32 4Z" />
        <path d="M32 33C24 31 19 24 19 15 27 17 31 24 32 33Z" />
        <path d="M32 33C40 31 45 24 45 15 37 17 33 24 32 33Z" />
        <path d="M32 33C20 35 10 30 5 21 15 19 25 23 32 33Z" />
        <path d="M32 33C44 35 54 30 59 21 49 19 39 23 32 33Z" />
        <path d="M14 38C24 42 40 42 50 38" />
      </g>
    </svg>
  )
}

/**
 * Marca em texto: LOTUS (Cinzel, dourado) + "e Movimento Pilates" (script).
 * `tone="dark"` para fundos escuros (rodapé).
 */
export default function Logo({ tone = 'light', compact = false }) {
  const script = tone === 'dark' ? 'text-navy-200' : 'text-navy-600'
  const word = tone === 'dark' ? 'text-gold-300' : 'text-gold-600'
  return (
    <span className="flex items-center gap-2.5">
      <LotusMark className={compact ? 'h-6 w-8' : 'h-8 w-10'} />
      <span className="flex flex-col leading-none">
        <span className={`font-cinzel text-xl font-semibold tracking-[0.22em] ${word} sm:text-2xl`}>
          {studio.shortName.toUpperCase()}
        </span>
        <span className={`-mt-0.5 font-script text-base sm:text-lg ${script}`}>e Movimento Pilates</span>
      </span>
    </span>
  )
}
