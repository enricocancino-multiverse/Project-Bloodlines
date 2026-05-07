"use client";

import { useMemo, useState } from "react";
import CharacterCard from "../components/CharacterCard";

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

type BoardSlot = {
  id: string;
  label: string;
  hint: string;
};

const initialCharacters: Character[] = [
  {
    id: "a1",
    name: "Evelyn Ashcroft",
    title: "Bloodline Matriarch",
    age: 64,
    relation: "Mother",
    trait: "Sovereign",
    color: "bg-rose-800/80",
    initials: "EA",
  },
  {
    id: "a2",
    name: "Lucian Vale",
    title: "Heir Apparent",
    age: 38,
    relation: "Father",
    trait: "Guardian",
    color: "bg-slate-700/80",
    initials: "LV",
  },
  {
    id: "a3",
    name: "Isla Merrow",
    title: "Kindred Scout",
    age: 26,
    relation: "Sibling",
    trait: "Navigator",
    color: "bg-cyan-700/80",
    initials: "IM",
  },
  {
    id: "a4",
    name: "Rowan Blackthorn",
    title: "Legacy Keeper",
    age: 48,
    relation: "Cousin",
    trait: "Archivist",
    color: "bg-amber-700/80",
    initials: "RB",
  },
];

const initialSlots: BoardSlot[] = [
  { id: "slot1", label: "Founder", hint: "The origin of bloodlines" },
  { id: "slot2", label: "Heir", hint: "Design the heir of the family" },
  { id: "slot3", label: "Confidant", hint: "Trusted allies or kin" },
  { id: "slot4", label: "Protector", hint: "Defenders and mentors" },
  { id: "slot5", label: "Legacy", hint: "Heritage and future promise" },
  { id: "slot6", label: "Mystic", hint: "Hidden or symbolic members" },
];

