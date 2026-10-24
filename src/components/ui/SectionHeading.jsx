import Reveal from './Reveal.jsx'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', light = false }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left'
  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      {eyebrow && <p className={`eyebrow ${light ? '!text-gold-300' : ''}`}>{eyebrow}</p>}
      <h2
        className={`mt-3 text-4xl font-semibold leading-tight sm:text-5xl ${light ? 'text-white' : 'text-navy-900'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-sage-100' : 'text-ink/70'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
