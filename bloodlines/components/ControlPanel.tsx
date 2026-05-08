import { Plus, Trash2 } from 'lucide-react';
import { FamilyMember } from '../types';

interface ControlPanelProps {
  selectedCount: number;
  onAddMember: () => void;
  onDeleteSelected: () => void;
  editingMember: FamilyMember | null;
}

export default function ControlPanel({
  selectedCount,
  onAddMember,
  onDeleteSelected,
  editingMember
}: ControlPanelProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="inline-block px-4 py-1.5 bg-primary/20 border border-primary rounded-full mb-6">
          <span className="text-xs text-primary tracking-wider">BLOODLINE STUDIO</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Build your lineage in a bleeding-edge palette.</h2>
        <p className="text-sm text-muted-dark leading-relaxed">
          Drag family boxes into a lineage chart, edit their details, and compare two boxes together on the board.
          This app is designed to feel like a modern storyboard for family heritage.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-surface p-4 rounded-lg border border-border">
          <h3 className="text-xs text-muted mb-2 tracking-wider">FEATURE</h3>
          <p className="text-sm text-white">Drag and drop family boxes</p>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border">
          <h3 className="text-xs text-muted mb-2 tracking-wider">FEATURE</h3>
          <p className="text-sm text-white">Edit metadata and compare two selected boxes</p>
        </div>
      </div>

      <div className="pt-6 border-t border-border space-y-3">
        <h3 className="text-xs text-muted mb-3 tracking-wider">QUICK CONTROLS</h3>

        <button
          onClick={onAddMember}
          className="w-full py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add family box
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className="w-full py-3 bg-surface hover:bg-surface-light text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-border"
        >
          <Trash2 className="w-4 h-4" />
          Delete selected family box(es)
        </button>
      </div>

      <div className="bg-surface/50 p-4 rounded-lg border border-border">
        <h3 className="text-xs text-muted mb-2 tracking-wider">SELECTED FAMILY BOXES</h3>
        <div className="text-3xl font-bold text-white mb-2">{selectedCount}</div>
        <p className="text-xs text-muted-dark">Click a family box to toggle its selection.</p>
      </div>
    </div>
  );
}
