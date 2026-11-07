import { useMemo, useState } from 'react'
import {
  Activity, ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronDown,
  CircleHelp, Clock3, LayoutDashboard, Link2, Menu, Plus, Search, Settings2,
  ShieldAlert, Users, WalletCards, X,
} from 'lucide-react'
import { studio } from '../data/site.js'

const platforms = [
  { name: 'Wellhub', short: 'WH', color: 'bg-emerald-100 text-emerald-800', note: 'Integração depende de solicitação e conexão com um sistema compatível.' },
  { name: 'TotalPass', short: 'TP', color: 'bg-blue-100 text-blue-800', note: 'A API requer cadastro, validação do sistema e credenciais da unidade.' },
  { name: 'ClassPass', short: 'CP', color: 'bg-rose-100 text-rose-800', note: 'A sincronização depende da aprovação e configuração da integração.' },
]

const initialClasses = [
  { id: 'a1', name: 'Pilates solo', instructor: 'Marina', time: '08:00', capacity: 8, booked: 5 },
  { id: 'a2', name: 'Pilates aparelhos', instructor: 'Luiza', time: '09:00', capacity: 5, booked: 4 },
  { id: 'a3', name: 'Pilates aparelhos', instructor: 'Marina', time: '10:00', capacity: 5, booked: 3 },
]
const initialBookings = [
  { id: 'b1', student: 'Pessoa de demonstração 01', classId: 'a1', source: 'Direto', status: 'Confirmada' },
  { id: 'b2', student: 'Pessoa de demonstração 02', classId: 'a1', source: 'Wellhub', status: 'Presença confirmada' },
  { id: 'b3', student: 'Pessoa de demonstração 03', classId: 'a2', source: 'TotalPass', status: 'Confirmada' },
  { id: 'b4', student: 'Pessoa de demonstração 04', classId: 'a3', source: 'Direto', status: 'Presença confirmada' },
]
const navigation = [
  { id: 'Resumo', icon: LayoutDashboard },
  { id: 'Agenda', icon: CalendarDays },
  { id: 'Alunos', icon: Users },
  { id: 'Integrações', icon: Link2 },
]

