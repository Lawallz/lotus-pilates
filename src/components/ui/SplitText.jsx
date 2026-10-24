import { motion, useReducedMotion } from 'framer-motion'

/**
 * Revela o texto palavra por palavra (efeito de título editorial).
 * `children` deve ser uma string; use `highlight` para palavras em destaque (itálico + gradiente).
 */
export default function SplitText({ children, highlight = [], delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  const words = String(children).split(' ')

  return (
    <span className={className} aria-label={String(children)}>
      {words.map((w, i) => {
        const isHi = highlight.some((h) => w.toLowerCase().startsWith(h.toLowerCase()))
        return (
          <span key={`${w}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className={`inline-block ${isHi ? 'italic font-medium text-gradient' : ''}`}
              initial={reduce ? false : { y: '110%', rotate: 4, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
