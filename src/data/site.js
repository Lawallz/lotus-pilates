// =====================================================================
// CONTEÚDO DO SITE — Lotus e Movimento Pilates
// Edite aqui.
// Listas vazias ([]) escondem a seção correspondente (ex.: depoimentos, estatísticas).
// =====================================================================

export const studio = {
  name: 'Lotus e Movimento Pilates',
  shortName: 'Lotus',
  tagline: 'Cuidado que acolhe. Movimento que transforma.',
  instagram: 'lotusemmovimentopilatessp', // sem @
}

// Link oficial de WhatsApp Business (wa.me/message/...).
// Este tipo de link NÃO aceita mensagem pré-preenchida via ?text=, por isso o argumento
// `message` é ignorado. O formulário copia a mensagem para a área de transferência (ver LeadForm).
export const WHATSAPP_URL = 'https://wa.me/message/BH456AEUOFW2E1'
export const whatsappLink = () => WHATSAPP_URL

export const instagramLink = `https://instagram.com/${studio.instagram}`

export const navLinks = [
  { label: 'Pilates', href: '#pilates' },
  { label: 'Quem somos', href: '#historia' },
  { label: 'Planos', href: '#planos' },
  { label: 'Espaço', href: '#espaco' },
  { label: 'Dúvidas', href: '#duvidas' },
  { label: 'Como chegar', href: '#localizacao' },
]

// Selos flutuantes do hero (apenas informações verdadeiras e já confirmadas)
export const heroBadges = {
  top: { title: 'Cuidado que acolhe', text: 'Movimento que transforma' },
  side: { title: 'Wellhub · TotalPass', text: 'e ClassPass aceitos' },
  chip: 'Agende sua aula experimental',
}

export const pilatesCards = [
  {
    id: 'origem',
    icon: 'History',
    title: 'Origem',
    summary: 'Uma ideia centenária, mais atual do que nunca.',
    detail:
      'Criado por Joseph Pilates no início do século XX, o método nasceu da união de exercícios de força, alongamento e respiração. Inicialmente usado na reabilitação, hoje é reconhecido no mundo todo por melhorar postura, mobilidade e consciência corporal.',
  },
  {
    id: 'principios',
    icon: 'Sparkles',
    title: 'Princípios',
    summary: 'Seis pilares que guiam cada movimento.',
    detail: 'Cada aula é construída sobre os princípios fundamentais do método:',
    principles: [
      { name: 'Concentração', text: 'Atenção plena ao movimento.' },
      { name: 'Controle', text: 'Qualidade acima de quantidade.' },
      { name: 'Fluidez', text: 'Movimentos contínuos e suaves.' },
      { name: 'Respiração', text: 'Oxigena e ativa a musculatura profunda.' },
      { name: 'Centro', text: 'Força que nasce no abdômen e na lombar.' },
      { name: 'Precisão', text: 'Cada detalhe importa.' },
    ],
  },
  {
    id: 'indicacao',
    icon: 'Users',
    title: 'Para quem é',
    summary: 'Adaptável a diferentes idades e objetivos.',
    detail:
      'O Pilates pode ser indicado para pessoas de diferentes idades e objetivos: de quem busca aliviar dores nas costas e melhorar a postura a quem quer ganhar flexibilidade, fortalecer o corpo ou começar a se movimentar com segurança. Cada aula deve ser ajustada ao seu momento e às suas necessidades.',
    tags: ['Dor nas costas', 'Postura', 'Flexibilidade', 'Fortalecimento', 'Bem-estar', 'Iniciantes'],
  },
]

export const storyTabs = [
  {
    id: 'missao',
    label: 'Missão',
    icon: 'Target',
    title: 'Nossa missão',
    showLogo: true,
    body: [
      'Oferecer um Pilates acolhedor, que cuida de cada pessoa com atenção e técnica, para que o movimento se transforme em mais saúde, postura e qualidade de vida.',
    ],
  },
  {
    id: 'valores',
    label: 'Valores',
    icon: 'Heart',
    title: 'No que acreditamos',
    values: [
      { name: 'Acolhimento', text: 'Você é recebido como é, sem julgamentos.' },
      { name: 'Cuidado', text: 'Atenção a cada pessoa e a cada movimento.' },
      { name: 'Transformação', text: 'Pequenos hábitos que mudam a rotina.' },
      { name: 'Respeito', text: 'Ao seu corpo, ao seu tempo e aos seus limites.' },
    ],
  },
  {
    id: 'objetivos',
    label: 'Objetivos',
    icon: 'Compass',
    title: 'Para onde vamos',
    body: [
      'Ajudar cada aluno a se mover com mais leveza, sentir menos dores e ganhar disposição no dia a dia.',
      'Ser um espaço de referência em cuidado e bem-estar para a nossa região.',
    ],
  },
]

