import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { faqs, whatsappLink } from '../data/site.js'

function Item({ item, index, open, onToggle }) {
  const id = `faq-${index}`
  return (
    <div className="border-b border-sage-100 last:border-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          className="flex w-full items-center justify-between gap-4 rounded-xl py-5 text-left transition-colors hover:text-navy-600 active:text-navy-700"
        >
          <span className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">{item.q}</span>
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
              open ? 'rotate-45 bg-navy-600 text-white' : 'bg-sage-100 text-navy-700'
            }`}
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-base leading-relaxed text-ink/70">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="duvidas" className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Dúvidas frequentes"
          title="Ficou com alguma dúvida?"
          subtitle="Reunimos as perguntas mais comuns de quem está começando."
        />

        <Reveal className="mx-auto mt-12 max-w-3xl rounded-[2rem] bg-white px-6 shadow-card ring-1 ring-sage-100 sm:px-10">
          {faqs.map((item, i) => (
            <Item
              key={item.q}
              item={item}
              index={i}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-8 text-center">
          <p className="text-sm text-ink/60">Não encontrou o que procurava?</p>
          <Button
            href={whatsappLink()}
            variant="secondary"
            className="mt-3"
          >
            Perguntar no WhatsApp
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
