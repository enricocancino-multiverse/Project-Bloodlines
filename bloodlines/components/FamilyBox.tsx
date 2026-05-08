import { useDrag } from 'react-dnd';
import { User, Calendar } from 'lucide-react';
import { FamilyMember, Theme } from '../types';

interface FamilyBoxProps {
  member: FamilyMember;
  isSelected: boolean;
  onClick: () => void;
  onSelect: () => void;
  onMove: (position: { x: number; y: number }) => void;
  currentTheme: Theme;
}

export default function FamilyBox({
  member,
  isSelected,
  onClick,
  onSelect,
  onMove,
  currentTheme
}: FamilyBoxProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'FAMILY_MEMBER',
      item: { id: member.id, position: member.position },
      end: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (item && delta) {
          onMove({
            x: item.position.x + delta.x,
            y: item.position.y + delta.y
          });
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [member.position]
  );

  const getGenderColor = () => {
    if (member.gender === 'male') return { hex: 'primary', rgb: 'primary-rgb' };
    if (member.gender === 'female') return { hex: 'accent', rgb: 'accent-rgb' };
    return { hex: 'muted-dark', rgb: 'muted-dark-rgb' };
  };

  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  const { hex: colorHex, rgb: colorRgb } = getGenderColor();

  return (
    <div
      ref={dragRef}
      className={`absolute cursor-move select-none transition-all ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: member.position.x,
        top: member.position.y,
        width: 150
      }}
    >
      <div
        className={`bg-surface-dark border-2 rounded-lg p-3 transition-all hover:shadow-lg ${
          isSelected
            ? 'shadow-lg ring-2'
            : ''
        }`}
        style={{
          borderColor: `var(--${colorHex})`,
          boxShadow: isSelected ? `0 0 12px rgba(var(--${colorRgb}), 0.2)` : undefined,
          outline: isSelected ? `2px solid rgba(var(--${colorRgb}), 0.3)` : undefined,
          outlineOffset: isSelected ? '2px' : undefined
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className="flex items-start gap-2 mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `rgba(var(--${colorRgb}), 0.2)`,
              color: `var(--${colorHex})`
            }}
          >
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{member.name}</h3>
            <p className="text-xs text-muted capitalize">{member.gender}</p>
          </div>
        </div>

        {member.birthDate && (
          <div className="flex items-center gap-1 text-xs text-muted-dark">
            <Calendar className="w-3 h-3" />
            <span>{member.birthDate}</span>
            {member.deathDate && <span>- {member.deathDate}</span>}
          </div>
        )}

        <div className="mt-2 flex gap-1 text-xs text-muted-dark">
          {member.parents.length > 0 && (
            <span className="bg-surface px-2 py-0.5 rounded">↑{member.parents.length}</span>
          )}
          {member.children.length > 0 && (
            <span className="bg-surface px-2 py-0.5 rounded">↓{member.children.length}</span>
          )}
          {member.partners.length > 0 && (
            <span className="bg-surface px-2 py-0.5 rounded">♥{member.partners.length}</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`mt-2 w-full py-1 text-xs rounded transition-colors ${
            isSelected
              ? 'bg-primary text-white'
              : 'bg-surface text-muted hover:bg-surface-light'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
}
