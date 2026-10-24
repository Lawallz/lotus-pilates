import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Send } from 'lucide-react'
import Reveal from './ui/Reveal.jsx'
import { goals, payments, periods, studio, whatsappLink } from '../data/site.js'

function Chips({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-navy-900">{legend}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {options.map((o) => {
          const selected = value === o
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(selected ? '' : o)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium ring-1 transition-all duration-200 active:scale-95 ${
                selected
                  ? 'bg-navy-600 text-white ring-navy-600 shadow-card'
                  : 'bg-white text-navy-800 ring-sage-200 hover:bg-sage-50 hover:ring-sage-300'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/**
 * Formulário curto que monta uma mensagem pré-preenchida e abre o WhatsApp.
 * Não envia dados para servidor algum: tudo vai direto na conversa do usuário.
 */
export default function LeadForm() {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [period, setPeriod] = useState('')
  const [payment, setPayment] = useState('')
  const [touched, setTouched] = useState(false)
  const [message, setMessage] = useState('') // mensagem pronta (após enviar)
  const [copied, setCopied] = useState(false)

  const invalid = touched && name.trim().length < 2

  // O link oficial do WhatsApp (wa.me/message/...) não aceita texto pré-preenchido.
  // Por isso copiamos a mensagem para a área de transferência e abrimos a conversa: é só colar.
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false) // sem permissão: o usuário pode copiar manualmente da caixa de texto
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (name.trim().length < 2) return

    const parts = [`Olá! Meu nome é ${name.trim()} e gostaria de agendar uma aula experimental.`]
    if (goal) parts.push(`Meu objetivo: ${goal.toLowerCase()}.`)
    if (period) parts.push(`Prefiro aulas no período da ${period.toLowerCase()}.`)
    if (payment) parts.push(`Vou utilizar: ${payment}.`)
    const text = parts.join(' ')

    setMessage(text)
    copy(text)
    window.open(whatsappLink(), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="agendar" className="section-pad bg-sand-50">
      <div className="container-page">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <p className="eyebrow">Aula experimental</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-navy-900 sm:text-5xl">
              Reserve o seu primeiro movimento
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Responda em 20 segundos. Montamos a mensagem para você: é só colar na conversa do WhatsApp com a
              equipe do {studio.shortName}.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-navy-800">
              <li>✓ Sem compromisso e sem cadastro</li>
              <li>✓ Seus dados não ficam salvos no site</li>
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              noValidate
              className="space-y-6 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-sage-100 sm:p-9"
            >
              <div>
                <label htmlFor="lead-name" className="mb-2 block text-sm font-semibold text-navy-900">
                  Como podemos te chamar?
                </label>
                <input
                  id="lead-name"
                  type="text"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? 'lead-name-error' : undefined}
                  placeholder="Seu primeiro nome"
                  className={`w-full rounded-2xl border bg-cream px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-sage-500 focus:bg-white focus:ring-4 focus:ring-sage-100 ${
                    invalid ? 'border-clay-500' : 'border-sage-200'
                  }`}
                />
                {invalid && (
                  <p id="lead-name-error" role="alert" className="mt-1.5 text-sm text-clay-600">
                    Informe seu nome para continuarmos.
                  </p>
                )}
              </div>

              <Chips legend="Qual o seu objetivo?" options={goals} value={goal} onChange={setGoal} />
              <Chips legend="Melhor período" options={periods} value={period} onChange={setPeriod} />
              <Chips legend="Como pretende pagar?" options={payments} value={payment} onChange={setPayment} />

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-navy-600 px-7 py-4 text-base font-semibold text-white shadow-soft transition-colors hover:bg-navy-700 hover:shadow-glow active:bg-navy-800"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Continuar no WhatsApp
                  <Send className="h-4 w-4" aria-hidden="true" />
                </span>
              </motion.button>

              {message && (
                <div role="status" className="rounded-2xl bg-sage-50 p-4 ring-1 ring-sage-200">
                  <p className="text-sm font-semibold text-navy-900">
                    {copied ? 'Mensagem copiada! Cole na conversa do WhatsApp.' : 'Sua mensagem está pronta:'}
                  </p>
                  <textarea
                    readOnly
                    value={message}
                    rows={3}
                    onFocus={(e) => e.target.select()}
                    className="mt-2 w-full resize-none rounded-xl border border-sage-200 bg-white p-3 text-sm text-ink/80"
                  />
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => copy(message)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 ring-1 ring-sage-200 transition-colors hover:bg-sage-100 active:bg-sage-200"
                    >
                      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                      {copied ? 'Copiado' : 'Copiar mensagem'}
                    </button>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 active:bg-navy-800"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
