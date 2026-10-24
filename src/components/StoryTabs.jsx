import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import Icon from './ui/Icon.jsx'
import { logo, storyTabs } from '../data/site.js'
import WaveDivider from './ui/WaveDivider.jsx'

export default function StoryTabs() {
  const [activeId, setActiveId] = useState(storyTabs[0].id)
  const active = storyTabs.find((t) => t.id === activeId)

  // Navegação por teclado (setas) conforme padrão WAI-ARIA de tabs
  const onKeyDown = (e) => {
    const i = storyTabs.findIndex((t) => t.id === activeId)
    if (e.key === 'ArrowRight') setActiveId(storyTabs[(i + 1) % storyTabs.length].id)
    if (e.key === 'ArrowLeft') setActiveId(storyTabs[(i - 1 + storyTabs.length) % storyTabs.length].id)
  }

  return (
    <section id="historia" className="section-pad relative bg-sand-50">
      <WaveDivider className="text-cream" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Quem somos"
          title="Missão, valores e objetivos"
          subtitle="Conheça o propósito que move o estúdio e os valores que guiam cada aula."
        />

        <Reveal className="mx-auto mt-12 max-w-4xl">
          {/* Abas: rolagem horizontal no mobile */}
          <div
            role="tablist"
            aria-label="Quem somos"
            onKeyDown={onKeyDown}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:justify-center sm:px-0 no-scrollbar"
          >
            {storyTabs.map((t) => {
              const selected = t.id === activeId
              return (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`tabpanel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(t.id)}
                  className={`relative shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-200 ${
                    selected ? 'text-white' : 'bg-white text-navy-700 ring-1 ring-sage-200 hover:bg-sage-100 active:bg-sage-200'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="story-pill"
                      className="absolute inset-0 rounded-full bg-navy-600 shadow-soft"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`tabpanel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
            className="mt-6 min-h-[18rem] rounded-[2rem] bg-white p-7 shadow-card sm:p-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className={active.showLogo ? 'grid items-center gap-8 md:grid-cols-5' : ''}>
                  <div className={active.showLogo ? 'md:col-span-3' : ''}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-100 text-navy-700">
                  <Icon name={active.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-3xl font-semibold text-navy-900 sm:text-4xl">{active.title}</h3>

                {active.body && (
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/75 sm:text-lg">
                    {active.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                  </div>

                  {active.showLogo && (
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      loading="lazy"
                      className="mx-auto w-56 rounded-3xl shadow-lift ring-1 ring-gold-200 md:col-span-2 md:w-full"
                    />
                  )}
                </div>

                {active.values && (
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {active.values.map((v) => (
                      <li key={v.name} className="rounded-2xl bg-sand-50 p-4">
                        <p className="font-display text-xl font-semibold text-navy-800">{v.name}</p>
                        <p className="mt-1 text-sm text-ink/70">{v.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
