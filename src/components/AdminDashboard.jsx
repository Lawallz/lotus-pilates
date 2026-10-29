import { useMemo, useState } from 'react'
import {
  Activity, ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronDown,
  CircleHelp, Clock3, LayoutDashboard, Link2, Menu, Search, Settings2, ShieldAlert,
  Users, WalletCards, X,
} from 'lucide-react'
import { studio } from '../data/site.js'

const platforms = [
  { name: 'Wellhub', short: 'WH', color: 'bg-emerald-100 text-emerald-800', note: 'Aguardando credenciais e validação de escopo' },
  { name: 'TotalPass', short: 'TP', color: 'bg-blue-100 text-blue-800', note: 'Aguardando cadastro e homologação da integração' },
  { name: 'ClassPass', short: 'CP', color: 'bg-rose-100 text-rose-800', note: 'Aguardando confirmação de acesso ao portal parceiro' },
]

const demoVisits = [
  { id: 'DEMO-1042', member: 'Aluno demonstração 01', platform: 'Wellhub', time: '08:00', status: 'Presença confirmada' },
  { id: 'DEMO-1041', member: 'Aluno demonstração 02', platform: 'TotalPass', time: '08:30', status: 'Aguardando check-in' },
  { id: 'DEMO-1040', member: 'Aluno demonstração 03', platform: 'ClassPass', time: '09:00', status: 'Presença confirmada' },
  { id: 'DEMO-1039', member: 'Aluno demonstração 04', platform: 'Wellhub', time: '09:30', status: 'Aguardando check-in' },
]

const navigation = [
  { id: 'Resumo', icon: LayoutDashboard },
  { id: 'Alunos', icon: Users },
  { id: 'Integrações', icon: Link2 },
]

function Sidebar({ page, setPage, mobileOpen, closeMobile, onExit }) {
  return (
    <>
      {mobileOpen && <button aria-label="Fechar menu" onClick={closeMobile} className="fixed inset-0 z-40 bg-navy-950/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sage-100 bg-white px-4 py-5 transition-transform lg:static lg:z-auto lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <a href="#topo" className="flex items-center gap-3" aria-label="Voltar ao site">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-navy-700 font-display text-lg font-semibold text-white">L</span>
            <span><strong className="block font-display text-lg text-navy-900">Lotus</strong><small className="text-xs text-ink/55">Gestão do estúdio</small></span>
          </a>
          <button onClick={closeMobile} aria-label="Fechar menu" className="rounded-lg p-2 text-ink/60 hover:bg-sage-50 lg:hidden"><X size={20} /></button>
        </div>

        <p className="mb-2 mt-10 px-3 text-[11px] font-bold uppercase tracking-[.16em] text-ink/40">Espaço de trabalho</p>
        <nav className="space-y-1" aria-label="Gestão">
          {navigation.map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => { setPage(id); closeMobile() }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${page === id ? 'bg-navy-700 text-white shadow-sm' : 'text-ink/70 hover:bg-sage-50 hover:text-navy-800'}`}>
              <Icon size={18} />{id}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-sand-50 p-4 ring-1 ring-sage-100">
          <span className="flex items-center gap-2 text-xs font-bold text-navy-900"><ShieldAlert size={15} />Modo de demonstração</span>
          <p className="mt-2 text-xs leading-relaxed text-ink/60">Este protótipo não autentica usuários nem acessa dados reais.</p>
        </div>
        <button onClick={onExit} className="mt-4 flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-ink/60 hover:bg-sage-50"><ArrowLeft size={16} /> Voltar ao site</button>
      </aside>
    </>
  )
}

function Metric({ title, value, detail, icon: Icon, trend, tone = 'sage' }) {
  const iconTone = tone === 'gold' ? 'bg-gold-100 text-gold-800' : tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-sage-100 text-navy-700'
  return (
    <article className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3"><span className="text-sm font-medium text-ink/60">{title}</span><span className={`grid h-10 w-10 place-items-center rounded-xl ${iconTone}`}><Icon size={19} /></span></div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-navy-950">{value}</p>
      <p className="mt-2 flex items-center gap-1 text-xs text-ink/50">{trend && <ArrowUpRight size={13} className="text-emerald-700" />}{detail}</p>
    </article>
  )
}

function IntegrationCards() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {platforms.map((platform) => (
        <article key={platform.name} className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-extrabold ${platform.color}`}>{platform.short}</span><span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Pendente</span></div>
          <h3 className="mt-4 font-display text-xl font-semibold text-navy-950">{platform.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/60">{platform.note}</p>
          <div className="mt-5 flex items-center gap-2 border-t border-sage-100 pt-4 text-xs font-semibold text-navy-700"><Link2 size={14} /> Integração ainda não configurada</div>
        </article>
      ))}
    </div>
  )
}

