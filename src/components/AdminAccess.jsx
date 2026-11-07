import { useCallback, useEffect, useState } from 'react'
import { Activity, ArrowLeft, CalendarDays, LogOut, Plus, Users } from 'lucide-react'
import { adminRequest, auth } from '../auth.js'
import { studio } from '../data/site.js'

const inputClass = 'w-full rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-navy-500'
const sourceNames = { direct: 'Direto', wellhub: 'Wellhub', totalpass: 'TotalPass', classpass: 'ClassPass' }
const localDateTime = value => { const date = new Date(value); return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date) }

function SignIn({ onExit }) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      if (!sent) {
        await auth.adapter.emailOtp.sendVerificationOtp({ email: email.trim().toLowerCase(), type: 'sign-in' })
        setSent(true)
      } else {
        await auth.adapter.signIn.emailOtp({ email: email.trim().toLowerCase(), otp: otp.trim() })
        await adminRequest('/api/admin/session')
        window.location.reload()
      }
    } catch (e) { setError(e.message || 'Não foi possível entrar. Confira o e-mail e tente novamente.') }
    finally { setBusy(false) }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f6f8f6] px-4 py-10 text-ink">
    <section className="w-full max-w-md rounded-3xl border border-sage-100 bg-white p-7 shadow-sm sm:p-9">
      <a href="#topo" className="mb-8 inline-flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-700 font-display text-xl font-semibold text-white">L</span><span><b className="block font-display text-xl text-navy-950">Lotus</b><small className="text-xs text-ink/55">Gestão do estúdio</small></span></a>
      <p className="text-sm text-ink/55">Acesso restrito</p><h1 className="mt-1 font-display text-3xl font-semibold text-navy-950">Entrar na gestão</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">{sent ? 'Digite o código enviado ao seu e-mail para confirmar o acesso.' : 'Informe o e-mail autorizado. Enviaremos um código de acesso de uso único.'}</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-navy-900">E-mail<input className={`${inputClass} mt-1.5`} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={sent} /></label>
        {sent && <label className="block text-sm font-medium text-navy-900">Código de acesso<input className={`${inputClass} mt-1.5`} inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={e => setOtp(e.target.value)} /></label>}
        {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-navy-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Aguarde…' : sent ? 'Confirmar código' : 'Enviar código'}</button>
      </form>
      {sent && <button onClick={() => { setSent(false); setOtp(''); setError('') }} className="mt-3 text-sm font-medium text-navy-700 underline">Usar outro e-mail</button>}
      <button onClick={onExit} className="mt-7 flex items-center gap-2 text-sm font-medium text-ink/55"><ArrowLeft size={16} />Voltar ao site</button>
    </section>
  </main>
}

