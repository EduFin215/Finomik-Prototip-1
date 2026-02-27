export interface AvatarBackground {
  id: string;
  name: string;
  bgClass: string;
  textClass?: string;
}

export const AVATAR_BACKGROUNDS: AvatarBackground[] = [
  {
    id: 'blue_soft',
    name: 'Azul suave',
    bgClass:
      'bg-gradient-to-tr from-finomik-primary via-sky-400 to-finomik-blue-soft shadow-[0_10px_25px_rgba(21,94,239,0.35)]',
    textClass: 'text-finomik-primary',
  },
  {
    id: 'blue_strong',
    name: 'Azul intenso',
    bgClass:
      'bg-gradient-to-br from-blue-900 via-blue-500 to-sky-300 shadow-[0_10px_25px_rgba(30,64,175,0.4)]',
    textClass: 'text-blue-700',
  },
  {
    id: 'green',
    name: 'Verde ahorro',
    bgClass:
      'bg-gradient-to-tr from-emerald-500 via-emerald-300 to-emerald-100 shadow-[0_10px_25px_rgba(16,185,129,0.35)]',
    textClass: 'text-emerald-700',
  },
  {
    id: 'purple',
    name: 'Morado creativo',
    bgClass:
      'bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-indigo-300 shadow-[0_10px_25px_rgba(126,34,206,0.4)]',
    textClass: 'text-purple-700',
  },
  {
    id: 'orange',
    name: 'Naranja energía',
    bgClass:
      'bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-200 shadow-[0_10px_25px_rgba(234,88,12,0.4)]',
    textClass: 'text-orange-700',
  },
  {
    id: 'yellow',
    name: 'Amarillo brillante',
    bgClass:
      'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-100 shadow-[0_10px_25px_rgba(245,158,11,0.35)]',
    textClass: 'text-yellow-700',
  },
];

