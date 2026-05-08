import { X, Users, Heart, Baby } from 'lucide-react';
import { useState } from 'react';
import { FamilyMember } from '../types';

interface PersonDetailsPanelProps {
  member: FamilyMember;
  onUpdate: (updates: Partial<FamilyMember>) => void;
  onClose: () => void;
  onAddRelative: (type: string) => void;
  familyMembers: FamilyMember[];
}

export default function PersonDetailsPanel({
  member,
  onUpdate,
  onClose,
  onAddRelative,
  familyMembers
}: PersonDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'partners' | 'contact' | 'biography'>('personal');

  const getRelatives = (type: 'parents' | 'children' | 'partners') => {
    return member[type].map(id => familyMembers.find(m => m.id === id)).filter(Boolean) as FamilyMember[];
  };

  return (
    <div className="h-full flex flex-col bg-surface-dark">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{member.name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted" />
        </button>
      </div>

      <div className="p-4 border-b border-border">
        <button className="w-full py-2 bg-surface hover:bg-surface-light text-sm text-white rounded-lg transition-colors border border-border">
          Show relationship to {member.name}
        </button>
      </div>

      <div className="flex border-b border-border">
        {['personal', 'partners', 'contact', 'biography'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-sm capitalize transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'personal' && (
          <>
            <div>
              <label className="block text-xs text-muted mb-1">Full name:</label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Gender:</label>
              <select
                value={member.gender}
                onChange={(e) => onUpdate({ gender: e.target.value as any })}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Birth date:</label>
              <input
                type="text"
                value={member.birthDate}
                onChange={(e) => onUpdate({ birthDate: e.target.value })}
                placeholder="YYYY-MM-DD"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Death date (optional):</label>
              <input
                type="text"
                value={member.deathDate || ''}
                onChange={(e) => onUpdate({ deathDate: e.target.value })}
                placeholder="YYYY-MM-DD"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-2">Tree stats:</label>
              <div className="space-y-1 text-sm text-muted-dark">
                <p>{member.parents.length} parent(s)</p>
                <p>{member.partners.length} partner(s)</p>
                <p>{member.children.length} child(ren)</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'partners' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Partners</h3>
            {getRelatives('partners').map(partner => (
              <div key={partner.id} className="p-3 bg-surface rounded-lg border border-border">
                <p className="text-sm text-white">{partner.name}</p>
                <p className="text-xs text-muted">{partner.gender}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="text-sm text-muted-dark">
            <p>Contact information can be added here.</p>
          </div>
        )}

        {activeTab === 'biography' && (
          <div>
            <label className="block text-xs text-muted mb-1">Biography:</label>
            <textarea
              value={member.biography}
              onChange={(e) => onUpdate({ biography: e.target.value })}
              placeholder="Write about this person's life, achievements, and memories..."
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white text-sm focus:outline-none focus:border-primary min-h-50 resize-none"
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <p className="text-xs text-muted mb-2">Click to add relatives of {member.name}:</p>

        <button
          onClick={() => onAddRelative('parent')}
          className="w-full py-2 bg-surface hover:bg-surface-light text-sm text-white rounded-lg transition-colors border border-border flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          Add new parent
        </button>

        <button
          onClick={() => onAddRelative('partner')}
          className="w-full py-2 bg-surface hover:bg-surface-light text-sm text-white rounded-lg transition-colors border border-border flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4" />
          Add partner/ex
        </button>

        <button
          onClick={() => onAddRelative('sibling')}
          className="w-full py-2 bg-surface hover:bg-surface-light text-sm text-white rounded-lg transition-colors border border-border flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          Add brother/sister
        </button>

        <button
          onClick={() => onAddRelative('child')}
          className="w-full py-2 bg-surface hover:bg-surface-light text-sm text-white rounded-lg transition-colors border border-border flex items-center justify-center gap-2"
        >
          <Baby className="w-4 h-4" />
          Add child
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-sm text-primary rounded-lg transition-colors border border-primary/40 mt-4"
        >
          Done editing
        </button>
      </div>
    </div>
  );
}
