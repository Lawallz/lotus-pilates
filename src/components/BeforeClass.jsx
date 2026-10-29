import { Check, Clock, Droplets, Shirt, ShieldCheck } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import { location, whatsappLink } from '../data/site.js'

const items = [
  { icon: Check, title: 'Agendamento obrigatório', text: 'Reserve seu horário pelo WhatsApp antes de realizar o check-in.' },
  { icon: Shirt, title: 'Roupas e meias', text: 'Use roupas leves e confortáveis e meias antiderrapantes próprias para Pilates.' },
  { icon: Clock, title: 'Chegue com antecedência', text: 'Recomendamos chegar de 10 a 15 minutos antes do horário agendado.' },
  { icon: Droplets, title: 'Hidratação', text: 'Há água filtrada disponível no estúdio durante sua permanência.' },
  { icon: ShieldCheck, title: 'Conte à equipe sobre sua saúde', text: 'Avise antes da aula se estiver em tratamento, gestante, com lesão, restrição física ou usando medicação contínua.' },
]

export default function BeforeClass() {
  return (
    <section id="orientacoes" className="section-pad">
      <div className="container-page">
        <SectionHeading eyebrow="Antes do check-in" title="O que você precisa saber antes da aula?" subtitle="Algumas orientações simples ajudam a tornar sua experiência mais segura, confortável e tranquila." />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.04} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-sage-100">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-100 text-navy-700"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="mt-4 font-display text-xl font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12} className="mx-auto mt-6 max-w-5xl rounded-3xl bg-sand-50 p-6 text-sm leading-relaxed text-ink/70 ring-1 ring-sage-100">
          <p className="font-semibold text-navy-900">Nosso compromisso</p>
          <p className="mt-2">Na Lotus e Movimento Pilates, cada aula é preparada de forma personalizada, respeitando sua individualidade e buscando oferecer uma experiência acolhedora, segura e cuidadosa.</p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-full bg-navy-600 px-5 py-3 font-semibold text-white hover:bg-navy-700">Agendar pelo WhatsApp</a>
        </Reveal>
        <p className="sr-only">{location.rules.join(' ')}</p>
      </div>
    </section>
  )
}
