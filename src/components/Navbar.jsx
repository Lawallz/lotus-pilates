import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Button from './ui/Button.jsx'
import Logo from './ui/Logo.jsx'
import useActiveSection from '../hooks/useActiveSection.js'
import { navLinks, studio, whatsappLink } from '../data/site.js'

const sectionIds = navLinks.map((l) => l.href.slice(1))

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sectionIds)

  // Barra de progresso de leitura
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Trava o scroll do body com o menu aberto e fecha com Esc
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-navy-700 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open ? 'bg-cream/90 shadow-card backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="container-page flex h-16 items-center justify-between sm:h-20" aria-label="Principal">
          <a href="#topo" className="flex items-center" onClick={close} aria-label={`${studio.name} — início`}>
            <Logo />
          </a>

          {/* Desktop */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.href.slice(1)
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-sage-100 hover:text-navy-800 active:bg-sage-200 ${
                      isActive ? 'text-navy-800' : 'text-ink/70'
                    }`}
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-sage-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button href={whatsappLink()} size="md" className="hidden sm:inline-flex">
              Aula experimental
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full text-navy-800 transition-colors hover:bg-sage-100 active:bg-sage-200 lg:hidden"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Progresso de leitura */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="h-[3px] origin-left bg-gradient-to-r from-sage-400 to-gold-400"
        />

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'calc(100dvh - 4rem)' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden lg:hidden"
            >
              <ul className="container-page flex flex-col gap-1 pt-4">
                {navLinks.map((l, i) => {
                  const isActive = active === l.href.slice(1)
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <a
                        href={l.href}
                        onClick={close}
                        aria-current={isActive ? 'true' : undefined}
                        className={`block rounded-2xl px-4 py-4 font-display text-3xl font-semibold transition-colors hover:bg-sage-100 active:bg-sage-200 ${
                          isActive ? 'bg-sage-100 text-navy-700' : 'text-navy-800'
                        }`}
                      >
                        {l.label}
                      </a>
                    </motion.li>
                  )
                })}
                <li className="px-4 pt-6">
                  <Button href={whatsappLink()} size="lg" className="w-full">
                    Agendar aula experimental
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
