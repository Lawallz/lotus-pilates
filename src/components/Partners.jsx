import { CheckCircle2, MessageCircle } from 'lucide-react'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'
import Button from './ui/Button.jsx'
import { partners, whatsappLink } from '../data/site.js'
import SpotlightCard from './ui/SpotlightCard.jsx'

// Os nomes são exibidos em texto. Para usar os logotipos oficiais, adicione o arquivo em
// /public/partners e informe `logo: '/partners/wellhub.svg'` em data/site.js (respeitando
// as diretrizes de marca de cada parceiro).
export default function Partners() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-800 px-6 py-14 text-center sm:px-14 sm:py-20">
          <div aria-hidden="true" className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-navy-600/40 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />

          <div className="relative">
            <SectionHeading
              light
              eyebrow="Parcerias"
              title="Seu benefício já vale aqui"
              subtitle="Aceitamos os principais aplicativos de bem-estar. Use o seu plano e comece hoje, sem burocracia."
            />

            <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
              {partners.map((p, i) => (
                <Reveal as="li" key={p.name} delay={i * 0.1}>
                  <SpotlightCard className="group flex h-full flex-col items-center gap-3 rounded-3xl bg-cream px-6 py-8 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-glow-sand">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="h-8 object-contain" />
                    ) : (
                      <span className="font-display text-3xl font-bold tracking-tight text-navy-800">{p.name}</span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Aceito · {p.note}
                    </span>
                  </SpotlightCard>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.3} className="mt-10 flex justify-center">
              <Button
                href={whatsappLink()}
                variant="light"
                size="lg"
                icon={MessageCircle}
              >
                Agendar com meu app
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
