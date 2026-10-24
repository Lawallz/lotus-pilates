import { Sparkle } from 'lucide-react'
import AnimatedNumber from './ui/AnimatedNumber.jsx'
import Reveal from './ui/Reveal.jsx'
import { benefits, stats } from '../data/site.js'

/** Faixa de benefícios em movimento contínuo + números de prova social. */
export default function BenefitsStrip() {
  // Duplica a lista para o loop ficar contínuo (translateX -50%)
  const items = [...benefits, ...benefits]

  return (
    <section aria-label="Benefícios do Pilates" className="border-y border-sage-100 bg-white">
      <div className="group relative overflow-hidden py-5">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <ul className="flex w-max animate-marquee gap-10 pr-10 group-hover:[animation-play-state:paused]">
          {items.map((b, i) => (
            <li
              key={`${b}-${i}`}
              aria-hidden={i >= benefits.length ? 'true' : undefined}
              className="flex items-center gap-10 whitespace-nowrap font-display text-xl font-medium text-navy-700"
            >
              {b}
              <Sparkle className="h-4 w-4 text-gold-400" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>

      {stats.length > 0 && (
      <div className="container-page pb-12 pt-8">
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-8 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-ink/60">{s.label}</dt>
                <dd className="font-display text-5xl font-semibold text-navy-800 sm:text-6xl">
                  <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      )}
    </section>
  )
}