function Dashboard({ onExit }) {
  const [tab, setTab] = useState('Resumo')
  const [data, setData] = useState({ clients: [], classes: [], bookings: [] })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    setBusy(true); setError('')
    try {
      const [clients, classes, bookings] = await Promise.all([
        adminRequest('/api/admin/clients'), adminRequest('/api/admin/classes'), adminRequest('/api/admin/bookings'),
      ])
      setData({ clients: clients.clients, classes: classes.classes, bookings: bookings.bookings })
    } catch (e) { setError(e.message || 'Não foi possível carregar os dados.') }
    finally { setBusy(false) }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function createClient(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    try { await adminRequest('/api/admin/clients', { method: 'POST', body: JSON.stringify({ full_name: form.get('full_name'), email: form.get('email'), phone: form.get('phone') }) }); event.currentTarget.reset(); refresh() }
    catch (e) { setError(e.message) }
  }
  async function createClass(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const start = new Date(form.get('starts_at'))
    try { await adminRequest('/api/admin/classes', { method: 'POST', body: JSON.stringify({ title: form.get('title'), instructor_name: form.get('instructor_name'), starts_at: start.toISOString(), ends_at: new Date(start.getTime() + Number(form.get('duration')) * 60000).toISOString(), capacity: Number(form.get('capacity')) }) }); event.currentTarget.reset(); refresh() }
    catch (e) { setError(e.message) }
  }
  async function createBooking(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    try { await adminRequest('/api/admin/bookings', { method: 'POST', body: JSON.stringify({ client_id: form.get('client_id'), class_session_id: form.get('class_session_id'), source: form.get('source') }) }); event.currentTarget.reset(); refresh() }
    catch (e) { setError(e.message) }
  }
  async function updateBooking(id, status) {
    try { await adminRequest('/api/admin/bookings', { method: 'PATCH', body: JSON.stringify({ id, status }) }); refresh() }
    catch (e) { setError(e.message) }
  }

  const nav = [{ name: 'Resumo', icon: Activity }, { name: 'Agenda', icon: CalendarDays }, { name: 'Alunos', icon: Users }]
  return <div className="min-h-screen bg-[#f6f8f6] text-ink">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-sage-100 bg-white px-4 py-4 sm:px-7"><a href="#topo" className="font-display text-xl font-semibold text-navy-950">Lotus <span className="text-sm font-normal text-ink/55">/ Gestão</span></a><div className="flex items-center gap-2">{nav.map(({ name, icon: Icon }) => <button key={name} onClick={() => setTab(name)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${tab === name ? 'bg-navy-700 text-white' : 'text-navy-800 hover:bg-sage-50'}`}><Icon size={16}/>{name}</button>)}<button onClick={async () => { await auth.adapter.signOut(); onExit() }} title="Sair" className="rounded-xl p-2 text-ink/55 hover:bg-sage-50"><LogOut size={18}/></button></div></header>
    <main className="mx-auto max-w-6xl p-4 sm:p-7"><div className="mb-6"><p className="text-sm text-ink/50">{studio.name}</p><h1 className="mt-1 font-display text-3xl font-semibold text-navy-950">{tab}</h1><p className="mt-1 text-sm text-ink/60">Dados operacionais salvos no banco Neon.</p></div>
      {error && <div role="alert" className="mb-5 flex items-center justify-between rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}<button onClick={() => setError('')} aria-label="Fechar">×</button></div>}
      {busy && <p className="mb-4 text-sm text-ink/55">Carregando…</p>}
      {tab === 'Resumo' && <><section className="grid gap-4 sm:grid-cols-3">{[['Clientes', data.clients.length], ['Aulas', data.classes.length], ['Reservas', data.bookings.filter(b => b.status !== 'cancelled').length]].map(([label, value]) => <article key={label} className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm"><p className="text-sm text-ink/55">{label}</p><p className="mt-2 text-3xl font-semibold text-navy-950">{value}</p></article>)}</section><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => setTab('Agenda')} className="rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white">Abrir agenda</button><button onClick={() => setTab('Alunos')} className="rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800">Ver clientes e reservas</button></div></>}
      {tab === 'Agenda' && <><form onSubmit={createClass} className="mb-5 grid gap-3 rounded-2xl border border-sage-100 bg-white p-5 sm:grid-cols-2 lg:grid-cols-5"><input name="title" required minLength="2" placeholder="Nome da aula" className={inputClass}/><input name="instructor_name" required minLength="2" placeholder="Instrutor(a)" className={inputClass}/><input name="starts_at" required type="datetime-local" className={inputClass}/><input name="duration" required type="number" min="15" max="180" defaultValue="50" aria-label="Duração em minutos" className={inputClass}/><div className="flex gap-2"><input name="capacity" required type="number" min="1" max="100" defaultValue="5" aria-label="Vagas" className={inputClass}/><button className="rounded-xl bg-navy-700 px-3 text-white" aria-label="Adicionar aula"><Plus size={18}/></button></div></form><form onSubmit={createBooking} className="mb-5 grid gap-3 rounded-2xl border border-sage-100 bg-white p-5 sm:grid-cols-4"><select name="client_id" required className={inputClass}><option value="">Selecione o cliente</option>{data.clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}</select><select name="class_session_id" required className={inputClass}><option value="">Selecione a aula</option>{data.classes.map(c => <option key={c.id} value={c.id}>{localDateTime(c.starts_at)} · {c.title}</option>)}</select><select name="source" className={inputClass}>{Object.entries(sourceNames).map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select><button className="rounded-xl border border-sage-200 px-3 py-2 text-sm font-semibold text-navy-800">Reservar vaga</button></form><div className="grid gap-3 md:grid-cols-2">{data.classes.map(c => <article key={c.id} className="rounded-2xl border border-sage-100 bg-white p-5"><div className="flex justify-between gap-3"><div><h2 className="font-semibold text-navy-950">{c.title}</h2><p className="mt-1 text-sm text-ink/55">{localDateTime(c.starts_at)} · {c.instructor_name}</p></div><span className="text-sm font-semibold text-navy-800">{c.booked}/{c.capacity}</span></div></article>)}</div></>}
      {tab === 'Alunos' && <><form onSubmit={createClient} className="mb-5 grid gap-3 rounded-2xl border border-sage-100 bg-white p-5 sm:grid-cols-4"><input name="full_name" required minLength="2" placeholder="Nome completo" className={inputClass}/><input name="email" type="email" placeholder="E-mail" className={inputClass}/><input name="phone" placeholder="Telefone" className={inputClass}/><button className="rounded-xl bg-navy-700 px-3 py-2 text-sm font-semibold text-white">Cadastrar cliente</button></form><section className="overflow-x-auto rounded-2xl border border-sage-100 bg-white"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-sand-50 text-xs uppercase text-ink/50"><tr><th className="p-4">Cliente</th><th className="p-4">Contato</th><th className="p-4">Reserva / aula</th><th className="p-4">Origem / status</th><th className="p-4">Ação</th></tr></thead><tbody className="divide-y divide-sage-100">{data.clients.map(c => { const bookings = data.bookings.filter(b => b.client_id === c.id); return <tr key={c.id}><td className="p-4 font-medium text-navy-950">{c.full_name}</td><td className="p-4 text-ink/65">{c.email || c.phone || '—'}</td><td className="p-4 text-ink/65">{bookings.map(b => `${b.class_title} (${localDateTime(b.starts_at)})`).join(', ') || '—'}</td><td className="p-4 text-ink/65">{bookings.map(b => `${sourceNames[b.source] || b.source} · ${b.status}`).join(', ') || c.status}</td><td className="p-4">{bookings.map(b => b.status === 'confirmed' ? <button key={b.id} onClick={() => updateBooking(b.id, 'attended')} className="mr-2 text-xs font-semibold text-navy-700 underline">Marcar presença</button> : b.status === 'attended' ? <button key={b.id} onClick={() => updateBooking(b.id, 'confirmed')} className="mr-2 text-xs font-semibold text-navy-700 underline">Desfazer presença</button> : null)}</td></tr> })}{!data.clients.length && <tr><td colSpan="5" className="p-8 text-center text-ink/50">Nenhum cliente cadastrado ainda.</td></tr>}</tbody></table></section></>}
    </main><footer className="px-4 pb-8 text-center text-xs text-ink/45"><button onClick={onExit} className="underline">Voltar ao site</button></footer>
  </div>
}

export default function AdminAccess({ onExit }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checked, setChecked] = useState(false)
  useEffect(() => { adminRequest('/api/admin/session').then(() => setAuthenticated(true)).catch(() => {}).finally(() => setChecked(true)) }, [])
  if (!checked) return <div className="grid min-h-screen place-items-center text-sm text-ink/55">Verificando acesso seguro…</div>
  return authenticated ? <Dashboard onExit={onExit}/> : <SignIn onExit={onExit}/>
}
