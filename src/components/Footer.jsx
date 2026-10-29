import { Instagram, MessageCircle } from 'lucide-react'
import Button from './ui/Button.jsx'
import Logo from './ui/Logo.jsx'
import Reveal from './ui/Reveal.jsx'
import { building, instagramLink, navLinks, studio, whatsappLink } from '../data/site.js'

export default function Footer() {
  return (
    <footer id="contato" className="relative overflow-hidden bg-navy-900 pb-28 pt-20 text-sage-100 lg:pb-12">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 animate-aurora rounded-full bg-sage-500/30 blur-3xl" />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Cuidado que acolhe. Movimento que transforma.</h2>
          <p className="mt-4 text-sage-200">
            Fale com a gente pelo WhatsApp e agende a sua aula experimental.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={whatsappLink()} variant="light" size="lg" icon={MessageCircle} magnetic shimmer>
              Chamar no WhatsApp
            </Button>
            <Button
              href={instagramLink}
              size="lg"
              variant="ghost"
              icon={Instagram}
              className="!text-white ring-1 ring-white/25 hover:!bg-white/10 active:!bg-white/20"
            >
              @{studio.instagram}
            </Button>
          </div>
        </Reveal>

        <div className="mt-16 grid items-center gap-7 border-t border-white/10 pt-8 text-sm sm:grid-cols-2 sm:gap-x-8 xl:grid-cols-[minmax(180px,1fr)_minmax(0,2fr)_minmax(230px,1fr)]">
          <a href="#topo" aria-label={`${studio.name} — voltar ao topo`} className="justify-self-center sm:justify-self-start">
            <Logo tone="dark" />
          </a>

          <ul className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-3 text-center sm:col-span-2 sm:grid-cols-4 xl:col-span-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="whitespace-nowrap text-sage-200 transition-colors hover:text-white active:text-sage-300">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="text-center text-sage-300 sm:col-start-2 sm:row-start-1 sm:text-right xl:col-start-3 xl:row-start-auto">
            <p>
              © {new Date().getFullYear()} {studio.name}
            </p>
            <p className="mt-1 text-xs">
              No prédio do{' '}
              <a
                href={`https://instagram.com/${building.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold-300 transition-colors hover:text-white"
              >
                {building.name}
              </a>{' '}
              · {building.description}
            </p>
            <a href="#/gestao" className="mt-2 inline-block text-[11px] text-sage-300/70 underline-offset-2 hover:text-white hover:underline">Prévia do painel de gestão</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
