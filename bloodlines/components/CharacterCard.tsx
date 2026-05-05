type Character = {
  id: string;
  name: string;
  title: string;
  age: number;
  relation: string;
  trait: string;
  color: string;
  initials: string;
};

type CharacterCardProps = {
  character: Character;
  selected?: boolean;
  draggable?: boolean;
  onDragStart: (id: string) => void;
  onClick: (id: string) => void;
};

export default function CharacterCard({
  character,
  selected = false,
  draggable = false,
  onDragStart,
  onClick,
}: CharacterCardProps) {
  return (
    <button
      type="button"
      className={`group flex w-full cursor-pointer flex-col items-start gap-4 rounded-3xl border px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400/40 hover:bg-white/10 ${character.color} ${
        selected ? "ring-2 ring-rose-400/80" : "ring-1 ring-white/10"
      }`}
      draggable={draggable}
      onDragStart={() => draggable && onDragStart(character.id)}
      onClick={() => onClick(character.id)}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold text-white shadow shadow-black/20">
            {character.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{character.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-rose-200/80">
              {character.title}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/80">
          {character.relation}
        </span>
      </div>
      <div className="flex items-center justify-between w-full text-sm text-white/80">
        <p>{character.trait}</p>
        <p className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80">
          {character.age} yrs
        </p>
      </div>
    </button>
  );
}