function VisitsTable({ platformFilter, setPlatformFilter, search, setSearch }) {
  const rows = useMemo(() => demoVisits.filter((visit) => (platformFilter === 'Todas' || visit.platform === platformFilter) && `${visit.id} ${visit.member} ${visit.platform}`.toLowerCase().includes(search.toLowerCase())), [platformFilter, search])
  return (
    <section className="overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-sage-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-display text-xl font-semibold text-navy-950">Movimentações recentes</h2><p className="mt-1 text-xs text-ink/50">Registros fictícios para demonstrar o layout</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative"><span className="sr-only">Buscar aluno ou código</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar aluno ou código" className="w-full rounded-xl border border-sage-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sage-500 sm:w-56" /></label>
          <label className="relative"><span className="sr-only">Filtrar plataforma</span><select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="w-full appearance-none rounded-xl border border-sage-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none focus:border-sage-500 sm:w-40">{['Todas', ...platforms.map((p) => p.name)].map((p) => <option key={p}>{p}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/45" /></label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-sand-50 text-xs uppercase tracking-wide text-ink/50"><tr><th className="px-5 py-3 font-semibold">Aluno</th><th className="px-5 py-3 font-semibold">Plataforma</th><th className="px-5 py-3 font-semibold">Horário</th><th className="px-5 py-3 font-semibold">Situação</th><th className="px-5 py-3 font-semibold">Referência</th></tr></thead>
          <tbody className="divide-y divide-sage-100">{rows.length ? rows.map((row) => <tr key={row.id} className="hover:bg-sage-50/50"><td className="px-5 py-4 font-medium text-navy-900">{row.member}</td><td className="px-5 py-4 text-ink/70">{row.platform}</td><td className="px-5 py-4 text-ink/70">Hoje, {row.time}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${row.status.startsWith('Presença') ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{row.status.startsWith('Presença') ? <Check size={13} /> : <Clock3 size={13} />}{row.status}</span></td><td className="px-5 py-4 font-mono text-xs text-ink/50">{row.id}</td></tr>) : <tr><td colSpan="5" className="px-5 py-10 text-center text-sm text-ink/50">Nenhum registro corresponde à busca.</td></tr>}</tbody>
        </table>
      </div>
      <div className="border-t border-sage-100 px-5 py-3 text-xs text-ink/50">{rows.length} registro(s) de demonstração</div>
    </section>
  )
}

function PageContent({ page, setPage, platformFilter, setPlatformFilter, search, setSearch }) {
  if (page === 'Integrações') return <><div className="mb-6"><h2 className="font-display text-2xl font-semibold text-navy-950">Conexões com parceiros</h2><p className="mt-1 text-sm text-ink/60">Status e próximos passos para conectar as plataformas.</p></div><IntegrationCards /><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950"><strong>Antes de ativar:</strong> cada parceiro precisa confirmar as permissões, fornecer credenciais e aprovar a integração. Não insira chaves neste protótipo. A conexão real deve acontecer no backend, com segredos protegidos e controle de acesso.</div></>
  if (page === 'Alunos') return <><div className="mb-6"><h2 className="font-display text-2xl font-semibold text-navy-950">Alunos e visitas</h2><p className="mt-1 text-sm text-ink/60">Visão ilustrativa de registros recebidos dos parceiros.</p></div><VisitsTable platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} search={search} setSearch={setSearch} /></>
  return <>
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-ink/50">Bem-vinda à gestão,</p><h2 className="mt-1 font-display text-3xl font-semibold text-navy-950">Visão geral</h2><p className="mt-1 text-sm text-ink/60">Acompanhe agenda, presenças e atividade do estúdio.</p></div><button className="inline-flex w-fit items-center gap-2 rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink/70"><CalendarDays size={16} /> Hoje <ChevronDown size={15} /></button></div>
    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"><strong>Modo de demonstração:</strong> indicadores, horários e alunos exibidos nesta página são fictícios.</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric title="Visitas hoje" value="18" detail="+3 em relação ao dia anterior" icon={Activity} trend /><Metric title="Agendamentos" value="24" detail="6 horários ainda disponíveis" icon={CalendarDays} tone="blue" /><Metric title="Alunos ativos" value="86" detail="Dados de exemplo" icon={Users} /><Metric title="Repasse estimado" value="R$ 1.240" detail="Valor ilustrativo, não financeiro" icon={WalletCards} tone="gold" /></div>
    <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_1fr]"><VisitsTable platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} search={search} setSearch={setSearch} /><section className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-display text-xl font-semibold text-navy-950">Conexões</h2><p className="mt-1 text-xs text-ink/50">Estado das integrações</p></div><Link2 className="text-navy-600" size={19} /></div><div className="mt-4 space-y-3">{platforms.map((p) => <div key={p.name} className="flex items-center justify-between rounded-xl bg-sand-50 px-3 py-3"><span className="flex items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-lg text-[10px] font-bold ${p.color}`}>{p.short}</span><span className="text-sm font-semibold text-navy-900">{p.name}</span></span><span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900">Pendente</span></div>)}</div><button onClick={() => setPage('Integrações')} className="mt-4 w-full rounded-xl border border-sage-200 px-3 py-2.5 text-sm font-semibold text-navy-800 hover:bg-sage-50">Ver integrações</button></section></div>
  </>
}

export default function AdminDashboard({ onExit }) {
  const [page, setPage] = useState('Resumo')
  const [filter, setFilter] = useState('Todas')
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#f6f8f6] text-ink">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-950 sm:text-sm"><ShieldAlert className="mr-1 inline h-4 w-4 align-[-3px]" /> Protótipo visual: sem login, sem sincronização e sem dados reais.</div>
      <div className="flex min-h-[calc(100vh-37px)]">
        <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} onExit={onExit} />
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-sage-100 bg-white/90 px-4 backdrop-blur sm:px-7">
            <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} aria-label="Abrir menu" className="rounded-lg p-2 hover:bg-sage-50 lg:hidden"><Menu size={20} /></button><div className="hidden text-sm text-ink/50 sm:block">{studio.name}</div><span className="hidden text-ink/25 sm:block">/</span><span className="text-sm font-semibold text-navy-900">{page}</span></div>
            <div className="flex items-center gap-3"><button aria-label="Ajuda" title="Ajuda" className="rounded-full p-2 text-ink/50 hover:bg-sage-50"><CircleHelp size={19} /></button><button aria-label="Configurações" title="Configurações" className="rounded-full p-2 text-ink/50 hover:bg-sage-50"><Settings2 size={19} /></button><span className="grid h-9 w-9 place-items-center rounded-full bg-sage-100 text-sm font-bold text-navy-800">LM</span></div>
          </header>
          <div className="mx-auto max-w-[1500px] p-4 sm:p-7"><PageContent page={page} setPage={setPage} platformFilter={filter} setPlatformFilter={setFilter} search={search} setSearch={setSearch} /></div>
          <footer className="px-4 pb-6 text-center text-[11px] text-ink/40">Interface demonstrativa para validação de fluxo e layout. Não usar para operar o estúdio. <button onClick={onExit} className="ml-1 underline underline-offset-2 hover:text-navy-700">Voltar ao site</button></footer>
        </main>
      </div>
    </div>
  )
}
