import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import Icon from './ui/Icon.jsx'
import { steps } from '../data/site.js'

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Passo a passo"
          title="Começar é simples"
          subtitle="Do primeiro contato à sua rotina de Pilates em quatro passos, sem burocracia."
        />

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* linha conectora (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-sage-200 lg:block"
          />

          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="relative text-center">
              <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy-600 text-white shadow-soft ring-8 ring-cream">
                <Icon name={s.icon} className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-gold-300 text-xs font-bold text-navy-900">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-navy-900">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/70">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
