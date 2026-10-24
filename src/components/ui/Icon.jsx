import {
  Accessibility,
  Armchair,
  MapPin,
  Snowflake,
  CalendarHeart,
  Car,
  Circle,
  ClipboardCheck,
  MessageCircle,
  Compass,
  Feather,
  Heart,
  History,
  Sparkles,
  Target,
  Train,
  Users,
} from 'lucide-react'

// Mapa explícito (em vez de `import *`) para manter o bundle pequeno no mobile.
// Ao usar um novo ícone nos dados de conteúdo, adicione-o aqui.
const icons = {
  Accessibility,
  Armchair,
  MapPin,
  Snowflake,
  CalendarHeart,
  Car,
  ClipboardCheck,
  Compass,
  Feather,
  Heart,
  History,
  MessageCircle,
  Sparkles,
  Target,
  Train,
  Users,
}

export default function Icon({ name, ...props }) {
  const Cmp = icons[name] || Circle
  return <Cmp aria-hidden="true" {...props} />
}
