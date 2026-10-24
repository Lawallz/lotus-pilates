import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '../data/site.js'

/**
 * Barra fixa de conversão no mobile (aparece após rolar o hero).
 * No desktop vira um botão flutuante de WhatsApp.
 */
export default function MobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-100 bg-cream/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
          >
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-navy-600 py-3.5 text-base font-semibold text-white shadow-soft transition-colors hover:bg-navy-700 active:scale-[0.98] active:bg-navy-800"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Agendar aula experimental
            </a>
          </motion.div>

          <motion.a
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-navy-600 text-white shadow-soft transition-colors hover:bg-navy-700 lg:grid"
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </motion.a>
        </>
      )}
    </AnimatePresence>
  )
}