export const partners = [
  { name: 'Wellhub', note: 'antigo Gympass' },
  { name: 'TotalPass', note: 'aceito' },
  { name: 'ClassPass', note: 'aceito' },
]

// ---------------------------------------------------------------------
// PLANOS — os valores ainda NÃO foram informados.
// Quando tiver os preços, preencha `prices` (R$ por mês). Exemplos:
//   prices: { '2x': 000, '3x': 000 }   → mostra o switch 2x/3x e a economia vs. 1º plano
//   prices: { unico: 000 }             → mostra um único preço
// Enquanto `prices` for null, o card mostra "Sob consulta".
// ---------------------------------------------------------------------
export const planFrequencies = [
  { id: '2x', label: '2x por semana' },
  { id: '3x', label: '3x por semana' },
]

const baseFeatures = [
  'Aulas de Pilates com acompanhamento de instrutor',
  'Equipamentos completos: Reformer, Cadillac, Chair e Barrel',
  'Ambiente climatizado e acolhedor',
]

export const plans = [
  {
    id: 'mensal',
    name: 'Mensal',
    period: 'Pagamento mensal',
    prices: null,
    features: baseFeatures,
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    period: 'Compromisso de 3 meses',
    badge: 'Custo-benefício',
    popular: true,
    prices: null,
    features: baseFeatures,
  },
  {
    id: 'semestral',
    name: 'Semestral',
    period: 'Compromisso de 6 meses',
    prices: null,
    features: baseFeatures,
  },
]

// Fotos reais do estúdio (em /public/fotos). `src` = miniatura, `full` = ampliada no lightbox.
const foto = (nome) => ({ src: `/fotos/${nome}-sm.jpg`, full: `/fotos/${nome}.jpg` })

export const heroPhoto = {
  ...foto('estudio-arcos-iluminados'),
  alt: 'Estúdio Lotus e Movimento Pilates com espelhos em arco iluminados e aparelhos de Pilates',
}

export const gallery = [
  { ...foto('estudio-vista-ampla'), alt: 'Vista ampla do estúdio, com aparelhos e bolas suíças', span: 'sm:col-span-2 sm:row-span-2' },
  { ...foto('bolas-e-acessorios'), alt: 'Bolas, rolos e acessórios de Pilates' },
  { ...foto('cadillac-e-barrel'), alt: 'Cadillac e Ladder Barrel' },
  { ...foto('recepcao-lotus'), alt: 'Recepção com o letreiro luminoso do Lotus' },
  { ...foto('reformer-e-espelhos'), alt: 'Reformer e espelhos em arco com iluminação' },
  { ...foto('entrada-sala-1'), alt: 'Entrada do estúdio, Sala 1', span: 'sm:col-span-2' },
  { ...foto('area-de-espera'), alt: 'Hall do prédio com área de espera', span: 'sm:col-span-2' },
]

// Empresa dona do prédio (aparece na seção "Como chegar" e no rodapé)
export const building = {
  name: 'Soul Unity',
  description: 'Centro de Beleza e Saúde',
  instagram: 'soulunity_',
  logo: '/marca/soul-unity.jpg',
}

export const equipment = ['Reformer', 'Cadillac', 'Wunda Chair', 'Ladder Barrel', 'Bolas e acessórios']

export const logo = { src: '/marca/logo-lotus.jpg', alt: 'Logotipo Lotus e Movimento Pilates: Cuidado que acolhe. Movimento que transforma.' }

// Depoimentos: deixe vazio até ter avaliações reais (Google, Instagram, WhatsApp) com autorização.
// Formato: { name: 'Maria S.', role: 'Aluna', rating: 5, text: '...' }
export const testimonials = []

