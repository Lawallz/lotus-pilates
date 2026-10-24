import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import SpotlightCard from './ui/SpotlightCard.jsx'
import { planFrequencies, plans, whatsappLink } from '../data/site.js'

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })

function FrequencySwitch({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Frequência semanal"
      className="mx-auto mt-10 flex w-full max-w-lg rounded-full bg-white p-1.5 shadow-card ring-1 ring-sage-100"
    >
      {planFrequencies.map((f) => {
        const selected = f.id === value
        return (
          <button
            key={f.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(f.id)}
            className={`relative flex-1 rounded-full px-2 py-2.5 text-xs sm:px-5 sm:text-sm font-semibold transition-colors ${
              selected ? 'text-white' : 'text-navy-700 hover:bg-sage-50 active:bg-sage-100'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="freq-pill"
                className="absolute inset-0 rounded-full bg-navy-600"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 block">{f.name}<span className="mt-0.5 block text-xs font-normal">{f.label}</span></span>
          </button>
        )
      })}
    </div>
  )
}

function PlanCard({ plan, freq, baseline }) {
  // Valores mensais por frequência semanal.
  const price = plan.prices ? plan.prices[freq] ?? plan.prices.unico : null
  const saving = price != null && baseline != null ? baseline - price : 0
  const pop = plan.popular

  const card = (
    <SpotlightCard
      className={`relative flex h-full flex-col p-7 transition-all duration-300 sm:p-8 ${
        pop
          ? 'rounded-[calc(2rem-2px)] bg-navy-700 text-white lg:py-12'
          : 'rounded-[2rem] bg-white text-ink shadow-card ring-1 ring-sage-100 hover:-translate-y-1.5 hover:shadow-lift'
      }`}
    >
      {pop && (
        <span className="btn-shimmer absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-300 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy-900 shadow-glow-sand">
          <Crown className="h-3.5 w-3.5" aria-hidden="true" />
          {plan.badge || 'Mais popular'}
        </span>
      )}

      <h3 className={`text-3xl font-semibold ${pop ? 'text-white' : 'text-navy-900'}`}>{plan.name}</h3>
      <p className={`mt-1 text-sm ${pop ? 'text-sage-100' : 'text-ink/60'}`}>{plan.period}</p>

      {price != null ? (
        <p className="mt-6 flex items-baseline gap-1">
          <motion.span
            key={`${plan.id}-${freq}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.35 }}
            className="font-display text-4xl font-semibold"
          >
            {brl(price)}
          </motion.span>
          <span className={`text-sm ${pop ? 'text-sage-100' : 'text-ink/60'}`}>/mês</span>
        </p>
      ) : (
        <div className="mt-6">
          <p className="font-display text-4xl font-semibold">Sob consulta</p>
          <p className={`mt-1 text-sm ${pop ? 'text-sage-100' : 'text-ink/60'}`}>Receba os valores pelo WhatsApp</p>
        </div>
      )}

      {/* Economia em relação ao plano mensal (calculada a partir dos preços) */}
      <p className={price != null ? 'mt-2 h-7' : 'mt-2'}>
        {saving > 0 && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              pop ? 'bg-white/15 text-sand-200' : 'bg-sage-100 text-navy-700'
            }`}
          >
            Economize {brl(saving)}/mês
          </span>
        )}
      </p>

      <ul className="mt-4 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                pop ? 'bg-gold-300/25 text-sand-200' : 'bg-sage-100 text-navy-600'
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            </span>
            <span className={pop ? 'text-sage-50' : 'text-ink/75'}>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        href={whatsappLink()}
        variant={pop ? 'light' : 'primary'}
        size="lg"
        className="mt-8 w-full"
        shimmer={pop}
      >
        {price != null ? `Escolher ${plan.name}` : 'Consultar valores'}
      </Button>
    </SpotlightCard>
  )

  // O plano em destaque ganha uma borda em gradiente giratório + leve elevação
  return pop ? <div className="gradient-border h-full rounded-[2rem] lg:-my-4">{card}</div> : card
}

export default function Pricing() {
  const [freq, setFreq] = useState(planFrequencies[0].id)
  const hasPrices = plans.some((p) => p.prices)
  // Exibe as frequências disponíveis nos planos.
  const hasFrequency = plans.some((p) => p.prices && p.prices['2x'] != null)

  return (
    <section id="planos" className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha o ritmo ideal para você"
          subtitle="Cuidar, Fortalecer ou Renovar: escolha sua frequência e compare os valores mensais de cada plano."
        />
        {hasFrequency && (
          <Reveal>
            <FrequencySwitch value={freq} onChange={setFreq} />
          </Reveal>
        )}

        <div className="mx-auto mt-14 grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-4 xl:items-center">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.1} className="h-full">
              <PlanCard plan={plan} freq={freq} baseline={plans[0].prices ? plans[0].prices[freq] ?? plans[0].prices.unico : null} />
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-ink/60">
          {hasPrices
            ? 'Consulte condições e horários disponíveis diretamente com a nossa equipe.'
            : 'Já usa Wellhub, TotalPass ou ClassPass? Aceitamos os três. É só nos avisar no agendamento.'}
        </p>
      </div>
    </section>
  )
}
