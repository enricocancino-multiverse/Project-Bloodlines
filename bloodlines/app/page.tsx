"use client";

import { useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "../components/Header";
import ControlPanel from "../components/ControlPanel";
import FamilyTreeCanvas from "../components/FamilyTreeCanvas";
import PersonDetailsPanel from "../components/PersonDetailsPanel";
import ThemeSelector from "../components/ThemeSelector";
import type { FamilyMember, Theme } from "../types";

const initialMembers: FamilyMember[] = [];

export default function Home() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialMembers);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>("bloodlines");
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const addFamilyMember = (relationship?: { type: string; to: string }) => {
    const id = `member-${Date.now()}`;
    const newMember: FamilyMember = {
      id,
      name: "New Person",
      gender: "unknown",
      birthDate: "",
      deathDate: "",
      biography: "",
      position: {
        x: relationship ? 100 : 400,
        y: relationship ? 100 : 300
      },
      parents: [],
      children: [],
      partners: []
    };

    setFamilyMembers((members) => {
      if (!relationship) {
        return [...members, newMember];
      }

      const relatedMember = members.find((m) => m.id === relationship.to);
      if (!relatedMember) {
        return [...members, newMember];
      }

      const createdMember = { ...newMember };
      const updatedMembers = members.map((member) => {
        if (member.id !== relationship.to) {
          if (
            relationship.type === "sibling" &&
            relatedMember.parents.includes(member.id) &&
            !member.children.includes(id)
          ) {
            return { ...member, children: [...member.children, id] };
          }
          return member;
        }

        switch (relationship.type) {
          case "parent":
            createdMember.children = [relationship.to];
            createdMember.position = {
              x: member.position.x - 150,
              y: member.position.y - 150
            };
            return { ...member, parents: [...member.parents, id] };
          case "child":
            createdMember.parents = [relationship.to];
            createdMember.position = {
              x: member.position.x + 150,
              y: member.position.y + 150
            };
            return { ...member, children: [...member.children, id] };
          case "partner":
            createdMember.partners = [relationship.to];
            createdMember.position = {
              x: member.position.x + 180,
              y: member.position.y
            };
            return { ...member, partners: [...member.partners, id] };
          case "sibling": {
            createdMember.parents = [...member.parents];
            createdMember.position = {
              x: member.position.x + 200,
              y: member.position.y
            };
            return member;
          }
          default:
            return member;
        }
      });

      return [...updatedMembers, createdMember];
    });

    setSelectedMembers(new Set([id]));
    setEditingMember(newMember);
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((members) => members.map((member) => (member.id === id ? { ...member, ...updates } : member)));
    setEditingMember((current) => (current && current.id === id ? { ...current, ...updates } : current));
  };

  const deleteSelectedMembers = () => {
    setFamilyMembers((members) => {
      const remainingMembers = members.filter((member) => !selectedMembers.has(member.id));
      return remainingMembers.map((member) => ({
        ...member,
        parents: member.parents.filter((id) => !selectedMembers.has(id)),
        children: member.children.filter((id) => !selectedMembers.has(id)),
        partners: member.partners.filter((id) => !selectedMembers.has(id))
      }));
    });

    setSelectedMembers(new Set());
    setEditingMember((current) => (current && selectedMembers.has(current.id) ? null : current));
  };

  const toggleMemberSelection = (id: string) => {
    setSelectedMembers((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedCount = selectedMembers.size;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen theme-${currentTheme}`}>
        <Header onThemeClick={() => setShowThemeSelector(true)} currentTheme={currentTheme} />

        <main className="h-[calc(100vh-80px)] flex bg-background">
          <div className="w-full max-w-[320px] border-r border-border bg-surface-dark">
            <ControlPanel
              selectedCount={selectedCount}
              onAddMember={() => addFamilyMember()}
              onDeleteSelected={deleteSelectedMembers}
              editingMember={editingMember}
            />
          </div>

          <div className="flex-1 bg-canvas overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-surface-dark/80 backdrop-blur px-4 py-2 rounded-lg border border-border">
              <h2 className="text-sm font-medium text-muted mb-1">LINEAGE BOARD</h2>
              <p className="text-xs text-muted-dark">Drag family boxes into place</p>
            </div>

            <FamilyTreeCanvas
              members={familyMembers}
              selectedMembers={selectedMembers}
              onMemberClick={(member) => setEditingMember(member)}
              onMemberSelect={toggleMemberSelection}
              onMemberMove={(id, updates) => updateFamilyMember(id, updates)}
              currentTheme={currentTheme}
            />

            {familyMembers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="text-center text-muted-dark">
                  <p className="text-lg text-white">Your lineage board is empty.</p>
                  <p className="mt-2 text-sm">Add a family box to begin building your family tree.</p>
                </div>
              </div>
            )}
          </div>

          {editingMember && (
            <div className="hidden xl:block w-96 border-l border-border bg-surface-dark">
              <PersonDetailsPanel
                member={editingMember}
                onUpdate={(updates) => updateFamilyMember(editingMember.id, updates)}
                onClose={() => setEditingMember(null)}
                onAddRelative={(type) => addFamilyMember({ type, to: editingMember.id })}
                familyMembers={familyMembers}
              />
            </div>
          )}
        </main>

        {showThemeSelector && (
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            onClose={() => setShowThemeSelector(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}
