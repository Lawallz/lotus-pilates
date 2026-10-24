import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import { testimonials } from '../data/site.js'
import SpotlightCard from './ui/SpotlightCard.jsx'

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 text-gold-500" role="img" aria-label={`${count} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < count ? 'fill-current' : 'text-sage-200'}`} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const scroller = useRef(null)

  const scrollBy = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * (el.firstElementChild?.clientWidth ?? 320) + dir * 16, behavior: 'smooth' })
  }

  return (
    <section id="depoimentos" className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem vive o Pilates, recomenda"
          subtitle="Histórias de alunos que transformaram a relação com o próprio corpo."
        />

        <Reveal className="mt-12">
          {/* Carrossel com scroll-snap: deslizar no celular, setas no desktop */}
          <div
            ref={scroller}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 pt-3 sm:mx-0 sm:px-3 no-scrollbar"
          >
            {testimonials.map((t) => (
              <SpotlightCard
                as="figure"
                key={t.name}
                className="flex w-[85%] shrink-0 snap-center flex-col rounded-3xl bg-white p-7 shadow-card ring-1 ring-sage-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-[26rem] sm:snap-start"
              >
                <Quote className="h-8 w-8 text-sage-200" aria-hidden="true" />
                <blockquote className="mt-3 flex-1 text-base leading-relaxed text-ink/80">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-sage-100 font-display text-xl font-semibold text-navy-700">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">{t.name}</span>
                    <span className="block text-xs text-ink/55">{t.role}</span>
                  </span>
                  <span className="ml-auto">
                    <Stars count={t.rating} />
                  </span>
                </figcaption>
              </SpotlightCard>
            ))}
          </div>

          <div className="mt-2 hidden justify-center gap-3 sm:flex">
            {[
              { dir: -1, Icon: ChevronLeft, label: 'Depoimento anterior' },
              { dir: 1, Icon: ChevronRight, label: 'Próximo depoimento' },
            ].map(({ dir, Icon, label }) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                aria-label={label}
                className="grid h-12 w-12 place-items-center rounded-full bg-white text-navy-700 ring-1 ring-sage-200 transition-colors hover:bg-sage-100 active:bg-sage-200"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
