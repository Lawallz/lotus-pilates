/**
 * Card com brilho radial que segue o cursor (efeito definido em .spotlight no index.css).
 * No toque (sem hover) o efeito não aparece, mantendo o card limpo no celular.
 */
export default function SpotlightCard({ as: Tag = 'div', className = '', children, ...props }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Tag onPointerMove={onMove} className={`spotlight ${className}`} {...props}>
      {children}
    </Tag>
  )
}
