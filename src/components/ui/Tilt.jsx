import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

/**
 * Inclinação 3D suave conforme o mouse (só em dispositivos com mouse; desativada com reduced-motion).
 */
export default function Tilt({ children, max = 8, className = '' }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spx = useSpring(px, { stiffness: 150, damping: 18 })
  const spy = useSpring(py, { stiffness: 150, damping: 18 })
  const rotateY = useTransform(spx, [0, 1], [-max, max])
  const rotateX = useTransform(spy, [0, 1], [max, -max])

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div style={{ perspective: 1000 }} className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>{children}</motion.div>
    </div>
  )
}
