import { Clock, Instagram, MapPin, Navigation, ScrollText } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import Icon from './ui/Icon.jsx'
import SpotlightCard from './ui/SpotlightCard.jsx'
import { location, building } from '../data/site.js'
import WaveDivider from './ui/WaveDivider.jsx'

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`

// Card visual simulando um mapa (decorativo). Para um mapa real, troque por um <iframe> do Google Maps.
function MapCard() {
  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir localização no Google Maps"
      className="group relative block min-h-[18rem] overflow-hidden rounded-[2rem] bg-sage-100 shadow-card ring-1 ring-sage-200 transition-shadow duration-300 hover:shadow-soft"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="300" fill="#E4EBE1" />
        <path d="M0 210 Q120 170 210 200 T400 150" stroke="#F3F6F2" strokeWidth="16" fill="none" />
        <path d="M110 0 L150 300" stroke="#F3F6F2" strokeWidth="12" />
        <path d="M0 90 L400 120" stroke="#F3F6F2" strokeWidth="10" />
        <path d="M290 0 L260 300" stroke="#F3F6F2" strokeWidth="8" />
        <rect x="170" y="20" width="90" height="60" rx="14" fill="#C9D7C4" opacity="0.7" />
        <rect x="20" y="220" width="80" height="60" rx="14" fill="#C9D7C4" opacity="0.7" />
        <rect x="300" y="170" width="80" height="90" rx="14" fill="#E8D9C1" opacity="0.8" />
      </svg>

      <div className="absolute left-[46%] top-[42%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-sage-500/30" aria-hidden="true" />
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-navy-700 text-white shadow-soft">
          <MapPin className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/95 p-4 backdrop-blur">
        <span className="text-sm font-semibold text-navy-900">Ver no Google Maps</span>
        <Navigation className="h-5 w-5 text-navy-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </a>
  )
}

export default function Location() {
  return (
    <section id="localizacao" className="section-pad relative bg-sand-50">
      <WaveDivider className="text-cream" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Como chegar"
          title="Localização e informações"
          subtitle="Estamos na Sala 1, dentro do prédio do Soul Unity — Centro de Beleza e Saúde, em Paulicéia."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="space-y-6">
            <MapCard />

            {/* Soul Unity: empresa dona do prédio */}
            <SpotlightCard className="flex items-center gap-5 rounded-3xl bg-white p-5 shadow-card ring-1 ring-sage-100 transition-all duration-300 hover:shadow-soft">
              <img
                src={building.logo}
                alt={`Logotipo ${building.name} — ${building.description}`}
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-gold-300"
              />
              <div>
                <p className="eyebrow">No prédio do</p>
                <p className="font-display text-2xl font-semibold leading-tight text-navy-900">
                  {building.name} <span className="text-base font-medium text-ink/60">· {building.description}</span>
                </p>
                <a
                  href={`https://instagram.com/${building.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 transition-colors hover:text-navy-800 active:text-navy-900"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />@{building.instagram}
                </a>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1} className="space-y-4">
            <SpotlightCard className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-sage-100 transition-all duration-300 hover:shadow-soft">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-100 text-navy-700">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold text-navy-900">Endereço</h3>
                  <address className="mt-1 text-sm not-italic leading-relaxed text-ink/75">
                    {location.address}
                    <br />
                    {location.district}
                    <br />
                    CEP {location.cep}
                  </address>
                  <ul className="mt-3 space-y-1.5">
                    {location.perks.map((p) => (
                      <li key={p.text} className="flex items-center gap-2 text-sm text-ink/70">
                        <Icon name={p.icon} className="h-4 w-4 text-navy-600" />
                        {p.text}
                      </li>
                    ))}
                  </ul>
                  <Button href={mapsUrl} variant="secondary" className="mt-4" icon={Navigation}>
                    Traçar rota
                  </Button>
                </div>
              </div>
            </SpotlightCard>

            {/* Só aparece quando `location.hours` for preenchido em data/site.js */}
            {location.hours && (
              <SpotlightCard className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-sage-100 transition-all duration-300 hover:shadow-soft">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-100 text-navy-700">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-navy-900">Horários</h3>
                    <dl className="mt-2 divide-y divide-sage-100 text-sm">
                      {location.hours.map((h) => (
                        <div key={h.days} className="flex justify-between gap-4 py-2">
                          <dt className="text-ink/70">{h.days}</dt>
                          <dd className="font-semibold text-navy-800">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </SpotlightCard>
            )}

            <SpotlightCard className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-sage-100 transition-all duration-300 hover:shadow-soft">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-100 text-navy-700">
                  <ScrollText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold text-navy-900">Orientações para a aula</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-ink/75 marker:text-sage-400">
                    {location.rules.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
