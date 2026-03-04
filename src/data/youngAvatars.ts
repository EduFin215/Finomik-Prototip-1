export type AvatarCategory = 'starter' | 'rare' | 'pro' | 'event';

export interface YoungAvatar {
  id: string;
  name: string;
  emoji: string;
  bgClass: string;
  textClass: string;
  category: AvatarCategory;
  minLevel?: number;
  priceCoins?: number;
  requiresPro?: boolean;
}

export const YOUNG_AVATARS: YoungAvatar[] = [
  {
    id: 'starter_rocket',
    name: 'Cohete inicial',
    emoji: '🚀',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    category: 'starter',
    priceCoins: 0,
  },
  {
    id: 'starter_piggy',
    name: 'Hucha ahorradora',
    emoji: '🐷',
    bgClass: 'bg-pink-100',
    textClass: 'text-pink-700',
    category: 'starter',
    priceCoins: 0,
  },
  {
    id: 'starter_lightbulb',
    name: 'Idea brillante',
    emoji: '💡',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-700',
    category: 'starter',
    priceCoins: 0,
  },
  {
    id: 'rare_dragon',
    name: 'Dragón del ahorro',
    emoji: '🐉',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-700',
    category: 'rare',
    minLevel: 3,
    priceCoins: 300,
  },
  {
    id: 'rare_chart',
    name: 'Gráfico ganador',
    emoji: '📈',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-700',
    category: 'rare',
    minLevel: 4,
    priceCoins: 350,
  },
  {
    id: 'pro_crown',
    name: 'Rey de las finanzas',
    emoji: '👑',
    bgClass: 'bg-indigo-100',
    textClass: 'text-indigo-700',
    category: 'pro',
    requiresPro: true,
    minLevel: 5,
    priceCoins: 700,
  },
  {
    id: 'pro_diamond',
    name: 'Inversor diamante',
    emoji: '💎',
    bgClass: 'bg-cyan-100',
    textClass: 'text-cyan-700',
    category: 'pro',
    requiresPro: true,
    minLevel: 6,
    priceCoins: 800,
  },
  {
    id: 'event_star',
    name: 'Estrella invitada',
    emoji: '🌟',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-700',
    category: 'event',
    priceCoins: 400,
  },
];

