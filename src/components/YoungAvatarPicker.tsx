import React from 'react';
import { Check } from 'lucide-react';
import { YOUNG_AVATARS, AvatarCategory } from '../data/youngAvatars';
import { AVATAR_BACKGROUNDS } from '../data/avatarBackgrounds';
import { ThemeMode } from '../utils/theme';

interface YoungAvatarPickerProps {
  selectedAvatarId?: string;
  onSelect: (id: string) => void;
  themeMode: ThemeMode;
  selectedBackgroundId?: string;
  onSelectBackground?: (id: string) => void;
}

const CATEGORY_LABELS: Record<AvatarCategory, string> = {
  starter: 'Básicos',
  rare: 'Raros',
  pro: 'Pro',
  event: 'Eventos',
};

export const YoungAvatarPicker: React.FC<YoungAvatarPickerProps> = ({
  selectedAvatarId,
  onSelect,
  themeMode,
  selectedBackgroundId,
  onSelectBackground,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<AvatarCategory>('starter');

  const filteredAvatars = YOUNG_AVATARS.filter(
    (avatar) => avatar.category === activeCategory
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(Object.keys(CATEGORY_LABELS) as AvatarCategory[]).map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === category
                ? 'bg-finomik-primary text-white border-finomik-primary'
                : 'bg-white text-finomik-primary border-[color:var(--finomik-blue-6)]'
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredAvatars.map((avatar) => {
          const selected = avatar.id === selectedAvatarId;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all ${
                `bg-white border-[color:var(--finomik-blue-6)] hover:shadow-md hover:-translate-y-0.5 ${
                  selected
                    ? 'ring-2 ring-finomik-primary ring-offset-2 ring-offset-white'
                    : ''
                }`
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${
                  avatar.bgClass
                } ${
                  themeMode === 'adult'
                    ? 'text-finomik-primary'
                    : avatar.textClass
                }`}
              >
                <span>{avatar.emoji}</span>
              </div>
              <span className="text-[11px] text-finomik-primary text-center line-clamp-2">
                {avatar.name}
              </span>

              {selected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-finomik-primary text-white flex items-center justify-center text-[10px] shadow">
                  <Check size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {onSelectBackground && (
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-[color:var(--finomik-blue-5)] uppercase tracking-wider">
            Fondo del avatar
          </div>
          <div className="flex flex-wrap gap-2">
            {AVATAR_BACKGROUNDS.map(bg => {
              const selected = bg.id === selectedBackgroundId;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => onSelectBackground(bg.id)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    selected
                      ? 'ring-2 ring-finomik-primary ring-offset-2 ring-offset-white'
                      : 'border-[color:var(--finomik-blue-6)]'
                  } ${bg.bgClass}`}
                >
                  {selected && (
                    <span className={`text-[10px] font-bold ${bg.textClass ?? 'text-finomik-primary'}`}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