const initialBoard: Record<string, string | null> = {
  slot1: "a1",
  slot2: "a2",
  slot3: "a3",
  slot4: null,
  slot5: null,
  slot6: "a4",
};

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [board, setBoard] = useState<Record<string, string | null>>(initialBoard);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [comparePair, setComparePair] = useState<[string, string]>(["a1", "a2"]);

  const poolCharacters = characters.filter(
    (character) => !Object.values(board).includes(character.id)
  );

  const compareText = useMemo(() => {
    const [firstId, secondId] = comparePair;
    if (firstId === secondId) {
      return "Choose two different characters to compare their relationship.";
    }

    const first = characters.find((character) => character.id === firstId);
    const second = characters.find((character) => character.id === secondId);
    if (!first || !second) {
      return "Select two characters from the compare panel.";
    }

    if (first.relation === second.relation) {
      return `Both ${first.name} and ${second.name} are listed as ${first.relation.toLowerCase()}-type lineage members.`;
    }

    return `${first.name} is ${first.relation.toLowerCase()}-aligned, while ${second.name} is ${second.relation.toLowerCase()}-aligned. Use the chart to visualize their connection.`;
  }, [characters, comparePair]);

  const toggleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const addCharacter = () => {
    const next = {
      id: crypto.randomUUID(),
      name: `Nova Blood ${characters.length + 1}`,
      title: "Scion",
      age: 22,
      relation: "Unknown",
      trait: "Untamed",
      color: "bg-emerald-700/80",
      initials: `NB${characters.length + 1}`,
    };
    setCharacters((current) => [...current, next]);
  };

  const removeSelected = () => {
    setCharacters((current) => current.filter((character) => !selectedIds.includes(character.id)));
    setBoard((current) => {
      const next = { ...current };
      Object.keys(next).forEach((slot) => {
        if (selectedIds.includes(next[slot] ?? "")) {
          next[slot] = null;
        }
      });
      return next;
    });
    setSelectedIds([]);
  };

  const handleDrop = (slotId: string) => {
    if (!draggedId) return;
    setBoard((current) => {
      const next = { ...current };
      Object.keys(next).forEach((slot) => {
        if (next[slot] === draggedId) {
          next[slot] = null;
        }
      });
      next[slotId] = draggedId;
      return next;
    });
    setDraggedId(null);
  };

  const handleCompareChange = (index: number, value: string) => {
    setComparePair((current) => {
      const next: [string, string] = [...current];
      next[index] = value;
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white sm:px-10">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 py-3 shadow-lg shadow-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-2xl font-black text-rose-200">
              B
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-rose-200/70">Bloodlines</p>
              <p className="text-sm font-semibold text-white">Royal lineage lab</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
            {['Product', 'Family', 'Explore', 'Marketplace', 'Pricing'].map((item) => (
              <a key={item} href="#" className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <button className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/70 transition hover:border-rose-300/40 hover:bg-rose-500/10 md:inline-flex">
              Search
            </button>
            <a
              href="#"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-rose-300/40 hover:bg-rose-500/10 md:inline-flex"
            >
              Sign in
            </a>
            <a
              href="#"
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Sign up
            </a>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(90,15,38,0.25)] backdrop-blur-2xl">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-rose-100/90">
              Royal bloodline studio
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-rose-100 sm:text-5xl">
                Build your lineage in a bleeding-edge royal palette.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-rose-100/80 sm:text-lg">
                Drag family members into a lineage chart, edit your character roster, and compare relationships in real time. This app is designed to feel like a modern storyboard for family heritage.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
                <p className="text-xs uppercase tracking-[0.24em] text-rose-200/70">Feature</p>
                <p className="mt-3 font-semibold text-white">Drag and drop characters</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
                <p className="text-xs uppercase tracking-[0.24em] text-rose-200/70">Feature</p>
                <p className="mt-3 font-semibold text-white">Compare two lineage nodes</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 rounded-4xl border border-white/10 bg-rose-950/30 p-6 shadow-[0_30px_80px_rgba(138,15,20,0.35)] xl:max-w-xs">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.28em] text-rose-200/80">Quick controls</p>
              <button
                type="button"
                onClick={addCharacter}
                className="w-full rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Add character
              </button>
              <button
                type="button"
                onClick={removeSelected}
                className="w-full rounded-3xl border border-rose-300/20 bg-white/5 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:border-rose-400/30 hover:bg-rose-500/10"
              >
                Remove selected
              </button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-rose-200/80">Selected cards</p>
              <p className="mt-3 text-lg font-semibold text-white">{selectedIds.length}</p>
              <p className="mt-2 text-sm text-rose-100/80">Click a card to toggle its selection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid gap-8 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-8">
          <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(10,5,15,0.45)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-rose-200/70">Lineage board</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Design your family tree with freedom</h2>
              </div>
              <p className="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/80">
                Drag to place
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {initialSlots.map((slot) => {
                const occupantId = board[slot.id];
                const occupant = characters.find((character) => character.id === occupantId);
                return (
                  <div
                    key={slot.id}
                    onDrop={() => handleDrop(slot.id)}
                    onDragOver={(event) => event.preventDefault()}
                    className="min-h-40 rounded-[28px] border border-white/10 bg-white/5 p-4 transition hover:border-rose-400/40"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-100/80">{slot.label}</h3>
                        <p className="mt-1 text-xs text-rose-200/70">{slot.hint}</p>
                      </div>
                      <div className="rounded-full bg-rose-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-rose-100/80">
                        slot
                      </div>
                    </div>
                    {occupant ? (
                      <CharacterCard
                        character={occupant}
                        selected={selectedIds.includes(occupant.id)}
                        draggable
                        onDragStart={setDraggedId}
                        onClick={toggleSelect}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center text-sm text-white/40">
                        Drop a character here
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(10,5,15,0.45)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-rose-200/70">Character roster</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Design boxes, portraits, and details</h2>
              </div>
              <p className="rounded-full bg-rose-500/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-rose-100/80">
                Editable roster
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {poolCharacters.length > 0 ? (
                poolCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    selected={selectedIds.includes(character.id)}
                    draggable
                    onDragStart={setDraggedId}
                    onClick={toggleSelect}
                  />
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/50">
                  All characters are placed on the board. Add more to continue designing.
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(10,5,15,0.45)]">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.28em] text-rose-200/70">Relationship compare</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Compare two characters</h2>
            </div>
            <div className="space-y-4">
              {[0, 1].map((index) => (
                <label key={index} className="block text-sm text-rose-100/85">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Character {index + 1}</span>
                  <select
                    value={comparePair[index]}
                    onChange={(event) => handleCompareChange(index, event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-rose-400"
                  >
                    {characters.map((character) => (
                      <option key={character.id} value={character.id} className="bg-slate-950 text-white">
                        {character.name}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] border border-rose-400/10 bg-rose-400/5 p-5 text-sm text-rose-100/90">
              <p className="font-semibold text-white">Relationship result</p>
              <p className="mt-3 leading-7">{compareText}</p>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(10,5,15,0.45)]">
            <p className="text-sm uppercase tracking-[0.28em] text-rose-200/70">Design notes</p>
            <ul className="mt-4 space-y-3 text-sm text-rose-100/80">
              <li>• Drag cards into any slot to shape your lineage flow.</li>
              <li>• Click a card to mark it selected, then remove it with the button.</li>
              <li>• Use the compare panel to focus on two individual characters.</li>
              <li>• Add new characters and change the roster as your family grows.</li>
            </ul>
          </div>
        </aside>
      </section>

      <footer className="mt-12 border-t border-white/10 bg-slate-950/95 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 sm:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-2xl font-black text-rose-200">
                B
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-rose-200/70">Bloodlines</p>
                <p className="text-lg font-semibold text-white">Royal lineage lab</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              {[
                { label: 'Facebook', symbol: 'F' "},
                { label: 'Twitter', symbol: 'T' },
                { label: 'Instagram', symbol: 'I' },
                { label: 'LinkedIn', symbol: 'L' },
                { label: 'YouTube', symbol: 'Y' },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  {item.symbol}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white">Company</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {['Home', 'Contact us', 'About us', 'Get started'].map((item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white">Services</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {['App design', 'Web design', 'Logo design', 'Banner design'].map((item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white">Account</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {['Profile', 'My account', 'Preferences', 'Purchase'].map((item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white">Courses</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {['HTML & CSS', 'JavaScript', 'Photography', 'Photoshop'].map((item) => (
                  <li key={item}>
                    <a href="#" className="transition hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-white">Subscribe</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
                />
                <button className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/70 md:flex md:items-center md:justify-between">
            <p>
              Copyright © 2026 <a href="#" className="text-white hover:underline">Bloodlines</a>. All rights reserved.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 md:mt-0">
              <a href="#" className="transition hover:text-white">Privacy policy</a>
              <a href="#" className="transition hover:text-white">Terms &amp; condition</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
