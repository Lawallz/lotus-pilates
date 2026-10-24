# Lotus e Movimento Pilates — site (React + Vite + Tailwind)

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (pasta dist/)
```

## Personalizar

Todo o conteúdo fica em **`src/data/site.js`**.

- **WhatsApp**: `WHATSAPP_URL` (link oficial `wa.me/message/...`). Esse tipo de link não aceita mensagem
  pré-preenchida; por isso o formulário "Reserve o seu primeiro movimento" copia a mensagem e abre a conversa.
- **Planos**: os valores ainda não foram informados. Preencha `prices` em cada plano (ver comentário em `plans`);
  enquanto estiver `null`, o card mostra "Sob consulta".
- **Depoimentos e números**: `testimonials` e `stats` estão vazios, então essas seções ficam ocultas.
  Preencha com dados reais para exibi-las.
- **Horários**: `location.hours` está `null` e o card fica oculto. Preencha com `[{ days, time }]` para exibir.
- **Soul Unity** (dona do prédio): dados em `building`; aparece em "Como chegar" e no rodapé.
- **Fotos**: arquivos em `public/fotos/` (versão `-sm` para miniaturas e versão grande para o lightbox);
  logotipo em `public/marca/`. Para trocar, mantenha os nomes ou ajuste `gallery` em `site.js`.
- **Cores** (em `tailwind.config.js`): `navy` (azul do logo), `gold` (dourado), `sage` (verde-água das paredes).
- **Fontes**: Cinzel (LOTUS), Great Vibes (script), Cormorant Garamond (títulos), DM Sans (texto).
- **Logo vetorial**: `components/ui/Logo.jsx` usa um lótus em traço + texto. Se houver o logo oficial em SVG, troque ali.

## Estrutura

```
src/
  data/site.js          conteúdo
  components/           Navbar, Hero, BenefitsStrip, WhatIsPilates, StoryTabs, Partners,
                        HowItWorks, Pricing, Gallery, Testimonials, LeadForm, FAQ,
                        Location, Footer, MobileCTA
  components/ui/        Button, Reveal, SectionHeading, Icon, AnimatedNumber,
                        SpotlightCard, Tilt, SplitText, WaveDivider
  hooks/                useActiveSection (link ativo na navegação)
```

## Ao trocar dados reais

- `index.html` contém o JSON-LD (SEO local): confirme cidade/CEP e adicione telefone e horários quando tiver.
- Novos ícones usados em `site.js` precisam ser adicionados ao mapa em `components/ui/Icon.jsx`.

## Efeitos visuais (onde ajustar)

- **Utilitários CSS** em `src/index.css`: `.spotlight` (brilho que segue o mouse), `.btn-shimmer`, `.gradient-border`,
  `.text-gradient`, `.grain` (textura), `.no-scrollbar`.
- **Sombras/animações** em `tailwind.config.js`: `shadow-glow`, `shadow-glow-sand`, `shadow-lift`, `animate-aurora`, `animate-shimmer`.
- **Botões**: `<Button magnetic shimmer />` ativa o efeito magnético e o brilho deslizante.
- Efeitos de mouse (magnético, tilt, spotlight) só rodam com mouse; no celular a interface fica limpa.
  Com "reduzir movimento" ativado no sistema, as animações são desligadas.
