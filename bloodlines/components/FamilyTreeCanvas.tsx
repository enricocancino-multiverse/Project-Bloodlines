import { useRef, useState, type MouseEvent, type WheelEvent, type ReactNode } from 'react';
import { FamilyMember, Theme } from '../types';
import FamilyBox from './FamilyBox';

interface FamilyTreeCanvasProps {
  members: FamilyMember[];
  selectedMembers: Set<string>;
  onMemberClick: (member: FamilyMember) => void;
  onMemberSelect: (id: string) => void;
  onMemberMove: (id: string, updates: Partial<FamilyMember>) => void;
  currentTheme: Theme;
}

export default function FamilyTreeCanvas({
  members,
  selectedMembers,
  onMemberClick,
  onMemberSelect,
  onMemberMove,
  currentTheme
}: FamilyTreeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-background')) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(0.5, zoom + delta), 2);
    setZoom(newZoom);
  };

  const drawConnections = () => {
    const connections: ReactNode[] = [];

    members.forEach(member => {
      member.children.forEach(childId => {
        const child = members.find(m => m.id === childId);
        if (!child) return;

        const startX = member.position.x + 75;
        const startY = member.position.y + 60;
        const endX = child.position.x + 75;
        const endY = child.position.y;
        const midY = (startY + endY) / 2;

        connections.push(
          <g key={`${member.id}-${childId}`}>
            <path
              d={`M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`}
              stroke="var(--connection-line)"
              strokeWidth="2"
              fill="none"
              className="opacity-60"
            />
          </g>
        );
      });

      member.partners.forEach((partnerId) => {
        const partner = members.find(m => m.id === partnerId);
        if (!partner || member.id >= partnerId) return;

        const startX = member.position.x + 150;
        const startY = member.position.y + 30;
        const endX = partner.position.x;
        const endY = partner.position.y + 30;

        connections.push(
          <line
            key={`partner-${member.id}-${partnerId}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="var(--connection-line)"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="opacity-40"
          />
        );
      });
    });

    return connections;
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full cursor-move canvas-background"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {drawConnections()}
      </svg>

      <div
        className="relative w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {members.map(member => (
          <FamilyBox
            key={member.id}
            member={member}
            isSelected={selectedMembers.has(member.id)}
            onClick={() => onMemberClick(member)}
            onSelect={() => onMemberSelect(member.id)}
            onMove={(position) => onMemberMove(member.id, { position })}
            currentTheme={currentTheme}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-6 bg-surface-dark/80 backdrop-blur border border-border rounded-lg p-2 space-y-2">
        <button
          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          className="w-10 h-10 bg-surface hover:bg-surface-light rounded flex items-center justify-center text-white transition-colors"
        >
          +
        </button>
        <div className="text-center text-xs text-muted">{Math.round(zoom * 100)}%</div>
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          className="w-10 h-10 bg-surface hover:bg-surface-light rounded flex items-center justify-center text-white transition-colors"
        >
          −
        </button>
      </div>
    </div>
  );
}
