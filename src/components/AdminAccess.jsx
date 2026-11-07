import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowLeft, ArrowLeftRight, CalendarDays, ChevronLeft, ChevronRight,
  ClipboardList, CreditCard, Download, LogOut, Plus, RefreshCw, UserCog, Users, X,
} from 'lucide-react'
import { adminRequest, auth } from '../auth.js'
import { studio } from '../data/site.js'

const inputClass = 'w-full rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-navy-500'
const sourceNames = { direct: 'Direto', wellhub: 'Wellhub', totalpass: 'TotalPass', classpass: 'ClassPass' }
const planStatuses = { active: 'Ativo', paused: 'Pausado', ended: 'Encerrado' }
const paymentStatuses = { pending: 'Pendente', paid: 'Pago', overdue: 'Atrasado', cancelled: 'Cancelado' }
const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const dateTime = (value, options = {}) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', ...options }).format(new Date(value))
const currency = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const csvCell = (value) => {
  const safe = String(value ?? '').replace(/[\r\n]+/g, ' ').replace(/^([=+@\-])/u, "'$1")
  return `"${safe.replace(/"/g, '""')}"`
}
function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows].map(row => row.map(csvCell).join(';')).join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}
const mondayOf = (input) => { const d = new Date(input); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d }
const weekDates = (date) => Array.from({ length: 7 }, (_, i) => { const d = new Date(date); d.setDate(d.getDate() + i); return d })
const weekRange = (date) => { const start = mondayOf(date); const end = new Date(start); end.setDate(end.getDate() + 7); return { from: start.toISOString(), to: end.toISOString(), start, end } }

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
  return <main className="grid min-h-screen place-items-center bg-[#f6f8f6] px-4 py-10 text-ink"><section className="w-full max-w-md rounded-3xl border border-sage-100 bg-white p-7 shadow-sm sm:p-9">
    <a href="#topo" className="mb-8 inline-flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-700 font-display text-xl font-semibold text-white">L</span><span><b className="block font-display text-xl text-navy-950">Lotus</b><small className="text-xs text-ink/55">Gestão do estúdio</small></span></a>
    <p className="text-sm text-ink/55">Acesso restrito</p><h1 className="mt-1 font-display text-3xl font-semibold text-navy-950">Entrar na gestão</h1><p className="mt-3 text-sm leading-relaxed text-ink/60">{sent ? 'Digite o código enviado ao seu e-mail para confirmar o acesso.' : 'Informe o e-mail autorizado. Enviaremos um código de acesso de uso único.'}</p>
    <form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium text-navy-900">E-mail<input className={`${inputClass} mt-1.5`} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={sent}/></label>{sent && <label className="block text-sm font-medium text-navy-900">Código de acesso<input className={`${inputClass} mt-1.5`} inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={e => setOtp(e.target.value)}/></label>}{error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}<button disabled={busy} className="w-full rounded-xl bg-navy-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Aguarde…' : sent ? 'Confirmar código' : 'Enviar código'}</button></form>
    {sent && <button onClick={() => { setSent(false); setOtp(''); setError('') }} className="mt-3 text-sm font-medium text-navy-700 underline">Usar outro e-mail</button>}<button onClick={onExit} className="mt-7 flex items-center gap-2 text-sm font-medium text-ink/55"><ArrowLeft size={16}/>Voltar ao site</button>
  </section></main>
}

function Metric({ label, value, note, icon: Icon }) {
  return <article className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><span className="text-sm text-ink/55">{label}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-sage-100 text-navy-700"><Icon size={18}/></span></div><p className="mt-3 text-2xl font-semibold text-navy-950">{value}</p>{note && <p className="mt-1 text-xs text-ink/50">{note}</p>}</article>
}

