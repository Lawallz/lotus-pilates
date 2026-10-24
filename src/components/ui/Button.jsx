import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const variants = {
  primary:
    'bg-navy-600 text-white shadow-soft hover:bg-navy-700 hover:shadow-glow active:bg-navy-800',
  secondary:
    'bg-white text-navy-800 ring-1 ring-sage-200 hover:bg-sage-50 hover:ring-sage-300 hover:shadow-card active:bg-sage-100',
  ghost: 'text-navy-700 hover:bg-sage-100 active:bg-sage-200',
  light: 'bg-cream text-navy-800 hover:bg-white hover:shadow-glow-sand active:bg-sand-100',
}

const sizes = {
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
}

/**
 * Botão/link com feedback de hover, active e foco.
 * - `magnetic`: o botão é levemente "puxado" pelo cursor (só com mouse).
 * - `shimmer`: brilho que atravessa o botão periodicamente (use no CTA principal).
 * Se receber `href`, renderiza <a>; senão, <button>.
 */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  magnetic = false,
  shimmer = false,
  className = '',
  children,
  ...props
}) {
  const Tag = href ? motion.a : motion.button
  const external = href && /^https?:/.test(href)
  const reduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 })

  const onPointerMove = (e) => {
    if (!magnetic || reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
  }
  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Tag
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={magnetic ? { x: sx, y: sy } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,box-shadow,color] duration-300 ${
        shimmer ? 'btn-shimmer' : ''
      } ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {Icon && (
          <Icon
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </span>
    </Tag>
  )
}
