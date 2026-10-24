import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import Icon from './ui/Icon.jsx'
import { pilatesCards } from '../data/site.js'
import SpotlightCard from './ui/SpotlightCard.jsx'

function PilatesCard({ card, open, onToggle }) {
  const panelId = `panel-${card.id}`
  return (
    <SpotlightCard
      className={`rounded-3xl bg-white p-6 shadow-card ring-1 transition-all duration-300 sm:p-8 ${
        open ? 'ring-sage-300 shadow-soft' : 'ring-sage-100 hover:ring-sage-200 hover:shadow-soft'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 text-left"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-100 text-navy-700">
          <Icon name={card.icon} className="h-6 w-6" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-2xl font-semibold text-navy-900">{card.title}</span>
          <span className="mt-1 block text-sm text-ink/65">{card.summary}</span>
        </span>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-navy-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-5 text-sm leading-relaxed text-ink/75 sm:text-base">
              <p>{card.detail}</p>

              {card.principles && (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {card.principles.map((p) => (
                    <li key={p.name} className="rounded-2xl bg-sand-50 p-3">
                      <p className="font-semibold text-navy-800">{p.name}</p>
                      <p className="text-sm text-ink/65">{p.text}</p>
                    </li>
                  ))}
                </ul>
              )}

              {card.tags && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((t) => (
                    <li key={t} className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-navy-700">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SpotlightCard>
  )
}

export default function WhatIsPilates() {
  const [openId, setOpenId] = useState(pilatesCards[0].id)

  return (
    <section id="pilates" className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="O método"
          title="O que é o Pilates?"
          subtitle="Um método de condicionamento físico e mental que fortalece o corpo de dentro para fora, com movimentos precisos, controlados e conscientes."
        />

        <div className="mx-auto mt-14 grid max-w-3xl gap-4">
          {pilatesCards.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.08}>
              <PilatesCard
                card={card}
                open={openId === card.id}
                onToggle={() => setOpenId(openId === card.id ? null : card.id)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