function Sidebar({ page, setPage, mobileOpen, closeMobile, onExit }) {
  return <>
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
        {navigation.map(({ id, icon: Icon }) => <button key={id} onClick={() => { setPage(id); closeMobile() }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${page === id ? 'bg-navy-700 text-white shadow-sm' : 'text-ink/70 hover:bg-sage-50 hover:text-navy-800'}`}><Icon size={18} />{id}</button>)}
      </nav>
      <div className="mt-auto rounded-2xl bg-sand-50 p-4 ring-1 ring-sage-100">
        <span className="flex items-center gap-2 text-xs font-bold text-navy-900"><ShieldAlert size={15} />Protótipo de fluxo</span>
        <p className="mt-2 text-xs leading-relaxed text-ink/60">Use somente dados fictícios. As alterações ficam apenas na memória desta tela.</p>
      </div>
      <button onClick={onExit} className="mt-4 flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-ink/60 hover:bg-sage-50"><ArrowLeft size={16} />Voltar ao site</button>
    </aside>
  </>
}

function Metric({ title, value, detail, icon: Icon, tone = 'sage' }) {
  const iconTone = tone === 'gold' ? 'bg-gold-100 text-gold-800' : tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-sage-100 text-navy-700'
  return <article className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-start justify-between gap-3"><span className="text-sm font-medium text-ink/60">{title}</span><span className={`grid h-10 w-10 place-items-center rounded-xl ${iconTone}`}><Icon size={19} /></span></div>
    <p className="mt-4 text-3xl font-semibold tracking-tight text-navy-950">{value}</p>
    <p className="mt-2 text-xs text-ink/50">{detail}</p>
  </article>
}

function Schedule({ classes, bookings, onAddClass, onBook, onToggleAttendance }) {
  const [showClassForm, setShowClassForm] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [newClass, setNewClass] = useState({ name: '', instructor: '', time: '', capacity: '5' })
  const [newBooking, setNewBooking] = useState({ student: '', classId: classes[0]?.id || '', source: 'Direto' })
  const submitClass = (event) => {
    event.preventDefault()
    if (!newClass.name.trim() || !newClass.instructor.trim() || !newClass.time) return
    onAddClass({ ...newClass, capacity: Number(newClass.capacity) })
    setNewClass({ name: '', instructor: '', time: '', capacity: '5' })
    setShowClassForm(false)
  }
  const submitBooking = (event) => {
    event.preventDefault()
    if (!newBooking.student.trim() || !newBooking.classId) return
    onBook(newBooking)
    setNewBooking({ ...newBooking, student: '' })
    setShowBookingForm(false)
  }
  return <div>
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm text-ink/50">Agenda demonstrativa</p><h2 className="mt-1 font-display text-3xl font-semibold text-navy-950">Aulas de hoje</h2><p className="mt-1 text-sm text-ink/60">Organize horários e acompanhe as vagas.</p></div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setShowBookingForm((v) => !v)} className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800"><Users size={16} />Reservar vaga</button>
        <button onClick={() => setShowClassForm((v) => !v)} className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />Adicionar aula</button>
      </div>
    </div>
    {(showClassForm || showBookingForm) && <section className="mb-5 rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
      {showClassForm && <form onSubmit={submitClass}><h3 className="mb-4 font-semibold text-navy-950">Nova aula (demonstração)</h3><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <input aria-label="Nome da aula" placeholder="Nome da aula" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} className="rounded-xl border border-sage-200 px-3 py-2.5 text-sm" />
        <input aria-label="Instrutor" placeholder="Instrutor(a)" value={newClass.instructor} onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })} className="rounded-xl border border-sage-200 px-3 py-2.5 text-sm" />
        <input aria-label="Horário" type="time" value={newClass.time} onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} className="rounded-xl border border-sage-200 px-3 py-2.5 text-sm" />
        <input aria-label="Capacidade" type="number" min="1" max="20" value={newClass.capacity} onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })} className="rounded-xl border border-sage-200 px-3 py-2.5 text-sm" />
      </div><button className="mt-4 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white">Adicionar à visualização</button></form>}
      {showBookingForm && <form onSubmit={submitBooking}><h3 className="mb-4 font-semibold text-navy-950">Reserva direta (demonstração)</h3><div className="grid gap-3 sm:grid-cols-3">
        <input aria-label="Nome de demonstração" placeholder="Nome fictício do aluno" value={newBooking.student} onChange={(e) => setNewBooking({ ...newBooking, student: e.target.value })} className="rounded-xl border border-sage-200 px-3 py-2.5 text-sm" />
        <select aria-label="Aula" value={newBooking.classId} onChange={(e) => setNewBooking({ ...newBooking, classId: e.target.value })} className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm">{classes.map((item) => <option key={item.id} value={item.id}>{item.time} · {item.name}</option>)}</select>
        <select aria-label="Origem" value={newBooking.source} onChange={(e) => setNewBooking({ ...newBooking, source: e.target.value })} className="rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm">{['Direto', 'Wellhub', 'TotalPass', 'ClassPass'].map((option) => <option key={option}>{option}</option>)}</select>
      </div><button className="mt-4 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white">Adicionar reserva de demonstração</button></form>}
    </section>}
    <div className="grid gap-4 xl:grid-cols-2">{classes.slice().sort((a, b) => a.time.localeCompare(b.time)).map((item) => {
      const attendees = bookings.filter((booking) => booking.classId === item.id)
      const capacity = Number(item.capacity) || 1
      return <article key={item.id} className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between"><div><p className="flex items-center gap-2 text-sm font-semibold text-navy-700"><Clock3 size={15} />{item.time}</p><h3 className="mt-2 font-display text-xl font-semibold text-navy-950">{item.name}</h3><p className="mt-1 text-sm text-ink/55">Instrutora: {item.instructor}</p></div><span className="rounded-full bg-sage-50 px-3 py-1.5 text-xs font-bold text-navy-800">{attendees.length}/{capacity} vagas</span></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sage-100"><div className="h-full rounded-full bg-navy-600" style={{ width: `${Math.min(100, attendees.length / capacity * 100)}%` }} /></div>
        <div className="mt-4 space-y-2">{attendees.length ? attendees.map((booking) => <div key={booking.id} className="flex items-center justify-between gap-2 rounded-xl bg-sand-50 px-3 py-2.5"><div><p className="text-sm font-medium text-navy-900">{booking.student}</p><p className="text-xs text-ink/50">{booking.source} · {booking.status}</p></div><button onClick={() => onToggleAttendance(booking.id)} className="rounded-lg border border-sage-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-800">{booking.status.includes('Presença') ? 'Desfazer presença' : 'Confirmar presença'}</button></div>) : <p className="py-2 text-sm text-ink/50">Nenhuma reserva nesta aula.</p>}</div>
      </article>
    })}</div>
  </div>
}

function Students({ bookings, classes, onToggleAttendance, search, setSearch }) {
  const rows = useMemo(() => bookings.filter((booking) => `${booking.student} ${booking.source}`.toLowerCase().includes(search.toLowerCase())), [bookings, search])
  return <section className="overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-sm">
    <div className="flex flex-col gap-4 border-b border-sage-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-xl font-semibold text-navy-950">Reservas e presenças</h2><p className="mt-1 text-xs text-ink/50">Dados fictícios desta demonstração.</p></div><label className="relative"><span className="sr-only">Buscar aluno</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar aluno ou origem" className="w-full rounded-xl border border-sage-200 py-2.5 pl-9 pr-3 text-sm sm:w-60" /></label></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-sand-50 text-xs uppercase tracking-wide text-ink/50"><tr><th className="px-5 py-3">Aluno</th><th className="px-5 py-3">Aula</th><th className="px-5 py-3">Origem</th><th className="px-5 py-3">Situação</th><th className="px-5 py-3">Ação</th></tr></thead><tbody className="divide-y divide-sage-100">{rows.length ? rows.map((booking) => { const item = classes.find((c) => c.id === booking.classId); return <tr key={booking.id}><td className="px-5 py-4 font-medium text-navy-900">{booking.student}</td><td className="px-5 py-4 text-ink/70">{item ? `${item.time} · ${item.name}` : 'Aula removida'}</td><td className="px-5 py-4 text-ink/70">{booking.source}</td><td className="px-5 py-4"><span className="rounded-full bg-sage-50 px-2.5 py-1 text-xs font-semibold text-navy-800">{booking.status}</span></td><td className="px-5 py-4"><button onClick={() => onToggleAttendance(booking.id)} className="text-xs font-semibold text-navy-700 underline">{booking.status.includes('Presença') ? 'Desfazer' : 'Confirmar presença'}</button></td></tr> }) : <tr><td colSpan="5" className="px-5 py-10 text-center text-ink/50">Nenhum registro encontrado.</td></tr>}</tbody></table></div>
  </section>
}

function Integrations() {
  return <><div className="mb-6"><h2 className="font-display text-2xl font-semibold text-navy-950">Conexões com parceiros</h2><p className="mt-1 text-sm text-ink/60">A integração fica para uma etapa posterior, após confirmação de acesso e homologação.</p></div><div className="grid gap-4 xl:grid-cols-3">{platforms.map((platform) => <article key={platform.name} className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-extrabold ${platform.color}`}>{platform.short}</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">Não conectada</span></div><h3 className="mt-4 font-display text-xl font-semibold text-navy-950">{platform.name}</h3><p className="mt-2 text-sm leading-relaxed text-ink/60">{platform.note}</p></article>)}</div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950"><strong>Importante:</strong> este painel ainda não consulta, envia ou altera dados dos parceiros. A conexão real exige credenciais autorizadas e aprovação de cada plataforma.</div></>
}

function Overview({ classes, bookings, setPage }) {
  const confirmed = bookings.filter((booking) => booking.status.includes('Presença')).length
  return <>
    <div className="mb-6"><p className="text-sm text-ink/50">Bem-vinda à gestão,</p><h2 className="mt-1 font-display text-3xl font-semibold text-navy-950">Visão geral</h2><p className="mt-1 text-sm text-ink/60">Acompanhe agenda e presença em uma única tela.</p></div>
    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"><strong>Modo de demonstração:</strong> nenhum dado é salvo ou enviado. Não use nomes reais.</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric title="Aulas na agenda" value={classes.length} detail="Horários de exemplo" icon={CalendarDays} /><Metric title="Reservas" value={bookings.length} detail="Inclui origens ilustrativas" icon={Users} tone="blue" /><Metric title="Presenças confirmadas" value={confirmed} detail="Marcadas nesta sessão de demonstração" icon={Activity} /><Metric title="Vagas disponíveis" value={classes.reduce((sum, item) => sum + Math.max(0, Number(item.capacity) - bookings.filter((b) => b.classId === item.id).length), 0)} detail="Soma da capacidade demonstrativa" icon={WalletCards} tone="gold" /></div>
    <div className="mt-6 rounded-2xl border border-sage-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-display text-xl font-semibold text-navy-950">Próximas aulas</h3><p className="mt-1 text-xs text-ink/50">Agenda de demonstração</p></div><button onClick={() => setPage('Agenda')} className="rounded-xl border border-sage-200 px-3 py-2 text-sm font-semibold text-navy-800">Abrir agenda</button></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{classes.slice().sort((a, b) => a.time.localeCompare(b.time)).slice(0, 3).map((item) => <div key={item.id} className="rounded-xl bg-sand-50 p-4"><p className="text-sm font-bold text-navy-700">{item.time}</p><p className="mt-1 font-semibold text-navy-950">{item.name}</p><p className="mt-1 text-xs text-ink/55">{bookings.filter((b) => b.classId === item.id).length}/{item.capacity} reservas</p></div>)}</div></div>
  </>
}

export default function AdminDashboard({ onExit }) {
  const [page, setPage] = useState('Resumo')
  const [classes, setClasses] = useState(initialClasses)
  const [bookings, setBookings] = useState(initialBookings)
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const addClass = (item) => setClasses((current) => [...current, { ...item, id: `new-${Date.now()}`, booked: 0 }])
  const addBooking = (item) => {
    if (bookings.filter((booking) => booking.classId === item.classId).length >= Number(classes.find((c) => c.id === item.classId)?.capacity || 0)) return
    setBookings((current) => [...current, { ...item, id: `new-${Date.now()}`, status: 'Confirmada' }])
  }
  const toggleAttendance = (id) => setBookings((current) => current.map((booking) => booking.id !== id ? booking : { ...booking, status: booking.status.includes('Presença') ? 'Confirmada' : 'Presença confirmada' }))
  return <div className="min-h-screen bg-[#f6f8f6] text-ink">
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-950 sm:text-sm"><ShieldAlert className="mr-1 inline h-4 w-4 align-[-3px]" />Protótipo demonstrativo: sem autenticação, persistência ou sincronização externa.</div>
    <div className="flex min-h-[calc(100vh-37px)]"><Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} onExit={onExit} />
      <main className="min-w-0 flex-1"><header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-sage-100 bg-white/90 px-4 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} aria-label="Abrir menu" className="rounded-lg p-2 hover:bg-sage-50 lg:hidden"><Menu size={20} /></button><div className="hidden text-sm text-ink/50 sm:block">{studio.name}</div><span className="hidden text-ink/25 sm:block">/</span><span className="text-sm font-semibold text-navy-900">{page}</span></div><div className="flex items-center gap-3"><button aria-label="Ajuda" title="Ajuda" className="rounded-full p-2 text-ink/50 hover:bg-sage-50"><CircleHelp size={19} /></button><button aria-label="Configurações" title="Configurações" className="rounded-full p-2 text-ink/50 hover:bg-sage-50"><Settings2 size={19} /></button><span className="grid h-9 w-9 place-items-center rounded-full bg-sage-100 text-sm font-bold text-navy-800">LM</span></div></header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-7">{page === 'Agenda' ? <Schedule classes={classes} bookings={bookings} onAddClass={addClass} onBook={addBooking} onToggleAttendance={toggleAttendance} /> : page === 'Alunos' ? <Students bookings={bookings} classes={classes} onToggleAttendance={toggleAttendance} search={search} setSearch={setSearch} /> : page === 'Integrações' ? <Integrations /> : <Overview classes={classes} bookings={bookings} setPage={setPage} />}</div>
        <footer className="px-4 pb-6 text-center text-[11px] text-ink/40">Interface demonstrativa para validar o fluxo. Não usar para operar o estúdio. <button onClick={onExit} className="ml-1 underline underline-offset-2 hover:text-navy-700">Voltar ao site</button></footer>
      </main>
    </div>
  </div>
}
