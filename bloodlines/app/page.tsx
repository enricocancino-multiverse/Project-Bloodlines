"use client";

import { useEffect, useMemo, useState } from "react";
import CharacterCard from "../components/CharacterCard";

type Character = {
  id: string;
  name: string;
  title: string;
  age: number;
  birthday: string;
  sex: string;
  nationality: string;
  mortalityYear: number | null;
  address: string;
  info: string;
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

const initialCharacters: Character[] = [];

const initialSlots: BoardSlot[] = [
  { id: "slot1", label: "Founder", hint: "The origin of bloodlines" },
  { id: "slot2", label: "Heir", hint: "Design the heir of the family" },
  { id: "slot3", label: "Confidant", hint: "Trusted allies or kin" },
  { id: "slot4", label: "Protector", hint: "Defenders and mentors" },
  { id: "slot5", label: "Legacy", hint: "Heritage and future promise" },
  { id: "slot6", label: "Mystic", hint: "Hidden or symbolic members" },
];

const initialBoard: Record<string, string | null> = {
  slot1: null,
  slot2: null,
  slot3: null,
  slot4: null,
  slot5: null,
  slot6: null,
};

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [board, setBoard] = useState<Record<string, string | null>>(initialBoard);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editBoxId, setEditBoxId] = useState<string | null>(null);
  const [boxForm, setBoxForm] = useState({
    name: "",
    age: "",
    birthday: "",
    sex: "",
    nationality: "",
    mortalityYear: "",
    address: "",
    info: "",
  });

  const activeBox =
    selectedIds.length === 1
      ? characters.find((character) => character.id === selectedIds[0]) ?? null
      : null;

  const selectedBoxes = characters.filter((character) => selectedIds.includes(character.id));
  const hasBoardItems = Object.values(board).some((item) => item !== null);

  const compareText = useMemo(() => {
    if (selectedBoxes.length !== 2) {
      return "Select two family boxes to compare their lineage details.";
    }

    const [first, second] = selectedBoxes;
    if (!first || !second) {
      return "Select two family boxes to compare their lineage details.";
    }

    if (first.relation === second.relation) {
      return `Both ${first.name} and ${second.name} are aligned as ${first.relation.toLowerCase()}-type lineage members.`;
    }

    return `${first.name} is ${first.relation.toLowerCase()}-aligned, while ${second.name} is ${second.relation.toLowerCase()}-aligned. Use the board to see how their roles connect.`;
  }, [characters, selectedIds]);

  useEffect(() => {
    if (activeBox) {
      setEditBoxId(activeBox.id);
      setBoxForm({
        name: activeBox.name,
        age: activeBox.age.toString(),
        birthday: activeBox.birthday,
        sex: activeBox.sex,
        nationality: activeBox.nationality,
        mortalityYear: activeBox.mortalityYear?.toString() ?? "",
        address: activeBox.address,
        info: activeBox.info,
      });
      return;
    }

    setEditBoxId(null);
    setBoxForm({
      name: "",
      age: "",
      birthday: "",
      sex: "",
      nationality: "",
      mortalityYear: "",
      address: "",
      info: "",
    });
  }, [activeBox]);

  const toggleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const addFamilyBox = () => {
    const next = {
      id: crypto.randomUUID(),
      name: `Nova Box ${characters.length + 1}`,
      title: "Scion",
      age: 22,
      birthday: "",
      sex: "Unknown",
      nationality: "",
      mortalityYear: null,
      address: "",
      info: "",
      relation: "Unknown",
      trait: "Untamed",
      color: "bg-emerald-700/80",
      initials: `NB${characters.length + 1}`,
    };
    setCharacters((current) => [...current, next]);
    setBoard((current) => {
      const nextBoard = { ...current };
      const emptySlot = Object.keys(nextBoard).find((slot) => nextBoard[slot] === null);
      if (emptySlot) {
        nextBoard[emptySlot] = next.id;
      }
      return nextBoard;
    });
    setSelectedIds([next.id]);
  };

  const removeSelectedBoxes = () => {
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

  const handleFormChange = (field: keyof typeof boxForm, value: string) => {
    setBoxForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveFamilyBox = () => {
    if (!editBoxId) return;
    setCharacters((current) =>
      current.map((character) =>
        character.id === editBoxId
          ? {
              ...character,
              name: boxForm.name,
              age: parseInt(boxForm.age, 10) || 0,
              birthday: boxForm.birthday,
              sex: boxForm.sex,
              nationality: boxForm.nationality,
              mortalityYear: boxForm.mortalityYear ? parseInt(boxForm.mortalityYear, 10) : null,
              address: boxForm.address,
              info: boxForm.info,
            }
          : character
      )
    );
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
              Bloodline Studio
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-rose-100 sm:text-5xl">
                Build your lineage in a bleeding-edge palette.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-rose-100/80 sm:text-lg">
                  Drag family boxes into a lineage chart, edit their details, and compare two boxes together on the board. This app is designed to feel like a modern storyboard for family heritage.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
                <p className="text-xs uppercase tracking-[0.24em] text-rose-200/70">Feature</p>
                  <p className="mt-3 font-semibold text-white">Drag and drop family boxes</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
                  <p className="text-xs uppercase tracking-[0.24em] text-rose-200/70">Feature</p>
                  <p className="mt-3 font-semibold text-white">Edit metadata and compare two selected boxes</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 rounded-4xl border border-white/10 bg-rose-950/30 p-6 shadow-[0_30px_80px_rgba(138,15,20,0.35)] xl:max-w-xs">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.28em] text-rose-200/80">Quick controls</p>
              <button
                type="button"
                onClick={addFamilyBox}
                className="w-full rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Add family box
              </button>
              <button
                type="button"
                onClick={removeSelectedBoxes}
                className="w-full rounded-3xl border border-rose-300/20 bg-white/5 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:border-rose-400/30 hover:bg-rose-500/10"
              >
                Delete selected family box(es)
              </button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-rose-200/70">Selected family boxes</p>
              <p className="mt-3 text-lg font-semibold text-white">{selectedIds.length}</p>
              <p className="mt-2 text-sm text-rose-100/80">Click a family box to toggle its selection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8">
        <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_90px_rgba(10,5,15,0.45)]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-rose-200/70">Lineage board</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Design your family tree with freedom</h2>
            </div>
            <p className="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/80">
              Drag family boxes into place
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {!hasBoardItems ? (
              <div className="col-span-full flex min-h-55 items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/80">
                Your lineage board is empty. Add a family box to begin building your family tree.
              </div>
            ) : (
              initialSlots.map((slot) => {
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
                        Position
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
                      <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center text-sm text-white/80">
                        This position is empty. Drag a family box here.
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-[0.28em] text-rose-200/70">Board compare feature</p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {selectedBoxes.length === 2
                    ? "Two family boxes selected"
                    : "Select two family boxes to compare"}
                </h3>
              </div>
              <p className="text-sm leading-7 text-rose-100/80">{compareText}</p>
              {selectedBoxes.length === 2 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {selectedBoxes.map((box) => (
                    <div key={box.id} className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-sm text-rose-100/80">
                      <p className="font-semibold text-white">{box.name}</p>
                      <p>{box.title}</p>
                      <p>{box.relation}</p>
                      <p>{box.nationality}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-[0.28em] text-rose-200/70">Family box editor</p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {editBoxId ? `Editing ${boxForm.name}` : "Select one family box to edit"}
                </h3>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm text-rose-100/90">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Name</span>
                    <input
                      value={boxForm.name}
                      onChange={(event) => handleFormChange("name", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none"
                      type="text"
                    />
                  </label>
                  <label className="block text-sm text-rose-100/90">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Current age</span>
                    <input
                      value={boxForm.age}
                      onChange={(event) => handleFormChange("age", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none"
                      type="number"
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm text-rose-100/90">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Birthday</span>
                    <input
                      value={boxForm.birthday}
                      onChange={(event) => handleFormChange("birthday", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none"
                      type="date"
                    />
                  </label>
                  <label className="block text-sm text-rose-100/90">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Sex</span>
                    <input
                      value={boxForm.sex}
                      onChange={(event) => handleFormChange("sex", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none"
                      type="text"
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm text-rose-100/90">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Nationality</span>
                    <input
                      value={boxForm.nationality}
                      onChange={(event) => handleFormChange("nationality", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none"
                      type="text"
                    />
                  </label>
                  <label className="block text-sm text-rose-100/90">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Mortality year</span>
                    <input
                      value={boxForm.mortalityYear}
                      onChange={(event) => handleFormChange("mortalityYear", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none"
                      type="number"
                    />
                  </label>
                </div>
                <label className="block text-sm text-rose-100/90">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Permanent address</span>
                  <input
                    value={boxForm.address}
                    onChange={(event) => handleFormChange("address", event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none"
                    type="text"
                  />
                </label>
                <label className="block text-sm text-rose-100/90">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-rose-200/70">Information</span>
                  <textarea
                    value={boxForm.info}
                    onChange={(event) => handleFormChange("info", event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none min-h-30 resize-none"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={saveFamilyBox}
                  disabled={!editBoxId}
                  className="w-full rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Save family box
                </button>
                <button
                  type="button"
                  onClick={removeSelectedBoxes}
                  disabled={selectedIds.length === 0}
                  className="w-full rounded-3xl border border-rose-300/20 bg-white/5 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:border-rose-400/30 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Delete selected family box{selectedIds.length === 1 ? "" : "es"}
                </button>
              </div>
            </div>
          </div>
        </div>
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