function ClientProfile({ clientId, onClose, onChanged, notify }) {
  const [record, setRecord] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setBusy(true)
    try { setRecord(await adminRequest(`/api/admin/clients?id=${encodeURIComponent(clientId)}`)); setError('') }
    catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }, [clientId])
  useEffect(() => { load() }, [load])

  async function save(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    try {
      await adminRequest('/api/admin/clients', { method: 'PATCH', body: JSON.stringify({
        id: clientId, full_name: form.get('full_name'), email: form.get('email'), phone: form.get('phone'),
        notes: form.get('notes'), plan_name: form.get('plan_name'), plan_monthly_amount: form.get('plan_monthly_amount'),
        plan_status: form.get('plan_status'), next_payment_date: form.get('next_payment_date'), status: form.get('status'),
      }) })
      notify('Ficha do cliente atualizada.'); await load(); onChanged()
    } catch (e) { setError(e.message) }
  }
  async function addPayment(event) {
    event.preventDefault(); const paymentForm = event.currentTarget; const form = new FormData(paymentForm)
    try {
      await adminRequest('/api/admin/payments', { method: 'POST', body: JSON.stringify({
        client_id: clientId, amount: form.get('amount'), due_date: form.get('due_date'), method: form.get('method'), notes: form.get('notes'),
      }) })
      paymentForm.reset(); notify('Cobrança adicionada.'); await load(); onChanged()
    } catch (e) { setError(e.message) }
  }
  async function changePayment(id, status) {
    try { await adminRequest('/api/admin/payments', { method: 'PATCH', body: JSON.stringify({ id, status }) }); await load(); onChanged() }
    catch (e) { setError(e.message) }
  }
  async function changeBooking(id, status) {
    try {
      const response = await adminRequest('/api/admin/bookings', { method: 'PATCH', body: JSON.stringify({ id, status }) })
      if (response.offers?.length) notify(`Vaga oferecida a ${response.offers.map(x => x.client_name).join(', ')}. A equipe precisa avisar o cliente.`)
      await load(); onChanged()
    } catch (e) { setError(e.message) }
  }
  if (busy && !record) return <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">Carregando ficha…</div>
  const client = record?.client
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/35 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Ficha do cliente"><section className="mx-auto my-4 max-w-5xl rounded-3xl bg-[#f7f9f7] shadow-xl">
    <header className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-sage-100 bg-white px-5 py-4"><div><p className="text-xs uppercase tracking-wide text-ink/45">Ficha do cliente</p><h2 className="font-display text-xl font-semibold text-navy-950">{client?.full_name || 'Cliente'}</h2></div><button onClick={onClose} aria-label="Fechar ficha" className="rounded-xl p-2 hover:bg-sage-50"><X size={19}/></button></header>
    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_1fr]">{error && <div role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800 lg:col-span-2">{error}</div>}
      {client && <form onSubmit={save} className="space-y-3 rounded-2xl border border-sage-100 bg-white p-5"><h3 className="font-semibold text-navy-950">Dados, plano e observações</h3><label className="block text-xs font-semibold text-ink/60">Nome<input name="full_name" required defaultValue={client.full_name} className={`${inputClass} mt-1`}/></label><div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold text-ink/60">E-mail<input name="email" type="email" defaultValue={client.email || ''} className={`${inputClass} mt-1`}/></label><label className="block text-xs font-semibold text-ink/60">Telefone<input name="phone" defaultValue={client.phone || ''} className={`${inputClass} mt-1`}/></label></div><div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold text-ink/60">Plano<input name="plan_name" defaultValue={client.plan_name || ''} placeholder="Ex.: 2x por semana" className={`${inputClass} mt-1`}/></label><label className="block text-xs font-semibold text-ink/60">Mensalidade<input name="plan_monthly_amount" type="number" min="0" step="0.01" defaultValue={client.plan_monthly_amount || ''} className={`${inputClass} mt-1`}/></label></div><div className="grid gap-3 sm:grid-cols-3"><label className="block text-xs font-semibold text-ink/60">Situação do plano<select name="plan_status" defaultValue={client.plan_status} className={`${inputClass} mt-1`}>{Object.entries(planStatuses).map(([v,n]) => <option key={v} value={v}>{n}</option>)}</select></label><label className="block text-xs font-semibold text-ink/60">Próximo vencimento<input name="next_payment_date" type="date" defaultValue={client.next_payment_date?.slice(0,10) || ''} className={`${inputClass} mt-1`}/></label><label className="block text-xs font-semibold text-ink/60">Cadastro<select name="status" defaultValue={client.status} className={`${inputClass} mt-1`}><option value="active">Ativo</option><option value="inactive">Inativo</option></select></label></div><label className="block text-xs font-semibold text-ink/60">Observações<textarea name="notes" rows="3" defaultValue={client.notes || ''} className={`${inputClass} mt-1`} placeholder="Preferências, restrições informadas, observações administrativas"/></label><button className="rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white">Salvar ficha</button></form>}
      <section className="space-y-4"><div className="rounded-2xl border border-sage-100 bg-white p-5"><h3 className="font-semibold text-navy-950">Histórico de aulas</h3><div className="mt-3 max-h-64 space-y-2 overflow-y-auto">{record?.bookings?.length ? record.bookings.map(b => <article key={b.id} className="flex items-center justify-between gap-3 rounded-xl bg-sand-50 p-3"><div><p className="text-sm font-medium text-navy-900">{b.class_title}</p><p className="mt-1 text-xs text-ink/55">{dateTime(b.starts_at)} · {sourceNames[b.source] || b.source}</p></div><div className="text-right"><span className="text-xs font-semibold text-navy-800">{b.status === 'attended' ? 'Presente' : b.status === 'no_show' ? 'Faltou' : b.status === 'cancelled' ? 'Cancelada' : 'Confirmada'}</span>{b.status === 'confirmed' && <button onClick={() => changeBooking(b.id, 'attended')} className="mt-1 block text-xs text-navy-700 underline">Marcar presença</button>}{b.status === 'attended' && <button onClick={() => changeBooking(b.id, 'no_show')} className="mt-1 block text-xs text-navy-700 underline">Corrigir para falta</button>}</div></article>) : <p className="text-sm text-ink/50">Sem aulas registradas.</p>}</div></div>
      <div className="rounded-2xl border border-sage-100 bg-white p-5"><h3 className="font-semibold text-navy-950">Pagamentos e mensalidades</h3><form onSubmit={addPayment} className="mt-3 grid gap-2 sm:grid-cols-2"><input name="amount" type="number" min="0.01" step="0.01" required placeholder="Valor em R$" className={inputClass}/><input name="due_date" type="date" required className={inputClass}/><select name="method" className={inputClass}><option value="">Forma (opcional)</option><option>Pix</option><option>Dinheiro</option><option>Cartão</option><option>Transferência</option></select><input name="notes" placeholder="Descrição (opcional)" className={inputClass}/><button className="rounded-xl bg-navy-700 px-3 py-2 text-sm font-semibold text-white sm:col-span-2">Adicionar cobrança</button></form><div className="mt-4 max-h-48 space-y-2 overflow-y-auto">{record?.payments?.length ? record.payments.map(p => <article key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-sand-50 p-3"><div><p className="text-sm font-semibold text-navy-900">{currency(p.amount)} · vence {new Date(`${p.due_date.slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR')}</p><p className="mt-1 text-xs text-ink/55">{paymentStatuses[p.status]}{p.method ? ` · ${p.method}` : ''}</p></div>{['pending','overdue'].includes(p.status) && <button onClick={() => changePayment(p.id,'paid')} className="text-xs font-semibold text-navy-700 underline">Marcar pago</button>}{p.status === 'paid' && <button onClick={() => changePayment(p.id,'pending')} className="text-xs text-ink/55 underline">Reabrir</button>}</article>) : <p className="text-sm text-ink/50">Nenhuma cobrança registrada.</p>}</div></div></section>
    </div>
  </section></div>
}

function Dashboard({ onExit, user }) {
  const [tab, setTab] = useState(() => user.role === 'instructor' ? 'Agenda' : 'Resumo')
  const [data, setData] = useState({ clients: [], classes: [], bookings: [], waitlist: [], payments: [], reports: null, staff: [] })
  const [weekDate, setWeekDate] = useState(() => dateKey(new Date()))
  const [instructorFilter, setInstructorFilter] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const range = useMemo(() => weekRange(new Date(`${weekDate}T12:00:00`)), [weekDate])
  const dates = useMemo(() => weekDates(range.start), [range.start])
  const dueAlerts = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayValue = (value) => {
      if (!value) return null
      const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
      const parsed = new Date(year, month - 1, day)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }
    const recorded = new Set(data.payments.map(payment => `${payment.client_id}:${String(payment.due_date).slice(0, 10)}`))
    const entries = []
    for (const payment of data.payments) {
      if (!['pending', 'overdue'].includes(payment.status)) continue
      const due = dayValue(payment.due_date)
      if (!due) continue
      const daysUntil = Math.round((due.getTime() - today.getTime()) / 86400000)
      if (daysUntil <= 7) entries.push({
        key: `payment-${payment.id}`, client_id: payment.client_id, client_name: payment.client_name,
        amount: payment.amount, due_date: payment.due_date, daysUntil,
      })
    }
    for (const client of data.clients) {
      if (client.status !== 'active' || client.plan_status !== 'active' || !client.next_payment_date) continue
      const dueDate = String(client.next_payment_date).slice(0, 10)
      if (recorded.has(`${client.id}:${dueDate}`)) continue
      const due = dayValue(dueDate)
      if (!due) continue
      const daysUntil = Math.round((due.getTime() - today.getTime()) / 86400000)
      if (daysUntil <= 7) entries.push({
        key: `client-${client.id}-${dueDate}`, client_id: client.id, client_name: client.full_name,
        amount: client.plan_monthly_amount, due_date: dueDate, daysUntil,
      })
    }
    return entries.sort((a, b) => a.daysUntil - b.daysUntil || a.client_name.localeCompare(b.client_name, 'pt-BR'))
  }, [data.clients, data.payments])

  const refresh = useCallback(async () => {
    setBusy(true); setError('')
    try {
      if (user.role === 'instructor') {
        const [classes, bookings] = await Promise.all([
          adminRequest(`/api/admin/classes?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`),
          adminRequest('/api/admin/bookings'),
        ])
        setData({ clients: [], classes: classes.classes, bookings: bookings.bookings,
          waitlist: [], payments: [], reports: null, staff: [] })
        return
      }
      const [clients, classes, bookings, waitlist, payments, reports] = await Promise.all([
        adminRequest('/api/admin/clients'),
        adminRequest(`/api/admin/classes?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`),
        adminRequest('/api/admin/bookings'), adminRequest('/api/admin/waitlist'),
        adminRequest('/api/admin/payments'), adminRequest('/api/admin/reports'),
      ])
      setData(current => ({ clients: clients.clients, classes: classes.classes, bookings: bookings.bookings,
        waitlist: waitlist.waitlist, payments: payments.payments, reports, staff: current.staff }))
    } catch (e) { setError(e.message || 'Não foi possível carregar os dados.') }
    finally { setBusy(false) }
  }, [range.from, range.to, user.role])
  useEffect(() => { refresh() }, [refresh])
  const loadStaff = useCallback(async () => {
    try {
      const result = await adminRequest('/api/admin/staff')
      setData(current => ({ ...current, staff: result.staff }))
      setError('')
    } catch (e) { setError(e.message || 'Não foi possível carregar a equipe.') }
  }, [])
  useEffect(() => {
    if (user.role === 'admin' && tab === 'Equipe') loadStaff()
  }, [loadStaff, tab, user.role])

  const instructors = [...new Set(data.classes.map(c => c.instructor_name))].sort()
  const visibleClasses = data.classes.filter(c => !instructorFilter || c.instructor_name === instructorFilter)
  async function mutate(path, method, body, successText) {
    try { const result = await adminRequest(path, { method, body: JSON.stringify(body) }); if (successText) setNotice(successText(result)); await refresh(); return result }
    catch (e) { setError(e.message || 'Não foi possível concluir a ação.'); return null }
  }
  async function createClient(event) {
    event.preventDefault(); const form=event.currentTarget; const f = new FormData(form)
    const result = await mutate('/api/admin/clients','POST',{full_name:f.get('full_name'),email:f.get('email'),phone:f.get('phone'),plan_name:f.get('plan_name'),plan_monthly_amount:f.get('plan_monthly_amount'),plan_status:f.get('plan_status')},()=> 'Cliente cadastrado.')
    if (result) form.reset()
  }
  async function createClass(event) {
    event.preventDefault(); const form=event.currentTarget; const f = new FormData(form); const start = new Date(f.get('starts_at'))
    const duration = Number(f.get('duration'))
    const repeats = f.get('repeat_weekly') === 'on'
    const weekdayValues = f.getAll('weekdays').map(Number)
    let occurrences
    if (repeats) {
      const until = new Date(`${f.get('repeat_until')}T23:59:59`)
      if (!Number.isFinite(until.getTime()) || until < start || until > new Date(start.getTime() + 84 * 86400000)) {
        setError('Escolha uma data final entre o início e as próximas 12 semanas.'); return
      }
      if (!weekdayValues.length) { setError('Selecione pelo menos um dia da semana.'); return }
      occurrences = []
      const day = new Date(start)
      day.setHours(0, 0, 0, 0)
      while (day <= until) {
        if (weekdayValues.includes(day.getDay())) {
          const occurrence = new Date(day)
          occurrence.setHours(start.getHours(), start.getMinutes(), 0, 0)
          if (occurrence >= start) occurrences.push(occurrence.toISOString())
        }
        day.setDate(day.getDate() + 1)
      }
      if (!occurrences.length || occurrences.length > 60) { setError('A recorrência precisa gerar entre 1 e 60 aulas.'); return }
    }
    const result = await mutate('/api/admin/classes','POST',{title:f.get('title'),instructor_name:f.get('instructor_name'),starts_at:start.toISOString(),ends_at:new Date(start.getTime()+duration*60000).toISOString(),duration,capacity:Number(f.get('capacity')),...(occurrences ? {occurrences} : {})},r => `${r.count || 1} aula${(r.count || 1) === 1 ? '' : 's'} adicionada${(r.count || 1) === 1 ? '' : 's'} à agenda.`)
    if (result) form.reset()
  }
  function exportClients() {
    downloadCsv('lotus-clientes.csv', ['Nome', 'E-mail', 'Telefone', 'Plano', 'Situação do plano', 'Mensalidade', 'Próximo vencimento', 'Cadastro'], data.clients.map(c => [c.full_name, c.email, c.phone, c.plan_name, planStatuses[c.plan_status], c.plan_monthly_amount, c.next_payment_date, c.status]))
  }
  function exportPayments() {
    downloadCsv('lotus-cobrancas.csv', ['Cliente', 'Vencimento', 'Valor', 'Situação', 'Forma', 'Observações'], data.payments.map(p => [p.client_name, p.due_date, p.amount, paymentStatuses[p.status], p.method, p.notes]))
  }
  function exportBookings() {
    downloadCsv('lotus-reservas.csv', ['Cliente', 'Aula', 'Instrutora', 'Início', 'Fim', 'Origem', 'Situação'], data.bookings.map(b => [b.client_name, b.class_title, b.instructor_name, b.starts_at, b.ends_at, sourceNames[b.source] || b.source, b.status]))
  }
  function exportReport() {
    downloadCsv('lotus-relatorio-ocupacao.csv', ['Aula', 'Instrutora', 'Data e hora', 'Ocupadas', 'Capacidade', 'Ocupação (%)'], (report?.occupancy || []).map(c => [c.title, c.instructor_name, c.starts_at, c.occupied, c.capacity, c.occupancy_percent]))
  }
  async function createBooking(event) {
    event.preventDefault(); const form=event.currentTarget; const f = new FormData(form)
    const result = await mutate('/api/admin/bookings','POST',{client_id:f.get('client_id'),class_session_id:f.get('class_session_id'),source:f.get('source')},()=> 'Reserva confirmada.')
    if (result) form.reset()
  }
  async function cancelBooking(id) {
    const result = await mutate('/api/admin/bookings','PATCH',{id,status:'cancelled'},r => r.offers?.length
      ? `Vaga oferecida a ${r.offers.map(x=>x.client_name).join(', ')}. Avise o cliente por telefone ou e-mail.`
      : 'Reserva cancelada.')
    return result
  }
  async function enqueue(event) {
    event.preventDefault(); const form=event.currentTarget; const f=new FormData(form)
    const result=await mutate('/api/admin/waitlist','POST',{client_id:f.get('client_id'),class_session_id:f.get('class_session_id')},r=>r.booked?r.message:'Cliente entrou na lista de espera.')
    if(result) form.reset()
  }
  async function markPresence(id, status) { await mutate('/api/admin/bookings','PATCH',{id,status}) }
  async function addInstructor(event) {
    event.preventDefault(); const form = event.currentTarget; const f = new FormData(form)
    try {
      await adminRequest('/api/admin/staff', { method: 'POST', body: JSON.stringify({
        email: f.get('email'), instructor_name: f.get('instructor_name'),
      }) })
      form.reset(); setNotice('Acesso da instrutora configurado.'); await loadStaff()
    } catch (e) { setError(e.message || 'Não foi possível vincular a instrutora.') }
  }
  async function toggleInstructor(member) {
    try {
      await adminRequest('/api/admin/staff', { method: 'PATCH', body: JSON.stringify({
        user_id: member.user_id, active: !member.active,
      }) })
      setNotice(member.active ? 'Acesso da instrutora suspenso.' : 'Acesso da instrutora reativado.')
      await loadStaff()
    } catch (e) { setError(e.message || 'Não foi possível alterar o acesso.') }
  }

  const navigation = user.role === 'admin' ? [
    { name: 'Resumo', icon: Activity }, { name: 'Agenda', icon: CalendarDays },
    { name: 'Clientes', icon: Users }, { name: 'Financeiro', icon: CreditCard },
    { name: 'Relatórios', icon: ClipboardList }, { name: 'Equipe', icon: UserCog },
    { name: 'Parcerias', icon: ArrowLeftRight },
  ] : [{ name: 'Agenda', icon: CalendarDays }]
  const occupiedNames = (classId) => data.bookings.filter(b=>b.class_session_id===classId&&['confirmed','attended','no_show'].includes(b.status))
  const report = data.reports

  return <div className="min-h-screen bg-[#f6f8f6] text-ink">
    <header className="sticky top-0 z-30 border-b border-sage-100 bg-white/95 px-3 py-3 backdrop-blur sm:px-6"><div className="flex flex-wrap items-center justify-between gap-3"><a href="#topo" className="font-display text-xl font-semibold text-navy-950">Lotus <span className="text-sm font-normal text-ink/55">/ Gestão</span></a><div className="flex flex-wrap items-center gap-1">{navigation.map(({name,icon:Icon})=><button key={name} onClick={()=>setTab(name)} className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold sm:text-sm ${tab===name?'bg-navy-700 text-white':'text-navy-800 hover:bg-sage-50'}`}><Icon size={15}/>{name}</button>)}<button onClick={refresh} aria-label="Atualizar dados" title="Atualizar" className="rounded-xl p-2 text-ink/55 hover:bg-sage-50"><RefreshCw size={16}/></button><button onClick={async()=>{await auth.adapter.signOut();onExit()}} title="Sair" className="rounded-xl p-2 text-ink/55 hover:bg-sage-50"><LogOut size={17}/></button></div></div></header>
    <main className="mx-auto max-w-7xl p-4 sm:p-7"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-ink/50">{studio.name}</p><h1 className="mt-1 font-display text-3xl font-semibold text-navy-950">{tab}</h1><p className="mt-1 text-sm text-ink/60">{user.role === 'instructor' ? `Agenda e chamadas · ${user.instructorName}` : 'Agenda, clientes e operação do estúdio em um só lugar.'}</p></div>{busy&&<p className="text-xs text-ink/50">Atualizando dados…</p>}</div>
      {error&&<div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}<button onClick={()=>setError('')} aria-label="Fechar">×</button></div>}{notice&&<div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{notice}<button onClick={()=>setNotice('')} aria-label="Fechar">×</button></div>}

      {tab==='Resumo'&&<><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Clientes ativos" value={report?.summary?.active_clients??'—'} icon={Users}/><Metric label="Aulas futuras" value={report?.summary?.upcoming_classes??'—'} icon={CalendarDays}/><Metric label="Reservas ativas" value={report?.summary?.active_bookings??'—'} icon={Activity}/><Metric label="Na lista de espera" value={report?.summary?.waiting_clients??'—'} icon={Users}/></section><section className="mt-5 rounded-2xl border border-amber-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-navy-950">Vencimentos e cobranças</h2><p className="mt-1 text-xs text-ink/55">Em atraso ou com vencimento nos próximos 7 dias. Os avisos são internos; o painel não envia mensagens.</p></div><button onClick={()=>setTab('Financeiro')} className="text-sm font-semibold text-navy-700 underline">Abrir financeiro</button></div><div className="mt-4 space-y-2">{dueAlerts.slice(0,8).map(alert=><article key={alert.key} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl p-3 ${alert.daysUntil<0?'bg-rose-50':'bg-amber-50'}`}><div><p className="text-sm font-semibold text-navy-950">{alert.client_name}<span className={`ml-2 text-xs ${alert.daysUntil<0?'text-rose-700':'text-amber-800'}`}>{alert.daysUntil<0?`${Math.abs(alert.daysUntil)} dia${Math.abs(alert.daysUntil)===1?'':'s'} em atraso`:alert.daysUntil===0?'Vence hoje':`Vence em ${alert.daysUntil} dia${alert.daysUntil===1?'':'s'}`}</span></p><p className="mt-1 text-xs text-ink/60">Vencimento: {new Date(`${String(alert.due_date).slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR')}{alert.amount!=null?` · ${currency(alert.amount)}`:''}</p></div><button onClick={()=>setSelectedClient(alert.client_id)} className="text-xs font-semibold text-navy-700 underline">Abrir ficha</button></article>)}{dueAlerts.length>8&&<p className="text-xs text-ink/50">Mais {dueAlerts.length-8} vencimento(s) — consulte Financeiro.</p>}{!dueAlerts.length&&<p className="rounded-xl bg-sage-50 p-3 text-sm text-ink/60">Nenhuma cobrança em atraso ou vencendo nos próximos 7 dias.</p>}</div></section><div className="mt-5 grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-sage-100 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-navy-950">Agenda desta semana</h2><p className="mt-1 text-xs text-ink/50">{range.start.toLocaleDateString('pt-BR')} – {new Date(range.end.getTime()-86400000).toLocaleDateString('pt-BR')}</p></div><button onClick={()=>setTab('Agenda')} className="text-sm font-semibold text-navy-700 underline">Abrir agenda</button></div><div className="mt-4 space-y-2">{data.classes.slice(0,5).map(c=><div key={c.id} className="flex justify-between gap-3 rounded-xl bg-sand-50 p-3"><span><b className="text-sm text-navy-900">{c.title}</b><small className="mt-1 block text-xs text-ink/55">{dateTime(c.starts_at)} · {c.instructor_name}</small></span><span className="text-xs font-semibold text-navy-800">{c.booked}/{c.capacity}</span></div>)}{!data.classes.length&&<p className="text-sm text-ink/50">Sem aulas nesta semana.</p>}</div></section><section className="rounded-2xl border border-sage-100 bg-white p-5"><h2 className="font-semibold text-navy-950">Resumo financeiro do mês</h2><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-sage-50 p-4"><p className="text-xs text-ink/55">Recebido</p><p className="mt-1 font-semibold text-navy-900">{currency(report?.summary?.received_this_month)}</p></div><div className="rounded-xl bg-amber-50 p-4"><p className="text-xs text-ink/55">A receber</p><p className="mt-1 font-semibold text-amber-900">{currency(report?.summary?.pending_amount)}</p></div></div><p className="mt-3 text-xs text-ink/55">{report?.summary?.overdue_payments??0} cobranças vencidas</p><button onClick={()=>setTab('Financeiro')} className="mt-3 text-sm font-semibold text-navy-700 underline">Abrir financeiro</button></section></div></>}

      {tab==='Agenda'&&<><div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sage-100 bg-white p-3"><div className="flex items-center gap-2"><button onClick={()=>{const d=new Date(`${weekDate}T12:00:00`);d.setDate(d.getDate()-7);setWeekDate(dateKey(d))}} className="rounded-lg border border-sage-200 p-2" aria-label="Semana anterior"><ChevronLeft size={17}/></button><button onClick={()=>setWeekDate(dateKey(new Date()))} className="rounded-lg border border-sage-200 px-3 py-2 text-sm font-medium">Hoje</button><button onClick={()=>{const d=new Date(`${weekDate}T12:00:00`);d.setDate(d.getDate()+7);setWeekDate(dateKey(d))}} className="rounded-lg border border-sage-200 p-2" aria-label="Próxima semana"><ChevronRight size={17}/></button><span className="ml-1 text-sm font-semibold text-navy-900">{range.start.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})} – {new Date(range.end.getTime()-86400000).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}</span></div><select value={instructorFilter} onChange={e=>setInstructorFilter(e.target.value)} className={`${inputClass} w-auto min-w-44`}><option value="">Todos instrutores</option>{instructors.map(name=><option key={name}>{name}</option>)}</select></div>
        {user.role === 'admin' && <form onSubmit={createClass} className="mb-4 grid gap-2 rounded-2xl border border-sage-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6"><input name="title" required minLength="2" placeholder="Nome da aula" className={inputClass}/><input name="instructor_name" required minLength="2" placeholder="Instrutor(a)" className={inputClass}/><input name="starts_at" required type="datetime-local" className={inputClass}/><input name="duration" type="number" required min="15" max="180" defaultValue="50" aria-label="Duração em minutos" className={inputClass}/><input name="capacity" type="number" required min="1" max="100" defaultValue="5" aria-label="Vagas" className={inputClass}/><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-700 px-3 py-2.5 text-sm font-semibold text-white"><Plus size={16}/>Adicionar aula</button><fieldset className="rounded-xl border border-sage-100 p-3 sm:col-span-2 lg:col-span-6"><label className="flex items-center gap-2 text-sm font-semibold text-navy-900"><input name="repeat_weekly" type="checkbox" className="accent-navy-700"/>Repetir semanalmente</label><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"><span className="text-xs text-ink/55">Dias:</span>{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((label,index)=><label key={label} className="flex items-center gap-1 text-xs text-ink/70"><input type="checkbox" name="weekdays" value={index} className="accent-navy-700"/>{label}</label>)}<label className="ml-auto flex items-center gap-2 text-xs font-medium text-ink/65">Repetir até<input name="repeat_until" type="date" className={`${inputClass} w-auto`} /></label></div><p className="mt-2 text-xs text-ink/45">A recorrência cria aulas individuais até 12 semanas à frente; você poderá gerenciar cada uma pela agenda.</p></fieldset></form>}
        {user.role === 'admin' && <div className="mb-4 grid gap-2 rounded-2xl border border-sage-100 bg-white p-4 sm:grid-cols-4"><form onSubmit={createBooking} className="contents"><select name="client_id" required className={inputClass}><option value="">Cliente para reserva</option>{data.clients.filter(c=>c.status==='active').map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</select><select name="class_session_id" required className={inputClass}><option value="">Aula desta semana</option>{visibleClasses.map(c=><option key={c.id} value={c.id}>{dateTime(c.starts_at)} · {c.title}</option>)}</select><select name="source" className={inputClass}>{Object.entries(sourceNames).map(([v,n])=><option key={v} value={v}>{n}</option>)}</select><button className="rounded-xl border border-sage-200 px-3 py-2 text-sm font-semibold text-navy-800">Reservar vaga</button></form><form onSubmit={enqueue} className="contents"><select name="client_id" required className={inputClass}><option value="">Cliente para espera</option>{data.clients.filter(c=>c.status==='active').map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</select><select name="class_session_id" required className={inputClass}><option value="">Aula para espera</option>{visibleClasses.map(c=><option key={c.id} value={c.id}>{dateTime(c.starts_at)} · {c.title}</option>)}</select><span className="hidden lg:block"/><button className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">Reservar ou entrar na espera</button></form></div>}
        <div className="overflow-x-auto pb-2"><div className="grid min-w-[1120px] grid-cols-7 gap-2">{dates.map((day,index)=>{const key=dateKey(day);const dayClasses=visibleClasses.filter(c=>dateKey(new Date(c.starts_at))===key);return <section key={key} className="min-h-48 rounded-2xl border border-sage-100 bg-white p-2"><h3 className="mb-2 border-b border-sage-100 pb-2 text-xs font-bold text-navy-800">{weekDays[index]} <span className="font-normal text-ink/50">{day.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</span></h3><div className="space-y-2">{dayClasses.map(c=><article key={c.id} className="rounded-xl bg-sage-50 p-2.5"><p className="text-xs font-bold text-navy-700">{new Date(c.starts_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</p><p className="mt-1 text-xs font-semibold text-navy-950">{c.title}</p><p className="mt-1 text-[11px] text-ink/55">{c.instructor_name}</p><p className="mt-1 text-[11px] font-medium text-navy-800">{c.booked}/{c.capacity} vagas{c.waitlist_count?` · ${c.waitlist_count} aguardando`:''}</p>{occupiedNames(c.id).map(b=><div key={b.id} className="mt-2 flex items-center justify-between gap-1 border-t border-sage-200 pt-1.5"><span className="truncate text-[10px] text-ink/65">{b.client_name}</span>{b.status==='confirmed'&&<div className="flex gap-1"><button onClick={()=>markPresence(b.id,'attended')} title="Marcar presença" className="text-[10px] font-semibold text-navy-700">Presente</button>{user.role === 'admin' && <button onClick={()=>cancelBooking(b.id)} title="Cancelar reserva" className="text-[10px] text-rose-700">×</button>}</div>}{b.status==='attended'&&<button onClick={()=>markPresence(b.id,'no_show')} className="text-[10px] text-ink/50">Falta</button>}</div>)}</article>)}{!dayClasses.length&&<p className="py-3 text-center text-[11px] text-ink/35">Sem aulas</p>}</div></section>})}</div></div>
        {user.role === 'admin' && <section className="mt-5 rounded-2xl border border-sage-100 bg-white p-5"><h2 className="font-semibold text-navy-950">Lista de espera e vagas oferecidas</h2><p className="mt-1 text-xs text-ink/55">Ao cancelar uma reserva, o próximo cliente recebe uma oferta de vaga. Avise a pessoa manualmente; a tela não envia mensagens.</p><div className="mt-3 grid gap-2 md:grid-cols-2">{data.waitlist.map(w=><article key={w.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sand-50 p-3"><div><p className="text-sm font-semibold text-navy-900">{w.client_name} <span className={`ml-1 text-xs ${w.status==='offered'?'text-emerald-700':'text-amber-800'}`}>{w.status==='offered'?'Vaga oferecida':'Aguardando'}</span></p><p className="mt-1 text-xs text-ink/55">{w.class_title} · {dateTime(w.starts_at)} · posição pela ordem de entrada</p>{w.status==='offered'&&<p className="mt-1 text-xs text-ink/60">Contato: {w.phone||w.email||'sem contato cadastrado'}</p>}</div><div className="flex gap-3">{w.status==='offered'&&<button onClick={()=>mutate('/api/admin/waitlist','PATCH',{id:w.id,status:'converted'},()=>`Reserva confirmada para ${w.client_name}.`)} className="text-xs font-semibold text-navy-700 underline">Confirmar vaga</button>}<button onClick={()=>mutate('/api/admin/waitlist','PATCH',{id:w.id,status:'cancelled'},()=> 'Item removido da lista.')} className="text-xs text-rose-700 underline">Remover</button></div></article>)}{!data.waitlist.length&&<p className="text-sm text-ink/50">Lista vazia.</p>}</div></section>}
      </>}

      {tab==='Clientes'&&<><div className="mb-3 flex justify-end"><button onClick={exportClients} className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm font-semibold text-navy-800"><Download size={16}/>Exportar clientes CSV</button></div><form onSubmit={createClient} className="mb-4 grid gap-2 rounded-2xl border border-sage-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-7"><input name="full_name" required minLength="2" placeholder="Nome completo" className={inputClass}/><input name="email" type="email" placeholder="E-mail" className={inputClass}/><input name="phone" placeholder="Telefone" className={inputClass}/><input name="plan_name" placeholder="Plano (opcional)" className={inputClass}/><input name="plan_monthly_amount" type="number" min="0" step="0.01" placeholder="Mensalidade R$" className={inputClass}/><select name="plan_status" className={inputClass}><option value="ended">Sem plano ativo</option><option value="active">Plano ativo</option><option value="paused">Plano pausado</option></select><button className="rounded-xl bg-navy-700 px-3 py-2 text-sm font-semibold text-white">Cadastrar cliente</button></form><section className="overflow-x-auto rounded-2xl border border-sage-100 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-sand-50 text-xs uppercase text-ink/50"><tr><th className="p-4">Cliente</th><th className="p-4">Contato</th><th className="p-4">Plano</th><th className="p-4">Próximo vencimento</th><th className="p-4">Aulas</th><th className="p-4">Ficha</th></tr></thead><tbody className="divide-y divide-sage-100">{data.clients.map(c=><tr key={c.id}><td className="p-4 font-medium text-navy-950">{c.full_name}{c.status==='inactive'&&<small className="ml-2 text-rose-600">Inativo</small>}</td><td className="p-4 text-ink/65">{c.email||c.phone||'—'}</td><td className="p-4 text-ink/65">{c.plan_name||'Sem plano'}{c.plan_monthly_amount?` · ${currency(c.plan_monthly_amount)}`:''}<small className="block text-xs">{planStatuses[c.plan_status]}</small></td><td className="p-4 text-ink/65">{c.next_payment_date?new Date(`${c.next_payment_date.slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR'):'—'}</td><td className="p-4 text-ink/65">{data.bookings.filter(b=>b.client_id===c.id&&b.status==='attended').length} presenças</td><td className="p-4"><button onClick={()=>setSelectedClient(c.id)} className="font-semibold text-navy-700 underline">Abrir ficha</button></td></tr>)}{!data.clients.length&&<tr><td colSpan="6" className="p-8 text-center text-ink/50">Nenhum cliente cadastrado.</td></tr>}</tbody></table></section></>}

      {tab==='Financeiro'&&<><div className="mb-4 flex justify-end"><button onClick={exportPayments} className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm font-semibold text-navy-800"><Download size={16}/>Exportar cobranças CSV</button></div><div className="mb-4 grid gap-3 sm:grid-cols-3"><Metric label="Recebido neste mês" value={currency(report?.summary?.received_this_month)} icon={CreditCard}/><Metric label="A receber" value={currency(report?.summary?.pending_amount)} icon={Activity}/><Metric label="Cobranças vencidas" value={report?.summary?.overdue_payments??'—'} icon={CalendarDays}/></div><section className="overflow-x-auto rounded-2xl border border-sage-100 bg-white"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-sand-50 text-xs uppercase text-ink/50"><tr><th className="p-4">Cliente</th><th className="p-4">Vencimento</th><th className="p-4">Valor</th><th className="p-4">Situação</th><th className="p-4">Forma</th><th className="p-4">Ação</th></tr></thead><tbody className="divide-y divide-sage-100">{data.payments.map(p=><tr key={p.id}><td className="p-4 font-medium text-navy-950">{p.client_name}</td><td className="p-4">{new Date(`${p.due_date.slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR')}</td><td className="p-4">{currency(p.amount)}</td><td className="p-4"><span className={p.status==='overdue'?'font-semibold text-rose-700':p.status==='paid'?'font-semibold text-emerald-700':'text-ink/65'}>{paymentStatuses[p.status]}</span></td><td className="p-4">{p.method||'—'}</td><td className="p-4">{['pending','overdue'].includes(p.status)&&<button onClick={()=>mutate('/api/admin/payments','PATCH',{id:p.id,status:'paid'},()=> 'Pagamento marcado como pago.')} className="text-xs font-semibold text-navy-700 underline">Marcar pago</button>}{p.status==='paid'&&<button onClick={()=>mutate('/api/admin/payments','PATCH',{id:p.id,status:'pending'},()=> 'Pagamento reaberto.')} className="text-xs text-ink/55 underline">Reabrir</button>}</td></tr>)}{!data.payments.length&&<tr><td colSpan="6" className="p-8 text-center text-ink/50">Nenhum pagamento cadastrado. Adicione pela ficha do cliente.</td></tr>}</tbody></table></section><p className="mt-3 text-xs text-ink/50">Controle administrativo simples; não processa cobranças nem integra meios de pagamento.</p></>}

      {tab==='Relatórios'&&<><div className="mb-4 flex flex-wrap gap-2"><button onClick={exportReport} className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm font-semibold text-navy-800"><Download size={16}/>Exportar ocupação CSV</button><button onClick={exportBookings} className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm font-semibold text-navy-800"><Download size={16}/>Exportar reservas CSV</button><button onClick={exportClients} className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm font-semibold text-navy-800"><Download size={16}/>Exportar clientes CSV</button><button onClick={exportPayments} className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm font-semibold text-navy-800"><Download size={16}/>Exportar cobranças CSV</button></div><section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Presenças (30 dias)" value={report?.attendance?.attended??'—'} icon={Users}/><Metric label="Faltas (30 dias)" value={report?.attendance?.no_show??'—'} icon={Activity}/><Metric label="Taxa de presença" value={`${report?.attendance?.rate_percent??0}%`} icon={ClipboardList}/><Metric label="Reservas aguardando" value={report?.summary?.waiting_clients??'—'} icon={CalendarDays}/></section><section className="mt-5 rounded-2xl border border-sage-100 bg-white p-5"><h2 className="font-semibold text-navy-950">Ocupação das aulas nos últimos 30 dias</h2><div className="mt-4 space-y-3">{report?.occupancy?.map(c=><div key={c.id}><div className="flex justify-between gap-3 text-xs"><span className="font-medium text-navy-900">{c.title} · {dateTime(c.starts_at)} · {c.instructor_name}</span><span>{c.occupied}/{c.capacity} · {c.occupancy_percent??0}%</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sage-100"><div className="h-full rounded-full bg-navy-600" style={{width:`${Math.min(100,Number(c.occupancy_percent)||0)}%`}}/></div></div>)}{!report?.occupancy?.length&&<p className="text-sm text-ink/50">Ainda não há aulas realizadas no período.</p>}</div></section><section className="mt-4 rounded-2xl border border-sage-100 bg-white p-5"><h2 className="font-semibold text-navy-950">Clientes por plano</h2><div className="mt-3 flex flex-wrap gap-2">{report?.plans?.map(p=><span key={p.plan_name} className="rounded-full bg-sage-50 px-3 py-2 text-sm text-navy-800">{p.plan_name}: {p.clients}</span>)}</div></section></>}

      {tab==='Equipe'&&<><section className="mb-4 rounded-2xl border border-sage-100 bg-white p-5"><h2 className="font-semibold text-navy-950">Adicionar instrutora</h2><p className="mt-1 text-sm text-ink/60">A conta precisa existir no Neon Auth antes de vinculá-la aqui. A instrutora entra com o próprio e-mail e recebe acesso apenas à agenda associada ao nome configurado.</p><form onSubmit={addInstructor} className="mt-4 grid gap-2 sm:grid-cols-3"><input name="email" type="email" required placeholder="E-mail já cadastrado no Neon Auth" className={inputClass}/><input name="instructor_name" required minLength="2" placeholder="Nome igual ao da agenda" className={inputClass}/><button className="rounded-xl bg-navy-700 px-3 py-2.5 text-sm font-semibold text-white">Vincular instrutora</button></form></section><section className="overflow-x-auto rounded-2xl border border-sage-100 bg-white"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-sand-50 text-xs uppercase text-ink/50"><tr><th className="p-4">Instrutora</th><th className="p-4">E-mail</th><th className="p-4">Acesso</th><th className="p-4">Ação</th></tr></thead><tbody className="divide-y divide-sage-100">{data.staff.map(member=><tr key={member.user_id}><td className="p-4 font-medium text-navy-950">{member.instructor_name}</td><td className="p-4 text-ink/65">{member.email}</td><td className="p-4">{member.active?'Ativo':'Suspenso'}</td><td className="p-4"><button onClick={()=>toggleInstructor(member)} className="text-xs font-semibold text-navy-700 underline">{member.active?'Suspender':'Reativar'} acesso</button></td></tr>)}{!data.staff.length&&<tr><td colSpan="4" className="p-8 text-center text-ink/50">Nenhuma instrutora vinculada.</td></tr>}</tbody></table></section></>}
      {tab==='Parcerias'&&<section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold text-amber-950">Wellhub, TotalPass e ClassPass</h2><p className="mt-2 text-sm leading-relaxed text-amber-900">As conexões reais seguem pendentes de credenciais e homologação das plataformas. Reservas vindas desses canais podem ser lançadas manualmente no formulário da agenda, indicando a origem.</p></section>}
    </main><footer className="px-4 pb-8 text-center text-xs text-ink/45"><button onClick={onExit} className="underline">Voltar ao site</button></footer>
    {selectedClient&&<ClientProfile clientId={selectedClient} onClose={()=>setSelectedClient(null)} onChanged={refresh} notify={setNotice}/>}
  </div>
}

export default function AdminAccess({ onExit }) {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)
  useEffect(() => { adminRequest('/api/admin/session').then(setUser).catch(() => {}).finally(() => setChecked(true)) }, [])
  if (!checked) return <div className="grid min-h-screen place-items-center text-sm text-ink/55">Verificando acesso seguro…</div>
  return user ? <Dashboard onExit={onExit} user={user}/> : <SignIn onExit={onExit}/>
}

