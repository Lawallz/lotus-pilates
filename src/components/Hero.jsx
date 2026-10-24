import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, CalendarCheck, Heart, Sparkles, Ticket } from 'lucide-react'
import Button from './ui/Button.jsx'
import SplitText from './ui/SplitText.jsx'
import Tilt from './ui/Tilt.jsx'
import { heroBadges, heroPhoto, studio, whatsappLink } from '../data/site.js'

export default function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  // Parallax sutil: a foto se move mais devagar que a página
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%'])
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%'])

  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="relative overflow-hidden bg-gradient-to-b from-sand-50 via-cream to-cream pt-28 sm:pt-36"
    >
      {/* Aurora: manchas de cor em movimento lento */}
      <motion.div style={{ y: blobY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-4 h-[28rem] w-[28rem] animate-aurora rounded-full bg-sage-300/40 blur-3xl" />
        <div className="absolute -left-32 top-1/2 h-96 w-96 animate-aurora-slow rounded-full bg-gold-300/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 animate-aurora rounded-full bg-clay-100/70 blur-3xl" />
      </motion.div>

      <div className="container-page relative grid items-center gap-14 pb-24 sm:pb-32 lg:grid-cols-2">
        <div>
          <motion.p
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-navy-700 shadow-card ring-1 ring-sage-100 backdrop-blur"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-sage-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
            </span>
            Estúdio de Pilates
          </motion.p>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] text-navy-900 sm:text-6xl lg:text-7xl">
            <SplitText highlight={['acolhe.', 'transforma.']} delay={0.15}>
              Cuidado que acolhe. Movimento que transforma.
            </SplitText>
          </h1>

          <motion.p {...fade(0.5)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            No {studio.name}, cada aula une força, respiração e consciência corporal para aliviar dores, melhorar
            a postura e devolver disposição à sua rotina, em um ambiente pensado para acolher você.
          </motion.p>

          <motion.div {...fade(0.65)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappLink()} size="lg" icon={ArrowRight} magnetic shimmer>
              Agendar Aula Experimental
            </Button>
            <Button href="#planos" variant="secondary" size="lg">
              Ver planos
            </Button>
          </motion.div>

          <motion.p {...fade(0.8)} className="mt-6 flex items-center gap-2 text-sm text-ink/60">
            <Heart className="h-4 w-4 text-clay-500" aria-hidden="true" />
            Aceitamos Wellhub, TotalPass e ClassPass
          </motion.p>
        </div>

        <motion.div {...fade(0.3)} className="relative mx-auto w-full max-w-md lg:max-w-none">
          {/* halo atrás da foto */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-sage-300/50 via-sand-200/40 to-transparent blur-2xl"
          />

          <Tilt max={6}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-sage-100 shadow-lift ring-1 ring-white/60">
              <motion.img
                src={heroPhoto.full}
                alt={heroPhoto.alt}
                style={{ y: imgY }}
                className="h-[115%] w-full object-cover object-[62%_50%]"
                loading="eager"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-white/10" />
            </div>

            {/* Selo: lema (vidro) */}
            <div className="absolute -left-3 top-10 max-w-[11rem] animate-float rounded-2xl bg-white/80 p-4 shadow-lift ring-1 ring-white/70 backdrop-blur-md sm:-left-8">
              <Sparkles className="h-5 w-5 text-gold-500 drop-shadow-[0_0_6px_rgba(221,170,63,0.8)]" aria-hidden="true" />
              <p className="mt-2 font-display text-xl font-semibold leading-tight text-navy-900">{heroBadges.top.title}</p>
              <p className="text-xs text-ink/60">{heroBadges.top.text}</p>
            </div>

            {/* Selo: aplicativos aceitos */}
            <div
              className="absolute -right-2 bottom-24 animate-float rounded-2xl bg-navy-700/95 p-4 text-white shadow-glow backdrop-blur sm:-right-6"
              style={{ animationDelay: '1.5s' }}
            >
              <Ticket className="h-5 w-5 text-gold-300" aria-hidden="true" />
              <p className="mt-2 font-display text-xl font-semibold leading-tight">{heroBadges.side.title}</p>
              <p className="text-xs text-navy-100">{heroBadges.side.text}</p>
            </div>

            {/* Selo: aula experimental */}
            <div
              className="absolute -bottom-5 left-6 flex animate-float items-center gap-3 rounded-full bg-white/90 py-2.5 pl-2.5 pr-5 shadow-lift ring-1 ring-white/70 backdrop-blur-md"
              style={{ animationDelay: '3s' }}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-600 text-white">
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-navy-900">{heroBadges.chip}</span>
            </div>
          </Tilt>
        </motion.div>
      </div>

      {/* Indicador de rolagem */}
      <a
        href="#pilates"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold uppercase tracking-widest text-navy-600 transition-colors hover:text-navy-800 lg:flex"
      >
        Descubra
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}