export const location = {
  address: 'Rua Júlio de Mesquita, 648 — Sala 1',
  district: 'Paulicéia, São Bernardo do Campo — SP',
  cep: '09691-000',
  mapsQuery: 'Rua Júlio de Mesquita, 648, Paulicéia, São Bernardo do Campo, SP, 09691-000',
  perks: [
    { icon: 'MapPin', text: 'Sala 1, com entrada pelo hall' },
    { icon: 'Armchair', text: 'Hall de entrada com área de espera' },
    { icon: 'Snowflake', text: 'Ambiente climatizado' },
  ],
  // Horários ainda não definidos: o card some enquanto for null.
  // Para exibir: hours: [{ days: 'Segunda a Sexta', time: '00h00 – 00h00' }]
  hours: null,
  rules: [
    'Chegue com 5 minutos de antecedência.',
    'Use roupas confortáveis.',
    'Informe lesões ou condições de saúde ao instrutor.',
  ],
}

// ---------------------------------------------------------------------
// Conversão: benefícios, passos, formulário e FAQ
// ---------------------------------------------------------------------

export const benefits = [
  'Alívio de dores nas costas',
  'Postura corrigida',
  'Mais flexibilidade',
  'Core forte',
  'Menos estresse',
  'Mais disposição',
  'Equilíbrio e coordenação',
  'Respiração consciente',
]

// Números de prova social: deixe vazio até ter dados reais.
// Formato: { value: 0, prefix: '+', suffix: '', label: 'alunos ativos' }
export const stats = []

export const steps = [
  {
    icon: 'MessageCircle',
    title: 'Fale com a gente',
    text: 'Chame no WhatsApp e escolha o melhor dia e horário para a sua aula experimental.',
  },
  {
    icon: 'ClipboardCheck',
    title: 'Conversa inicial',
    text: 'Conversamos sobre seus objetivos, histórico e possíveis dores para adaptar a aula a você.',
  },
  {
    icon: 'Sparkles',
    title: 'Sua primeira aula',
    text: 'Você vive o método na prática, com acompanhamento próximo do início ao fim.',
  },
  {
    icon: 'CalendarHeart',
    title: 'Escolha seu plano',
    text: 'Gostou? Escolha o plano ou use Wellhub, TotalPass ou ClassPass e siga na sua rotina.',
  },
]

export const goals = ['Aliviar dores', 'Melhorar a postura', 'Ganhar flexibilidade', 'Fortalecer o corpo', 'Reduzir o estresse']
export const periods = ['Manhã', 'Tarde', 'Noite']
export const payments = ['Plano do estúdio', 'Wellhub', 'TotalPass', 'ClassPass']

export const faqs = [
  {
    q: 'Nunca fiz Pilates. Posso começar?',
    a: 'Sim! O Pilates pode ser adaptado a diferentes níveis. Na aula experimental o instrutor explica cada movimento e ajusta os exercícios ao seu momento.',
  },
  {
    q: 'Como agendo a aula experimental?',
    a: 'É só chamar no WhatsApp pelo botão do site. Combinamos o melhor dia e horário e tiramos as suas dúvidas.',
  },
  {
    q: 'Como funciona com Wellhub, TotalPass e ClassPass?',
    a: 'Aceitamos os três. Informe qual plano você usa ao falar com a gente e combinamos o agendamento. Confira com o seu aplicativo a categoria do seu plano.',
  },
  {
    q: 'Preciso levar algum equipamento?',
    a: 'Apenas roupas confortáveis. Os aparelhos e acessórios ficam por conta do estúdio. Se tiver alguma orientação específica sobre meias ou calçados, avisaremos no agendamento.',
  },
  {
    q: 'Posso praticar com dor nas costas, hérnia ou lesões?',
    a: 'Em muitos casos o Pilates ajuda no alívio das dores, mas cada caso é único. Informe seu histórico ao instrutor e, se possível, leve a orientação do seu médico ou fisioterapeuta.',
  },
  {
    q: 'Quais são os valores dos planos?',
    a: 'Chame no WhatsApp e enviaremos as opções de planos e valores disponíveis.',
  },
]
