import { FileText } from 'lucide-react'
import SectionHeading from './ui/SectionHeading.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { contractPreview, studio } from '../data/site.js'

export default function ContractPreview() {
  return (
    <section id="termo" className="section-pad bg-sand-50">
      <div className="container-page">
        <SectionHeading eyebrow="Transparência" title="Consulte o termo de adesão" subtitle="Leia as condições gerais e tire suas dúvidas com a equipe antes de contratar um plano." />
        <Reveal className="mx-auto mt-10 max-w-3xl rounded-[2rem] bg-white p-7 shadow-card ring-1 ring-sage-100 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-100 text-navy-700"><FileText className="h-6 w-6" aria-hidden="true" /></span>
          <h3 className="mt-5 font-display text-2xl font-semibold text-navy-900">Planos mensal, trimestral, semestral e anual</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{contractPreview.note}</p>
          <p className="mt-3 text-sm text-ink/70">O documento identifica a contratada como {studio.name}, informa o endereço da Rua Júlio de Mesquita, 658, Sala 1, e inclui regras de agendamento, faltas, reposição, trancamento, cancelamento e privacidade.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={contractPreview.file} variant="primary" icon={FileText}>Abrir termo em PDF</Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
