import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, X } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import { equipment, gallery } from '../data/site.js'
import WaveDivider from './ui/WaveDivider.jsx'

function GalleryImage({ item, onOpen }) {
  const [failed, setFailed] = useState(false)

  return (
    <motion.figure
      whileTap={{ scale: 0.98 }}
      className={`group relative min-h-[14rem] overflow-hidden rounded-3xl bg-sage-100 shadow-card transition-shadow duration-500 hover:shadow-lift ${item.span || ''}`}
    >
      {failed ? (
        <div className="grid h-full min-h-[14rem] place-items-center text-sage-400">
          <ImageOff className="h-8 w-8" aria-hidden="true" />
        </div>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      )}

      {/* Véu com brilho + legenda no hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 text-sm font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        {item.alt}
      </figcaption>
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-navy-800 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100"
      >
        <Maximize2 className="h-4 w-4" />
      </span>

      {/* Botão cobrindo o card: acessível por teclado e toque */}
      {!failed && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Ampliar foto: ${item.alt}`}
          className="absolute inset-0 rounded-3xl"
        />
      )}
    </motion.figure>
  )
}

function Lightbox({ index, onClose, onPrev, onNext }) {
  const item = gallery[index]
  const closeRef = useRef(null)
  const touchX = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onPrev, onNext])

  // Deslizar para os lados no celular
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) (dx > 0 ? onPrev : onNext)()
    touchX.current = null
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de fotos ampliada"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-900/90 p-4 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 active:bg-white/35"
      >
        <X className="h-6 w-6" />
      </button>

      {[
        { fn: onPrev, Icon: ChevronLeft, label: 'Foto anterior', pos: 'left-3 sm:left-8' },
        { fn: onNext, Icon: ChevronRight, label: 'Próxima foto', pos: 'right-3 sm:right-8' },
      ].map(({ fn, Icon, label, pos }) => (
        <button
          key={label}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            fn()
          }}
          aria-label={label}
          className={`absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 active:bg-white/35 ${pos}`}
        >
          <Icon className="h-6 w-6" />
        </button>
      ))}

      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="max-h-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={item.full || item.src}
            alt={item.alt}
            className="max-h-[78vh] w-auto max-w-full rounded-3xl object-contain shadow-lift"
          />
          <figcaption className="mt-4 text-center text-sm text-sage-100">
            {item.alt} · {index + 1}/{gallery.length}
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  )
}

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(() => setOpenIndex((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length)), [])
  const next = useCallback(() => setOpenIndex((i) => (i === null ? i : (i + 1) % gallery.length)), [])

  return (
    <section id="espaco" className="section-pad relative bg-sand-50">
      <WaveDivider className="text-cream" />
      <div className="container-page">
        <SectionHeading
          eyebrow="O espaço"
          title="Galeria de momentos"
          subtitle="Um ambiente pensado para você desacelerar: luz natural, equipamentos completos e muito acolhimento."
        />

        <Reveal className="mt-12">
          <div className="grid auto-rows-[14rem] grid-cols-1 gap-4 sm:auto-rows-[15rem] sm:grid-cols-4">
            {gallery.map((item, i) => (
              <GalleryImage key={item.src} item={item} onOpen={() => setOpenIndex(i)} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-600">
            Equipamentos
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {equipment.map((e) => (
              <li
                key={e}
                className="cursor-default rounded-full bg-white px-4 py-2 text-sm font-medium text-navy-800 shadow-card ring-1 ring-sage-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 hover:text-white hover:shadow-glow"
              >
                {e}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <AnimatePresence>
        {openIndex !== null && <Lightbox index={openIndex} onClose={close} onPrev={prev} onNext={next} />}
      </AnimatePresence>
    </section>
  )
}
