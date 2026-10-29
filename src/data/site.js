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
  phone: '(11) 97438-5433',
  email: 'lotusemovimentopilates@gmail.com',
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
  { label: 'Antes da aula', href: '#orientacoes' },
  { label: 'Termo', href: '#termo' },
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
      'Promover saúde, equilíbrio e consciência corporal por meio do Método Pilates, com atendimento personalizado, técnico e humanizado, para que cada pessoa floresça com segurança e bem-estar.',
    ],
  },
  {
    id: 'valores',
    label: 'Valores',
    icon: 'Heart',
    title: 'No que acreditamos',
    values: [
      { name: 'Excelência', text: 'Aperfeiçoamento contínuo e atenção aos detalhes.' },
      { name: 'Ética', text: 'Responsabilidade profissional em cada atendimento.' },
      { name: 'Individualidade', text: 'Respeito ao corpo, ao tempo e aos limites de cada pessoa.' },
      { name: 'Acolhimento', text: 'Sensibilidade e cuidado em uma experiência humanizada.' },
      { name: 'Harmonia', text: 'Integração entre corpo, mente e movimento.' },
    ],
  },
  {
    id: 'objetivos',
    label: 'Objetivos',
    icon: 'Compass',
    title: 'Para onde vamos',
    body: [
      'Consolidar-se como referência em qualidade e cuidado na região da Paulicéia, em São Bernardo do Campo, reconhecida pela elegância no atendimento, pela precisão técnica e pela transformação genuína na vida de seus alunos.',
    ],
  },
]

export const story = {
  title: 'Nossa história',
  paragraphs: [
    'A Lotus e Movimento Pilates nasceu da amizade de longa data entre dois sócios, unidos pela confiança e pelo desejo de criar um espaço dedicado à saúde, ao bem-estar e à qualidade de vida.',
    'A experiência em gestão e planejamento se uniu à formação profissional, ao conhecimento técnico e a uma forma acolhedora de cuidar. Dessa parceria surgiu um estúdio pensado para ir além da prática do Pilates: um ambiente onde cada pessoa é recebida com respeito, atenção e cuidado individualizado.',
    'Cada detalhe — do espaço à estrutura e aos equipamentos — foi escolhido para oferecer conforto, segurança e uma experiência que reflita os valores da Lotus.',
    'A flor de lótus representa pureza, renovação, equilíbrio, superação e transformação. Movimento traduz a essência do Pilates: controle, precisão, respiração, equilíbrio e fluidez. Juntos, os termos expressam nossa busca por consciência corporal e qualidade de vida.',
  ],
}

export const contractPreview = {
  title: 'Termo de adesão',
  file: '/documentos/termo-lotus-planos.pdf',
  note: 'Esta é uma cópia para consulta. A contratação deve ser feita com o quadro-resumo preenchido e a versão integral apresentada ao aluno antes do aceite.',
}

export const partners = [
  { name: 'Wellhub', note: 'Silver+' },
  { name: 'TotalPass', note: 'TP3+' },
  { name: 'ClassPass', note: 'aceito' },
]

// ---------------------------------------------------------------------
// PLANOS — valores mensais conforme a tabela do estúdio.
// As frequências correspondem a Cuidar, Fortalecer e Renovar.
// ---------------------------------------------------------------------
export const planFrequencies = [
  { id: '1x', label: '1x por semana', name: 'Cuidar' },
  { id: '2x', label: '2x por semana', name: 'Fortalecer' },
  { id: '3x', label: '3x por semana', name: 'Renovar' },
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
    period: '4 semanas',
    prices: { '1x': 230, '2x': 345, '3x': 437 },
    features: baseFeatures,
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    period: '12 semanas',
    prices: { '1x': 220.80, '2x': 331.20, '3x': 419.52 },
    features: baseFeatures,
  },
  {
    id: 'semestral',
    name: 'Semestral',
    period: '24 semanas',
    prices: { '1x': 207, '2x': 310.50, '3x': 393.30 },
    features: baseFeatures,
  },
  {
    id: 'anual',
    name: 'Anual',
    period: '48 semanas',
    badge: 'Maior economia',
    popular: true,
    prices: { '1x': 195.50, '2x': 293.25, '3x': 371.45 },
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
  address: 'Rua Júlio de Mesquita, 658 — Sala 1',
  district: 'Paulicéia, São Bernardo do Campo — SP',
  cep: '09691-000',
  mapsQuery: 'Rua Júlio de Mesquita, 658, Paulicéia, São Bernardo do Campo, SP, 09691-000',
  perks: [
    { icon: 'MapPin', text: 'Sala 1, com entrada pelo hall' },
    { icon: 'Armchair', text: 'Hall de entrada com área de espera' },
    { icon: 'Snowflake', text: 'Ambiente climatizado' },
  ],
  // Horários ainda não informados pelo estúdio: o card some enquanto for null.
  // Para exibir: hours: [{ days: 'Segunda a Sexta', time: '00h00 – 00h00' }]
  hours: null,
  rules: [
    'O agendamento prévio é obrigatório. Reserve pelo WhatsApp antes do check-in.',
    'Use roupas leves e confortáveis, que permitam liberdade de movimento.',
    'Use meias antiderrapantes próprias para Pilates. Consulte a equipe sobre a disponibilidade para compra no estúdio.',
    'Chegue de 10 a 15 minutos antes do horário agendado.',
    'Há água filtrada disponível durante sua permanência; mantenha-se hidratado.',
    'Informe à equipe, antes da aula, condições de saúde, gestação, restrições, lesões ou uso contínuo de medicação.',
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
export const payments = ['Pix', 'Débito', 'Crédito', 'Wellhub', 'TotalPass', 'ClassPass']

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
    a: 'Aceitamos Wellhub, TotalPass e ClassPass. O agendamento prévio pelo WhatsApp é obrigatório. Antes de reservar, confirme no aplicativo da plataforma se o seu plano dá acesso ao estúdio e consulte a equipe sobre os horários disponíveis. Faça o check-in na plataforma conforme a orientação recebida.',
  },
  {
    q: 'Preciso levar algum equipamento?',
    a: 'Use roupas leves e confortáveis e meias antiderrapantes próprias para Pilates. O estúdio disponibiliza os aparelhos, acessórios e água filtrada.',
  },
  {
    q: 'Posso praticar com dor nas costas, hérnia ou lesões?',
    a: 'Em muitos casos o Pilates ajuda no alívio das dores, mas cada caso é único. Informe seu histórico ao instrutor e, se possível, leve a orientação do seu médico ou fisioterapeuta.',
  },
  {
    q: 'Quais são os valores dos planos?',
    a: 'Os planos estão na seção Planos: Cuidar (1x por semana), Fortalecer (2x) e Renovar (3x), nas opções mensal, trimestral, semestral e anual. Os valores mensais começam em R$ 195,50 no plano anual. Consulte condições e horários pelo WhatsApp.',
  },
]
